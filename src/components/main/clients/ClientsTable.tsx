import React, { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClients } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { AuthContext } from "../../../store/auth-context";
import UITable, { FilterType } from "../../UI/UITable";
import ClientHeader from "./ClientHeader";

type ClientsTableType = {
  title: string;
  disableSortBy: boolean;
  showPagination: boolean;
  isShowAllVisible: boolean;
  isAddNewVisible: boolean;
  currentPage?: number;
  sort?: string;
  sortBy?: string;
  linkHandler?: (page: number, sortBy: string, sort: string) => void;
};

const ClientsTable: React.FC<ClientsTableType> = (props) => {
  const columns = ClientHeader(props.disableSortBy);

  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    props.currentPage ? props.currentPage : 1
  );
  const itemsPerPage = 10;
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
        orderBy: props.sortBy ? props.sortBy : "",
        order: props.sort ? props.sort : "",
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
    });
  }, [sendClientRequest, token, currentPage, props.sort, props.sortBy]);

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

  const changePageHandler = useCallback((args: FilterType) => {
    setCurrentPage(args.page);
    if (props.linkHandler) {
      props.linkHandler(args.page, args.sortBy, args.sort);
    }
  }, []);

  const sortHandler = useCallback((args: FilterType) => {
    if (props.linkHandler) {
      props.linkHandler(args.page, args.sortBy, args.sort);
    }
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
      sort={props.sort ? props.sort : ""}
      sortBy={props.sortBy ? props.sortBy : ""}
    />
  );
};

export default ClientsTable;
