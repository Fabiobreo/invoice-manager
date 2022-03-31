import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { ChakraStylesConfig, Select } from "chakra-react-select";
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
import { getClients, postClient, putClient } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { ClientComboBox } from "../../../models/ClientComboBox";
import { ClientFormType } from "../../../models/ClientFormType";
import { InvoiceFormType } from "../../../models/InvoiceFormType";
import { AuthContext } from "../../../store/auth-context";
import Card from "../../ui/Card";
import ErrorModal, { ErrorType } from "../../ui/ErrorModal";
import LoadingSpinner from "../../ui/LoadingSpinner";

import classes from "./ClientForm.module.css";

const ClientForm: React.FC<ClientFormType> = (props) => {
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (prev, { selectProps: { menuIsOpen } }) => ({
      ...prev,
      "> svg": {
        transitionDuration: "normal",
        transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
      },
    }),

    control: (provided) => ({
      ...provided,
      background: "#e3f2fd",
      font: "inherit",
      color: "#1976d2",
      borderRadius: "4px",
      border: "1px solid white",
      width: "100%",
      textAlign: "left",
      padding: "0.25rem",
    }),

    groupHeading: (provided) => ({
      ...provided,
      background: "#64b5f6",
      color: "white",
    }),

    group: (provided) => ({
      ...provided,
      background: "#e3f2fd",
      color: "#1976d2",
    }),
  };

  const authCtx = useContext(AuthContext);
  const { token } = authCtx;
  const history = useHistory();
  let loadAllClients = props.loadAllClients;
  let editMode = props.isEditMode;

  const state = history.location.state as ClientFormType;
  if (state) {
    loadAllClients = state.loadAllClients;
    if (state.isEditMode) {
      editMode = state.isEditMode;
    }
  }

  const [name, setName] = useState(props.client ? props.client!.name : "");
  const [email, setEmail] = useState(props.client ? props.client!.email : "");
  const [companyName, setCompanyName] = useState(
    props.client ? props.client!.companyDetails.name : ""
  );
  const [address, setAddress] = useState(
    props.client ? props.client!.companyDetails.address : ""
  );
  const [vatNumber, setVatNumber] = useState(
    props.client ? props.client!.companyDetails.vatNumber : ""
  );
  const [regNumber, setRegNumber] = useState(
    props.client ? props.client!.companyDetails.regNumber : ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>();
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [clients, setClients] = useState<ClientComboBox[]>();

  const isReadOnly = !isEditMode && props.client ? true : false;

  const toast = useToast();

  const {
    sendRequest: sendPostClientRequest,
    data: postClientDetailsData,
    status: postClientDetailsStatus,
    error: postClientDetailsError,
  } = useHttp(postClient);

  const {
    sendRequest: sendPutClientRequest,
    status: putClientDetailsStatus,
    error: putClientDetailsError,
  } = useHttp(putClient);

  const {
    sendRequest: sendGetClientsRequest,
    data: getClientsDetailsData,
    status: getClientsDetailsStatus,
    error: getClientsDetailsError,
  } = useHttp(getClients);

  const errorHandler = useCallback(() => {
    setError(undefined);
  }, []);

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onCompanyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const onVatNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVatNumber(e.target.value);
  };

  const onRegNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegNumber(e.target.value);
  };

  const editModeHandler = () => {
    setIsEditMode((previous) => {
      if (previous) {
        setName(props.client!.name);
        setEmail(props.client!.email);
        setCompanyName(props.client!.companyDetails.name);
        setAddress(props.client!.companyDetails.address);
        setVatNumber(props.client!.companyDetails.vatNumber);
        setRegNumber(props.client!.companyDetails.regNumber);
      }
      return !previous;
    });
  };

  const addInvoiceHandler = () => {
    history.push({
      pathname: "/invoices/add",
      state: { client: props.client, loadAllClients: false } as InvoiceFormType,
    });
  };

  useEffect(() => {
    if (loadAllClients) {
      setIsClientsLoading(true);
      sendGetClientsRequest({
        token: token,
        params: {
          orderBy: "clientName",
          order: "asc",
        },
      });
    }
  }, [sendGetClientsRequest, token, loadAllClients]);

  useEffect(() => {
    if (getClientsDetailsStatus === "completed" && !getClientsDetailsError) {
      setIsClientsLoading(false);
      setClients([
        {
          label: "Clients",
          options: getClientsDetailsData.clients.map((client: Client) => {
            return {
              value: { client: client },
              label: client.name + " | " + client.companyDetails.name,
            };
          }),
        },
      ]);
    } else if (getClientsDetailsError) {
      setIsClientsLoading(false);
    }
  }, [getClientsDetailsStatus, getClientsDetailsData, getClientsDetailsError]);

  const selectHandler = (item: any) => {
    const client = item.value.client;
    setName(client.name);
    setEmail(client.email);
    setCompanyName(client.companyDetails.name);
    setAddress(client.companyDetails.address);
    setVatNumber(client.companyDetails.vatNumber);
    setRegNumber(client.companyDetails.regNumber);
    if (props.onSelectedClient) {
      props.onSelectedClient(client);
    }
  };

  useEffect(() => {
    if (postClientDetailsStatus === "completed" && !postClientDetailsError) {
      setIsLoading(false);
      if (
        postClientDetailsData &&
        postClientDetailsData.client &&
        postClientDetailsData.client.user_id
      ) {
        toast({
          title: "Client created.",
          description: "A new client has been successfully created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        history.push(`/clients/${postClientDetailsData.client.id}`);
      }
    } else if (postClientDetailsError) {
      setIsLoading(false);
      setError({
        title: "Client registration failed",
        message: postClientDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [
    postClientDetailsStatus,
    postClientDetailsData,
    postClientDetailsError,
    errorHandler,
    history,
    toast,
  ]);

  useEffect(() => {
    if (putClientDetailsStatus === "completed" && !putClientDetailsError) {
      setIsLoading(false);
      toast({
        title: "Client updated.",
        description: "Client successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsEditMode(false);
    } else if (putClientDetailsError) {
      setIsLoading(false);
      setError({
        title: "Client update failed",
        message: putClientDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [putClientDetailsStatus, putClientDetailsError, errorHandler, toast]);

  const addNewClientHandler = () => {
    history.push("/clients/add");
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim().length === 0) {
      setError({
        title: "Client registration failed",
        message: "Enter a valid name.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (email.trim().length === 0) {
      setError({
        title: "Client registration failed",
        message: "Enter a valid email.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (companyName.trim().length === 0) {
      setError({
        title: "Client registration failed",
        message: "Enter a valid company name.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (address.trim().length === 0) {
      setError({
        title: "Client registration failed",
        message: "Enter a valid address.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (vatNumber.trim().length === 0) {
      setError({
        title: "Client registration failed",
        message: "Enter a valid TAX/VAT number.",
        onConfirm: errorHandler,
      });
      return;
    }

    if (regNumber.trim().length === 0) {
      setError({
        title: "Client registration failed",
        message: "Enter a valid registration number.",
        onConfirm: errorHandler,
      });
      return;
    }

    setIsLoading(true);

    if (props.client === undefined) {
      sendPostClientRequest({
        token: authCtx.current_user!.token,
        client: {
          name: name,
          email: email,
          companyDetails: {
            name: companyName,
            address: address,
            vatNumber: vatNumber,
            regNumber: regNumber,
          },
        },
      });
    } else {
      sendPutClientRequest({
        token: authCtx.current_user!.token,
        client: {
          id: props.client.id,
          name: name,
          email: email,
          companyDetails: {
            name: companyName,
            address: address,
            vatNumber: vatNumber,
            regNumber: regNumber,
          },
        },
      });
    }
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
      <Card
        className={`${classes.clientForm} ${
          props.className ? props.className : ""
        }`}
      >
        <div className={classes.control}>
          <Flex>
            {props.showGoBack && (
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
            )}
            <Spacer />
            <Heading>Client</Heading>
            <Spacer />
          </Flex>
        </div>
        {props.client !== undefined && props.isReadOnly === false && (
          <div className={classes.control}>
            <Flex ml={1} mr={1}>
              <Center>
                <Button
                  type="button"
                  h="2.25rem"
                  w="7rem"
                  size="md"
                  background="#64b5f6"
                  color="white"
                  onClick={addInvoiceHandler}
                >
                  Add Invoice
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
        {loadAllClients && isClientsLoading && (
          <LoadingSpinner className={classes.spinner} />
        )}
        {loadAllClients && !isClientsLoading && (
          <div>
            <Flex mb={2} mt={3} ml={1}>
              <Box flex="1" mr={2}>
                <Select
                  name="clientsList"
                  classNamePrefix="chakra-react-select"
                  options={clients}
                  placeholder="Select a client..."
                  closeMenuOnSelect={true}
                  chakraStyles={chakraStyles}
                  onChange={selectHandler}
                />
              </Box>
              <Center>
                <Button
                  type="button"
                  h="2.25rem"
                  w="8rem"
                  mr={1}
                  size="md"
                  background="#64b5f6"
                  color="white"
                  onClick={addNewClientHandler}
                >
                  Add new client
                </Button>
              </Center>
            </Flex>
          </div>
        )}

        {!isClientsLoading && (
          <form onSubmit={submitHandler}>
            <div className={classes.control}>
              <div className={classes.row}>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="name">
                    Name
                  </FormLabel>
                </div>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="email">
                    Email
                  </FormLabel>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter name"
                    required
                    readOnly={isReadOnly || loadAllClients}
                    value={name}
                    onChange={onNameChange}
                  />
                </div>
                <div className={classes.column}>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    required
                    readOnly={isReadOnly || loadAllClients}
                    value={email}
                    onChange={onEmailChange}
                  />
                </div>
              </div>
            </div>

            <div className={classes.control}>
              <div className={classes.row}>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="companyName">
                    Company name
                  </FormLabel>
                </div>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="address">
                    Company address
                  </FormLabel>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="companyName"
                    placeholder="Enter company name"
                    required
                    readOnly={isReadOnly || loadAllClients}
                    value={companyName}
                    onChange={onCompanyNameChange}
                  />
                </div>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="address"
                    placeholder="Enter company address"
                    required
                    readOnly={isReadOnly || loadAllClients}
                    value={address}
                    onChange={onAddressChange}
                  />
                </div>
              </div>
            </div>

            <div className={classes.control}>
              <div className={classes.row}>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="vatNumber">
                    Company Tax/VAT number
                  </FormLabel>
                </div>
                <div className={classes.column}>
                  <FormLabel fontWeight="bold" htmlFor="regNumber">
                    Company registration number
                  </FormLabel>
                </div>
              </div>

              <div className={classes.row}>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="vatNumber"
                    placeholder="Enter company tax/vat number"
                    required
                    readOnly={isReadOnly || loadAllClients}
                    value={vatNumber}
                    onChange={onVatNumberChange}
                  />
                </div>
                <div className={classes.column}>
                  <Input
                    type="text"
                    id="regNumber"
                    placeholder="Enter company registration number"
                    required
                    readOnly={isReadOnly || loadAllClients}
                    value={regNumber}
                    onChange={onRegNumberChange}
                  />
                </div>
              </div>
            </div>

            {!loadAllClients && (
              <div className={classes.actions}>
                {!isLoading && props.client === undefined && (
                  <Button type="submit">Submit</Button>
                )}
                {!isLoading && props.client !== undefined && !isReadOnly && (
                  <Button type="submit">Update</Button>
                )}
                {isLoading && (
                  <Button isLoading loadingText="Submitting">
                    Submitting
                  </Button>
                )}
              </div>
            )}
          </form>
        )}
      </Card>
    </Fragment>
  );
};

export default ClientForm;
