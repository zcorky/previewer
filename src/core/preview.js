import {
  $,
  setStyle, setStyles,
  addEvents, removeEvents,
} from '@zcorky/dom';

import AlloyFinger from '../lib/alloyfinger';
import Transform from '../lib/transform';
import To from '../lib/to';

import { maxImage, ease, createBodyScrollable } from './utils/utils';
import { createLoading } from './utils/loading';

// const AlloyFinger = require('../lib/alloyfinger');
// const Transform = require('../lib/transform');
// const To = require('../lib/to');

export class Previewer {
  previewing = false;
  lastPreviewedAt = null;

  constructor() {
    this.render();
  }

  getElement = (selector) => {
    return $(selector);
  }

  getContainer = () => {
    const name = 'data-preview-container';
    const selector = `div[${name}="true"]`;
    let $container = $(selector);
    if ($container) {
      return {
        $box: this.$container,
        $image: this.$imageContainer,
        $mask: this.$maskContainer,
        $loading: this.$loading,
      };
    }

    // @1 $container
    $container = this.$container = document.createElement('div');
    $container.setAttribute(name, 'true');
    setStyles($container, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 100000000,
      backgroundColor: '#000',
      overflow: 'hidden',
      animation: 'easeshow .25s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });

    // @2 $style
    const $style = document.createElement('style');
    $style.innerHTML = `
      @keyframes easeshow {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
      @keyframes easehide {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }

      div[${name}="true"] img {
        position: relative;
      }

      div[${name}="true"] img:after {
        content: "...";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
    `;
    $container.prepend($style);

    // @3 $imageContainer
    const $imageContainer = this.$imageContainer = document.createElement('img');
    // $imageContainer.setAttribute('src', 'https://gpic.qpic.cn/gbar_pic/rqlh3lfegUYAvWGGNA8wyC5kly2PwLzONQsSatcxicqJOw0gz9MGmZg/1000');
    $imageContainer.setAttribute('rate', window.innerHeight / window.innerWidth);
    setStyles($imageContainer, {
      width: '100%',
      // height: 200,
      // backgroundColor: 'rgba(255, 255, 255, 0.78)',
      border: 'none',
    });
    this.createAlloyFinger($imageContainer);
    $container.appendChild($imageContainer);
    // @for PC
    // @TODO bug for mobile, we donot expect it run on mobile
    // addEvents($imageContainer, ['click'], this.togglePreview);

    // @4 $maskContainer
    const $maskContainer = this.$maskContainer = document.createElement('div');
    $maskContainer.setAttribute('data-mask', 'true');
    setStyles($maskContainer, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: '-10',
      // backgroundColor: 'black',
      '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
    });
    $container.prepend($maskContainer);

    // @5 $loadingContainer
    const $loadingContainer = this.$loading = createLoading();
    $container.appendChild($loadingContainer);


    addEvents($maskContainer, ['click', 'tap'], this.togglePreview);
    document.body.appendChild($container);

    return {
      $box: $container,
      $image: $imageContainer,
      $mask: $maskContainer,
      $loading: $loadingContainer,
    };
  }

  createAlloyFinger = ($image) => {
    Transform($image);
    let initScale = 1;

    const af = new AlloyFinger($image, {
      singleTap: () => {
        this.togglePreview();
        // this.reset();
      },
      doubleTap: () => {
        const { auto } = maxImage($image);
        let scale = 1;
        if (auto === 'width') {
          scale = window.innerWidth / $image.width;
        } else {
          scale = window.innerHeight / $image.height;
        }
        this.zoom(scale);
      },
      multipointStart: function () {
        To.stopAll();
        initScale = $image.scaleX;
      },
      multipointEnd: function () {
        To.stopAll();
        if ($image.scaleX < 1) {
          new To($image, 'scaleX', 1, 500, ease);
          new To($image, 'scaleY', 1, 500, ease);
        }
        if ($image.scaleX > 5) {
          new To($image, 'scaleX', 5, 500, ease);
          new To($image, 'scaleY', 5, 500, ease);
        }
        var rotation = $image.rotateZ % 360;
        if (rotation < 0)rotation = 360 + rotation;
        $image.rotateZ = rotation;
        if (rotation > 0 && rotation < 45) {
          new To($image, 'rotateZ', 0, 500, ease);
        } else if (rotation >= 315) {
          new To($image, 'rotateZ', 360, 500, ease);
        } else if (rotation >= 45 && rotation < 135) {
          new To($image, 'rotateZ', 90, 500, ease);
        } else if (rotation >= 135 && rotation < 225) {
          new To($image, 'rotateZ', 180, 500, ease);
        } else if (rotation >= 225 && rotation < 315) {
          new To($image, 'rotateZ', 270, 500, ease);
        }
      },
      pinch: (evt) => {
        $image.scaleX = $image.scaleY = initScale * evt.zoom;
      },
      rotate: (evt) => {
        $image.rotateZ += evt.angle;
      },
      pressMove: (evt) => {
        if (this.checkBoundary(evt.deltaX, evt.deltaY)) {
          $image.translateX += evt.deltaX;
          $image.translateY += evt.deltaY;
        }
        evt.preventDefault();
      },
    });

    return af;
  }

  loadImage = (src, callback) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      callback(src);
    };
  }

  togglePreview = ($image, src) => {
    if (this.lastPreviewedAt) {
      const delta = Date.now() - this.lastPreviewedAt;
      if (delta < 300) {
        return false;
      }
    }
    
    this.lastPreviewedAt = Date.now();
  
    if (!this.previewing && $image && src) {
      this.preview($image, src);
    } else {
      this.unpreview();
    }
  }

  preview = ($image, src) => {
    this.previewing = true;
    const { $box, $image: $imageContainer, $loading } = this.getContainer();
    this.bodyScroll.disable();

    setStyles($box, {
      display: 'flex',
    });

    // @reset last image
    $imageContainer.setAttribute('src', '');
    setStyles($loading, {
      display: 'block',
    });

    // @sync
    // $imageContainer.setAttribute('src', src);

    // const { max, auto } = maxImage($image);
    // setStyles($imageContainer, {
    //   [max]: '100%',
    //   [auto]: 'auto',
    // });
  
    // @async
    this.loadImage(src, loadedSrc => {
      $imageContainer.setAttribute('src', loadedSrc);

      const { max, auto } = maxImage($image);
      setStyles($imageContainer, {
        [max]: '100%',
        [auto]: 'auto',
      });
      setStyles($loading, {
        display: 'none',
      });
    });
  }

  unpreview = () => {
    this.previewing = false;
    const { $box } = this.getContainer();
    this.bodyScroll.enable();
    this.reset();
    
    setStyle($box, 'animation-name', 'easehide');
    const handleEaseHide = () => {
      if ($box.style['animation-name'] === 'easehide') {
        setStyles($box, {
          display: 'none',
          'animation-name': 'easeshow',
        });
      }

      removeEvents($box, ['animationend', handleEaseHide]);
    };
    addEvents($box, ['animationend'], handleEaseHide);
  }

  zoom = (scale) => {
    const { $image: $imageContainer } = this.getContainer();

    To.stopAll();
    if ($imageContainer.scaleX > 1.5) {
      new To($imageContainer, 'scaleX', 1, 500, ease);
      new To($imageContainer, 'scaleY', 1, 500, ease);
      new To($imageContainer, 'translateX', 0, 500, ease);
      new To($imageContainer, 'translateY', 0, 500, ease);
    } else {
      new To($imageContainer, 'scaleX', scale, 500, ease);
      new To($imageContainer, 'scaleY', scale, 500, ease);
      new To($imageContainer, 'translateX', 0, 500, ease);
      new To($imageContainer, 'translateY', 0, 500, ease);
    }
  }

  checkBoundary = (deltaX = 0, deltaY = 0) => {
    const { $image } = this.getContainer();
    const { scaleX, translateX, translateY, originX, originY, width, height } = $image;
    const rate = $image.getAttribute('rate');

    if(scaleX !== 1 || scaleX !== rate){
      // include long picture
      const rangeLeft = (scaleX - 1) * (width / 2 + originX) + originX;
      const rangeRight = -(scaleX - 1) * (width / 2 - originX) + originX;
      const rangeUp = (scaleX - 1) * (height / 2 + originY) + originY;
      const rangeDown = -(scaleX - 1) * (height / 2 - originY) + originY;

      if(translateX + deltaX <= rangeLeft
          && translateX + deltaX >= rangeRight
          && translateY + deltaY <= rangeUp
          && translateY + deltaY >= rangeDown ) {
        return true;
      }
    }

    return false;
  }

  reset = () => {
    const { $image: $imageContainer } = this.getContainer();

    To.stopAll();

    if ($imageContainer.scaleX !== 1
      || $imageContainer.scaleY !== 1
      || $imageContainer.translateX !== 0
      || $imageContainer.translateY !== 0) {
      new To($imageContainer, 'scaleX', 1, 500, ease);
      new To($imageContainer, 'scaleY', 1, 500, ease);
      new To($imageContainer, 'translateX', 0, 500, ease);
      new To($imageContainer, 'translateY', 0, 500, ease);
      new To($imageContainer, 'rotateX', 0, 500, ease);
      new To($imageContainer, 'rotateY', 0, 500, ease);
    } else {
      setTimeout(() => {
        To.reset($imageContainer, 'scaleX', 1);
        To.reset($imageContainer, 'scaleY', 1);
        To.reset($imageContainer, 'translateX', 0);
        To.reset($imageContainer, 'translateY', 0);
        To.reset($imageContainer, 'rotateX', 0);
        To.reset($imageContainer, 'rotateY', 0);
      }, 250);
    }
  }

  render() {
    this.bodyScroll = createBodyScrollable();

    const handler = event => {
      const $element = event.target;
      if (!$element.hasAttribute('data-preview')) return false;
      const image = $element.src;
      if (!image) return false;

      this.togglePreview($element, image);
    };

    addEvents(window, ['tap', 'click'], handler);
  }
}
