import '../index.css';

export const metadata = {
  title: 'DevTracks - Commit Review Dashboard',
  description: 'Analyze GitHub commits and generate markdown reviews',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
