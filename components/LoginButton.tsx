'use client';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const LoginButton = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Handle the click functionality for the login button
  const handleLoginClick = () => {
    // Check if the user is logged in
    if (session) {
      // Navigate to the the profile page
      router.push('/profile');
    }
    else {
      // Navigate to the login page
      router.push('/login');
    }
  };

  return (
    <div className="relative">
      <button
        className="p-2 hover:bg-red-500"
        // Click event
        onClick={handleLoginClick}
      >
        <svg className="w-8 h-8 md:w-18 md:h-18 lg:w-20 lg:h-20"
          width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M40 13.3334C35.3359 13.3325 30.7531 14.555 26.709 16.8788C22.665 19.2026 19.3012 22.5464 16.9534 26.5765C14.6055 30.6067 13.3558 35.1821 13.3289 39.8461C13.302 44.5102 14.4988 49.0997 16.8 53.1567C18.3554 51.1353 20.3548 49.4986 22.6436 48.3733C24.9325 47.2479 27.4495 46.664 30 46.6667H50C52.5505 46.664 55.0675 47.2479 57.3564 48.3733C59.6452 49.4986 61.6446 51.1353 63.2 53.1567C65.5012 49.0997 66.698 44.5102 66.6711 39.8461C66.6442 35.1821 65.3944 30.6067 63.0466 26.5765C60.6988 22.5464 57.335 19.2026 53.2909 16.8788C49.2469 14.555 44.6641 13.3325 40 13.3334ZM66.4767 60.2534C66.8944 59.7089 67.2944 59.1511 67.6767 58.58C71.3721 53.089 73.342 46.6188 73.3333 40C73.3333 21.59 58.41 6.66669 40 6.66669C21.59 6.66669 6.66666 21.59 6.66666 40C6.65616 47.3226 9.06679 54.4431 13.5233 60.2534L13.5067 60.3134L14.69 61.69C17.8163 65.3451 21.6979 68.2787 26.0674 70.2888C30.4369 72.2989 35.1903 73.3376 40 73.3334C40.72 73.3334 41.4356 73.3111 42.1467 73.2667C48.1613 72.8874 53.9589 70.8765 58.9167 67.45C61.2877 65.8143 63.4367 63.8782 65.31 61.69L66.4933 60.3134L66.4767 60.2534ZM40 20C37.3478 20 34.8043 21.0536 32.9289 22.929C31.0536 24.8043 30 27.3479 30 30C30 32.6522 31.0536 35.1957 32.9289 37.0711C34.8043 38.9465 37.3478 40 40 40C42.6522 40 45.1957 38.9465 47.0711 37.0711C48.9464 35.1957 50 32.6522 50 30C50 27.3479 48.9464 24.8043 47.0711 22.929C45.1957 21.0536 42.6522 20 40 20Z" fill="white"/>
        </svg>



      </button>
    </div>
  );
};

export default LoginButton;
