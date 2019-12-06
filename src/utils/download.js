export async function download(url, options) {
  const _options = options || {};
  
  const filename = _options.filename || +new Date();
  const method = _options.method || 'GET';
  const headers = _options.headers || {};
  const body = _options.body || undefined;

  const blob = await fetch(url, { method, headers, body }).then(res => res.blob());

  const blobUrl = window.URL.createObjectURL(blob);
  const $link = document.createElement('a');
  $link.style.display = 'none';
  $link.href = blobUrl;
  $link.download = filename;
  document.body.appendChild($link);
  $link.click();
  window.URL.revokeObjectURL(blobUrl);
  document.body.removeChild($link);
}