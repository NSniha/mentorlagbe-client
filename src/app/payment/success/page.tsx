'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

import { useAuth } from '@/components/Providers';
import { request } from '@/lib/api';

function Content() {
  const sessionId = useSearchParams().get('session_id');
  const { token, refresh } = useAuth();
  const [status, setStatus] = useState('Verifying your payment securely...');

  useEffect(() => {
    if (!token) return;

    if (!sessionId) {
      setStatus('Missing payment session ID.');
      return;
    }

    request<{ paid: boolean; plan: string }>(
      `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
      {},
      token,
    )
      .then(async ({ paid }) => {
        await refresh();
        setStatus(
          paid
            ? 'Your payment is confirmed and your Pro plan is active!'
            : 'This payment has not been confirmed yet.',
        );
      })
      .catch((error: Error) => setStatus(error.message));
  }, [sessionId, token, refresh]);

  return (
    <main className="status-page [font-family:'DM_Sans',sans-serif]">
      <div>
        <CheckCircle2 size={54} aria-hidden="true" />
        <span className="eyebrow">✳ PAYMENT STATUS</span>

        <h1 className="[font-family:Manrope,sans-serif]!">
          Thanks for choosing to grow.
        </h1>

        <p aria-live="polite">{status}</p>

        <Link href="/dashboard" className="btn btn-primary">
          Back to dashboard <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}

export default function Success() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}