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
import { getClient, getInvoice, putInvoice } from "../../../lib/api";
import { InvoiceInfo } from "../../../models/Invoice";
import Card from "../../UI/Card";
import ErrorModal, { ErrorType } from "../../UI/ErrorModal";
import LoadingSpinner from "../../UI/LoadingSpinner";
import InvoiceForm from "./InvoiceForm";
import classes from "./InvoiceDetails.module.css";
import {
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import ClientForm from "../clients/ClientForm";
import { InvoiceFormType } from "../../../models/InvoiceFormType";

const InvoiceDetails: React.FC<{ className?: string }> = (props) => {
  const history = useHistory();
  const [error, setError] = useState<ErrorType>();
  const toast = useToast();
  const params = useParams<{ invoiceId?: string }>();
  const { invoiceId } = params;

  const state = history.location.state as InvoiceFormType;
  const [editMode, setEditMode] = useState(state ? !state.isReadOnly : false);

  const componentRef = useRef(null);
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

  const {
    sendRequest: sendPutInvoiceRequest,
    status: putInvoiceDetailsStatus,
    error: putInvoiceDetailsError,
  } = useHttp(putInvoice);

  const errorHandler = useCallback(() => {
    setError(undefined);
  }, [history]);

  useEffect(() => {
    if (invoiceId !== undefined) {
      sendGetInvoiceRequest({ id: invoiceId });
    }
  }, [invoiceId, sendGetInvoiceRequest]);

  useEffect(() => {
    if (getInvoiceDetailsData && getInvoiceDetailsData.invoice) {
      sendGetClientRequest({ id: getInvoiceDetailsData.invoice.client_id });
    }
  }, [getInvoiceDetailsData, sendGetClientRequest]);

  useEffect(() => {
    if (getClientDetailsStatus === "completed" && state && state.openAndPrint) {
      handlePrint();
    }
  }, [getClientDetailsData]);

  const submitInvoiceHandler = (invoice: InvoiceInfo) => {
    if (invoice.date > invoice.dueDate) {
      setError({
        title: "Invoice update failed",
        message: "You must set the due date later than the invoice date",
        onConfirm: errorHandler,
      });
      return;
    }

    sendPutInvoiceRequest({
      invoice: {
        ...invoice,
        id: invoiceId,
        client_id: getInvoiceDetailsData.invoice.client_id,
      },
    });
  };

  useEffect(() => {
    if (putInvoiceDetailsStatus === "completed" && !putInvoiceDetailsError) {
      toast({
        title: "Invoice updated.",
        description: "Invoice successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEditMode(false);

      sendGetInvoiceRequest({ id: invoiceId });
    } else if (putInvoiceDetailsError) {
      setError({
        title: "Invoice update failed",
        message: putInvoiceDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [putInvoiceDetailsStatus, putInvoiceDetailsError]);

  const editModeHandler = () => {
    setEditMode((previous) => {
      return !previous;
    });
  };

  return (
    <Fragment>
      {getInvoiceDetailsError && (
        <ErrorModal
          title={"Fetching invoice failed"}
          message={getInvoiceDetailsError}
          onConfirm={() => history.goBack()}
        />
      )}

      {getClientDetailsError && (
        <ErrorModal
          title={"Fetching invoice's client failed"}
          message={getClientDetailsError}
          onConfirm={() => history.goBack()}
        />
      )}

      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={error.onConfirm}
        />
      )}

      {getInvoiceDetailsStatus !== "completed" && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}

      {!getInvoiceDetailsError && getInvoiceDetailsStatus === "completed" && (
        <div ref={componentRef}>
          <Card
            className={`${classes.invoiceForm} ${
              props.className ? props.className : ""
            }`}
          >
            <div className={classes.control}>
              <Flex>
                <Center>
                  <div className="navigation">
                    <IconButton
                      aria-label="Go Back"
                      size="sm"
                      background="#64b5f6"
                      color="white"
                      ml={1}
                      mt={1}
                      onClick={() => history.goBack()}
                    >
                      <ChevronLeftIcon h={6} w={6} />
                    </IconButton>
                  </div>
                </Center>
                <Spacer />
                <Heading size={"2xl"}>Invoice</Heading>
                <Spacer />
              </Flex>
            </div>

            <div className={`${classes.control} navigation`}>
              <Flex ml={1} mr={1}>
                <Center>
                  <Button
                    type="button"
                    h="2.25rem"
                    w="3.75rem"
                    size="md"
                    background="#64b5f6"
                    color="white"
                    onClick={handlePrint}
                    visibility={editMode ? "hidden" : "visible"}
                  >
                    Print
                  </Button>
                </Center>
                <Spacer />
                <Center>
                  <Button
                    type="button"
                    h="2.25rem"
                    w="3.75rem"
                    size="md"
                    background="#64b5f6"
                    color="white"
                    onClick={editModeHandler}
                  >
                    {!editMode ? "Edit" : "Cancel"}
                  </Button>
                </Center>
              </Flex>
            </div>

            <Card className={classes.invoiceDeeperForm}>
              {getClientDetailsStatus === "pending" && (
                <div className="centered">
                  <LoadingSpinner className={classes.spinner} />
                </div>
              )}
              {!getClientDetailsError &&
                getClientDetailsStatus === "completed" && (
                  <ClientForm
                    className={classes.invoiceDeeperForm}
                    client={getClientDetailsData.client}
                    isReadOnly={true}
                    isLoading={false}
                  />
                )}
            </Card>

            <InvoiceForm
              invoice={getInvoiceDetailsData.invoice}
              isReadOnly={!editMode}
              isLoading={false}
              onSubmitInvoice={submitInvoiceHandler}
            />
          </Card>
        </div>
      )}
    </Fragment>
  );
};

export default InvoiceDetails;
