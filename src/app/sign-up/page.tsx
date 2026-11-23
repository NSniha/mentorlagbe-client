import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';

export default function SignUp() {
  return (
    <div
      className="contents [font-family:'DM_Sans',sans-serif]
        [&_.auth-page_h1]:[font-family:Manrope,sans-serif]!
        [&_.auth-page_h1_em]:[font-family:Manrope,sans-serif]!
        [&_.auth-visual_h1]:text-[clamp(2.125rem,8.5vw,3.5rem)]!
        lg:[&_.auth-visual_h1]:text-[clamp(3rem,5vw,4.25rem)]!
        [&_.auth-form-shell_h1]:text-[clamp(1.875rem,3.38vw,2.875rem)]!
        [&_.auth-page_p]:text-[15px]!
        [&_.auth-form_label]:text-[14px]!
        [&_.auth-form_input]:text-[15px]!
        [&_.auth-form_.btn]:text-[14px]!"
    >
      <Suspense>
        <AuthForm mode="up" />
      </Suspense>
    </div>
  );
}