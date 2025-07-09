// app/signup/page.tsx
"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './page.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await signUp(email, password);

      if (error) {
        setError(error.message);
        setIsSubmitting(false);
        return;
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          // User is automatically confirmed, redirect to login
          setSuccess("Account created successfully! Redirecting to login...");
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          // User needs to confirm email
          setSuccess("Please check your email and click the confirmation link to activate your account.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Sign Up</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          disabled={isSubmitting || loading}
          placeholder="your@email.com"
        />

        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          disabled={isSubmitting || loading}
          placeholder="••••••••••"
          minLength={6}
        />

        <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
          disabled={isSubmitting || loading}
          placeholder="••••••••••"
          minLength={6}
        />

        <button type="submit" disabled={isSubmitting || loading} className={styles.button}>
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className={styles.signup}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
