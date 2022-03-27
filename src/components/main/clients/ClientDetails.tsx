import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClient } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { AuthContext } from "../../../store/auth-context";
import ErrorModal, { ErrorType } from "../../ui/ErrorModal";
import LoadingSpinner from "../../ui/LoadingSpinner";
import ClientForm from "./ClientForm";

const ClientDetails = () => {
  const authCtx = useContext(AuthContext);
  const params = useParams();
  const { clientId }: any = params;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const [client, setClient] = useState<Client>();

  const {
    sendRequest: sendGetClientRequest,
    data: getClientDetailsData,
    status: getClientDetailsStatus,
    error: getClientDetailsError,
  } = useHttp(getClient);

  const errorHandler = () => {
    setError(undefined);
  };

  useEffect(() => {
    if (getClientDetailsStatus === "completed" && !getClientDetailsError) {
      setIsLoading(false);
      setClient(getClientDetailsData.client);
    } else if (getClientDetailsError) {
      setIsLoading(false);
      setError({
        title: "Fetching client failed",
        message: getClientDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [getClientDetailsStatus, getClientDetailsData, getClientDetailsError]);

  useEffect(() => {
    setIsLoading(true);
    sendGetClientRequest({
      token: authCtx.current_user!.token,
      id: clientId,
    });
  }, [authCtx.current_user, clientId, sendGetClientRequest]);

  return (
    <Fragment>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      {isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && <ClientForm client={client}/>}
    </Fragment>
  );
};

export default ClientDetails;
