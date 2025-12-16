'use client';

import DecoderForm from '@/components/DecoderForm/DecoderForm';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function DecodePage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Fixed guest mode indicator - stays below navbar */}
      <div className={styles.guestBanner}>
        <div className={styles.guestBannerContent}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>You're using TechTag as a guest.</span>
          <a href="/signup" className={styles.guestBannerLink}>
            Sign up to save your decodes →
          </a>
        </div>
      </div>
      
      <section className={styles.container}>
        <DecoderForm />
      </section>
      
      <Footer />
    </div>
  );
}
