import React from 'react';
import logo from './assets/logo-footer.png';

interface ILogoFooter extends React.Props<HTMLImageElement> {
  alt?: string;
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default React.forwardRef(function LogoFooter(
  props: ILogoFooter,
  ref?: React.Ref<HTMLImageElement> | null,
) {
  const { className, alt = 'RIF OS', width = '150', ...other } = props;

  return (
    <img
      className={`logo ${className}`}
      src={logo}
      alt={alt}
      width={width}
      ref={ref}
      {...other}
    />
  );
});
