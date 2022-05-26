import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Gallery from './Gallery';

const queryClient = new QueryClient();

function Header() {
  return (
    <div className="pb-2 border-b wx-8 sticky top-0 border-theme-secondary backdrop-blur">
      <div className="text-lg px-4">
        <span className="font-bold">War aggregator</span>
        <span className="text-theme-red text-3xl">.</span>
      </div>
    </div>
  );
}

function Footer() {
  const href = 'https://github.com/volunteer-prb/war-agregator';
  return (
    <div className="py-2 px-4 bg-theme-secondary text-white text-right">
      <a
        className="underline"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {href}
      </a>
    </div>
  );
}

function App() {
  return (
    <div className="bg-theme-main flex flex-col h-screen">
      <QueryClientProvider client={queryClient}>
        <Header />
        <Gallery />
        <Footer />
      </QueryClientProvider>
    </div>
  );
}

export default App;
