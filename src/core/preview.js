import {
  $,
  setStyles,
  addEvents, removeEvents,
} from '@zcorky/dom';

import AlloyFinger from '../lib/alloyfinger';
import Transform from '../lib/transform';
import To from '../lib/to';

import { maxImage, ease, createBodyScrollable } from '../utils/utils';
import { createLoading } from '../utils/loading';

import { download } from '../utils/download';

const MAX_SCALE = 5;
const MIN_SCALE = 0.1;

const icons = {
  'go-left': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M21.67 27.788a.667.667 0 0 0 0-.942L9.415 14.589a.667.667 0 0 0-.943 0l-.943.943a.667.667 0 0 0 0 .943L19.785 28.73c.26.26.682.26.943 0l.942-.943Z" data-follow-fill="#fff"/><path fill="#fff" d="M20.728 3.275a.667.667 0 0 0-.943 0L7.528 15.532a.667.667 0 0 0 0 .943l.943.942c.26.26.683.26.943 0L21.67 5.162a.667.667 0 0 0 0-.943l-.943-.943Z" data-follow-fill="#fff"/></svg>`,
  'go-right': `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 32 32"><path d="M10.195 27.788a.667.667 0 0 1 0-.942l12.257-12.257c.26-.26.682-.26.943 0l.942.943c.26.26.26.682 0 .943L12.081 28.73a.667.667 0 0 1-.943 0l-.943-.943Z" data-follow-fill="#fff"/><path d="M11.138 3.275c.26-.26.682-.26.943 0l12.256 12.257c.26.26.26.682 0 .943l-.942.942a.667.667 0 0 1-.943 0L10.195 5.162a.667.667 0 0 1 0-.943l.943-.943Z" data-follow-fill="#fff"/></svg>`,
  'zoom-in': `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 32 32"><path d="M14.667 3.333C20.927 3.333 26 8.407 26 14.667c0 2.365-.725 4.562-1.965 6.38l4.522 4.521c.26.26.26.682 0 .943l-1.131 1.131a.667.667 0 0 1-.943 0L22.08 23.24A11.29 11.29 0 0 1 14.667 26c-6.26 0-11.334-5.073-11.334-11.332 0-6.26 5.075-11.334 11.334-11.334Zm0 2.8a8.533 8.533 0 1 0 0 17.067 8.533 8.533 0 0 0 0-17.067Z" data-follow-fill="#fff"/><path stroke-width="2" stroke="#fff" d="M14.7 10v9M19.2 14.5h-9" data-follow-stroke="#fff"/></svg>`,
  'zoom-out': `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 32 32"><path d="M14.667 3.333C20.927 3.333 26 8.407 26 14.667c0 2.365-.725 4.562-1.965 6.38l4.522 4.521c.26.26.26.682 0 .943l-1.131 1.131a.667.667 0 0 1-.943 0L22.08 23.24A11.29 11.29 0 0 1 14.667 26c-6.26 0-11.334-5.073-11.334-11.332 0-6.26 5.075-11.334 11.334-11.334Zm0 2.8a8.533 8.533 0 1 0 0 17.067 8.533 8.533 0 0 0 0-17.067Z" data-follow-fill="#fff"/><path stroke-width="2" stroke="#fff" d="M19.2 14.5h-9" data-follow-stroke="#fff"/></svg>`,
  '1v1': `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 32 32"><path d="M26.82 14.41h1.588c.892 0 1.592.7 1.592 1.59 0 .89-.7 1.59-1.592 1.59h-1.59a10.936 10.936 0 0 1-9.228 9.228v1.59C17.59 29.3 16.89 30 16 30a1.575 1.575 0 0 1-1.59-1.592v-1.59C9.636 26.12 5.88 22.3 5.18 17.59H3.59A1.576 1.576 0 0 1 2 16c0-.89.7-1.59 1.59-1.59h1.592a10.934 10.934 0 0 1 9.228-9.23V3.59c0-.89.7-1.59 1.59-1.59.89 0 1.59.7 1.59 1.59v1.592a10.934 10.934 0 0 1 9.228 9.228h.002Zm-9.866 9.926c3.82-.446 6.936-3.564 7.382-7.38A8.402 8.402 0 0 0 16 7.6a8.392 8.392 0 0 0-5.589 14.661 8.399 8.399 0 0 0 6.543 2.075ZM16 19.628a3.628 3.628 0 1 0 0-7.257 3.628 3.628 0 0 0 0 7.257Z" data-follow-fill="#fff"/></svg>`,
  'rotate-left': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32"><mask fill="#fff" id="a" data-follow-fill="#fff"><rect rx="1" height="13" width="21" y="15" x="5"/></mask><rect mask="url(#a)" stroke-width="5" stroke="#fff" rx="1" height="13" width="21" y="15" x="5" data-follow-stroke="#fff"/><path stroke-width="2.5" stroke="#fff" d="M28.5 17V8h-12" data-follow-stroke="#fff"/><path stroke-width="2.5" stroke="#fff" d="m19 3-4 5.217L19 13" data-follow-stroke="#fff"/></svg>`,
  'rotate-right': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32"><g clip-path="url(#a)"><mask height="13" width="21" y="15" x="6" maskUnits="userSpaceOnUse" style="mask-type:luminance" id="b"><path fill="#fff" d="M7 15h19a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V16a1 1 0 0 1 1-1Z" data-follow-fill="#fff"/></mask><g mask="url(#b)"><path stroke-width="5" stroke="#fff" d="M7 15h19a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V16a1 1 0 0 1 1-1Z" data-follow-stroke="#fff"/></g><path stroke-width="2.5" stroke="#fff" d="M3.5 17V8h12" data-follow-stroke="#fff"/><path stroke-width="2.5" stroke="#fff" d="m13 3 4 5.217L13 13" data-follow-stroke="#fff"/></g><defs><clipPath id="a"><path transform="matrix(-1 0 0 1 32 0)" fill="#fff" d="M0 0h32v32H0z" data-follow-fill="#fff"/></clipPath></defs></svg>`,
  'close': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M5.63 25.428a.667.667 0 0 1 0-.943L24.484 5.63c.26-.26.683-.26.943 0l.943.943c.26.26.26.682 0 .943L7.515 26.37a.667.667 0 0 1-.943 0l-.943-.943Z" data-follow-fill="#fff"/><path fill="#fff" d="M25.428 26.37a.667.667 0 0 1-.943 0L5.63 7.516a.667.667 0 0 1 0-.943l.943-.943c.26-.26.683-.26.943 0l18.856 18.856c.26.26.26.683 0 .943l-.943.943Z" data-follow-fill="#fff"/></svg>`,
};

export class Previewer {
  previewing = false;
  lastPreviewedAt = null;
  urls = [];
  stepCurrent = 1;
  allSteps = 1;

  constructor() {
    this.render();
  }

  previewable($element) {
    if (!$element.hasAttribute('data-preview')) return false;
    const source = this.getSource($element);
    if (!source) return false;
    return true;
  }

  getElement = (selector) => {
    return $(selector);
  }

  getOriginElement = (url) => {
    return $(`img[src="${url}"]`)
    || $(`img[data-src="${url}"]`)
    || $(`img[data-hd="${url}"]`);
  }

  getSource = ($element) => {
    return $element.src
      || $element.getAttribute('data-src')
      || $element.getAttribute('data-hd');
  };

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
      animation: 'easeshow .4s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'all .3s',
      //
      // overflow: 'auto',
    });

    // @2 $style
    const $style = document.createElement('style');
    $style.innerHTML = `
      @keyframes easeshow {
        from {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }

        50% {
          opacity: 1;
        }
      }
      @keyframes easehide {
        from {
          opacity: 1;
        }

        50% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }

        to {
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
      }

      .pswp-toolbar-content .group {
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
        // padding: 8px;
      }

      .pswp .lake-pswp-tool-bar .pswp-toolbar-content .lake-pswp-counter {
        user-select: none;
        display: inline-block;
        font-size: 16px;
        vertical-align: top;
        line-height: 34px;
        color: #DEDEDE;
        margin: 0 2px;
        min-width: 37px;
      }

      .pswp .lake-pswp-tool-bar .pswp-toolbar-content .lake-pswp-counter .count {
        display: inline-block;
        width: 28px;
        text-align: center;
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

      .previewer .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }

      .previewer .close {
        position: fixed;
        top: 32px;
        right: 32px;
        width: 32px;
        height: 32px;
        padding: 8px;

        color: #fff;
        font-size: 20px;

        background-color: #3c3c3c;

        display: flex;
        justify-content: center;
        align-items: center;

        transition: all .3s;

        opacity: 0;

        border-radius: 2px;
      }

      .previewer .close:hover {
        cursor: pointer;
      }

      .previewer .toolbox {
        opacity: 0;
      }

      .previewer:hover .close {
        opacity: 1;
      }

      .previewer:hover .toolbox {
        opacity: 1;
      }

      // @media (min-width: 1024px) {
      //   .previewer .close {
      //     opacity: 1;
      //   }
      // }

      @media (max-width: 600px) {
        .pswp-toolbar-content {
          background: transparent;
          flex-flow: column wrap;
        }

        .pswp-toolbar-content .separation {
          display: none !important;
        }

        .pswp-toolbar-content .group {
          margin-bottom: 6px;
        }
      }
    `;
    $container.prepend($style);

    const $imageContainerWrapper = document.createElement('div');
    $imageContainerWrapper.className = 'previewer-image-container-wrapper';
    setStyles($imageContainerWrapper, {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      userSelect: 'none',
    });
    
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
      cursor: 'move',
    });
    this.createAlloyFinger($imageContainer);
    $imageContainerWrapper.appendChild($imageContainer);
    $container.appendChild($imageContainerWrapper);
    // @for PC
    // @TODO bug for mobile, we donot expect it run on mobile
    // @TODO only support mouse type, but does not work
    // addEvents($imageContainer, ['click', 'touchstart'], () => {
    //   // Mouse event
    //   // if (event.type === 'click' && event instanceof MouseEvent) {
    //   //   alert(event.type);
    //   //   this.togglePreview();
    //   // }
    //   // @TODO hack with userAgent, but want to use the event, help
    //   if (!/mobile/i.test(window.navigator.userAgent)) {
    //     this.togglePreview();
    //   }
    // });

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

    // @6.1 add close
    const $close = this.createClose();
    $container.appendChild($close);

    // @7 use icon font
    this.useIconFontCN('//at.alicdn.com/t/font_1508774_y6eqn0d1ta.js');

    // when click mask, close preview
    addEvents($maskContainer, ['click', 'tap'], this.togglePreview);
    document.body.appendChild($container);

    // to avoid click image to toggle preview
    addEvents($imageContainer, ['click'], event => {
      event.stopPropagation();
    });
    addEvents($('.previewer .toolbox .lake-pswp-arrow-left'), ['click'], this.previewPrevious);
    addEvents($('.previewer .toolbox .lake-pswp-arrow-right'), ['click'], this.previewNext);
    addEvents($('.previewer .lake-pswp-zoom-in'), ['click'], this.zoomIn);
    addEvents($('.previewer .lake-pswp-zoom-out'), ['click'], this.zoomOut);
    addEvents($('.previewer .lake-pswp-rotate-left'), ['click'], this.rotateLeft);
    addEvents($('.previewer .lake-pswp-rotate-right'), ['click'], this.rotateRight);
    addEvents($('.previewer .lake-pswp-origin-size'), ['click'], this.reset);
    // addEvents($('.lake-pswp-best-size'), ['click', 'tap'], this.reset);
    addEvents($('.previewer .close'), ['tap', 'click'], this.close);

    return {
      $box: $container,
      $image: $imageContainer,
      $mask: $maskContainer,
      $loading: $loadingContainer,
    };
  }

  setContainerStyles(attributes) {
    if (attributes) {
      setStyles(this.$container, attributes);
    }
  }

  setImageStyles(attributes) {
    if (attributes) {
      setStyles(this.$image, attributes);
    }
  }

  setUrls = (urls) => {
    this.urls = urls || [];
  }

  setSteps = (url) => {
    const urls = this.urls;
    const index = urls.indexOf(url);

    if (index === -1) {
      this.setUrls([url]);
      this.stepCurrent = 1;
      this.allSteps = 1;
      return ;
    }
    
    this.stepCurrent = index + 1;
    this.allSteps = urls.length;
  }

  useIconFontCN(scriptUrl) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    document.head.appendChild(script);
  }

  createIcon = (name) => {
    return icons[name] || '';
  };

  createClose = () => {
    const element = document.createElement('span') || document.querySelector('.previewer.close');
    element.className = 'close';
    // element.style = '';
    element.innerHTML = this.createIcon('close');

    return element;
  }

  createToolBox = () => {
    const element = document.createElement('div') || document.querySelector('.toolbox.pswp');
    element.className = 'toolbox pswp';
    element.style = 'position: fixed; bottom:0;left:50%;transform:translateX(-50%);padding:12px;transition:all .3s;';
    element.innerHTML = `
      <div class="lake-pswp-tool-bar">
        <div class="pswp-toolbar-content">
          <div class="group">
            <span class="lake-pswp-arrow-left btn default">
              ${this.createIcon('go-left')}
            </span>
            <span class="lake-pswp-counter">
              <span class="count current">${this.stepCurrent}</span>
              <span> / </span>
              <span class="count total">${this.allSteps}</span>
            </span>
            <span class="lake-pswp-arrow-right btn default">
              ${this.createIcon('go-right')}
            </span>
          </div>
          <span class="separation"></span>
          <div class="group">
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
          </div>
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

    $counter.innerHTML = `
      <span class="count current">${this.stepCurrent}</span>
        <span> / </span>
      <span class="count total">${this.allSteps}</span>
    `;
  };

  createAlloyFinger = ($image) => {
    Transform($image);
    let initScale = 1;

    const af = new AlloyFinger($image, {
      singleTap: () => {
        // this.togglePreview();
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
      addEvents(window, ['keydown'], this.keyboardLeftRight);
      this.preview(options);
    } else {
      removeEvents(window, ['keydown'], this.keyboardLeftRight);
      this.unpreview();
    }
  }

  preview = (options) => {
    // if (!options) return alert('preview with no options, it needs { styles?: {}, source?: string, index?: number }');

    const { styles, source, index = 0 } = options || {};
    const _source = source || this.urls[index];

    if (!_source) {
      return alert('No image source provided.');
    }

    this.previewing = true;
    const { $box, $image: $imageContainer, $loading } = this.getContainer();
    this.bodyScroll.disable();

    setStyles($box, {
      display: 'flex',
    });

    // @reset last image
    $imageContainer.setAttribute('src', '');
    let it = setTimeout(() => {
      // load image show loading
      setStyles($loading, {
        display: 'block',
      });
    }, 300);

    // @sync
    // $imageContainer.setAttribute('src', src);

    // const { max, auto } = maxImage($image);
    // setStyles($imageContainer, {
    //   [max]: '100%',
    //   [auto]: 'auto',
    // });

    // update tool box
    this.setSteps(_source);
    this.updateToolBox();

    // @async
    this.loadImage(_source, loadedSrc => {
      $imageContainer.setAttribute('src', loadedSrc);

      if (!styles) {
        const $originElement = this.getOriginElement(_source);

        if ($originElement) {
          const { max, auto } = maxImage($originElement);

          setStyles($imageContainer, {
            [max]: '100%',
            [auto]: 'auto',
          });
        }
      } else {
        setStyles($imageContainer, styles);
      }

      // load image done
      if (it) {
        clearTimeout(it);
        it = null;
      }
  
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
    const url = this.urls[nextIndex];

    this.reset();

    this.preview({
      source: url, // hd || regular,
    });
  };

  previewPrevious = () => {
    this.stepCurrent -= 1;
    if (this.stepCurrent <= 0) {
      this.stepCurrent = this.allSteps;
    }

    const prevIndex = this.stepCurrent - 1;
    const url = this.urls[prevIndex];

    this.reset();

    this.preview({
      source: url, // hd || regular,
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

  close = () => {
    this.unpreview();
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
      || $imageContainer.translateY !== 0
      || $imageContainer.translateZ !== 0) {
      new To($imageContainer, 'scaleX', 1, 500, ease);
      new To($imageContainer, 'scaleY', 1, 500, ease);
      new To($imageContainer, 'translateX', 0, 500, ease);
      new To($imageContainer, 'translateY', 0, 500, ease);
      new To($imageContainer, 'rotateX', 0, 500, ease);
      new To($imageContainer, 'rotateY', 0, 500, ease);
      new To($imageContainer, 'rotateZ', 0, 500, ease);
    } else {
      setTimeout(() => {
        To.reset($imageContainer, 'scaleX', 1);
        To.reset($imageContainer, 'scaleY', 1);
        To.reset($imageContainer, 'translateX', 0);
        To.reset($imageContainer, 'translateY', 0);
        To.reset($imageContainer, 'rotateX', 0);
        To.reset($imageContainer, 'rotateY', 0);
        To.reset($imageContainer, 'rotateZ', 0);
      }, 250);
    }
  }

  render = () => {
    this.bodyScroll = createBodyScrollable();

    const handler = event => {
      const $element = event.target;
      if (!this.previewable($element)) {
        return false;
      }

      if (!this.urls || !this.urls.length) {
        const $elements = Array.prototype
          .slice.call(document.querySelectorAll('[data-preview="true"]'));
        const urls = $elements.map($element => {
          return this.getSource($element);
        });
        this.setUrls(urls);
      }

      const source = this.getSource($element);
      const { max, auto } = maxImage($element);

      this.togglePreview({
        styles: {
          // detect width/height, which is bigger, then set 100%
          [max]: '100%',
          [auto]: 'auto',
        },
        source,
      });
    };

    addEvents(window, ['tap', 'click'], handler);
  }

  keyboardLeftRight = (event) => {
    const keyCode = event.keyCode;
    if (keyCode === 37) {
      this.previewPrevious();
    } else if (keyCode === 39) {
      this.previewNext();
    }
  }

  // others
  async download(options) {
    await download(options.url, options);
  }
}
