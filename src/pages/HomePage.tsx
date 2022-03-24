import { Fragment, useContext, useEffect, useState } from "react";
import CompanyDetailsForm from "../components/Auth/CompanyDetailsForm";
import ErrorModal, { ErrorType } from "../components/UI/ErrorModal";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import useHttp from "../hooks/use-http";
import { getCompanyDetails } from "../lib/api";
import { AuthContext } from "../store/auth-context";

const HomePage = () => {
  const authCtx = useContext(AuthContext);
  const { setCompanyDetails } = authCtx;
  const isLoggedIn = authCtx.isLoggedIn;
  const needCompanyDetails =
    authCtx.isLoggedIn && authCtx.current_user?.companyDetails == null;

  const currentUser = authCtx.current_user;

  const {
    sendRequest: sendCompanyDetailsRequest,
    data: companyDetailsData,
    status: companyDetailsStatus,
    error: companyDetailsError,
  } = useHttp(getCompanyDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();

  const errorHandler = () => {
    setError(undefined);
  };

  useEffect(() => {
    if (companyDetailsStatus === "completed" && !companyDetailsError) {
      setIsLoading(false);
      if (companyDetailsData && companyDetailsData.companyDetails) {
        setCompanyDetails(companyDetailsData.companyDetails);
      }
    } else if (companyDetailsError) {
      setIsLoading(false);
      setError({
        title: "Failed to fetch company details",
        message: companyDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    companyDetailsStatus,
    companyDetailsData,
    companyDetailsError,
    setCompanyDetails,
  ]);

  useEffect(() => {
    if (
      currentUser &&
      currentUser.companyDetails === null &&
      currentUser.token !== ""
    ) {
      setIsLoading(true);
      sendCompanyDetailsRequest(currentUser.token);
    }
  }, [currentUser, sendCompanyDetailsRequest]);

  return (
    <Fragment>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      {!isLoggedIn && <div className="centered">WELCOME</div>}
      {isLoggedIn && isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && needCompanyDetails && <CompanyDetailsForm />}
      {isLoggedIn && !needCompanyDetails && <div className="centered">THE REAL DEAL</div>}
    </Fragment>
  );
};

export default HomePage;
