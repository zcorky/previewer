/**
 * Get element
 * @param {string | element} selector 
 */
export function $(selector) {
  return typeof selector === 'string' ? document.querySelector(selector) : selector;
}

/**
 * Set element style.
 * @param {element}  
 * @param {string} name 
 * @param {number | string} value 
 */
export function setStyle($node, name, value) {
  const rValue = name === 'zIndex' ? value : typeof value === 'number' ? `${value}px` : value;
  if (($node.style[name]) === rValue) return false;
  
  $node.style[name] = rValue; // eslint-disable-line
}

export function setStyles($node, styles) {
  Object.keys(styles).forEach(key => {
    setStyle($node, key, styles[key]);
  });
}