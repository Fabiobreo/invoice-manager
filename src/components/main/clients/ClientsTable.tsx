import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClients } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { AuthContext } from "../../../store/auth-context";
import UITable from "../../ui/UITable";

const ClientsTable = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        width: 110,
        align: "left",
      },
      {
        Header: "Company",
        accessor: "companyDetails.name",
        disableSortBy: true,
        width: 110,
        align: "left",
      },
      {
        Header: "Total billed",
        accessor: "totalBilled",
        disableSortBy: true,
        width: 110,
      },
      {
        Header: "Invoices Count",
        accessor: "invoicesCount",
        width: 140,
      },
    ],
    []
  );

  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const history = useHistory();

  const {
    sendRequest: sendClientRequest,
    status: clientStatus,
    data: clientData,
    error: clientError,
  } = useHttp(getClients);

  useEffect(() => {
    setIsLoading(true);
    sendClientRequest(token);
  }, [sendClientRequest, token]);

  useEffect(() => {
    if (clientStatus === "completed" && !clientError) {
      setIsLoading(false);
      setData(clientData.clients);
    } else if (clientError) {
      setIsLoading(false);
    }
  }, [clientStatus, clientData, clientError]);

  const showAllHandler = () => {
    history.replace('/clients');
  }

  const addNewHandler = () => {
    history.replace('/clients/add');
  }

  return (
    <UITable
      title={"clients"}
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={clientError}
      onShowAll={showAllHandler}
      onAddNew={addNewHandler}
    />
  );
};

export default ClientsTable;
