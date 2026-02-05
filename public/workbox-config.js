module.exports = {
  globDirectory: 'public/',
  globPatterns: [
    '**/manifest.json',
    '**/*.{png,jpg,jpeg}',
    '**/sw.js'
  ],
  swDest: 'public/sw.js',
  clientsClaim: true,
  skipWaiting: true
};