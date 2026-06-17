import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <section className="auth-page">
      <AuthForm mode="login" />
    </section>
  );
}
