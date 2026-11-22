'use client';

import {Suspense,useEffect,useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {AlertCircle,ArrowUpRight,CheckCircle2,Clock3} from 'lucide-react';
import {useAuth} from '@/components/Providers';
import {request} from '@/lib/api';

type Result = {sessionId: string; verified: boolean; message: string};

function Content() {
 const params = useSearchParams();
 const {token,loading,refresh} = useAuth();
 const sessionId = params.get('session_id');
 const [result,setResult] = useState<Result | null>(null);

 useEffect(()=>{
  if (!token || !sessionId) return;
  const controller = new AbortController();
  setResult(null);
  const query = new URLSearchParams({session_id:sessionId});
  request<{paid:boolean;plan:string}>('/api/payments/verify?'+query, {signal:controller.signal}, token)
   .then(async data=>{
    if (controller.signal.aborted) return;
    const verified = data.paid && data.plan === 'pro';
    if (verified) await refresh();
    if (!controller.signal.aborted) setResult({
     sessionId,
     verified,
     message:verified?'Your payment is confirmed and your Pro plan is active!':'Your payment has not been confirmed yet.',
    });
   })
   .catch(error=>{
    if (!controller.signal.aborted) setResult({sessionId,verified:false,message:error.message});
   });
  return ()=>controller.abort();
 },[sessionId,token,refresh]);

 const needsSignIn = Boolean(sessionId && !loading && !token);
 const verification = token && result?.sessionId === sessionId ? result : null;
 const status = !sessionId?'Missing payment session ID.':
  needsSignIn?'Sign in to verify this payment with your account.':
  verification?.message ?? 'Verifying your payment securely...';
 const StatusIcon = verification?.verified?CheckCircle2:!sessionId||needsSignIn||verification?AlertCircle:Clock3;
 const signInPath = '/sign-in?'+new URLSearchParams({next:'/payment/success?'+new URLSearchParams({session_id:sessionId ?? ''})});

 return <main className="status-page"><div>
  <StatusIcon size={54} aria-hidden="true"/>
  <span className="eyebrow">✳ PAYMENT STATUS</span>
  <h1>{verification?.verified?'Your Pro plan is active.':'Verify your payment'}</h1>
  <p role="status">{status}</p>
  <Link className="btn btn-primary" href={needsSignIn?signInPath:'/dashboard'}>
   {needsSignIn?'Sign in':'Back to dashboard'} <ArrowUpRight size={17}/>
  </Link>
 </div></main>;
}
export default function Success(){return <Suspense><Content/></Suspense>}
