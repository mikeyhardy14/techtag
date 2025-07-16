
'use client';

import DecoderForm from '@/components/DecoderForm/DecoderForm';
import styles from './page.module.css';

export default function DecodePage() {
  return (
    <section className={styles.container}>
      <DecoderForm />
    </section>
  );
}
