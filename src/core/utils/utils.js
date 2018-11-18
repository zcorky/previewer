import { setStyle } from './dom';

export function maxImage($img) {
  const width = $img.width;
  const height = $img.height;

  if (width >= height) {
    return {
      auto: 'height',
      max: 'width',
    };
  } else {
    return {
      auto: 'width',
      max: 'height',
    };
  }
}

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
};