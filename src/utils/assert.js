export function assert(value, message) {
  if (!value) {
    throw new Error(message); // eslint-disable-line
  }
}