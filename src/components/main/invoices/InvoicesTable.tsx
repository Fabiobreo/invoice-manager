import { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { getInvoices } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { Invoice, TotalInvoice } from "../../../models/Invoice";
import { AuthContext } from "../../../store/auth-context";
import UITable, { FilterType } from "../../UI/UITable";
import InvoicesHeader from "./InvoicesHeader";

type InvoicesTableType = {
  title: string;
  disableSortBy: boolean;
  showPagination: boolean;
  isShowAllVisible: boolean;
  isAddNewVisible: boolean;
  selectedClient?: Client;
  currentPage?: number;
  sort?: string;
  sortBy?: string;
  linkHandler?: (page: number, sortBy: string, sort: string) => void;
};

const InvoicesTable: React.FC<InvoicesTableType> = (props) => {
  const columns = InvoicesHeader(props.disableSortBy);

  const [data, setData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(
    props.currentPage ? props.currentPage : 1
  );
  const itemsPerPage = 10;
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const selectedClientId = props.selectedClient ? props.selectedClient.id : "";
  const history = useHistory();

  const {
    sendRequest: sendInvoiceRequest,
    status: invoiceStatus,
    data: invoiceData,
    error: invoiceError,
  } = useHttp(getInvoices);

  useEffect(() => {
    if (props.selectedClient) setCurrentPage(1);
  }, [props.selectedClient]);

  useEffect(() => {
    setIsLoading(true);
    sendInvoiceRequest({
      token: token,
      params: {
        filter: selectedClientId,
        orderBy: props.sortBy ? props.sortBy : "",
        order: props.sort ? props.sort : "",
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      },
    });
  }, [
    sendInvoiceRequest,
    token,
    currentPage,
    props.sort,
    props.sortBy,
    selectedClientId,
  ]);

  useEffect(() => {
    if (invoiceStatus === "completed" && !invoiceError) {
      setIsLoading(false);
      setData(invoiceData.invoices);
      setTotalPages(Math.ceil(invoiceData.total / itemsPerPage));
    } else if (invoiceError) {
      setIsLoading(false);
    }
  }, [invoiceStatus, invoiceData, invoiceError]);

  const showAllHandler = useCallback(() => {
    history.push("/invoices");
  }, [history]);

  const addNewHandler = useCallback(() => {
    history.push("/invoices/add");
  }, [history]);

  const rowClickHandler = useCallback(
    (row: TotalInvoice) => {
      history.push(`/invoices/${row.invoice.id}`);
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
      id={"InvoicesTable"}
      title={props.title}
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={invoiceError}
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

export default InvoicesTable;
