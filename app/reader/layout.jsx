

export const metadata = {
  title: "ePUB Reader",
  description: "ePUB Reader for my pesonal collection of eBooks.",
};

export default function RootLayout({ children }) {
  return (
      <body>
        {children}
      </body>
  );
}
