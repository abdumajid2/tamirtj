export const metadata = {
  title: "Tamir.tj — ремонт и стройка",
  description: "Маркетплейс: мастера, компании, объекты и заявки на ремонт",
};

import "./globals.css";
import Providers from "@/app/providers";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

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
