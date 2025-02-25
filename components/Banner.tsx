'use client';
import Menu from '../components/HamburgerMenu';
import LoginButton from '../components/LoginButton';


const Banner = () => {

  return (
    <div className='flex flex-row h-1/7 z-100 bg-[#D00000] text-center items-center p-1'>
        <div className="flex-shrink-0">
          <Menu />
        </div>
        <h1 className='font-extrabold text-6xl font-cinzel_decorative mx-auto tracking-widest'>Boston Freedom Trail</h1>
        <div className='flex-grow-0'>
          <LoginButton/>
        </div>
    </div>
  );
};

export default Banner;
