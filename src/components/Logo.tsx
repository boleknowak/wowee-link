import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ className = '' }) {
  return (
    <Link href="/" className={`${className} block`}>
      <div className="flex flex-row items-center justify-center space-x-4">
        <Image src="/wowee.png" alt="Logo" width={64} height={64} />
        <h1 className="text-3xl font-bold">wowee.link</h1>
      </div>
    </Link>
  );
}
