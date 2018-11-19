import isSupportPassive from './isSupportPassive';

const passiveOptions = isSupportPassive() ? {
  passive: true,
  capture: false,
} : false;

const NOOP = () => null;

export function addEvent($node, name, handler) {
  if (name === 'tap') {
    onTap($node, handler);
    return ;
  }

  $node.addEventListener(name, handler, passiveOptions);
}

export function removeEvent($node, name, handler) {
  $node.removeEventListener(name, handler, passiveOptions);
}

/**
 * Compatible addEventListener
 * @param {element} $node
 * @param {array} names 
 * @param {function} handler 
 */
export function addEvents($node, names = [], handler = NOOP) {
  names.forEach(name => addEvent($node, name, handler));
}

export function removeEvents($node, names = [], handler = NOOP) {
  names.forEach(name => removeEvent($node, name, handler));
}

export function onTap($node, callback) {
  let timeout = null;
  let lock = false;
  
  addEvent($node, 'touchstart', () => {
    timeout = Date.now();
  });

  addEvent($node, 'touchmove', () => {
    lock = true;
  });

  addEvent($node, 'touchend', function (event) {
    if (lock) {
      lock = false;
      return false;
    }
    const delta = Date.now() - timeout;
    if (delta < 300) {
      callback.call(this, event);
    }
    timeout = Date.now();
  });
}