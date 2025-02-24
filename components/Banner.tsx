'use client';
import Menu from '../components/HamburgerMenu';
import LoginButton from '../components/LoginButton';


const Banner = () => {

  return (
    <div className='flex flex-row h-1/6 z-100 bg-[#D00000] text-center items-center p-2'>
        <div className="flex-shrink-0">
          <Menu />
        </div>
        <h1 className='font-extrabold text-5xl font-cinzel mx-auto'>Boston Freedom Trail</h1>
        <div className='flex-grow-0'>
          <LoginButton/>
        </div>
    </div>
  );
};

export default Banner;
