import { Bread } from '../bread';
import { HeaderMenu } from './header-menu';

const Logo = () => <img src={'/logo.png'} className={`h-10 w-20`} alt="logo" />;

export const Header = () => {
  return (
    <div
      className={'flex w-full items-center justify-between px-2 py-1 shadow'}
    >
      <div className={'flex items-center justify-center gap-4'}>
        <Logo />
        <Bread />
      </div>
      <HeaderMenu />
    </div>
  );
};
