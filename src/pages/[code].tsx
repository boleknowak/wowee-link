/* eslint-disable react-hooks/exhaustive-deps */
import Logo from '@/components/Logo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Code() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const fetchLink = async () => {
    setIsLoading(true);
    const { code } = router.query;

    const res = await fetch(`/api/link?code=${code}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      setError('Something went wrong');
      setIsLoading(false);
      return;
    }

    const data = await res.json();

    if (data.data.error) {
      setError(data.data.error);
      setIsLoading(false);
      return;
    }

    if (data.data.url) {
      window.location.href = data.data.url;
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchLink();
    }
  }, [router.isReady]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-lg text-center">
        <Logo className="mb-12" />
        <div className="relative">
          <Image src="/blob.svg" alt="Blob" width={600} height={480} className="mx-auto" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {isLoading && (
              <div>
                <Image src="/loading.gif" alt="Loading" width={100} height={100} />
                <h2 className="text-xl text-black italic font-bold mt-2">Loading...</h2>
              </div>
            )}
            {!isLoading && (
              <div>
                <Image src="/error.png" alt="Error" width={100} height={100} className="mx-auto" />
                <h2 className="text-xl text-black italic font-bold mt-2">Oops! Something went wrong.</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
