import { Button, FormLabel, Heading, Input } from "@chakra-ui/react";
import {
  useState,
  Fragment,
  useRef,
  useContext,
  useEffect,
  useCallback,
} from "react";
import useHttp from "../../hooks/use-http";
import { putCompanyDetails } from "../../lib/api";
import { AuthContext } from "../../store/auth-context";
import Card from "../ui/Card";
import ErrorModal, { ErrorType } from "../ui/ErrorModal";

import classes from "./CompanyDetailsForm.module.css";

const CompanyDetailsForm = () => {
  const authCtx = useContext(AuthContext);
  const { setCompanyDetails } = authCtx;

  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const vatInputRef = useRef<HTMLInputElement>(null);
  const regInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();

  const {
    sendRequest: sendCompanyDetailsRequest,
    data: companyDetailsData,
    status: companyDetailsStatus,
    error: companyDetailsError,
  } = useHttp(putCompanyDetails);

  const errorHandler = useCallback(() => {
    setError(undefined);
  }, []);

  useEffect(() => {
    if (companyDetailsStatus === "completed" && !companyDetailsError) {
      setIsLoading(false);
      if (
        companyDetailsData &&
        companyDetailsData.user &&
        companyDetailsData.user.companyDetails
      ) {
        setCompanyDetails(companyDetailsData.user.companyDetails);
      }
    } else if (companyDetailsError) {
      setIsLoading(false);
      setError({
        title: "Company registration failed",
        message: companyDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    companyDetailsStatus,
    companyDetailsData,
    companyDetailsError,
    setCompanyDetails,
    errorHandler,
  ]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredName = nameInputRef.current!.value;
    const enteredAddress = addressInputRef.current!.value;
    const enteredVat = vatInputRef.current!.value;
    const enteredReg = regInputRef.current!.value;

    if (enteredName?.trim().length === 0) {
      setError({
        title: "Company registration failed",
        message: "Enter a valid name.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (enteredAddress?.trim().length === 0) {
      setError({
        title: "Company registration failed",
        message: "Enter a valid address.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (enteredVat?.trim().length === 0) {
      setError({
        title: "Company registration failed",
        message: "Enter a valid TAX/VAT number.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (enteredReg?.trim().length === 0) {
      setError({
        title: "Company registration failed",
        message: "Enter a valid registration number.",
        onConfirm: errorHandler,
      });
      return;
    }

    setIsLoading(true);
    sendCompanyDetailsRequest({
      token: authCtx.current_user!.token,
      companyDetails: {
        name: enteredName,
        address: enteredAddress,
        vatNumber: enteredVat,
        regNumber: enteredReg,
      },
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
      <Card className={classes.companyDetails}>
        <Heading margin="2">Company details</Heading>
        <Heading size="1x4" margin="3">
          Please fill in the form below before continue
        </Heading>
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="name">
              Name
            </FormLabel>
            <Input
              type="text"
              id="name"
              placeholder="Enter name"
              required
              ref={nameInputRef}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="address">
              Address
            </FormLabel>
            <Input
              type="text"
              id="address"
              placeholder="Enter address"
              required
              ref={addressInputRef}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="vatNumber">
              Tax/VAT number
            </FormLabel>
            <Input
              type="text"
              id="vatNumber"
              placeholder="Enter tax/vat number"
              required
              ref={vatInputRef}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="regNumber">
              Registration number
            </FormLabel>
            <Input
              type="text"
              id="regNumber"
              placeholder="Enter registration number"
              required
              ref={regInputRef}
            />
          </div>

          <div className={classes.actions}>
            {!isLoading && <Button type="submit">Submit</Button>}
            {isLoading && (
              <Button isLoading loadingText="Submitting">
                Submitting
              </Button>
            )}
          </div>
        </form>
      </Card>
    </Fragment>
  );
};

export default CompanyDetailsForm;
