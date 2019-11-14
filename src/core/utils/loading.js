const innerHTML = `
<style>
.zcorky-loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: -10;
}
.zcorky-wrapper {
  width: 50px;
  height: 50px;
}

.rotate {
  animation: zcorky-rotate 1s linear infinite;
}

@keyframes zcorky-rotate {
  to {
    transform: rotate(1turn);
  }
}
</style>
<svg class="zcorky-wrapper" viewBox="-25 -25 50 50">
  <circle cx="0" cy="0" r="20" stroke="#f0f0f0" fill="none" stroke-width="3px" style="opacity: 0.4"></circle>
  <circle cx="0" cy="0" r="20" stroke="#f0f0f0" fill="none" stroke-width="3px" stroke-dasharray="20 150" class="rotate"></circle>
</svg>
`;

export const createLoading = () => {
  const div = document.createElement('div');
  div.innerHTML = innerHTML;
  div.classList.add('zcorky-loading-container');
  return div;
};