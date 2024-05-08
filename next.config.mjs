/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {hostname: 'lh3.googleusercontent.com'},
      {hostname: 'imagedelivery.net'},
      {hostname: 'avatars.githubusercontent.com'}
    ]

  }
};

export default nextConfig;
