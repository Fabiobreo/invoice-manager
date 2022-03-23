import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../store/auth-context";
import classes from "./Header.module.css";

const Header = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;
  const loggedUserName = authCtx.current_user?.name;

  const logoutHandler = () => {
    authCtx.logout();
    // TODO: redirect the user
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
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              {loggedUserName}
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
