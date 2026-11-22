import Link from 'next/link';import {ArrowUpRight} from 'lucide-react';
export default function NotFound(){return <main className="notfound"><span>404 ✳</span><h1>Looks like this page<br/>is on a <em>study break.</em></h1><p>Let's get you back to something worth exploring.</p><Link href="/" className="btn btn-primary">Back to home <ArrowUpRight size={18}/></Link></main>}
