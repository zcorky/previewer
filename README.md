# Movable
* Simply Preview Image

## Compatible
- Chrome
- Mobile

## How to
* 1 NPM
* 2 CDN: `<script src="https://unpkg.com/@zcorky/previewer/lib/index.umd.js"></script>`

```
// Auto Collect Preview Images Intelligently
// use NPM
import '@zcorky/previewer';

// use CDN
<script src="https://unpkg.com/@zcorky/previewer/lib/index.umd.js"></script>
```

```
// Preview Manually
import { previewer } from '@zcorky/previewer';

// Method One: Preview Many
preview.setUrls([
  'http://example.com/a.png',
  'http://example.com/b.png',
  'http://example.com/c.png',
])

// Method Two: Preview Single Image
previewer.preview({ source: 'http://example.com/a.png' });
```

## 更新日志
[CHANGELOG.md](https://github.com/zcorky/previewer/blob/master/CHANGELOG.md)