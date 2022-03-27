import React, { Fragment } from "react";
import { useTable, usePagination, useSortBy, useFlexLayout } from "react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Text,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Center,
  Spacer,
} from "@chakra-ui/react";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import LoadingSpinner from "./LoadingSpinner";
import { useHistory } from "react-router-dom";

const UITable: React.FC<{
  columns: Array<any>;
  data: Array<any>;
  isLoading: boolean;
  error: string | null;
  title: string;
  onShowAll?: () => void;
  onAddNew?: () => void;
}> = (props) => {
  const cellProps = (props: any, { cell }: any) =>
    getStyles(props, cell.column.align);

  const getStyles = (props: any, align = "center") => [
    props,
    {
      style: {
        justifyContent:
          align === "right"
            ? "flex-end"
            : align === "left"
            ? "flex-start"
            : "center",
        alignItems: "center",
        display: "flex",
      },
    },
  ];

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 70,
      width: 70,
      maxWidth: 140,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns: props.columns,
      data: props.data,
      defaultColumn,
    },
    useSortBy,
    usePagination,
    useFlexLayout
  );

  const history = useHistory();

  const onRowClick = (row: any) => {
    history.push(`/clients/${row.id}`);
  };

  return (
    <Fragment>
      <Table
        {...getTableProps()}
        variant="simple"
        colorScheme="linkedin"
        size="sm"
      >
        <Thead>
          <Tr>
            <Th colSpan={props.columns.length}>
              <Flex>
                <Center>
                  <Text fontSize="md" mb={2}>
                    {props.title}
                  </Text>
                </Center>
                <Spacer />
                <Button
                  type="button"
                  h="1.75rem"
                  size="sm"
                  background="#64b5f6"
                  color="white"
                  onClick={props.onAddNew}
                >
                  Add new
                </Button>
                <Button
                  type="button"
                  h="1.75rem"
                  ml={4}
                  mb={2}
                  size="sm"
                  background="#64b5f6"
                  color="white"
                  onClick={props.onShowAll}
                >
                  Show all
                </Button>
              </Flex>
            </Th>
          </Tr>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  userSelect="none"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <Flex alignItems="center">
                    {column.render("Header")}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronDownIcon ml={1} w={4} h={4} />
                      ) : (
                        <ChevronUpIcon ml={1} w={4} h={4} />
                      )
                    ) : (
                      ""
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        {!props.error && !props.isLoading && (
          <Tbody {...getTableBodyProps()}>
            {props.data.length > 0 ? (
              page.map((row, i) => {
                prepareRow(row);
                return (
                  <Tr
                    {...row.getRowProps()}
                    onClick={() => onRowClick(row.original)}
                    cursor={"pointer"}
                    _hover={{ bg: "blue.50" }}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <Td
                          wordBreak="break-all"
                          {...cell.getCellProps(cellProps)}
                        >
                          {cell.render("Cell")}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={props.columns.length}>
                  <Flex>
                    <Spacer />
                    <Center>
                      <Text as="div" p="4px 24px" fontSize="md">
                        No records
                      </Text>
                    </Center>
                    <Spacer />
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        )}
        {!props.error && props.isLoading && (
          <Tbody>
            <Tr>
              <Td colSpan={props.columns.length}>
                <Flex>
                  <Spacer />
                  <Center>
                    <LoadingSpinner />
                  </Center>
                  <Spacer />
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        )}
        {props.error && (
          <Tbody>
            <Tr>
              <Td colSpan={6}>
                <Flex>
                  <Spacer />
                  <Center>
                    <Text>{props.error}</Text>
                  </Center>
                  <Spacer />
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        )}
      </Table>

      {!props.isLoading && props.data.length > 0 && (
        <Flex justifyContent="space-between" m={4} alignItems="center">
          <Flex>
            <Tooltip label="First Page">
              <IconButton
                aria-label="First Page"
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />
            </Tooltip>
            <Tooltip label="Previous Page">
              <IconButton
                aria-label="Previous Page"
                onClick={previousPage}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex alignItems="center">
            <Text flexShrink="0" mr={8}>
              Page{" "}
              <Text fontWeight="bold" as="span">
                {pageIndex + 1}
              </Text>{" "}
              of{" "}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
              </Text>
            </Text>
            <Text flexShrink="0">Go to page:</Text>{" "}
            <NumberInput
              ml={2}
              mr={8}
              w={28}
              min={1}
              max={pageOptions.length}
              onChange={(value) => {
                const page = value ? +value - 1 : 0;
                gotoPage(page);
              }}
              defaultValue={pageIndex + 1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                aria-label="Next Page"
                onClick={nextPage}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
            <Tooltip label="Last Page">
              <IconButton
                aria-label="Last Page"
                onClick={() => gotoPage(pageCount - 1)}
                isDisabled={!canNextPage}
                icon={<ArrowRightIcon h={3} w={3} />}
                ml={4}
              />
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </Fragment>
  );
};

export default UITable;
