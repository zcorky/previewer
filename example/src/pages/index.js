import styles from './index.css';

// import Previewer from '../../../src/core/index';
// import previewer from '../../../src/';
import { previewer } from '../../../lib/index';
// import '../utils/debug';

// new Previewer();

window.previewer = previewer;

export default function() {
  return (
    <div>
      <h3 className="title">Click image to open the viewer.</h3>
      <ul className="gallery">
        <li>
          <img data-preview="true" className="pic" src="https://p.qpic.cn/qqconadmin/0/e4a67754b2d1485aa186a4d38dbf07e1/0" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/2aqluyraXicEfqicaK3aV4iaib5icib78qF0eFxokIEKSewIg8hQW0kiavCQg/1000" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/3MSgRdnPzZAQnkIModguuoU1PXSKZUup1B67V82b3KicfhjAVwh19BRFia4DgWfxgg/1000" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/2aqluyraXicEfqicaK3aV4iazVolQTREmcvaEG92Hy9oibhyDJHNzu1s3w/1000" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/emH5YQz0vOJ2E0L6ZljlcW9nFgQzMXtpN240iaeB7PFUhZSWvvpbtLA/1000" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/hVlQlSGMCtYlKrqpM5xwdmJrbh4iaawOgY6lFT1eNWTib7qv2Z2QuJWXmchPUqBriay/1000" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/lDVAjxOVicMnyU4OWLShicffM3TvZYFia4ywL0B5oC3BLPDCoIkgdkJLA/0" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/2aqluyraXicEfqicaK3aV4ia3YQE3mKcibH02jibympJ4gzCUEjk2Iz5BwQ/1000" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/rqlh3lfegUYAvWGGNA8wyC5kly2PwLzONQsSatcxicqJOw0gz9MGmZg/1000" />
        </li>
        <li>
          <img data-preview="true" className="pic" src="https://gpic.qpic.cn/gbar_pic/PR0vBBjLNC7PpwKQ5YmKjo9ricr8EqAZFQVzXJG96SKCr4hVoWiaT4OQ/0" />
        </li>
      </ul>
    </div>
  );
}
