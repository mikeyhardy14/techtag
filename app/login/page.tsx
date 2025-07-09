// app/login/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        // Create username from email for URL
        const username = email.split("@")[0];
        router.push(`/u/${username}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Log In</h1>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="your@email.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          disabled={isSubmitting || loading}
        />

        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="••••••••••"
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          disabled={isSubmitting || loading}
        />

        <button 
          type="submit" 
          disabled={isSubmitting || loading} 
          className={styles.button}
        >
          {isSubmitting ? "Logging in…" : "Log In"}
        </button>

        <div className={styles.links}>
          <Link href="/auth/forgot-password" className={styles.link}>
            Forgot your password?
          </Link>
        </div>

        <p className={styles.signup}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
