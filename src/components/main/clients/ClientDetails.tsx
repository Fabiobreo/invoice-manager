import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClient } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { AuthContext } from "../../../store/auth-context";
import Card from "../../ui/Card";
import ErrorModal, { ErrorType } from "../../ui/ErrorModal";
import LoadingSpinner from "../../ui/LoadingSpinner";
import InvoicesTable from "../invoices/InvoicesTable";
import ClientForm from "./ClientForm";

import classes from "./ClientDetails.module.css";

const ClientDetails = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
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

  const errorHandler = useCallback(() => {
    setError(undefined);
    history.push("/");
  }, [history]);

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
  }, [
    getClientDetailsStatus,
    getClientDetailsData,
    getClientDetailsError,
    history,
    errorHandler,
  ]);

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
      {!isLoading && (
        <ClientForm
          client={client}
          loadAllClients={false}
          isReadOnly={false}
          isEditMode={false}
          showGoBack={true}
        />
      )}
      <Card className={classes.clientDetailsInvoice}>
        <InvoicesTable
          title={"Invoices"}
          disableSortBy={true}
          isAddNewVisible={false}
          isShowAllVisible={false}
          showPagination={false}
          selectedClient={client}
        />
      </Card>
    </Fragment>
  );
};

export default ClientDetails;
