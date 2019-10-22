import { IBundleOptions } from 'father';

const options: IBundleOptions = {
  cjs: 'rollup',
  esm: 'babel',
  doc: {
    typescript: true,
  },
};

export default options;
