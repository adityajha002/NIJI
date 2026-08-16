import style from './loading.module.css';

interface LoadingProps {
  message?: string;
  variant?: 'page' | 'inline';
}

const Loading = ({
  message = 'Loading',
  variant = 'page',
}: LoadingProps) => {
  const className = [
    style.main,
    variant === 'inline' ? style.inline : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={style.page}>
      <div className={className} role="status" aria-live="polite">
        <div className={style.loader} aria-hidden="true">
          <span className={style.ring}></span>
          <span className={style.ring}></span>
          <span className={style.ring}></span>
          <span className={style.core}>N</span>
        </div>
        <p className={style.text}>{message}</p>
        <span className={style.srOnly}>{message}</span>
      </div>
    </div>
  );
};

export default Loading;
