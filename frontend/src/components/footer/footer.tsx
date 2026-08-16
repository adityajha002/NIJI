import { Link } from 'react-router-dom';
import style from './footer.module.css';

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.container}>
        <div className={style.brandCol}>
          <div className={style.logo}></div>
          <p className={style.tagline}>
            Empowering local shops and buyers with seamless discovery and trade.
          </p>
        </div>

        <div className={style.linksGroup}>
          <div className={style.col}>
            <h4 className={style.colTitle}>NAVIGATION</h4>
            <Link to="/" className={style.link}>Home</Link>
            <Link to="/auth" className={style.link}>Login / Register</Link>
            <Link to="/redirect-to-profile" className={style.link}>Dashboard</Link>
          </div>

          <div className={style.col}>
            <h4 className={style.colTitle}>DISCOVER</h4>
            <a href="#section1" className={style.link}>Explore Shops</a>
            <a href="#categories" className={style.link}>Categories</a>
            <a href="#featured" className={style.link}>Featured Products</a>
          </div>

          <div className={style.col}>
            <h4 className={style.colTitle}>CONNECT</h4>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={style.link}>Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={style.link}>Instagram</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={style.link}>GitHub</a>
          </div>
        </div>
      </div>

      <div className={style.bottomBar}>
        <p className={style.copyright}>
          &copy; {new Date().getFullYear()} NIJI. All rights reserved.
        </p>
        <div className={style.legalLinks}>
          <a href="#privacy" className={style.legalLink}>Privacy Policy</a>
          <span className={style.dot}>•</span>
          <a href="#terms" className={style.legalLink}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
