import { useEffect, useRef, useState } from 'react';
import Header from '../../Header';
import Footer from '../../components/footer/Footer';

// Slow network resource URLs
const SLOW_IMAGE_URL = 'https://slowfil.es/file?type=png&delay=10000&size=1000&cachebuster=';
const SLOW_SCRIPT_URL = 'https://slowfil.es/file?type=js&delay=7000&size=100&cachebuster=';

// Placeholder image for LCP test
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop';

const PerformanceTestInvestigate = () => {
  // State management
  const [lcpImageSrc, setLcpImageSrc] = useState(null);
  const [lcpLoading, setLcpLoading] = useState(false);
  const [lcpLoadTime, setLcpLoadTime] = useState(null);

  const [inpTaskRunning, setInpTaskRunning] = useState(false);
  const [inpDuration, setInpDuration] = useState(null);

  const [layoutShiftTriggered, setLayoutShiftTriggered] = useState(false);

  const [loadingResources, setLoadingResources] = useState(true);
  const [resourceLoadTime, setResourceLoadTime] = useState(null);

  // Refs
  const didBlockFcpRef = useRef(false);
  const resourceStartTimeRef = useRef(0);
  const lcpStartTimeRef = useRef(0);

  // Block FCP: Block main thread for 5 seconds on initial render
  if (!didBlockFcpRef.current) {
    const BLOCK_FCP_MS = 5000;
    const start = performance.now();
    while (performance.now() - start < BLOCK_FCP_MS) {
      // Intentionally block main thread (delays FCP)
    }
    didBlockFcpRef.current = true;
  }

  // Increase Loading Time: Load slow network resources automatically
  useEffect(() => {
    resourceStartTimeRef.current = performance.now();

    const img1 = new Image();
    const img2 = new Image();

    img1.src = SLOW_IMAGE_URL + Date.now() + '_1';
    img2.src = SLOW_IMAGE_URL + Date.now() + '_2';

    let loaded = 0;
    const handleLoad = () => {
      loaded++;
      if (loaded === 2) {
        const elapsed = performance.now() - resourceStartTimeRef.current;
        setResourceLoadTime(Math.round(elapsed));
        setLoadingResources(false);
      }
    };

    img1.onload = handleLoad;
    img1.onerror = handleLoad;
    img2.onload = handleLoad;
    img2.onerror = handleLoad;

    // Additional slow script load simulation
    const script = document.createElement('script');
    script.src = SLOW_SCRIPT_URL + Date.now();
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Trigger Bad LCP: Load large image slowly on button click
  const handleTriggerBadLCP = () => {
    if (lcpLoading) return;

    setLcpLoading(true);
    setLcpImageSrc(null);
    setLcpLoadTime(null);
    lcpStartTimeRef.current = performance.now();

    // Load large image after network delay
    setTimeout(() => {
      const img = new Image();
      img.src = SLOW_IMAGE_URL + Date.now() + '_lcp';

      img.onload = () => {
        const elapsed = performance.now() - lcpStartTimeRef.current;
        setLcpImageSrc(img.src);
        setLcpLoadTime(Math.round(elapsed));
        setLcpLoading(false);
      };

      img.onerror = () => {
        // Use placeholder image on error
        setLcpLoading(false);
        setLcpImageSrc(PLACEHOLDER_IMAGE);
        const elapsed = performance.now() - lcpStartTimeRef.current;
        setLcpLoadTime(Math.round(elapsed));
      };
    }, 1000);
  };

  // Trigger Bad INP: Block main thread for a long time on button click
  const handleTriggerBadINP = () => {
    if (inpTaskRunning) return;

    setInpTaskRunning(true);
    setInpDuration(null);

    setTimeout(() => {
      const start = performance.now();
      const BLOCK_DURATION_MS = 6000; // Block for 6 seconds

      while (performance.now() - start < BLOCK_DURATION_MS) {
        // Use CPU intensively to degrade INP
        Math.sqrt(Math.random() * 1000000);
      }

      const elapsed = performance.now() - start;
      setInpDuration(Math.round(elapsed));
      setInpTaskRunning(false);
    }, 20);
  };

  // Trigger Layout Shift: Add large content dynamically
  const handleTriggerLayoutShift = () => {
    setLayoutShiftTriggered(true);

    // Trigger Layout Shift after 2 seconds
    setTimeout(() => {
      setLayoutShiftTriggered(false);
    }, 100);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        <section className="min-h-screen flex flex-col items-center px-6 py-16 bg-gradient-to-b from-purple-50 via-white to-white">
          {/* Header */}
          <header className="max-w-2xl text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600">
              Performance Test - Investigate
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              This page intentionally degrades Core Web Vitals metrics for testing purposes.
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>✓ FCP blocked for 5 seconds (automatic)</p>
              <p>✓ Loading slow network resources (automatic)</p>
            </div>
          </header>

          {/* Loading Status */}
          {loadingResources && (
            <div className="mt-8 flex flex-col items-center gap-3 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
              <p className="text-gray-700 font-medium">
                Loading slow network resources... (Increasing Loading Time)
              </p>
            </div>
          )}

          {!loadingResources && resourceLoadTime && (
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                ✓ Resources loaded: {(resourceLoadTime / 1000).toFixed(2)}s
              </p>
            </div>
          )}

          {/* Test Buttons */}
          <div className="mt-12 w-full max-w-4xl space-y-8">
            {/* LCP Test */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                1. LCP (Largest Contentful Paint) Test
              </h2>
              <p className="text-gray-600 mb-4">
                Loads a large image slowly to degrade LCP performance.
              </p>

              <button
                onClick={handleTriggerBadLCP}
                disabled={lcpLoading}
                className={`rounded-lg px-6 py-3 text-white text-lg font-semibold shadow-md transition
                  ${lcpLoading
                    ? 'bg-purple-400 cursor-wait'
                    : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {lcpLoading ? 'Loading Image...' : 'Trigger Bad LCP'}
              </button>

              {lcpLoading && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                  <p className="text-gray-600">Loading large image slowly...</p>
                </div>
              )}

              {lcpImageSrc && !lcpLoading && (
                <div className="mt-4 space-y-3">
                  <img
                    src={lcpImageSrc}
                    alt="LCP Test Image"
                    className="w-full h-96 object-cover rounded-lg shadow-md"
                    loading="eager"
                  />
                  <p className="text-purple-700 font-medium">
                    ✓ LCP image loaded: {(lcpLoadTime / 1000).toFixed(2)}s
                  </p>
                </div>
              )}
            </div>

            {/* INP Test */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                2. INP (Interaction to Next Paint) Test
              </h2>
              <p className="text-gray-600 mb-4">
                Blocks the main thread for 6 seconds on click to degrade INP performance.
              </p>

              <button
                onClick={handleTriggerBadINP}
                disabled={inpTaskRunning}
                className={`rounded-lg px-6 py-3 text-white text-lg font-semibold shadow-md transition
                  ${inpTaskRunning
                    ? 'bg-red-400 cursor-wait'
                    : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {inpTaskRunning ? 'Running Long Task...' : 'Trigger Bad INP'}
              </button>

              {inpTaskRunning && (
                <p className="mt-3 text-sm text-red-600 animate-pulse font-medium">
                  ⚠ Blocking main thread... UI will freeze!
                </p>
              )}

              {!inpTaskRunning && inpDuration && (
                <p className="mt-3 text-red-700 font-medium">
                  ✓ Long task completed: {inpDuration}ms (≈{(inpDuration / 1000).toFixed(1)}s)
                </p>
              )}
            </div>

            {/* Layout Shift Test */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                3. Layout Shift (CLS) Test
              </h2>
              <p className="text-gray-600 mb-4">
                Dynamically adds large content to trigger layout shifts.
              </p>

              <button
                onClick={handleTriggerLayoutShift}
                className="rounded-lg px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold shadow-md transition"
              >
                Trigger Layout Shift
              </button>

              {layoutShiftTriggered && (
                <div className="mt-4 p-8 bg-orange-100 border-4 border-orange-500 rounded-lg">
                  <p className="text-2xl font-bold text-orange-800">
                    ⚠ Large Content Appeared Suddenly!
                  </p>
                  <p className="text-orange-700 mt-2">
                    This triggers a layout shift.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PerformanceTestInvestigate;
