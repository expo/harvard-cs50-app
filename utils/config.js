const common = {
  AMPLITUDE_API_KEY: 'XXX',
  SENTRY_PUBLIC_DSN:
    'https://183a3e6c8a854f80809a3930ca1c1268@sentry.io/201826',
};

// Prod
const prod = {
  ...common,
  secondScreen: false,
  resourcesScreen: false,
  muteVideo: false,
  autoplayVideo: true,
  firstLoad: false,
  sentryEnabledInDev: false,
};

// Dev
const dev = {
  ...common,
  secondScreen: false,
  resourcesScreen: false,
  muteVideo: false,
  autoplayVideo: true,
  firstLoad: false,
  sentryEnabledInDev: true,
};

export default prod;
