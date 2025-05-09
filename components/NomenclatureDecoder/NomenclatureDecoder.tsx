'use client';
import { useState } from 'react';
import styles from '../page.module.css';

// Fake decode helper
const decode = (nomen: string) => {
  if (!nomen) return null;
  if (nomen.startsWith('GB')) return { brand: 'Greenheck', software: 'CAPS' };
  if (nomen.startsWith('AAON')) return { brand: 'AAON', software: 'AAON Select' };
  return { brand: 'Unknown', software: '—' };
};

export default function NomenclatureDecoder() {
  const [input, setInput] = useState('');
  const decoded = decode(input.trim());

  return (
    <div className={styles.decoder}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter nomenclature…"
      />
      {decoded && input && (
        <div className={styles.decodeResult}>
          <p><strong>Brand:</strong> {decoded.brand}</p>
          <p><strong>Software:</strong> {decoded.software}</p>
          {decoded.software !== '—' && (
            <a
              href={decoded.software === 'CAPS'
                ? 'https://caps.greenheck.com'
                : '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              Launch {decoded.software}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
