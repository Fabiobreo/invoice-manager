import { Button, FormLabel, Heading, Input } from "@chakra-ui/react";
import { useState, Fragment, useContext, useEffect, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useHttp from "../../hooks/use-http";
import { putCompanyDetails } from "../../lib/api";
import { AuthContext } from "../../store/auth-context";
import Card from "../UI/Card";
import ErrorModal, { ErrorType } from "../UI/ErrorModal";

import classes from "./CompanyDetailsForm.module.css";

type CompanyDetailsInputs = {
  name: string;
  address: string;
  vat: string;
  reg: string;
};

const CompanyDetailsForm = () => {
  const { register, handleSubmit } = useForm<CompanyDetailsInputs>();
  const authCtx = useContext(AuthContext);
  const { setCompanyDetails } = authCtx;

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
      if (
        companyDetailsData &&
        companyDetailsData.user &&
        companyDetailsData.user.companyDetails
      ) {
        setCompanyDetails(companyDetailsData.user.companyDetails);
      }
    } else if (companyDetailsError) {
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

  const submitHandler: SubmitHandler<CompanyDetailsInputs> = (data) => {
    sendCompanyDetailsRequest({
      companyDetails: {
        name: data.name,
        address: data.address,
        vatNumber: data.vat,
        regNumber: data.reg,
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
            <FormLabel fontWeight="bold" htmlFor="address">
              Address
            </FormLabel>
            <Input
              type="text"
              id="address"
              placeholder="Enter address"
              required
              {...register("address")}
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
              {...register("vat")}
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
              {...register("reg")}
            />
          </div>

          <div className={classes.actions}>
            {companyDetailsStatus !== "pending" && (
              <Button type="submit">Submit</Button>
            )}
            {companyDetailsStatus === "pending" && (
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
