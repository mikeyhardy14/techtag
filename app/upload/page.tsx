
'use client';

import styles from '../page.module.css';

export default function UploadPage() {
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Nomenclature dataset uploaded');
  };

  return (
    <form onSubmit={handleUpload} className={styles.container}>
      <h2 className="text-2xl font-semibold mb-4">Upload Dataset</h2>
      <input type="file" accept=".json" className="mb-4" />
      <button type="submit" className="btn">Upload</button>
    </form>
  );
}