import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.weltner.coxswaincrew',
  appName: 'coxswain-crew',
  webDir: 'dist/coxswain-crew/browser',
  server: {
    url: 'http://192.168.178.183:4200',
    cleartext: true,
  },
};

export default config;
