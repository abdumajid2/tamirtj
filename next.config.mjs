/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: "https", hostname: "ui-avatars.com" },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/seed/**",
      },
      // если будешь брать с другого CDN — добавь сюда
    ],
  },
};

export default nextConfig;
