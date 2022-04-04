import React, { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClients } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { AuthContext } from "../../../store/auth-context";
import UITable from "../../UI/UITable";
import ClientHeader from "./ClientHeader";

const ClientsTable: React.FC<{
  title: string;
  disableSortBy: boolean;
  showPagination: boolean;
  isShowAllVisible: boolean;
  isAddNewVisible: boolean;
}> = (props) => {
  const columns = ClientHeader(props.disableSortBy);

  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("");
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
    sendClientRequest({
      token: token,
      params: {
        orderBy: orderBy,
        order: order,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
    });
  }, [sendClientRequest, token, currentPage, order, orderBy]);

  useEffect(() => {
    if (clientStatus === "completed" && !clientError) {
      setIsLoading(false);
      setData(clientData.clients);
      setTotalPages(Math.ceil(clientData.total / itemsPerPage));
    } else if (clientError) {
      setIsLoading(false);
    }
  }, [clientStatus, clientData, clientError]);

  const showAllHandler = useCallback(() => {
    history.push("/clients");
  }, [history]);

  const addNewHandler = useCallback(() => {
    history.push("/clients/add");
  }, [history]);

  const rowClickHandler = useCallback(
    (row: Client) => {
      history.push(`/clients/${row.id}`);
    },
    [history]
  );

  const changePageHandler = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const sortHandler = useCallback((sort: { sortBy: string; sort: string }) => {
    setOrderBy(sort.sortBy);
    setOrder(sort.sort);
  }, []);

  return (
    <UITable
      id={"ClientsTable"}
      title={props.title}
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={clientError}
      isShowAllVisible={props.isShowAllVisible}
      onShowAll={showAllHandler}
      isAddNewVisible={props.isAddNewVisible}
      onAddNew={addNewHandler}
      onRowClick={rowClickHandler}
      totalPages={totalPages}
      currentPage={currentPage}
      showPagination={props.showPagination}
      onChangePage={changePageHandler}
      onSort={sortHandler}
    />
  );
};

export default ClientsTable;
