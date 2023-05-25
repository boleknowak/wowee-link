import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  className?: string;
  logo?: string | 'default' | 'loading' | 'error';
  onClick?: () => void;
};

export default function Logo({ className = '', logo = 'default', onClick }: LogoProps) {
  return (
    <Link href="/" className={`${className} block font-poppins`} onClick={onClick}>
      <div className="flex flex-row items-center justify-center space-x-4">
        {logo === 'default' && <Image src="/wowee.png" alt="Logo" width={64} height={64} />}
        {logo === 'loading' && <Image src="/loading.gif" alt="Loading Logo" width={64} height={64} />}
        {logo === 'error' && <Image src="/error.png" alt="Error Logo" width={64} height={64} />}
        <h1 className="text-3xl font-bold">wowee.link</h1>
      </div>
    </Link>
  );
}
