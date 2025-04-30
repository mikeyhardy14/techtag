
'use client';

import DecoderForm from '@/components/DecoderForm/DecoderForm';
import styles from './page.module.css';

export default function DecodePage() {
  return (
    <section className={styles.container}>
      <h2 className="text-2xl font-semibold mb-4">Decode Model Number</h2>
      <DecoderForm />
    </section>
  );
}
