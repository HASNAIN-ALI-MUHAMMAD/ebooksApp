import "./globals.css";
import SessionProviderWrapper from "./(componets)/SessionProvider";

export const metadata = {
  title: "Personal eBook Collection",
  description: "A personal project for my ebook collection.Contains 100s of books and a pdf and a epub reader as well.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
            {children}
        </SessionProviderWrapper>
      </body>
    </html>

  );
}
