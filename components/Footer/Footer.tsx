// components/Footer/Footer.tsx
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.brand}>
              <h4>TechTag</h4>
              <p>
                The industry's leading HVAC nomenclature decoder. 
                Fast, accurate, and reliable model number breakdowns.
              </p>
            </div>
          </div>
          
          <div className={styles.section}>
            <h4>Quick Links</h4>
            <ul className={styles.links}>
              <li><Link href="/decode">Decode Now</Link></li>
              <li><Link href="/history">History</Link></li>
              <li><Link href="/subscribe">Pricing</Link></li>
              <li><Link href="/login">Sign In</Link></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>Support</h4>
            <ul className={styles.links}>
              <li>support@techtag.com</li>
              <li>1-800-TECHTAG</li>
              <li><Link href="#faq">FAQ</Link></li>
              <li><Link href="#docs">Documentation</Link></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4>Company</h4>
            <ul className={styles.links}>
              <li><Link href="#about">About Us</Link></li>
              <li><Link href="#careers">Careers</Link></li>
              <li><Link href="#privacy">Privacy Policy</Link></li>
              <li><Link href="#terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} TechTag. All rights reserved.</p>
          <div className={styles.badges}>
            <span className={styles.badge}>Industry Leading</span>
            <span className={styles.badge}>ISO Certified</span>
            <span className={styles.badge}>24/7 Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}



