import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { postInvoice, putInvoice } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { InvoiceFormType } from "../../../models/InvoiceFormType";
import { AuthContext } from "../../../store/auth-context";
import Card from "../../ui/Card";
import { SingleDatepicker } from "../../ui/DatePicker";
import ErrorModal, { ErrorType } from "../../ui/ErrorModal";
import ClientForm from "../clients/ClientForm";

import classes from "./InvoiceForm.module.css";

const format = (val: string) => `$` + val;
const parse = (val: string) => {
  const value = val.replace(/^\$/, "");
  if (value.length > 0) return value;
  else return "0";
};

const InvoiceForm: React.FC<InvoiceFormType> = (props) => {
  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const history = useHistory();
  const toast = useToast();
  let loadAllClients = props.loadAllClients;
  let selectedClient = props.client;
  let editMode = props.isEditMode;
  let openAndPrint = props.openAndPrint;
  let print = props.print;

  const state = history.location.state as InvoiceFormType;
  if (state) {
    loadAllClients = state.loadAllClients;
    if (state.client) {
      selectedClient = state.client;
    }
    if (state.isEditMode) {
      editMode = state.isEditMode;
    }
    if (state.openAndPrint) {
      openAndPrint = state.openAndPrint;
    }

    if (state.print) {
      print = state.print;
    }
  }

  const [invoiceDate, setInvoiceDate] = useState<Date>(
    props.invoice ? new Date(props.invoice.date) : new Date()
  );

  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    props.invoice ? props.invoice.invoice_number : ""
  );

  const [projectCode, setProjectCode] = useState<string>(
    props.invoice ? props.invoice.projectCode : ""
  );

  const [invoiceTotal, setInvoiceTotal] = useState<string>(
    props.invoice ? format(props.invoice.value.toFixed(2).toString()) : ""
  );

  const [currentClient, setCurrentClient] = useState<Client | null>(
    selectedClient ? selectedClient : null
  );

  const defaultInvoiceItems = [{ item: "", price: "0.00" }];
  let propsInvoiceItems = [];

  if (props.invoice && props.invoice.meta) {
    for (let key in props.invoice.meta) {
      propsInvoiceItems.push({
        item: key,
        price: props.invoice.meta[key].toString(),
      });
    }
  }

  const [invoiceItems, setInvoiceItems] = useState<Array<InvoiceItem>>(
    propsInvoiceItems.length > 0 ? propsInvoiceItems : defaultInvoiceItems
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const [isEditMode, setIsEditMode] = useState(editMode);

  const isReadOnly =
    !isEditMode &&
    (selectedClient ? true : false) &&
    (props.invoice ? true : false);

  const {
    sendRequest: sendPostInvoiceRequest,
    data: postInvoiceDetailsData,
    status: postInvoiceDetailsStatus,
    error: postInvoiceDetailsError,
  } = useHttp(postInvoice);

  const {
    sendRequest: sendPutInvoiceRequest,
    status: putInvoiceDetailsStatus,
    error: putInvoiceDetailsError,
  } = useHttp(putInvoice);

  const errorHandler = useCallback(() => {
    setError(undefined);
  }, []);

  const onInvoiceNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInvoiceNumber(e.target.value);
  };

  const onProjectCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectCode(e.target.value);
  };

  const editModeHandler = () => {
    setIsEditMode((previous) => {
      if (previous) {
        setProjectCode(props.invoice!.projectCode);
        setInvoiceDate(new Date(props.invoice!.date));
        setInvoiceNumber(props.invoice!.invoice_number);
        setInvoiceTotal(format(props.invoice!.value.toFixed(2).toString()));
        propsInvoiceItems = [];
        if (props.invoice && props.invoice.meta) {
          for (let key in props.invoice.meta) {
            propsInvoiceItems.push({
              item: key,
              price: props.invoice.meta[key].toString(),
            });
          }
        }
        setInvoiceItems(
          propsInvoiceItems.length > 0 ? propsInvoiceItems : defaultInvoiceItems
        );
      }
      return !previous;
    });
  };

  const selectedClientHandler = (client: Client) => {
    setCurrentClient(client);
  };

  useEffect(() => {
    if (openAndPrint === true) {
      if (print) print();
      else window.print();
    }
  }, [openAndPrint, print]);

  useEffect(() => {
    if (postInvoiceDetailsStatus === "completed" && !postInvoiceDetailsError) {
      setIsLoading(false);
      if (
        postInvoiceDetailsData &&
        postInvoiceDetailsData.invoice &&
        postInvoiceDetailsData.invoice.id
      ) {
        toast({
          title: "Invoice created.",
          description: "A new invoice has been successfully created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        history.push(`/invoices/${postInvoiceDetailsData.invoice.id}`);
      }
    } else if (postInvoiceDetailsError) {
      setIsLoading(false);
      setError({
        title: "Invoice registration failed",
        message: postInvoiceDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    postInvoiceDetailsStatus,
    postInvoiceDetailsData,
    postInvoiceDetailsError,
    errorHandler,
    history,
    toast,
  ]);

  useEffect(() => {
    if (putInvoiceDetailsStatus === "completed" && !putInvoiceDetailsError) {
      setIsLoading(false);
      toast({
        title: "Invoice updated.",
        description: "Invoice successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsEditMode(false);
    } else if (putInvoiceDetailsError) {
      setIsLoading(false);
      setError({
        title: "Invoice update failed",
        message: putInvoiceDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [putInvoiceDetailsStatus, putInvoiceDetailsError, errorHandler, toast]);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (currentClient === null) {
      setError({
        title: "Invoice registration failed",
        message: "Select a valid client.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (invoiceDate > new Date()) {
      setError({
        title: "Invoice registration failed",
        message: "Enter a valid date.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (invoiceNumber.trim().length === 0) {
      setError({
        title: "Invoice registration failed",
        message: "Enter a valid invoice number.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (projectCode.trim().length === 0) {
      setError({
        title: "Invoice registration failed",
        message: "Enter a valid project identifier.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (parseFloat(parse(invoiceTotal)) === 0) {
      setError({
        title: "Invoice registration failed",
        message: "Total is $0. Enter at least an item greater than zero.",
        onConfirm: errorHandler,
      });
      return;
    }

    for (var i = 0; i < invoiceItems.length; ++i) {
      if (invoiceItems[i].item.trim().length === 0) {
        setError({
          title: "Invoice registration failed",
          message: "Enter a valid item description for each item.",
          onConfirm: errorHandler,
        });
        return;
      }
    }

    setIsLoading(true);

    const meta = {} as Record<string, string>;
    for (const element of invoiceItems) {
      meta[element.item] = element.price;
    }

    if (props.invoice === undefined) {
      sendPostInvoiceRequest({
        token: token,
        invoice: {
          invoice_number: invoiceNumber,
          client_id: currentClient.id,
          date: invoiceDate.getTime(),
          value: parseFloat(parse(invoiceTotal)),
          projectCode: projectCode,
          meta: meta,
        },
      });
    } else {
      sendPutInvoiceRequest({
        token: token,
        invoice: {
          id: props.invoice!.id,
          invoice_number: invoiceNumber,
          client_id: currentClient.id,
          date: invoiceDate.getTime(),
          value: parseFloat(parse(invoiceTotal)),
          projectCode: projectCode,
          meta: meta,
        },
      });
    }
  };

  type InvoiceItem = {
    item: string;
    price: string;
  };

  const handleItemChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let values = [...invoiceItems];
    values[index]["item"] = event?.target.value;
    setInvoiceItems(values);
  };

  const handlePriceChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let values = [...invoiceItems];
    const value = parse(event?.target.value);
    values[index]["price"] = value;
    setInvoiceItems(values);

    let total = 0;
    for (let i = 0; i < values.length; ++i) {
      total += parseFloat(values[i].price);
    }
    setInvoiceTotal(format(total.toFixed(2).toString()));
  };

  const addFormFields = () => {
    setInvoiceItems([...invoiceItems, { item: "", price: "0.00" }]);
  };

  const removeFormFields = (i: number) => {
    let values = [...invoiceItems];
    values.splice(i, 1);
    setInvoiceItems(values);

    let total = 0;
    for (let i = 0; i < values.length; ++i) {
      total += parseFloat(values[i].price);
    }
    setInvoiceTotal(format(total.toFixed(2).toString()));
  };

  return (
    <Fragment>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <Card className={classes.invoiceForm}>
        <div className={classes.control}>
          <Flex>
            <Center>
              <IconButton
                aria-label="Go Back"
                size="sm"
                background="#64b5f6"
                color="white"
                ml={1}
                mt={1}
                onClick={() => history.goBack()}
              >
                <ChevronLeftIcon h={6} w={6} />
              </IconButton>
            </Center>
            <Spacer />
            <Heading size={"2xl"}>Invoice</Heading>
            <Spacer />
          </Flex>
        </div>
        <div>
          {selectedClient !== undefined && (
            <div className={classes.control}>
              <Flex ml={1} mr={1}>
                <Center>
                  <Button
                    type="button"
                    h="2.25rem"
                    w="3.75rem"
                    size="md"
                    background="#64b5f6"
                    color="white"
                    onClick={() => {
                      if (print) print();
                    }}
                  >
                    Print
                  </Button>
                </Center>
                <Spacer />
                <Center>
                  <Button
                    type="button"
                    h="2.25rem"
                    w="3.75rem"
                    size="md"
                    background="#64b5f6"
                    color="white"
                    onClick={editModeHandler}
                  >
                    {!isEditMode ? "Edit" : "Cancel"}
                  </Button>
                </Center>
              </Flex>
            </div>
          )}
          <ClientForm
            className={classes.invoiceDeeperForm}
            loadAllClients={loadAllClients}
            onSelectedClient={selectedClientHandler}
            client={selectedClient}
            isReadOnly={true}
            isEditMode={false}
            showGoBack={false}
          />

          <form onSubmit={submitHandler}>
            <div className={classes.control}>
              <div className={classes.row}>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="invoiceDate">
                    Invoice date
                  </FormLabel>
                </div>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="invoiceNumber">
                    Invoice number
                  </FormLabel>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.column}>
                  <Box>
                    <SingleDatepicker
                      name="invoiceDate"
                      id="invoiceDate"
                      date={invoiceDate}
                      onDateChange={setInvoiceDate}
                      isReadOnly={isReadOnly}
                    />
                  </Box>
                </div>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="invoiceNumber"
                    placeholder="Enter the invoice number"
                    required
                    readOnly={isReadOnly}
                    value={invoiceNumber}
                    onChange={onInvoiceNumberChange}
                  />
                </div>
              </div>
            </div>

            <div className={classes.control}>
              <div className={classes.row}>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="projectIdentifier">
                    Project identifier
                  </FormLabel>
                </div>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="projectIdentifier">
                    Invoice Total
                  </FormLabel>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="projectIdentifier"
                    placeholder="Enter the project identifier"
                    required
                    readOnly={isReadOnly}
                    value={projectCode}
                    onChange={onProjectCodeChange}
                  />
                </div>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="invoiceTotal"
                    placeholder="$0"
                    required
                    readOnly={true}
                    value={invoiceTotal}
                  />
                </div>
              </div>
            </div>

            <Card className={classes.invoiceDeeperForm}>
              <FormControl
                className={classes.control}
                overflow="scroll"
                overflowX={"hidden"}
                height="200px"
              >
                <div className={classes.control}>
                  <Center>
                    <FormLabel size="lg" fontWeight="bold">
                      Invoice Items
                    </FormLabel>
                  </Center>
                </div>
                {invoiceItems.map((element, index) => (
                  <FormControl key={index} mt={1}>
                    <div className={classes.row}>
                      <div className={classes.column}>
                        <FormLabel fontWeight="bold">Item</FormLabel>
                      </div>
                      <div className={classes.column}>
                        <FormLabel fontWeight="bold">Price</FormLabel>
                      </div>
                    </div>

                    <div className={classes.row}>
                      <div className={classes.column}>
                        <Input
                          type="text"
                          name="item"
                          required
                          isReadOnly={isReadOnly}
                          placeholder="Insert a new item"
                          value={element.item || ""}
                          onChange={(event) => handleItemChange(index, event)}
                        />
                      </div>
                      <div className={classes.column}>
                        <Input
                          name="price"
                          type="text"
                          required
                          isReadOnly={isReadOnly}
                          onChange={(valueString) =>
                            handlePriceChange(index, valueString)
                          }
                          value={format(element.price)}
                          step={0.5}
                        />
                      </div>
                      {!isReadOnly && (
                        <div className={classes.column}>
                          {index ? (
                            <Button
                              type="button"
                              h="2.25rem"
                              w="7rem"
                              size="md"
                              background="#64b5f6"
                              color="white"
                              onClick={() => removeFormFields(index)}
                            >
                              Remove
                            </Button>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </FormControl>
                ))}
                {!isReadOnly && (
                  <div>
                    <Button
                      mt={4}
                      h="2.25rem"
                      w="7rem"
                      size="md"
                      background="#64b5f6"
                      color="white"
                      type="button"
                      onClick={() => addFormFields()}
                    >
                      Add
                    </Button>
                  </div>
                )}
              </FormControl>
            </Card>

            <div className={classes.actions}>
              {!isLoading && props.invoice === undefined && (
                <Button type="submit">Submit</Button>
              )}
              {!isLoading && props.invoice !== undefined && !isReadOnly && (
                <Button type="submit">Update</Button>
              )}
              {isLoading && (
                <Button isLoading loadingText="Submitting">
                  Submitting
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>
    </Fragment>
  );
};

export default InvoiceForm;
