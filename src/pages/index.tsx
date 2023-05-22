import Logo from '@/components/Logo';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasted, setIsPasted] = useState<boolean>(false);
  const [isShortened, setIsShortened] = useState<boolean>(false);
  const [shortenedUrl, setShortenedUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, pastedUrl: string | null = null) => {
    const parsedUrl = pastedUrl || url;
    // TODO: check if URL is valid and if it's not a short URL

    if (e !== null && typeof e !== 'undefined') {
      e.preventDefault();
    }

    if (!parsedUrl) {
      setError('Please enter a URL');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: parsedUrl }),
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

    if (data.data.short_url) {
      const fullUrl = `${window.location.protocol}//${window.location.host}/${data.data.short_url}`;
      urlRef.current?.select();
      navigator.clipboard.writeText(fullUrl);
      setIsShortened(true);
      setShortenedUrl(fullUrl);
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPasted) {
      setUrl(e.target.value);
    }

    setError('');
    setIsPasted(false);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    setIsPasted(true);
    setUrl(e.clipboardData.getData('text'));
    setError('');
    handleSubmit(null, e.clipboardData.getData('text'));
  };

  useEffect(() => {
    urlRef.current?.focus();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-lg text-center">
        <Logo className="mb-12" />
        <div className="relative">
          <Image src="/blob.svg" alt="Blob" width={600} height={480} className="mx-auto" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {!isShortened && (
              <div>
                <div className="text-black mb-4 font-bold text-xl">Just paste the URL</div>
                <form onSubmit={handleSubmit}>
                  <input type="text" name="url" id="url" ref={urlRef} onChange={(e) => handleChange(e)} onPaste={(e) => handlePaste(e)} value={url} autoFocus className="w-72 md:w-96 mx-auto bg-white text-black focus:outline-none focus:ring focus:ring-[#2C5364] border-4 border-[#2C5364] rounded-full py-2 px-4" placeholder="Enter a URL and hit enter" />
                </form>
                <div className="font-bold text-red-600 mt-2 text-sm h-5">{error}</div>
              </div>
            )}
            {isShortened && (
              <div>
                <div className="text-black mb-4 font-bold text-xl">Copied to clipboard! 🎉</div>
                <div className="text-black mb-4 font-bold">{shortenedUrl}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
