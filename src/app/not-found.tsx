import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🥗</div>
        <h1 className="font-display text-5xl font-bold text-[#1B3A1F] mb-3">404</h1>
        <p className="text-[#5C7A61] mb-8 text-lg">This recipe doesn't exist... yet!</p>
        <Link href="/" className="green-gradient text-white px-8 py-3.5 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform inline-block">
          Back to Kitchen
        </Link>
      </div>
    </div>
  );
}
