/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    taint: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  images: {
    remotePatterns: [
      {hostname: 'lh3.googleusercontent.com'},
      {hostname: 'imagedelivery.net'},
      {hostname: 'avatars.githubusercontent.com'}
    ]

  }
};

export default nextConfig;
