const path = require('path');

const nextConfig = {
  images: {
    domains: [
      'contents.mediadecathlon.com',
      'commons.wikimedia.org',
    ],
  },
  outputFileTracingRoot: path.join(__dirname, '../'),
};
module.exports = nextConfig;
