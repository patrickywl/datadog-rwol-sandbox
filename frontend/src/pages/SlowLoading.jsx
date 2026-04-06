import { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import Footer from '../components/footer/Footer';
import slowLoadingImage from '../assets/slow_loading.png'; // LCP Candidate Image

// URL to simulate network delay
const SLOW_WAIT_URL =
  'https://slowfil.es/file?type=png&delay=10000&size=500&cachebuster=' + Date.now();

const SlowLoading = () => {
  const [isNetworkDone, setIsNetworkDone] = useState(false);
  const [isShowingHero, setIsShowingHero] = useState(false);

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageLoadElapsed, setImageLoadElapsed] = useState(null);

  const [lastLongTask, setLastLongTask] = useState(null);
  const [isLongTaskRunning, setIsLongTaskRunning] = useState(false);

  // --- Refs ---
  const slowChainStartRef = useRef(0); // Time when the slowfil.es request started
  const imageLoadTimeoutRef = useRef(null);
  
  const didBlockFcpRef = useRef(false);
  if (!didBlockFcpRef.current) {
    const BLOCK_FCP_MS = 3000; // Block first paint for 3 seconds
    const start = performance.now();
    while (performance.now() - start < BLOCK_FCP_MS) {
      // Intentionally block the main thread
    }
    didBlockFcpRef.current = true;
  }

  const startHeroImageLoading = () => {
    setIsImageLoading(true);
    setImageError(null);
    setImageSrc(null);
    setImageLoadElapsed(null);

    imageLoadTimeoutRef.current = setTimeout(() => {
      const img = new Image();
      img.src = slowLoadingImage;

      img.onload = () => {
        setImageSrc(slowLoadingImage);
        setIsImageLoading(false);

        const totalElapsed = performance.now() - slowChainStartRef.current;
        setImageLoadElapsed(Math.round(totalElapsed));

        imageLoadTimeoutRef.current = null;
      };

      img.onerror = () => {
        setImageError('Failed to load image. Please try again later.');
        setIsImageLoading(false);
        setImageLoadElapsed(null);
        imageLoadTimeoutRef.current = null;
      };
    }, 500);
  };

  useEffect(() => {
    const imgSlow = new Image();

    slowChainStartRef.current = performance.now();

    imgSlow.src = SLOW_WAIT_URL;

    const handleNetworkComplete = () => {
      setIsNetworkDone(true);
      setIsShowingHero(true);
      startHeroImageLoading();
    };

    imgSlow.onload = handleNetworkComplete;
    imgSlow.onerror = handleNetworkComplete; // Proceed even if the slow file fails

    return () => {
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
      }
    };
  }, []);

  const handleLongTask = () => {
    if (isLongTaskRunning) return;

    setIsLongTaskRunning(true);
    setLastLongTask(null);

    setTimeout(() => {
      const longTaskStart = performance.now();
      const BLOCK_DURATION_MS = 5000;
      const start = performance.now();

      while (performance.now() - start < BLOCK_DURATION_MS) {
        // CPU is busy here...
      }

      const elapsed = performance.now() - longTaskStart;
      setLastLongTask(Math.round(elapsed));
      setIsLongTaskRunning(false);
    }, 20);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-blue-50 via-white to-white text-center">
          <header className="max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
              Slow Loading Playground
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              This page is used to test Core Web Vitals, including poor LCP and FCP behavior.
            </p>
          </header>

          <div className="mt-8 w-full max-w-4xl flex flex-col items-center gap-4">
            {!isNetworkDone && (
              <div className="flex flex-col items-center gap-2 text-gray-600 text-sm md:text-base">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
                <p>Waiting for slow external resource to complete (simulating slow LCP)…</p>
              </div>
            )}

            {isNetworkDone && isShowingHero && (
              <>
                {isImageLoading && (
                  <div className="flex flex-col items-center gap-2 text-gray-600 text-sm md:text-base">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
                    <p>Simulating slow hero image delivery…</p>
                  </div>
                )}

                {imageError && (
                  <p className="text-sm text-red-600 text-center md:text-base">
                    {imageError}
                  </p>
                )}

                {imageSrc && !isImageLoading && !imageError && (
                  <img
                    src={imageSrc}
                    alt="Actual hero image"
                    className="w-full h-[30rem] object-cover rounded-xl shadow-lg border border-blue-100"
                    loading="eager"
                    decoding="sync"
                  />
                )}

                {!isImageLoading && !imageError && imageLoadElapsed != null && (
                  <p className="text-sm md:text-base text-blue-700 font-medium">
                    Hero image loaded in {(imageLoadElapsed / 1000).toFixed(2)} seconds
                    from the moment the slow resource request started.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleLongTask}
              disabled={isLongTaskRunning}
              className={`rounded-lg border px-6 py-3 text-white text-lg font-semibold shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 
                ${isLongTaskRunning 
                  ? 'bg-blue-400 border-blue-400 cursor-wait' 
                  : 'bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600'
                }`}
            >
              {isLongTaskRunning ? 'Running Long Task...' : 'Simulate Long Task'}
            </button>

            {isLongTaskRunning && (
              <p className="text-sm text-gray-500 animate-pulse">
                Blocking main thread... (UI will freeze)
              </p>
            )}

            {!isLongTaskRunning && lastLongTask != null && (
              <p className="text-sm text-gray-600">
                Long task completed in approximately {lastLongTask} ms (≈
                {(lastLongTask / 1000).toFixed(1)} s).
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SlowLoading;