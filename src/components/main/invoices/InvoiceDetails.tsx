import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import useHttp from "../../../hooks/use-http";
import { getClient, getInvoice } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { Invoice } from "../../../models/Invoice";
import { AuthContext } from "../../../store/auth-context";
import ErrorModal, { ErrorType } from "../../ui/ErrorModal";
import LoadingSpinner from "../../ui/LoadingSpinner";
import InvoiceForm from "./InvoiceForm";

const InvoiceDetails = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const params = useParams();
  const { invoiceId }: any = params;
  const componentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const [invoice, setInvoice] = useState<Invoice>();
  const [client, setClient] = useState<Client>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const {
    sendRequest: sendGetInvoiceRequest,
    data: getInvoiceDetailsData,
    status: getInvoiceDetailsStatus,
    error: getInvoiceDetailsError,
  } = useHttp(getInvoice);

  const {
    sendRequest: sendGetClientRequest,
    data: getClientDetailsData,
    status: getClientDetailsStatus,
    error: getClientDetailsError,
  } = useHttp(getClient);

  const errorHandler = useCallback(() => {
    setError(undefined);
    history.replace("/");
  }, [history]);

  useEffect(() => {
    if (getInvoiceDetailsStatus === "completed" && !getInvoiceDetailsError) {
      setIsLoading(false);
      setInvoice(getInvoiceDetailsData.invoice);
    } else if (getInvoiceDetailsError) {
      setIsLoading(false);
      setError({
        title: "Fetching invoice failed",
        message: getInvoiceDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    getInvoiceDetailsStatus,
    getInvoiceDetailsData,
    getInvoiceDetailsError,
    errorHandler,
  ]);

  useEffect(() => {
    setIsLoading(true);
    sendGetInvoiceRequest({
      token: authCtx.current_user!.token,
      id: invoiceId,
    });
  }, [authCtx.current_user, invoiceId, sendGetInvoiceRequest]);

  useEffect(() => {
    if (invoice) {
      setIsLoading(true);
      sendGetClientRequest({
        token: authCtx.current_user!.token,
        id: invoice.client_id,
      });
    }
  }, [authCtx.current_user, invoice, sendGetClientRequest]);

  useEffect(() => {
    if (getClientDetailsStatus === "completed" && !getClientDetailsError) {
      setIsLoading(false);
      setClient(getClientDetailsData.client);
    } else if (getClientDetailsError) {
      setIsLoading(false);
      setError({
        title: "Fetching invoice's client failed",
        message: getClientDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    getClientDetailsStatus,
    getClientDetailsData,
    getClientDetailsError,
    errorHandler,
  ]);

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
        <div ref={componentRef}>
          <InvoiceForm
            loadAllClients={false}
            invoice={invoice}
            client={client}
            print={handlePrint}
            isEditMode={false}
            openAndPrint={false}
          />
        </div>
      )}
    </Fragment>
  );
};

export default InvoiceDetails;
