import React, { Fragment, useEffect, useState } from "react";
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

type UITableType = {
  id: string;
  columns: Array<any>;
  data: Array<any>;
  isLoading: boolean;
  error: string | null;
  title: string;
  isShowAllVisible: boolean;
  onShowAll?: () => void;
  isAddNewVisible: boolean;
  onAddNew?: () => void;
  onRowClick: (row: any) => void;
  totalPages: number;
  currentPage: number;
  onChangePage?: (args: FilterType) => void;
  showPagination: boolean;
  onSort?: (args: FilterType) => void;
  sort: string;
  sortBy: string;
};

export type FilterType = {
  page: number;
  sortBy: string;
  sort: string;
};

const UITable: React.FC<UITableType> = (props) => {
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
      maxWidth: 200,
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
    state: { sortBy },
  } = useTable(
    {
      columns: props.columns,
      data: props.data,
      defaultColumn,
      manualPagination: true,
      manualSortBy: true,
      pageCount: props.totalPages,
      initialState: {
        pageIndex: props.currentPage - 1,
        sortBy: [
          {
            id: props.sortBy,
            desc: props.sort == "desc",
          },
        ],
      },
    },
    useSortBy,
    usePagination,
    useFlexLayout
  );

  const [currentPage, setCurrentPage] = useState(props.currentPage);
  const { onSort } = props;

  useEffect(() => {
    if (sortBy.length > 0) {
      if (onSort) {
        onSort({
          page: currentPage,
          sortBy: sortBy[0].id,
          sort: sortBy[0].desc ? "desc" : "asc",
        });
      }
    } else {
      if (onSort) {
        onSort({ page: currentPage, sortBy: "", sort: "" });
      }
    }
  }, [sortBy, onSort]);

  useEffect(() => {
    setCurrentPage(props.currentPage);
  }, [props.currentPage]);

  return (
    <Fragment>
      <Table
        id={props.id}
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
                  <Text fontSize="lg" mb={2}>
                    {props.title}
                  </Text>
                </Center>
                <Spacer />
                {props.isAddNewVisible && (
                  <Button
                    type="button"
                    h="1.75rem"
                    mb={2}
                    size="sm"
                    background="#64b5f6"
                    color="white"
                    onClick={props.onAddNew}
                  >
                    Add new
                  </Button>
                )}
                {props.isShowAllVisible && (
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
                )}
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
                    _hover={{ bg: "blue.50" }}
                    cursor={"pointer"}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <Td
                          wordBreak="break-all"
                          {...cell.getCellProps(cellProps)}
                          onClick={() => {
                            if (cell.column.id !== "more")
                              props.onRowClick(row.original);
                          }}
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

      {!props.isLoading && props.data.length > 0 && props.showPagination && (
        <Flex justifyContent="space-between" m={4} alignItems="center">
          <Flex>
            <Tooltip label="First Page">
              <IconButton
                aria-label="First Page"
                onClick={() => {
                  gotoPage(0);
                  setCurrentPage(1);
                  if (props.onChangePage)
                    props.onChangePage({
                      page: 1,
                      sortBy: sortBy.length > 0 ? sortBy[0].id : "",
                      sort:
                        sortBy.length > 0
                          ? sortBy[0].desc
                            ? "desc"
                            : "asc"
                          : "",
                    });
                }}
                isDisabled={!canPreviousPage || currentPage === 1}
                icon={<ArrowLeftIcon h={3} w={3} />}
                mr={4}
              />
            </Tooltip>
            <Tooltip label="Previous Page">
              <IconButton
                aria-label="Previous Page"
                onClick={() => {
                  previousPage();
                  setCurrentPage(currentPage - 1);
                  if (props.onChangePage)
                    props.onChangePage({
                      page: currentPage - 1,
                      sortBy: sortBy.length > 0 ? sortBy[0].id : "",
                      sort:
                        sortBy.length > 0
                          ? sortBy[0].desc
                            ? "desc"
                            : "asc"
                          : "",
                    });
                }}
                isDisabled={!canPreviousPage || currentPage === 1}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex alignItems="center">
            <Text flexShrink="0" mr={8}>
              Page{" "}
              <Text fontWeight="bold" as="span">
                {currentPage}
              </Text>{" "}
              of{" "}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
              </Text>
            </Text>
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                aria-label="Next Page"
                onClick={() => {
                  nextPage();
                  setCurrentPage(currentPage + 1);
                  if (props.onChangePage)
                    props.onChangePage({
                      page: currentPage + 1,
                      sortBy: sortBy.length > 0 ? sortBy[0].id : "",
                      sort:
                        sortBy.length > 0
                          ? sortBy[0].desc
                            ? "desc"
                            : "asc"
                          : "",
                    });
                }}
                isDisabled={!canNextPage || currentPage === pageOptions.length}
                icon={<ChevronRightIcon h={6} w={6} />}
              />
            </Tooltip>
            <Tooltip label="Last Page">
              <IconButton
                aria-label="Last Page"
                onClick={() => {
                  gotoPage(pageCount - 1);
                  setCurrentPage(pageCount);
                  if (props.onChangePage)
                    props.onChangePage({
                      page: pageCount,
                      sortBy: sortBy.length > 0 ? sortBy[0].id : "",
                      sort:
                        sortBy.length > 0
                          ? sortBy[0].desc
                            ? "desc"
                            : "asc"
                          : "",
                    });
                }}
                isDisabled={!canNextPage || currentPage === pageOptions.length}
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
