import { Button, FormLabel, Heading, Input, useToast } from "@chakra-ui/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../hooks/use-http";
import { login, register } from "../../lib/api";
import { AuthContext } from "../../store/auth-context";
import Card from "../UI/Card";
import ErrorModal, { ErrorType } from "../UI/ErrorModal";

import classes from "./Register.module.css";

const Register: React.FC<{ switchAuthMode: () => void }> = (props) => {
  const history = useHistory();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const authCtx = useContext(AuthContext);

  const {
    sendRequest: sendRegisterRequest,
    status: registerStatus,
    error: registerError,
  } = useHttp(register);

  const {
    sendRequest: sendLoginRequest,
    data: loginData,
    status: loginStatus,
    error: loginError,
  } = useHttp(login);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();

  useEffect(() => {
    setIsLoading(false);
    if (registerStatus === "completed" && !registerError) {
      toast({
        title: "Account created.",
        description: "Your account has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      const enteredEmail = emailInputRef.current!.value;
      const enteredPassword = passwordInputRef.current!.value;
      setIsLoading(true);
      sendLoginRequest({
        email: enteredEmail,
        password: enteredPassword,
      });
    } else if (registerError) {
      setError({
        title: "Registration failed",
        message: registerError,
        onConfirm: errorHandler,
      });
    }
  }, [registerStatus, registerError, sendLoginRequest, toast]);

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
        message:
          "Could not login to the newly registered account due to: " +
          loginError,
        onConfirm: errorHandler,
      });
    }
  }, [loginStatus, loginData, loginError, authCtx, history]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredName = nameInputRef.current?.value;
    const enteredEmail = emailInputRef.current!.value;
    const enteredPassword = passwordInputRef.current!.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current?.value;

    if (enteredName?.trim().length === 0) {
      setError({
        title: "Registration failed",
        message: "Enter a valid name",
        onConfirm: errorHandler,
      });
      return;
    }

    if (enteredEmail.trim().length === 0) {
      setError({
        title: "Registration failed",
        message: "Enter a valid email",
        onConfirm: errorHandler,
      });
      return;
    }

    if (enteredPassword.trim().length === 0) {
      setError({
        title: "Registration failed",
        message: "Enter a valid password",
        onConfirm: errorHandler,
      });
      return;
    }

    if (enteredPassword !== enteredConfirmPassword) {
      setError({
        title: "Registration failed",
        message: "Password and Confirm Password do not match",
        onConfirm: errorHandler,
      });
      return;
    }

    setIsLoading(true);
    sendRegisterRequest({
      name: enteredName,
      email: enteredEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
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
      <Card className={classes.register}>
        <Heading margin="2">Sign Up</Heading>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="name">
              Name
            </FormLabel>
            <Input type="text" id="name" required ref={nameInputRef} />
          </div>
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
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="confirmPassword">
              Confirm Password
            </FormLabel>
            <Input
              type="password"
              id="confirmPassword"
              required
              ref={confirmPasswordInputRef}
            />
          </div>
          <div className={classes.actions}>
            {!isLoading && <Button type="submit">Create Account</Button>}
            {isLoading && (
              <Button isLoading loadingText="Submitting">
                Create Account
              </Button>
            )}
            <button
              type="button"
              className={classes.toggle}
              onClick={props.switchAuthMode}
            >
              Login with existing account
            </button>
          </div>
        </form>
      </Card>
    </Fragment>
  );
};

export default Register;
