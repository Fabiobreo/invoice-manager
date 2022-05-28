import {
  Button,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useHttp from "../../hooks/use-http";
import { loginUser } from "../../lib/api";
import { AuthContext } from "../../store/auth-context";
import Card from "../UI/Card";
import ErrorModal, { ErrorType } from "../UI/ErrorModal";

import classes from "./Login.module.css";

type LoginInputs = {
  email: string;
  password: string;
};

const Login: React.FC<{ switchAuthMode: () => void }> = (props) => {
  const { register, handleSubmit } = useForm<LoginInputs>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const [showPassword, setShowPassword] = useState(false);
  const authCtx = useContext(AuthContext);

  const {
    sendRequest: sendLoginRequest,
    data: loginData,
    status: loginStatus,
    error: loginError,
  } = useHttp(loginUser);

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
  }, [loginStatus, loginData, loginError, authCtx]);

  const submitHandler: SubmitHandler<LoginInputs> = (data) => {
    setIsLoading(true);
    sendLoginRequest({
      email: data.email,
      password: data.password,
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
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="email">
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter email"
              required
              {...register("email")}
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
                {...register("password")}
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
