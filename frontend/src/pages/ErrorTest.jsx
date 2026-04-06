import { useState } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import Header from '../Header';
import Footer from '../components/footer/Footer';

const ErrorTest = () => {
  const [hasTriggered, setHasTriggered] = useState(false);

  const throwError = () => {
    setHasTriggered(true);

    const error = new Error('Datadog RUM manual test error');
    datadogRum.addError(error, { page: 'error-test', trigger: 'button' });

    setTimeout(() => {
      throw error;
    }, 0);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-red-50 via-white to-white text-center">
          <header className="max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-red-600">
              Error Tracking Playground
            </h1>
            <p className="text-base md:text-lg text-gray-700">
              Use this page to confirm that Datadog RUM is receiving front-end errors. When you
              click the button below the app throws an uncaught error in a deferred callback so
              the page remains interactive while the error is reported.
            </p>
          </header>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={throwError}
              type="button"
              className="rounded-lg border border-red-500 bg-red-500 px-6 py-3 text-white text-lg font-semibold shadow-md transition hover:bg-red-600 hover:border-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            >
              Throw Error
            </button>
            <p className="text-sm text-gray-600 max-w-xl">
              {hasTriggered
                ? 'An error was triggered. Check Datadog RUM error dashboards or logs to confirm receipt.'
                : 'After triggering the error, verify the event in Datadog.'}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorTest;

