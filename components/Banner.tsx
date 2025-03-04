'use client';
import Menu from '../components/HamburgerMenu';
import LoginButton from '../components/LoginButton';
import Link from 'next/link';

const Banner = () => {

  return (
    <div className='flex flex-row h-1/7 z-100 bg-[#D00000] text-center items-center p-1 w-full'>
        <div className="flex-shrink-0">
          <Menu />
        </div>
        <Link href={'/'}>
        <h1 className='font-extrabold text-3xl md:text-6xl font-cinzel_decorative mx-auto tracking-widest'>Boston Freedom Trail</h1>
        </Link>
        <div className='flex-grow-0 ml-40'>
          <LoginButton/>
        </div>
    </div>
  );
};

export default Banner;
