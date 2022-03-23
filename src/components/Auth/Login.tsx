import { Button, FormLabel, Heading, Input } from "@chakra-ui/react";
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
  const authCtx = useContext(AuthContext);

  const {
    sendRequest: sendLoginRequest,
    data: loginData,
    status: loginStatus,
    error: loginError,
  } = useHttp(login);

  useEffect(() => {
    setIsLoading(false);
    if (loginStatus === "completed" && !loginError) {
      const expirationTime = new Date(
        new Date().getTime() + 2 * 60 * 60 * 1000
      ); // TODO CHANGE HERE, EXPIRES LOGIN IN TWO HOURS
      authCtx.login(loginData, expirationTime.toISOString());
      history.replace("/");
    } else if (loginError) {
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
            <Input type="email" id="email" required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="password">
              Password
            </FormLabel>
            <Input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>

          <div className={classes.actions}>
            {!isLoading && <Button type="submit">Login</Button>}
            {isLoading && (
              <Button isLoading loadingText="Submitting">
                Login
              </Button>
            )}
            <button
              type="button"
              className={classes.toggle}
              onClick={props.switchAuthMode}
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
