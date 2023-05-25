import Logo from '@/components/Logo';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { IoStatsChart } from 'react-icons/io5';
import { AiOutlinePlusCircle } from 'react-icons/ai';

export default function Home() {
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasted, setIsPasted] = useState<boolean>(false);
  const [isShortened, setIsShortened] = useState<boolean>(false);
  const [shortenedUrl, setShortenedUrl] = useState<string>('');
  const [shortenedCode, setShortenedCode] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [currentLogo, setCurrentLogo] = useState<string>('default');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null, pastedUrl: string | null = null) => {
    const parsedUrl = pastedUrl || url;
    // TODO: check if URL is valid and if it's not a short URL

    if (e !== null && typeof e !== 'undefined') {
      e.preventDefault();
    }

    if (!parsedUrl) {
      setError('Please enter a URL');
      setCurrentLogo('error');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setCurrentLogo('loading');

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

    if (data.data.short_url) {
      const fullUrl = `${window.location.protocol}//${window.location.host}/${data.data.short_url}`;
      urlRef.current?.select();
      navigator.clipboard.writeText(fullUrl);
      setIsShortened(true);
      setShortenedUrl(fullUrl);
      setShortenedCode(data.data.short_url);
      setElapsedTime(data.data.elapsed_time);
    }

    setIsLoading(false);
    setCurrentLogo('default');
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

  const copyUrl = () => {
    navigator.clipboard.writeText(shortenedUrl);
  };

  const resetPage = () => {
    setUrl('');
    setError('');
    setIsPasted(false);
    setIsShortened(false);
    setShortenedUrl('');
    setShortenedCode('');
    setElapsedTime(0);
    setCurrentLogo('default');
  };

  useEffect(() => {
    urlRef.current?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>wowee.link</title>
        <meta name="description" content="A simple URL shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-lg">
          <Logo className="mb-12" logo={currentLogo} onClick={() => resetPage()} />
          <div className="bg-white px-4 py-5 text-black background-border">
            {!isShortened && (
              <div>
                <div className="text-black mb-2 font-bold text-lg">Just paste the URL</div>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-grow flex-row items-center space-x-2">
                    <input type="text" name="url" id="url" ref={urlRef} onChange={(e) => handleChange(e)} onPaste={(e) => handlePaste(e)} value={url} autoFocus className="w-72 md:w-96 mx-auto bg-white text-black focus:outline-none font-poppins tracking-wide border-4 border-[#2C5364] bg-[#E7E7E7] py-2 px-4" placeholder="https://" />
                    <button type="submit" className="bg-[#ECB580] px-6 h-12 border-4 border-[#2C5364] font-bold text-sm">
                      shrink
                    </button>
                  </div>
                </form>
                <div className="font-bold text-red-600 mt-2 text-xs h-5 font-poppins">{error}</div>
              </div>
            )}
            {isShortened && (
              <div>
                <div className="mb-10">
                  <div className="text-black font-bold text-lg">Yay! URL copied to clipboard. 🎉</div>
                  <div className="text-black font-bold text-sm">It took {elapsedTime} ms.</div>
                </div>
                <div>
                  <div className="flex flex-row items-center space-x-3">
                    <div className="text-black font-bold text-sm">{shortenedUrl}</div>
                    <div className="flex flex-row items-center space-x-1">
                      <button className="hover:bg-gray-200 rounded-full h-6 w-6" title="Copy" onClick={() => copyUrl()}>
                        <BiCopy className="mx-auto" />
                      </button>
                      <Link href={`/stats/${shortenedCode}`} className="block flex items-center hover:bg-gray-200 rounded-full h-6 w-6" title="Statistics">
                        <IoStatsChart className="mx-auto" />
                      </Link>
                      <button className="hover:bg-gray-200 rounded-full h-6 w-6" title="Short one more" onClick={() => resetPage()}>
                        <AiOutlinePlusCircle className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
