import { css } from 'docz-plugin-css';

export default {
  base: '/teaness/',
  dest: 'docs',
  typescript: true,
  menu: ['Getting Started', 'components', 'Form Component', 'hooks'],
  theme: 'docz-theme-ztopia',
  themeConfig: {
    colors: {
      blackLight: '#242635', // sidebar background (dark), table header background (dark), preview handle background (dark), <blockquote> background, <code> background
      black: '#151725', // page background (dark)
      blackDark: '#0e1019', // text
      whiteLight: '#fcfcfd', // text
      white: '#ffffff', // page background (light)
      whiteDark: '#f5f7f9', // sidebar background (light), table header background (light), preview handle background (light), <blockquote> background, <code> background
      grey: '#d1d4db', // table border, preview border, preview handle bars
      primaryLight: '#d9eaff', // sidebar menu item (hovered)
      primary: '#40a9ff', // brand background, link, thematic break, preview error type, props table property name, <h1>, <blockquote> border left, search result
      primaryDark: '#0046a3', // link (hovered)
      secondary: '#595959', // props table shape type, brand background, <hr>, search result
      highlight: '#fa8c16', // matched search query
      error: 'rgba(200,0,0,0.8)', // preview error background
    },
    fonts: {
      body:
        '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
      title:
        '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
    },
    logo: {
      src: null,
      width: 40,
    },
  },
  plugins: [
    css({
      preprocessor: 'postcss',
    }),
    css({
      preprocessor: 'sass',
    }),
    css({
      preprocessor: 'less',
      loaderOpts: {
        javascriptEnabled: true,
      },
    }),
  ],
  filterComponents: files =>
    files.filter(filepath => /[w-]*.(js|jsx|ts|tsx)$/.test(filepath)),
  modifyBabelRc: babelrc => {
    // 需放 class-properties 前面
    babelrc.plugins.unshift([
      require.resolve('@babel/plugin-proposal-decorators'),
      { legacy: true },
    ]);

    return babelrc;
  },
};
