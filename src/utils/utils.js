import { setStyle } from '@zcorky/dom';

export function getViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
} 

export function maxImage($img) {
  const viewport = getViewport();
  const width = $img.width;
  const height = $img.height;

  // 图片本身宽度 vs 高度
  //  设置长边为最大
  if (width >= height) {
    // 图片短边 vs 视口
    // 
    //  如果短边比视口还高（宽），
    //    那么应该设置短边为最大宽度，
    //    以保证长边不会突出
    //
    if (height >= viewport.height) {
      return {
        auto: 'width',
        max: 'height',
      };
    }

    return {
      auto: 'height',
      max: 'width',
    };
  } else {
    if (width >= viewport.height) {
      return {
        auto: 'height',
        max: 'width',
      };
    }

    return {
      auto: 'width',
      max: 'height',
    };
  }
}

// export function maxImage(width, height) {
//   if (width >= height) {
//     return {
//       auto: 'height',
//       max: 'width',
//     };
//   } else {
//     return {
//       auto: 'width',
//       max: 'height',
//     };
//   }
// }

export function ease(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export function createBodyScrollable() {
  const origin = document.body.style.overflow;

  return {
    enable: () => {
      setStyle(document.body, 'overflow', origin);
    },
    disable: () => {
      setStyle(document.body, 'overflow', 'hidden');
    },
  };
}
