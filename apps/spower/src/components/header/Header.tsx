import { HeaderMenu } from './HeaderMenu';

const Logo = () => (
  <img
    src={'http://s-power.vn/wp-content/uploads/2021/04/spower-non-bg-1.png'}
    className={`h-9 w-20`}
    alt="logo"
  />
);

export const Header = () => {
  return (
    <div className={'flex w-full justify-between px-2 py-1 shadow'}>
      <div className={'flex items-center justify-center gap-40'}>
        <Logo />
      </div>
      <HeaderMenu />
    </div>
  );
};
