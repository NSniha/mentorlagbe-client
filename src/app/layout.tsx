import type {Metadata} from 'next';
import './globals.css';
import {Providers} from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const metadata:Metadata={title:{default:'MentorLagbe — Find your mentor. Unlock your potential.',template:'%s | MentorLagbe'},description:'Explore personalized tuition and mentorship in Bangladesh. Find approved tutors, apply online, and grow with guidance that fits your goals.',robots:{index:true,follow:true},openGraph:{title:'MentorLagbe',description:'Your next learning breakthrough begins here.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body><Providers><Header/>{children}<Footer/></Providers></body></html>}
