import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

let hasInitialized = false;

const getEnv = (key, fallback = undefined) => {
  const value = import.meta.env[key];
  return value != null && value !== '' ? value : fallback;
};

export const initializeDatadog = () => {
  if (hasInitialized) {
    return;
  }

  const applicationId = getEnv('REACT_APP_APP_ID_RUM');
  const clientToken = getEnv('REACT_APP_CLIENT_TOKEN_RUM');
  const site = getEnv('REACT_APP_DD_SITE');
  const version = getEnv('REACT_APP_VERSION');
  const service = getEnv('REACT_APP_DD_SERVICE', 'rwol-demo-frontend');
  const environment = getEnv('REACT_APP_DD_ENV', 'rwol-workshop');

  if (!applicationId || !clientToken || !site) {
    if (import.meta.env.DEV) {
      console.warn(
        'Datadog initialization skipped. Missing REACT_APP_* environment variables.',
      );
    }
    return;
  }

  const allowedTracingUrls = getEnv('REACT_APP_DD_ALLOWED_TRACING_URLS', '')
    ?.split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  let user;
  const storedUser = sessionStorage.getItem('dd_current_user');

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      user = null;
    }
  }

  if (!user) {
    user = {
      id: '100',
      name: 'Alex Smith',
      email: 'alex.smith@standard-user.com',
      plan: 'standard',
      hasPaid: false
    };
    sessionStorage.setItem('dd_current_user', JSON.stringify(user));
  }

  datadogRum.init({
    applicationId: applicationId,
    clientToken: clientToken,
    site: site,
    service: service,
    env: environment,
    version: version,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    startSessionReplayRecordingManually: false,
    trackResources: true,
    trackLongTasks: true,
    allowedTracingUrls: allowedTracingUrls.length > 0 ? allowedTracingUrls : [],
  });

  datadogRum.setUser(user);
  datadogRum.setGlobalContextProperty('activity', {
    ab_test: 'group_a',
    cartValue: true,
    amount: 99.99
  });

  datadogLogs.init({
    clientToken: clientToken,
    site: site,
    forwardErrorsToLogs: true,
    forwardConsoleLogs: 'all',
    sessionSampleRate: 100,
    telemetrySampleRate: 100,
    service: service,
    env: environment,
    version: version,
  });

  hasInitialized = true;
  console.log('[Datadog] RUM and Logs SDK initialized successfully');
};
