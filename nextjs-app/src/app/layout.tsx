import type { Metadata } from 'next';
import './globals.css';
import { Inter, Merriweather } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['300','400','700'], variable: '--font-merriweather' });


export const metadata: Metadata = {
title: 'SymptomSense',
description: 'Private · On-device · AI-powered health guidance.',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<head>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
<link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon.svg" />
<link rel="icon" href="/favicon.ico" />
</head>
<body className={`${inter.variable} ${merriweather.variable}`}>
<div className="min-h-screen flex flex-col">
<header
className="border-b sticky top-0 z-10 saturate-150"
style={{
  backgroundImage:
    "linear-gradient(135deg, #F2F0EF 0%, #e9fbf2 18%, #91C8E4 48%, #3aa0c0 68%, #245F73 100%)",
  backgroundAttachment: "fixed",
  backgroundSize: "cover"
}}
>
<div className="mx-auto max-w-6xl px-4 py-6 flex flex-col items-center justify-center text-center">
<div className="w-12 h-12 rounded-full bg-white/80 text-[var(--tone-teal)] flex items-center justify-center mb-2 shadow">🩺</div>
<div className="text-2xl sm:text-3xl font-semibold text-white drop-shadow">SymptomSense</div>
<div className="text-[12px] text-white/90">Private · On-device · AI-powered</div>
</div>
</header>


<main className="flex-1">{children}</main>


<footer className="border-t bg-white/80 backdrop-blur">
<div className="mx-auto max-w-5xl px-4 py-5">
<div className="heartbeat-line mb-3" />
<div className="flex items-center justify-between text-xs text-gray-500 gap-3 flex-wrap">
<div className="flex items-center gap-2"><span className="text-emerald-600">●</span> Powered by Local AI</div>
<div>Not a doctor. For educational use only.</div>
<button className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Help & Contact</button>
</div>
</div>
</footer>
</div>
</body>
</html>
);
}