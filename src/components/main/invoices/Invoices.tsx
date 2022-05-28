import Card from "../../UI/Card";
import InvoicesTable from "./InvoicesTable";

import classes from "./Invoices.module.css";
import { Box } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useCallback, useEffect, useState } from "react";
import { ClientComboBox, ClientItem } from "../../../models/ClientComboBox";
import { Client } from "../../../models/Client";
import useHttp from "../../../hooks/use-http";
import { getClients } from "../../../lib/api";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorModal, { ErrorType } from "../../UI/ErrorModal";
import useRouter from "../../../hooks/useRuoter";
import { ClientChakraStyles } from "../../../models/ClientChakraStyles";

const Invoices = () => {
  const router = useRouter();
  const { pathname, history } = router;
  const [clients, setClients] = useState<ClientComboBox[]>();
  const [selectedVisibleClient, setSelectedVisibleClient] =
    useState<ClientItem>();
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();

  const currentPage = router.query.page ? +router.query.page : 1;
  const sort = router.query.sort ? router.query.sort : "";
  const sortBy = router.query.sortBy ? router.query.sortBy : "";
  var clientId = router.query.clientId ? router.query.clientId : "";

  const errorHandler = useCallback(() => {
    setError(undefined);
    history.replace("/");
  }, [history]);

  const {
    sendRequest: sendGetClientsRequest,
    data: getClientsDetailsData,
    status: getClientsDetailsStatus,
    error: getClientsDetailsError,
  } = useHttp(getClients);

  useEffect(() => {
    setIsClientsLoading(true);
    sendGetClientsRequest({
      params: {
        orderBy: "clientName",
        order: "asc",
      },
    });
  }, [sendGetClientsRequest]);

  useEffect(() => {
    if (getClientsDetailsStatus === "completed" && !getClientsDetailsError) {
      setIsClientsLoading(false);
      setClients([
        {
          label: "Clients",
          options: getClientsDetailsData.clients.map((client: Client) => {
            return {
              value: { client: client },
              label: client.name + " | " + client.companyDetails.name,
            };
          }),
        },
      ]);

      if (clientId !== "") {
        const currentClient = getClientsDetailsData.clients.find(
          (client: Client) => client.id == clientId
        ) as Client | undefined;
        if (currentClient !== undefined) {
          setSelectedVisibleClient({
            value: { client: currentClient },
            label:
              currentClient.name + " | " + currentClient.companyDetails.name,
          });
          setSelectedClient(currentClient);
        }
      }
    } else if (getClientsDetailsError) {
      setIsClientsLoading(false);
      setError({
        title: "Fetching clients failed",
        message: getClientsDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    getClientsDetailsStatus,
    getClientsDetailsData,
    getClientsDetailsError,
    errorHandler,
  ]);

  const selectHandler = (item: any) => {
    const selected = item.value.client as Client;
    clientId = selected.id;
    setSelectedClient(selected);
    setSelectedVisibleClient({
      value: { client: selected },
      label: selected.name + " | " + selected.companyDetails.name,
    });
    linkHandler(1, sortBy, sort);
  };

  const linkHandler = (page: number, sortBy: string, sort: string) => {
    let searchString = "";
    if (clientId !== "") {
      searchString += `clientId=${clientId}`;
    }

    if (page > 1) {
      if (searchString.length > 0) searchString += "&";
      searchString += `page=${page}`;
    }
    if (sort !== "" && sortBy !== "") {
      if (searchString.length > 0) searchString += "&";
      searchString += `sortBy=${sortBy}&sort=${sort}`;
    }

    if (searchString.length > 0) {
      searchString = "?" + searchString;
      history.replace({
        pathname: pathname,
        search: searchString,
      });
    } else {
      history.push({
        pathname: pathname,
      });
    }
  };

  return (
    <Card className={classes.invoices}>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}

      {isClientsLoading && <LoadingSpinner />}

      {!isClientsLoading && (
        <Box m={2}>
          <Select
            id="selectClient"
            name="clientsList"
            classNamePrefix="chakra-react-select"
            options={clients}
            placeholder="Filter by client or company name..."
            closeMenuOnSelect={true}
            chakraStyles={ClientChakraStyles}
            value={selectedVisibleClient}
            onChange={selectHandler}
          />
        </Box>
      )}

      <InvoicesTable
        title={"Invoices"}
        disableSortBy={false}
        showPagination={true}
        isShowAllVisible={false}
        isAddNewVisible={true}
        selectedClient={selectedClient}
        currentPage={currentPage}
        sort={sort}
        sortBy={sortBy}
        linkHandler={linkHandler}
      />
    </Card>
  );
};

export default Invoices;
