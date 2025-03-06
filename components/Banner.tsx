'use client';
import Menu from '../components/HamburgerMenu';
import LoginButton from '../components/LoginButton';
import Link from 'next/link';

interface BannerProps {
    setTrackingData: (data: string | null) => void;
    setIsTracking: React.Dispatch<React.SetStateAction<boolean>>;
    isTracking: boolean;
}

const Banner: React.FC<BannerProps> = ({ setTrackingData, setIsTracking, isTracking  }) => {
    return (
        <div className='flex items-center justify-between h-auto z-100 bg-[#D00000] p-2 w-full'>
            {/* Left: Menu*/}
            <div className="flex-shrink-0">
                <Menu setTrackingData={setTrackingData} setIsTracking={setIsTracking} isTracking={isTracking} />
            </div>

            {/* Center: Title*/}
            <div className="flex-grow text-center">
                <Link href={'/'}>
                    <h1 className='font-extrabold text-2xl md:text-6xl font-cinzel_decorative tracking-widest'>
                        Boston Freedom Trail
                    </h1>
                </Link>
            </div>

            {/* Right: LoginButton */}
            <div className='flex-shrink-0'>
                <LoginButton />
            </div>
        </div>
    );
};

export default Banner;
