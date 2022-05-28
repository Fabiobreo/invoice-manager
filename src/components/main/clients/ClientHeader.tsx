import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { Client } from "../../../models/Client";
import { ClientFormType } from "../../../models/ClientFormType";
import { InvoiceFormType } from "../../../models/InvoiceFormType";

const ClientHeader = (disableSort: boolean) => {
  const history = useHistory();

  return [
    {
      id: "clientName",
      Header: "Name",
      accessor: "name",
      width: 110,
      align: "left",
      disableSortBy: false || disableSort,
    },
    {
      id: "companyName",
      Header: "Company",
      accessor: "companyDetails.name",
      Cell: ({ value }: any) => <b>{value}</b>,
      width: 140,
      align: "left",
      disableSortBy: false || disableSort,
    },
    {
      id: "email",
      Header: "Email",
      accessor: "email",
      disableSortBy: true,
      width: 180,
      align: "left",
    },
    {
      id: "totalBilled",
      Header: "Total billed",
      accessor: (row: Client) => {
        return `$${row.totalBilled}`;
      },
      Cell: ({ value }: any) => <b>{value}</b>,
      width: 130,
      disableSortBy: false || disableSort,
    },
    {
      id: "invoicesCount",
      Header: "Invoices Count",
      accessor: "invoicesCount",
      width: 150,
      disableSortBy: false || disableSort,
    },
    {
      id: "more",
      Header: "",
      accessor: (row: Client) => {
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
                    pathname: `/clients/${row.id}`,
                    state: {
                      isReadOnly: false
                    } as ClientFormType,
                  });
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  history.push({
                    pathname: `/invoices/add/${row.id}`,
                  });
                }}
              >
                Add Invoice
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

export default ClientHeader;
