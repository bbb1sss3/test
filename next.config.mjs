const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'image.coupangcdn.com' },
      { protocol: 'https', hostname: 'thumbnail.coupangcdn.com' },
      { protocol: 'https', hostname: 'thumbnail6.coupangcdn.com' },
      { protocol: 'https', hostname: 'thumbnail7.coupangcdn.com' },
      { protocol: 'https', hostname: 'ads-partners.coupang.com' },
    ],
  },
};

export default nextConfig;