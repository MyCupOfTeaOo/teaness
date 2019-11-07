import React from 'react';
import { useEffectState } from '../hooks/index';

export interface ImgProps {
  /**
   * 第一顺位图片
   */
  src?: string;
  /**
   * 备用图片 默认使用file.svg
   */
  backupSrc?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Img: React.FC<ImgProps> = props => {
  const [src, setSrc] = useEffectState(props.src || props.backupSrc, [
    props.src,
  ]);
  return (
    <img
      className={props.className}
      style={props.style}
      alt={props.alt}
      src={src}
      onError={() => setSrc(props.backupSrc)}
    />
  );
};
Img.defaultProps = {
  backupSrc:
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+CiAgPHBhdGggZmlsbD0iI0Q5RDlEOSIgZD0iTTUzNCAzNTJWMTM2SDIzMnY3NTJoNTYwVjM5NEg1NzZhNDIgNDIgMCAwIDEtNDItNDJ6Ii8+CiAgPHBhdGggZD0iTTg1NC42IDI4OC42TDYzOS40IDczLjRjLTYtNi0xNC4xLTkuNC0yMi42LTkuNEgxOTJjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjgzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg2NDBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMzExLjNjMC04LjUtMy40LTE2LjctOS40LTIyLjd6TTYwMiAxMzcuOEw3OTAuMiAzMjZINjAyVjEzNy44ek03OTIgODg4SDIzMlYxMzZoMzAydjIxNmE0MiA0MiAwIDAgMCA0MiA0MmgyMTZ2NDk0eiIvPgo8L3N2Zz4K',
};
export default Img;
