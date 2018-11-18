
import * as path from 'path';

const sourcePath = path.resolve(__dirname, '../src');

// console.log(sourcePath);
// process.exit();

// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: false,
      dynamicImport: false,
      title: 'viewer',
      dll: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
    }],
  ],
  extraBabelIncludes: [
    sourcePath,
  ]
}
