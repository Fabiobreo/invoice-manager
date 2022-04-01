import { ChevronDownIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { TotalInvoice } from "../../../models/Invoice";
import { useHistory } from "react-router-dom";
import { InvoiceFormType } from "../../../models/InvoiceFormType";

const InvoicesHeader = (disableSort: boolean) => {
  const history = useHistory();

  return [
    {
      id: "invoiceNumber",
      Header: "Number",
      accessor: "invoice.invoice_number",
      Cell: ({ value }: any) => <b>{value}</b>,
      width: 100,
      align: "left",
      disableSortBy: true,
    },
    {
      id: "date",
      Header: "Date (MM-dd-yyyy)",
      accessor: (row: TotalInvoice) => {
        var date = new Date(row.invoice.date);
        return format(date, "MM-dd-yyyy");
      },
      width: 160,
      disableSortBy: false || disableSort,
    },
    {
      id: "clientName",
      Header: "Client Name",
      accessor: "client.name",
      width: 130,
      align: "left",
      disableSortBy: true,
    },
    {
      id: "companyName",
      Header: "Client Company",
      accessor: "client.companyDetails.name",
      Cell: ({ value }: any) => <b>{value}</b>,
      width: 150,
      align: "left",
      disableSortBy: false || disableSort,
    },
    {
      id: "price",
      Header: "Invoice value",
      accessor: (row: TotalInvoice) => {
        return `$${row.invoice.value}`;
      },
      Cell: ({ value }: any) => <b>{value}</b>,
      width: 130,
      disableSortBy: false || disableSort,
    },
    {
      id: "more",
      Header: "",
      accessor: (row: TotalInvoice) => {
        return (
          <Menu>
            <MenuButton
              as={Button}
              w={40}
              h="1.75rem"
              rightIcon={<ChevronDownIcon />}
            >
              More
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  history.push({
                    pathname: `/invoices/${row.invoice.id}`,
                    state: {
                      client: row.client,
                      loadAllClients: false,
                      isEditMode: true,
                    } as InvoiceFormType,
                  });
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  history.push({
                    pathname: `/invoices/${row.invoice.id}`,
                    state: {
                      client: row.client,
                      loadAllClients: false,
                      isEditMode: false,
                      openAndPrint: true,
                    } as InvoiceFormType,
                  });
                }}
              >
                Print
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
      disableSortBy: true,
      width: 110,
    },
  ];
};

export default InvoicesHeader;
