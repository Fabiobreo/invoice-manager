import React, { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getClients } from "../../../lib/api";
import { Client } from "../../../models/Client";
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

  const [currentPage, setCurrentPage] = useState(
    props.currentPage ? props.currentPage : 1
  );
  const itemsPerPage = 10;
  const history = useHistory();

  const {
    sendRequest: sendClientRequest,
    status: clientStatus,
    data: clientData,
    error: clientError,
  } = useHttp(getClients);

  useEffect(() => {
    sendClientRequest({
      params: {
        orderBy: props.sortBy ? props.sortBy : "",
        order: props.sort ? props.sort : "",
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
    });
  }, [currentPage, props.sort, props.sortBy]);

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
      data={clientData !== null ? clientData.clients : []}
      isLoading={clientStatus !== "completed" || clientError !== null}
      error={clientError}
      isShowAllVisible={props.isShowAllVisible}
      onShowAll={showAllHandler}
      isAddNewVisible={props.isAddNewVisible}
      onAddNew={addNewHandler}
      onRowClick={rowClickHandler}
      totalPages={
        clientData !== null ? Math.ceil(clientData.total / itemsPerPage) : 0
      }
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
