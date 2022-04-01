import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from "../../store/auth-context";
import classes from "./Header.module.css";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const isLoggedIn = authCtx.isLoggedIn;
  const loggedUserName = authCtx.current_user?.name;

  const logoutHandler = () => {
    authCtx.logout();
    history.replace("/");
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>Invoice Manager</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/login" id="headerLogin">
                Login
              </Link>
            </li>
          )}
          {isLoggedIn && <li>{loggedUserName}</li>}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler} id="headerLogout">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
