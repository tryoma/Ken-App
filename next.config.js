/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'img.youtube.com',
      'storage.googleapis.com',
      'files.stripe.com',
      'lh3.googleusercontent.com',
    ],
  },
};

module.exports = nextConfig;
