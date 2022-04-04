import Card from "../../UI/Card";
import InvoicesTable from "./InvoicesTable";

import classes from "./Invoices.module.css";
import { Box } from "@chakra-ui/react";
import { ChakraStylesConfig, Select } from "chakra-react-select";
import { useCallback, useContext, useEffect, useState } from "react";
import { ClientComboBox } from "../../../models/ClientComboBox";
import { Client } from "../../../models/Client";
import useHttp from "../../../hooks/use-http";
import { getClients } from "../../../lib/api";
import { AuthContext } from "../../../store/auth-context";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ErrorModal, { ErrorType } from "../../UI/ErrorModal";
import { useHistory } from "react-router-dom";

const Invoices = () => {
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (prev, { selectProps: { menuIsOpen } }) => ({
      ...prev,
      "> svg": {
        transitionDuration: "normal",
        transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
      },
    }),

    control: (provided) => ({
      ...provided,
      background: "#e3f2fd",
      font: "inherit",
      color: "#1976d2",
      borderRadius: "4px",
      border: "1px solid white",
      width: "100%",
      textAlign: "left",
      padding: "0.25rem",
    }),

    groupHeading: (provided) => ({
      ...provided,
      background: "#64b5f6",
      color: "white",
    }),

    group: (provided) => ({
      ...provided,
      background: "#e3f2fd",
      color: "#1976d2",
    }),
  };

  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const history = useHistory();
  const [clients, setClients] = useState<ClientComboBox[]>();
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();

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
      token: token,
      params: {
        orderBy: "clientName",
        order: "asc",
      },
    });
  }, [sendGetClientsRequest, token]);

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
    setSelectedClient(item.value.client);
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
            chakraStyles={chakraStyles}
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
      />
    </Card>
  );
};

export default Invoices;
