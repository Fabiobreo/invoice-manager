import { Fragment, useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClient, putClient } from "../../../lib/api";
import { ClientInfo } from "../../../models/Client";
import Card from "../../UI/Card";
import ErrorModal, { ErrorType } from "../../UI/ErrorModal";
import LoadingSpinner from "../../UI/LoadingSpinner";
import InvoicesTable from "../invoices/InvoicesTable";
import ClientForm from "./ClientForm";

import classes from "./ClientDetails.module.css";
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
import { ClientFormType } from "../../../models/ClientFormType";

const ClientDetails: React.FC<{ className?: string }> = (props) => {
  const history = useHistory();
  const [error, setError] = useState<ErrorType>();
  const toast = useToast();
  const params = useParams<{ clientId?: string }>();
  const { clientId } = params;

  const state = history.location.state as ClientFormType;
  const [editMode, setEditMode] = useState(state ? !state.isReadOnly : false);

  const {
    sendRequest: sendGetClientRequest,
    data: getClientDetailsData,
    status: getClientDetailsStatus,
    error: getClientDetailsError,
  } = useHttp(getClient);

  const {
    sendRequest: sendPutClientRequest,
    status: putClientDetailsStatus,
    error: putClientDetailsError,
  } = useHttp(putClient);

  const submitClientHandler = (clientInfo: ClientInfo) => {
    sendPutClientRequest({
      client: { ...clientInfo, id: clientId },
    });
  };

  const errorHandler = useCallback(() => {
    setError(undefined);
    history.push("/");
  }, [history]);

  useEffect(() => {
    if (getClientDetailsError) {
      setError({
        title: "Fetching client failed",
        message: getClientDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [getClientDetailsError]);

  useEffect(() => {
    if (clientId !== undefined) {
      sendGetClientRequest({
        id: clientId,
      });
    }
  }, [clientId]);

  useEffect(() => {
    if (putClientDetailsStatus === "completed" && !putClientDetailsError) {
      toast({
        title: "Client updated.",
        description: "Client successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEditMode(false);

      sendGetClientRequest({
        id: clientId,
      });
    } else if (putClientDetailsError) {
      setError({
        title: "Client update failed",
        message: putClientDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [putClientDetailsStatus, putClientDetailsError]);

  const addInvoiceHandler = () => {
    history.push({
      pathname: `/invoices/add/${clientId}`,
    });
  };

  const editModeHandler = () => {
    setEditMode((previous) => {
      return !previous;
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

      {getClientDetailsStatus !== "completed" && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}

      {!getClientDetailsError && getClientDetailsStatus === "completed" && (
        <Card
          className={`${classes.clientForm} ${
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
              <Heading>Client</Heading>
              <Spacer />
            </Flex>
          </div>

          <div className={classes.control}>
            <Flex ml={1} mr={1} mt={2} mb={2}>
              <Center>
                <Button
                  type="button"
                  h="2.25rem"
                  w="7rem"
                  size="md"
                  background="#64b5f6"
                  color="white"
                  onClick={addInvoiceHandler}
                >
                  Add Invoice
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

          <ClientForm
            client={getClientDetailsData.client}
            isReadOnly={!editMode}
            isLoading={putClientDetailsStatus === "pending"}
            onSubmitClient={submitClientHandler}
          />
        </Card>
      )}

      {!getClientDetailsError && getClientDetailsStatus === "completed" && (
        <Card className={classes.clientDetailsInvoice}>
          <InvoicesTable
            title={"Invoices"}
            disableSortBy={true}
            isAddNewVisible={false}
            isShowAllVisible={false}
            showPagination={false}
            selectedClient={getClientDetailsData.client}
          />
        </Card>
      )}
    </Fragment>
  );
};

export default ClientDetails;
