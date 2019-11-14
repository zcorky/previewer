import {
  $,
  setStyles,
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

const MAX_SCALE = 5;
const MIN_SCALE = 0.1;

export class Previewer {
  previewing = false;
  lastPreviewedAt = null;
  stepCurrent = 1;
  allSteps = 1;

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
    $container.className = 'previewer';
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
      //
      // overflow: 'auto',
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

      .pswp * {
        box-sizing: border-box;
      }

      .pswp-toolbar-content {
        display: flex;
        align-items: center;
        background: #252525;
        border-radius: 4px;
        padding: 6px;
      }

      .pswp .lake-pswp-tool-bar .btn {
        color: #D9D9D9;
        display: inline-block;
        width: 32px;
        height: 32px;
        padding: 6px;
        margin: 0 6px;
        border: 1px solid #383838;
        border-radius: 2px;
        cursor: pointer;

        display: flex;
        align-items: center;
      }

      .pswp .lake-pswp-tool-bar .lake-pswp-arrow-left,.lake-pswp-arrow-right {
        padding: 8px;
      }

      .pswp .lake-pswp-tool-bar .pswp-toolbar-content .lake-pswp-counter {
        user-select: none;
        display: inline-block;
        font-size: 16px;
        vertical-align: top;
        line-height: 34px;
        color: #DEDEDE;
        margin: 0 2px;
      }

      .pswp .lake-pswp-tool-bar .separation {
        width: 1px;
        margin: 0px 10px;
        display: inline-block;
        height: 20px;
        border: 0.5px solid #383838;
      }

      .pswp .lake-pswp-tool-bar .btn.disable {
        background: none;
      }

      .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
    `;
    $container.prepend($style);

    const $imageContainerWrapper = document.createElement('div');
    $imageContainerWrapper.className = 'previewer-image-container-wrapper';
    
    // @3 $imageContainer
    const $imageContainer = this.$imageContainer = document.createElement('img');
    $imageContainer.className = 'previewer-image-container';
    // $imageContainer.setAttribute('src', 'https://gpic.qpic.cn/gbar_pic/rqlh3lfegUYAvWGGNA8wyC5kly2PwLzONQsSatcxicqJOw0gz9MGmZg/1000');
    $imageContainer.setAttribute('rate', window.innerHeight / window.innerWidth);
    setStyles($imageContainer, {
      width: '100%',
      // height: 200,
      // backgroundColor: 'rgba(255, 255, 255, 0.78)',
      border: 'none',
    });
    this.createAlloyFinger($imageContainer);
    $imageContainerWrapper.appendChild($imageContainer);
    $container.appendChild($imageContainerWrapper);
    // @for PC
    // @TODO bug for mobile, we donot expect it run on mobile
    // @TODO only support mouse type, but does not work
    addEvents($imageContainer, ['click', 'touchstart'], () => {
      // Mouse event
      // if (event.type === 'click' && event instanceof MouseEvent) {
      //   alert(event.type);
      //   this.togglePreview();
      // }
      // @TODO hack with userAgent, but want to use the event, help
      if (!/mobile/i.test(window.navigator.userAgent)) {
        this.togglePreview();
      }
    });

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

    // @6 add toolbox
    const $toolbox = this.createToolBox();
    $container.appendChild($toolbox);

    // @7 use icon font
    this.useIconFontCN('//at.alicdn.com/t/font_1508774_ljmn8zvl2p.js');

    //
    addEvents($maskContainer, ['click', 'tap'], this.togglePreview);
    document.body.appendChild($container);

    //
    addEvents($('.toolbox .lake-pswp-arrow-left'), ['click'], this.previewPrevious);
    addEvents($('.toolbox .lake-pswp-arrow-right'), ['click'], this.previewNext);
    addEvents($('.lake-pswp-zoom-in'), ['click'], this.zoomIn);
    addEvents($('.lake-pswp-zoom-out'), ['click'], this.zoomOut);
    addEvents($('.lake-pswp-rotate-left'), ['click'], this.rotateLeft);
    addEvents($('.lake-pswp-rotate-right'), ['click'], this.rotateRight);
    addEvents($('.lake-pswp-origin-size'), ['click'], this.reset);
    // addEvents($('.lake-pswp-best-size'), ['click', 'tap'], this.reset);

    return {
      $box: $container,
      $image: $imageContainer,
      $mask: $maskContainer,
      $loading: $loadingContainer,
    };
  }

  getAllPreviewNodes = () => {
    return Array.prototype.slice.call(document.querySelectorAll('[data-preview="true"]'));
  }

  setSteps = (node) => {
    const all = this.getAllPreviewNodes();
    const index = all.indexOf(node);
    
    this.stepCurrent = index + 1;
    this.allSteps = all.length;
  }

  useIconFontCN(scriptUrl) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    document.head.appendChild(script);
  }

  createIcon = (name) => {
    return `
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#previewer-${name}"></use>
      </svg>
    `;
  };

  createToolBox = () => {
    const element = document.createElement('div') || document.querySelector('.toolbox.pswp');
    element.className = 'toolbox pswp';
    element.style = 'position: fixed; bottom:0;left:50%;transform:translateX(-50%);padding:12px;';
    element.innerHTML = `
      <div class="lake-pswp-tool-bar">
        <div class="pswp-toolbar-content">
          <span class="lake-pswp-arrow-left btn default">
            ${this.createIcon('go-left')}
          </span>
          <span class="lake-pswp-counter">${this.stepCurrent} / ${this.allSteps}</span>
          <span class="lake-pswp-arrow-right btn default">
            ${this.createIcon('go-right')}
          </span>
          <span class="separation"></span>
          <span class="lake-pswp-zoom-in btn default">
            ${this.createIcon('zoom-in')}
          </span>
          <span class="lake-pswp-zoom-out btn default">
            ${this.createIcon('zoom-out')}
          </span>
          <span class="lake-pswp-origin-size btn activated">
            ${this.createIcon('1v1')}
          </span>
          <span class="lake-pswp-rotate-left btn default">
            ${this.createIcon('rotate-left')}
          </span>
          <span class="lake-pswp-rotate-right btn default">
            ${this.createIcon('rotate-right')}
          </span>
          <!-- <span class="lake-pswp-best-size btn disable">
          ${this.createIcon('fullscreen')}
        </span> -->
        </div>
      </div>
    `;

    return element;
  }

  updateToolBox = () => {
    const $counter = $('.toolbox .lake-pswp-counter');

    if (!$counter) return ;

    $counter.textContent = `${this.stepCurrent} / ${this.allSteps}`;
  };

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
        if (rotation < 0) rotation = 360 + rotation;
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

  togglePreview = (options) => {
    if (this.lastPreviewedAt && Date.now() - this.lastPreviewedAt < 300) {
      this.lastPreviewedAt = Date.now();
      return false;
    }

    this.lastPreviewedAt = Date.now();

    if (!this.previewing && options) { // if options undefine, this maybe call from unpreview
      this.preview(options);
    } else {
      this.unpreview();
    }
  }

  preview = (options) => {
    if (!options) return alert('preview with no options, it needs { styles, source }');

    const { styles, source } = options || {};
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
    this.loadImage(source, loadedSrc => {
      $imageContainer.setAttribute('src', loadedSrc);
      setStyles($imageContainer, styles);
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

    setStyles($box, {
      'animation-name': 'easehide',
    });
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

  previewNext = () => {
    this.stepCurrent += 1;
    if (this.stepCurrent > this.allSteps) {
      this.stepCurrent = 1;
    }

    const nextIndex = this.stepCurrent - 1;
    const $element = this.getAllPreviewNodes()[nextIndex];

    this.updateToolBox();
    
    const { max, auto } = maxImage($element);

    const regular = $element.src || $element.getAttribute('data-src');
    const hd = $element.getAttribute('data-hd'); // support hd image

    this.reset();

    this.preview({
      styles: {
        // detect width/height, which is bigger, then set 100%
        [max]: '100%',
        [auto]: 'auto',
      },
      source: hd || regular,
    });
  };

  previewPrevious = () => {
    this.stepCurrent -= 1;
    if (this.stepCurrent <= 0) {
      this.stepCurrent = this.allSteps;
    }

    const prevIndex = this.stepCurrent - 1;
    const $element = this.getAllPreviewNodes()[prevIndex];

    this.updateToolBox();
    
    const { max, auto } = maxImage($element);

    const regular = $element.src || $element.getAttribute('data-src');
    const hd = $element.getAttribute('data-hd'); // support hd image

    this.reset();

    this.preview({
      styles: {
        // detect width/height, which is bigger, then set 100%
        [max]: '100%',
        [auto]: 'auto',
      },
      source: hd || regular,
    });
  };

  zoomIn = () => {
    const { $image: $imageContainer } = this.getContainer();

    this.zoom($imageContainer.scaleX * 2);
  }

  zoomOut = () => {
    const { $image: $imageContainer } = this.getContainer();

    this.zoom($imageContainer.scaleX * 0.5);
  }

  rotateLeft = () => {
    const { $image: $imageContainer } = this.getContainer();
    const originRotateZ = $imageContainer.rotateZ;
    const rotateZ = Math.ceil(originRotateZ / 90) * 90 - 90;
    this.rotate(rotateZ);
  }

  rotateRight = () => {
    const { $image: $imageContainer } = this.getContainer();
    const originRotateZ = $imageContainer.rotateZ;
    const rotateZ = Math.ceil(originRotateZ / 90) * 90 + 90;
    this.rotate(rotateZ);
  }

  zoom = (scale) => {
    const { $image: $imageContainer } = this.getContainer();

    To.stopAll();
    if ($imageContainer.scaleX > MAX_SCALE || $imageContainer.scaleX < MIN_SCALE) {
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

  rotate = (angle) => {
    const { $image: $imageContainer } = this.getContainer();

    To.stopAll();
    new To($imageContainer, 'rotateZ', angle, 500, ease);
  }

  checkBoundary = (deltaX = 0, deltaY = 0) => {
    const { $image } = this.getContainer();
    const { scaleX, translateX, translateY, originX, originY, width, height } = $image;
    const rate = $image.getAttribute('rate');

    if (scaleX !== 1 || scaleX !== rate) {
      // include long picture
      const rangeLeft = (scaleX - 1) * (width / 2 + originX) + originX;
      const rangeRight = -(scaleX - 1) * (width / 2 - originX) + originX;
      const rangeUp = (scaleX - 1) * (height / 2 + originY) + originY;
      const rangeDown = -(scaleX - 1) * (height / 2 - originY) + originY;

      if (translateX + deltaX <= rangeLeft
        && translateX + deltaX >= rangeRight
        && translateY + deltaY <= rangeUp
        && translateY + deltaY >= rangeDown) {
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

  render = () => {
    this.bodyScroll = createBodyScrollable();

    const handler = event => {
      const $element = event.target;
      if (!$element.hasAttribute('data-preview')) return false;
      const regular = $element.src || $element.getAttribute('data-src');
      if (!regular) return false;


      this.setSteps($element);
      this.updateToolBox();

      const { max, auto } = maxImage($element);
      const hd = $element.getAttribute('data-hd'); // support hd image

      this.togglePreview({
        styles: {
          // detect width/height, which is bigger, then set 100%
          [max]: '100%',
          [auto]: 'auto',
        },
        source: hd || regular,
      });
    };

    addEvents(window, ['tap', 'click'], handler);
  }
}
