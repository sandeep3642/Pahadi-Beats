const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // other webpack config
  plugins: [
    // other plugins
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('/downloadedsongs'),
          handler: 'NetworkFirst', // Tries to fetch from the network, falls back to cache
          options: {
            cacheName: 'downloaded-songs-cache',
            expiration: {
              maxEntries: 50,
            },
          },
        },
      ],
    }),
  ],
};
