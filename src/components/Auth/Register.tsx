import {
  Button,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useHttp from "../../hooks/use-http";
import { loginUser, registerUser } from "../../lib/api";
import { AuthContext } from "../../store/auth-context";
import Card from "../UI/Card";
import ErrorModal, { ErrorType } from "../UI/ErrorModal";

import classes from "./Register.module.css";

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC<{ switchAuthMode: () => void }> = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const authCtx = useContext(AuthContext);

  const {
    sendRequest: sendRegisterRequest,
    status: registerStatus,
    error: registerError,
  } = useHttp(registerUser);

  const {
    sendRequest: sendLoginRequest,
    data: loginData,
    status: loginStatus,
    error: loginError,
  } = useHttp(loginUser);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();

  const errorHandler = useCallback(() => {
    setError(undefined);
  }, []);

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const showConfirmPasswordHandler = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
      setIsLoading(true);
      sendLoginRequest({
        email: watch("email"),
        password: watch("password"),
      });
    } else if (registerError) {
      setError({
        title: "Registration failed",
        message: registerError,
        onConfirm: errorHandler,
      });
    }
  }, [registerStatus, registerError, sendLoginRequest, toast, errorHandler]);

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
        message: `Could not login to the newly registered account due to: ${loginError}`,
        onConfirm: errorHandler,
      });
    }
  }, [loginStatus, loginData, loginError, authCtx, errorHandler]);

  const submitHandler: SubmitHandler<RegisterInputs> = (data) => {
    setIsLoading(true);
    sendRegisterRequest({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
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
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="name">
              Name
            </FormLabel>
            <Input
              type="text"
              id="name"
              placeholder="Enter name"
              required
              {...register("name")}
            />
          </div>
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
                placeholder="Enter password"
                required
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
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="confirmPassword">
              Confirm Password
            </FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Enter confirm password"
                required
                {...register("confirmPassword", {
                  validate: () =>
                    getValues("password") == getValues("confirmPassword"),
                })}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  background="#64b5f6"
                  color="white"
                  onClick={showConfirmPasswordHandler}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
          {errors.confirmPassword && (
            <span id="confirmPasswordMismatch">Password and confirm password do not match</span>
          )}
          <div className={classes.actions}>
            {!isLoading && (
              <Button type="submit" id="registerButton">
                Create Account
              </Button>
            )}
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
