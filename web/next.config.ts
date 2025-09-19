import path from 'path';

const nextConfig = {
  images: {
    domains: ['contents.mediadecathlon.com',],
  },
  outputFileTracingRoot: path.join(__dirname, '../'),
};
module.exports = nextConfig;
