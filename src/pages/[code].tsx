/* eslint-disable react-hooks/exhaustive-deps */
import Logo from '@/components/Logo';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Code() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentLogo, setCurrentLogo] = useState<string>('default');
  const router = useRouter();

  const fetchLink = async () => {
    setIsLoading(true);
    setCurrentLogo('loading');
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
      setCurrentLogo('error');
      return;
    }

    const data = await res.json();

    if (data.data.error) {
      setError(data.data.error);
      setIsLoading(false);
      setCurrentLogo('error');
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
        <Logo className="mb-12" logo={currentLogo} />
        <div className="bg-white px-4 py-5 text-black background-border">
          <div>
            {isLoading && <div className="text-black font-bold text-lg">Redirecting...</div>}
            {!isLoading && error && <div className="text-black font-bold text-lg">{error}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
