const NOOP = () => null;

export function addEvent($node, name, handler) {
  if (name === 'tap') {
    onTap($node, handler);
    return ;
  }

  $node.addEventListener(name, handler);
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

export function onTap($node, callback) {
  let timeout = null;
  let lock = false;
  
  $node.addEventListener('touchstart', () => {
    timeout = Date.now();
  });

  $node.addEventListener('touchmove', () => {
    lock = true;
  });

  $node.addEventListener('touchend', function (event) {
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