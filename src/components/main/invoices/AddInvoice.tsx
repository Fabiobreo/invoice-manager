import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Center,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClient, getClients, postInvoice } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { InvoiceInfo } from "../../../models/Invoice";
import Card from "../../UI/Card";
import ErrorModal, { ErrorType } from "../../UI/ErrorModal";
import ClientForm from "../clients/ClientForm";
import SelectClient from "../clients/SelectClient";
import InvoiceForm from "./InvoiceForm";
import classes from "./InvoiceForm.module.css";

const AddInvoice: React.FC<{ className?: string }> = (props) => {
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [error, setError] = useState<ErrorType>();
  const params = useParams<{ clientId?: string }>();
  const { clientId } = params;

  const history = useHistory();
  const toast = useToast();

  const {
    sendRequest: sendGetClientsRequest,
    data: getClientsDetailsData,
    status: getClientsDetailsStatus,
    error: getClientsDetailsError,
  } = useHttp(getClients);

  const {
    sendRequest: sendGetClientRequest,
    data: getClientDetailsData,
    error: getClientDetailsError,
  } = useHttp(getClient);

  const {
    sendRequest: sendPostInvoiceRequest,
    data: postInvoiceDetailsData,
    status: postInvoiceDetailsStatus,
    error: postInvoiceDetailsError,
  } = useHttp(postInvoice);

  useEffect(() => {
    if (postInvoiceDetailsStatus === "completed" && !postInvoiceDetailsError) {
      if (
        postInvoiceDetailsData &&
        postInvoiceDetailsData.invoice &&
        postInvoiceDetailsData.invoice.id
      ) {
        toast({
          title: "Invoice created.",
          description: "A new invoice has been successfully created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        history.push(`/invoices/${postInvoiceDetailsData.invoice.id}`);
      }
    } else if (postInvoiceDetailsError) {
      setError({
        title: "Invoice registration failed",
        message: postInvoiceDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    postInvoiceDetailsStatus,
    postInvoiceDetailsData,
    postInvoiceDetailsError,
  ]);

  useEffect(() => {
    if (clientId) {
      sendGetClientRequest({ id: clientId });
    } else {
      sendGetClientsRequest({
        params: {
          orderBy: "clientName",
          order: "asc",
        },
      });
    }
  }, [sendGetClientsRequest]);

  const errorHandler = useCallback(() => {
    setError(undefined);
  }, []);

  const selectClientChanged = (client: Client) => {
    setSelectedClient(client);
  };

  const submitInvoiceHandler = (invoice: InvoiceInfo) => {
    if (selectedClient == undefined && !clientId) {
      setError({
        title: "Invoice registration failed",
        message: "Select a client for this invoice",
        onConfirm: errorHandler,
      });
      return;
    }

    if (invoice.date > invoice.dueDate) {
      setError({
        title: "Invoice registration failed",
        message: "You must set the due date later than the invoice date",
        onConfirm: errorHandler,
      });
      return;
    }

    const client_id = clientId ? clientId : selectedClient?.id;

    sendPostInvoiceRequest({ invoice: { ...invoice, client_id: client_id } });
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
      {getClientsDetailsError !== null && (
        <ErrorModal
          title={"Error while retrieving clients"}
          message={getClientsDetailsError}
          onConfirm={() => history.goBack()}
        />
      )}
      {getClientDetailsError !== null && (
        <ErrorModal
          title={"Error while retrieving client"}
          message={getClientDetailsError}
          onConfirm={() => history.goBack()}
        />
      )}

      <Card
        className={`${classes.invoiceForm} ${
          props.className ? props.className : ""
        }`}
      >
        <div className={classes.control}>
          <Flex>
            <Center>
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
            </Center>
            <Spacer />
            <Heading>Add new invoice</Heading>
            <Spacer />
          </Flex>
        </div>

        <Card className={classes.invoiceDeeperForm}>
          {clientId && getClientDetailsData && (
            <ClientForm
              className={classes.invoiceDeeperForm}
              client={getClientDetailsData.client}
              isReadOnly={true}
              isLoading={false}
            />
          )}
          {!clientId && (
            <SelectClient
              isLoading={
                getClientsDetailsStatus === "pending" ||
                getClientsDetailsData === null
              }
              data={getClientsDetailsData}
              onSelectClientChanged={selectClientChanged}
            />
          )}
        </Card>

        <InvoiceForm
          isReadOnly={false}
          isLoading={postInvoiceDetailsStatus === "pending"}
          onSubmitInvoice={submitInvoiceHandler}
        />
      </Card>
    </Fragment>
  );
};

export default AddInvoice;
