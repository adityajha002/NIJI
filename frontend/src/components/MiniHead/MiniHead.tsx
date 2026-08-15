import style from './MiniHead.module.css';
import { useAuth } from '../../context/useAuth';

const MiniHead = () => {
  const { user } = useAuth();
  return (
    <div className={style.main}>
      <div className={style.film}>
        <h1 className={style.heading}>WELCOME {user ? user.name.toUpperCase() : "PLEASE LOGIN FIRST"}</h1>
      </div>
    </div>
  );
};

export default MiniHead;
