"use client";
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider/AuthProvider';
import styles from './page.module.css';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const { data, error } = await resetPassword(email);

      if (error) {
        setError(error.message);
        setIsSubmitting(false);
        return;
      }

      setSuccess("Password reset email sent! Check your inbox for instructions.");
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Reset Password</h1>
        
        <p className={styles.description}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
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
          disabled={isSubmitting}
          placeholder="your@email.com"
        />

        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className={styles.back}>
          <Link href="/login" className={styles.link}>
            ← Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
} 