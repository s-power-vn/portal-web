import { Link } from '@tanstack/react-router';

import { Bread } from '../bread';
import { HeaderMenu } from './header-menu';

const Logo = () => (
  <Link to="/" className="block">
    <img src={'/logo.png'} className={`h-10 w-20`} alt="logo" />
  </Link>
);

export const Header = () => {
  return (
    <div
      className={'flex w-full items-center justify-between px-2 py-1 shadow'}
    >
      <div className={'flex items-center justify-center'}>
        <Logo />
        <Bread />
      </div>
      <HeaderMenu />
    </div>
  );
};
