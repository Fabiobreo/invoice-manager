import {
  Button,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { login } from "../../lib/api";
import { AuthContext } from "../../store/auth-context";
import Card from "../UI/Card";
import ErrorModal, { ErrorType } from "../UI/ErrorModal";

import classes from "./Login.module.css";

const Login: React.FC<{ switchAuthMode: () => void }> = (props) => {
  const history = useHistory();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const [showPassword, setShowPassword] = useState(false);
  const authCtx = useContext(AuthContext);

  const {
    sendRequest: sendLoginRequest,
    data: loginData,
    status: loginStatus,
    error: loginError,
  } = useHttp(login);

  useEffect(() => {
    if (loginStatus === "completed" && !loginError) {
      setIsLoading(false);
      const expirationTime = new Date(
        new Date().getTime() + 2 * 60 * 60 * 1000
      );
      authCtx.login(loginData, expirationTime.toISOString());
    } else if (loginError) {
      setIsLoading(false);
      setError({
        title: "Authentication failed",
        message: loginError,
        onConfirm: errorHandler,
      });
    }
  }, [loginStatus, loginData, loginError, authCtx, history]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current!.value;
    const enteredPassword = passwordInputRef.current!.value;

    if (enteredEmail.trim().length === 0) {
      setError({
        title: "Authentication failed",
        message: "Enter a valid email",
        onConfirm: errorHandler,
      });
      return;
    }

    if (enteredPassword.trim().length === 0) {
      setError({
        title: "Authentication failed",
        message: "Enter a valid password",
        onConfirm: errorHandler,
      });
      return;
    }

    setIsLoading(true);
    sendLoginRequest({
      email: enteredEmail,
      password: enteredPassword,
    });
  };

  const errorHandler = () => {
    setError(undefined);
  };

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Fragment>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <Card className={classes.login}>
        <Heading margin="2">Login</Heading>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="email">
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter email"
              required
              ref={emailInputRef}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="password">
              Password
            </FormLabel>

            <InputGroup>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                ref={passwordInputRef}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  background="#64b5f6"
                  color="white"
                  onClick={showPasswordHandler}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>

          <div className={classes.actions}>
            {!isLoading && (
              <Button type="submit" id="loginButton">
                Login
              </Button>
            )}
            {isLoading && (
              <Button isLoading loadingText="Submitting">
                Login
              </Button>
            )}
            <button
              type="button"
              className={classes.toggle}
              onClick={props.switchAuthMode}
              id="switchButton"
            >
              Create new account
            </button>
          </div>
        </form>
      </Card>
    </Fragment>
  );
};

export default Login;
