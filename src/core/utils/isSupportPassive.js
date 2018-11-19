/**
 * Detect the device is support passive
 */
let isSupport = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      isSupport = true;
    },
  });
  window.addEventListener('test', null, opts);
} catch (e) {
  //
}

export default function isSupportPassive() {
  return isSupport;
}