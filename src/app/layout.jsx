export const metadata = {
  title: { default: "Tamir.tj — ремонт и стройка", template: "%s — Tamir.tj" },
  icons: {
    icon: [
      {
        url: 'tamirlogo.png', type: 'image/png', sizes: '48x48'
      }
    ]
  },
  description: "Tamir.tj — платформа для поиска проверенных специалистов в сфере ремонта и строительства в Таджикистане. Найдите мастера для вашего проекта быстро и надежно.",
  openGraph: {
    title: "Tamir.tj — ремонт и стройка",
    description:
      "Вызов проверенных мастеров: сантехника, электрика, мебель, кондиционеры. Цены, отзывы, быстрый заказ онлайн.",
    url: "https://tamir.tj",
    siteName: "Tamir.tj",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
};

import "./globals.css";
import Providers from "@/app/providers";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { url } from "zod";

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <Navbar />
          <main className="section container">{children}</main>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
