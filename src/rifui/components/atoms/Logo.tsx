import React from 'react';
import logo_full_blk from '../../assets/logo-full-blk.svg';

interface ILogo extends React.Props<HTMLImageElement> {
  alt?: string;
  style?: React.CSSProperties;
}

export default React.forwardRef(function LogoFooter(
  props: ILogo,
  ref?: React.Ref<HTMLImageElement> | null,
) {
  const { alt = 'RIF OS', ...other } = props;

  return <img src={logo_full_blk} alt={alt} ref={ref} {...other} />;
});
