import style from "./sideMenu.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

interface SideMenuProps {
  isOpen: boolean;
}

const SideMenu = ({ isOpen }: SideMenuProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className={`${style.main} ${isOpen ? style.open : ""}`}>
      <div className={style.film}>
        {user ? (
          <div
            className={style.menuOption}
            onClick={userLogout}
            role="button"
            tabIndex={0}
          >
            LOGOUT
          </div>
        ) : (
          <Link to="/auth" style={{ textDecoration: "none" }}>
            <div className={style.menuOption}>LOGIN</div>
          </Link>
        )}

        {user?.role === "user" && (
          <Link to="/add" style={{ textDecoration: "none" }}>
            <div className={style.menuOption}>ADD YOUR SHOP</div>
          </Link>
        )}

        {user && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className={style.menuOption}>INBOX</div>
          </Link>
        )}

        {user && (
          <Link
            to="/redirect-to-profile"
            style={{ textDecoration: "none" }}
          >
            <div className={style.menuOption}>PROFILE</div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
