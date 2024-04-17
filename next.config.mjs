/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {hostname: 'lh3.googleusercontent.com'},
      {hostname: 'imagedelivery.net'},
    ]

  }
};

export default nextConfig;
