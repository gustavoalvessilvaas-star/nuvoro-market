import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <section className="auth-page">
      <AuthForm mode="register" />
    </section>
  );
}
