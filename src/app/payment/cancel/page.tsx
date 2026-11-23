import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Cancel() {
  return (
    <main className="status-page [font-family:'DM_Sans',sans-serif]">
      <div>
        <span aria-hidden="true" className="status-icon">↩</span>
        <span className="eyebrow">✳ CHECKOUT CANCELLED</span>

        <h1 className="[font-family:Manrope,sans-serif]!">
          No payment was made.
        </h1>

        <p>
          You can continue using your Free plan or revisit the Pro options when
          you are ready.
        </p>

        <Link href="/pricing" className="btn btn-primary">
          Return to pricing <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}