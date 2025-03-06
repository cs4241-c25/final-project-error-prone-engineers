'use client';
import Link from 'next/link';

const Banner = () => {
    return (
        <div className='flex items-center justify-between min-h-[7rem] py-4 z-100 bg-[#D00000] px-4 w-full'>
            {/* Center: Title */}
            <div className="flex-grow text-center flex items-center justify-center">
                <Link href={'/'}>
                    <h1 className='font-extrabold text-2xl md:text-6xl font-cinzel_decorative tracking-widest leading-none'>
                        Boston Freedom Trail
                    </h1>
                </Link>
            </div>
        </div>
    );
};







export default Banner;
