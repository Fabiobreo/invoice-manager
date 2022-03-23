import {
  useState,
  Fragment,
} from "react";

import Login from "./Login";
import Register from "./Register";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <Fragment>
      {isLogin && <Login switchAuthMode={switchAuthModeHandler}/>}
      {!isLogin && <Register switchAuthMode={switchAuthModeHandler}/>}
    </Fragment>
  );
};

export default AuthForm;
