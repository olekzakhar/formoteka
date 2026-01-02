/** @type {import('next').NextConfig} */
const nextConfig = {
  // Потрібно це для того, що при білді Next.js конвертне всі зображення в один з цих форматів
  // і вони стануть легшими і будуть швидше завантажуватись
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
