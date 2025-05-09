// app/login/page.tsx
"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("jane.doe@example.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // simulate async login success
    setTimeout(() => {
      setIsSubmitting(false);
      const username = email.split("@")[0];
      router.push(`/u/${username}/dashboard`);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Log In</h1>

        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="jane.doe@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
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
        />

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Logging in…" : "Log In"}
        </button>

        <p className={styles.signup}>
          Don’t have an account?{" "}
          <a href="#" className={styles.link}>
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
