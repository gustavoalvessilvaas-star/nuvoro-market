import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <section className="auth-page">
      <AuthForm mode="forgot-password" />
    </section>
  );
}
