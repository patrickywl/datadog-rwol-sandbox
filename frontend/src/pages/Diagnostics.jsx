import { useEffect, useMemo, useState } from 'react';
import Header from '../Header';
import Footer from '../components/footer/Footer';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

const STORAGE_KEY = 'diagnostics_messages';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const weekdayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const day = weekdayNames[date.getDay()];
  const month = monthNames[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const friendlyHours = hours % 12 || 12;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${day}, ${dayOfMonth} ${month} ${year} ${friendlyHours}:${paddedMinutes} ${period}`;
};

const defaultUser = {
  id: '1234',
  name: 'John Doe',
  email: 'john@doe.com',
  plan: 'premium',
};

const Diagnostics = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasAppliedUser, setHasAppliedUser] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      console.warn('Unable to parse stored diagnostics messages', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!hasAppliedUser) {
      datadogRum.setUser(defaultUser);
      datadogLogs.setUser(defaultUser);
      setHasAppliedUser(true);
    }
  }, [hasAppliedUser]);

  const summaryText = useMemo(() => {
    if (messages.length === 0) {
      return 'No saved messages yet.';
    }
    return `${messages.length} saved ${messages.length > 1 ? 'messages' : 'message'}.`;
  }, [messages.length]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    const now = new Date().toISOString();
    setMessages((prev) => [
      { id: now, message: trimmed, createdAt: now },
      ...prev,
    ]);
    setMessage('');
  };

  const handleDeleteMessage = (id) => {
    setMessages((prev) => prev.filter((entry) => entry.id !== id));
  };

  const triggerRuntimeError = () => {
    setActionMessage('⚠️ Runtime error triggered! Check Datadog RUM → Errors to see the uncaught exception.');
    setTimeout(() => {
      const obj = {};
      obj.name.missingProperty;
    }, 100);
  };

  const generateManualRumError = () => {
    datadogRum.addError('Manual RUM error from Diagnostics playground', {
      source: 'manual',
      session_id: datadogRum.getInternalContext()?.session_id,
      feature: 'diagnostics-sandbox',
    });
    setActionMessage('✅ Manual RUM error event sent. View in Datadog RUM → Errors.');
  };

  const generateBrowserLogs = () => {
    const context = { issuedAt: new Date().toISOString(), feature: 'diagnostics-sandbox' };
    datadogLogs.logger.info("Diagnostics playground: INFO log generated", context);
    datadogLogs.logger.warn("Diagnostics playground: WARN log generated", context);
    datadogLogs.logger.error("Diagnostics playground: ERROR log generated", context);
    datadogLogs.logger.debug("Diagnostics playground: DEBUG log generated", context);
    setActionMessage('✅ Browser logs generated (INFO, WARN, ERROR, DEBUG). Check Datadog Logs.');
  };

  const fetchFromBackend = async () => {
    const backendUrl = import.meta.env.REACT_APP_BACKEND_URL;
    const apiUrl = backendUrl ? `${backendUrl}/api/products/1` : 'https://dummyjson.com/products/1';
    const label = backendUrl ? 'Backend API (via APM)' : 'DummyJSON API (direct, no APM)';

    setActionMessage(`🔄 Calling ${label}...`);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      datadogLogs.logger.info(`Diagnostics playground: ${label} response`, {
        feature: 'diagnostics-sandbox',
        productTitle: data?.title,
        viaBackend: !!backendUrl,
      });
      setActionMessage(`✅ ${label} called successfully. Product: "${data?.title}". Check Datadog RUM → Resources.`);
    } catch (error) {
      datadogLogs.logger.error(`Diagnostics playground: ${label} request failed`, {
        feature: 'diagnostics-sandbox',
        error: error.message,
      });
      setActionMessage(`❌ ${label} call failed. Check console or Datadog Logs for details.`);
    }
  };

  const clearAllMessages = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
          <header className="space-y-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600">Diagnostics Playground</h1>
            <p className="text-base md:text-lg text-gray-700">
              Experiment with Datadog RUM and Logs instrumentation. Save notes locally, trigger
              synthetic events, and watch them flow into your dashboards.
            </p>
          </header>

          <section className="bg-white border border-blue-100 shadow-sm rounded-2xl px-6 py-8 space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-semibold text-blue-700">Local Message Board</h2>
              <p className="text-sm text-gray-600">
                Use this form to persist messages in <code>localStorage</code>. This helps simulate
                user-generated content while RUM captures interactions.
              </p>
            </header>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                  Add New Message
                </label>
                <input
                  id="message"
                  name="message"
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Enter your message here"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                >
                  Save Message
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                  onClick={clearAllMessages}
                  disabled={messages.length === 0}
                >
                  Clear All
                </button>
                <span className="text-sm text-gray-500">{summaryText}</span>
              </div>
            </form>

            <div className="space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-gray-500 italic">No messages saved yet.</p>
              )}
              {messages.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm"
                >
                  <p className="text-gray-800">&ldquo;{entry.message}&rdquo;</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-gray-500">
                    <span>{formatTimestamp(entry.createdAt)}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(entry.id)}
                      className="rounded-md border border-red-200 px-2 py-1 font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                      data-dd-privacy="allow"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="bg-white border border-blue-100 shadow-sm rounded-2xl px-6 py-8 space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-semibold text-blue-700">Datadog Actions</h2>
              <p className="text-sm text-gray-600">
                Trigger synthetic scenarios to validate RUM error tracking, browser logs, and custom
                context management.
              </p>
            </header>

            {actionMessage && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                {actionMessage}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={triggerRuntimeError}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
              >
                Trigger Runtime Error
              </button>
              <button
                type="button"
                onClick={generateManualRumError}
                className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              >
                Add Manual RUM Error Event
              </button>
              <button
                type="button"
                onClick={generateBrowserLogs}
                className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
              >
                Generate Browser Logs
              </button>
              <button
                type="button"
                onClick={fetchFromBackend}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              >
                Call API (Backend / DummyJSON)
              </button>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Diagnostics;
