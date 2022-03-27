import {
  Button,
  Center,
  Flex,
  FormLabel,
  Heading,
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
import { postClient, putClient } from "../../../lib/api";
import { Client } from "../../../models/Client";
import { AuthContext } from "../../../store/auth-context";
import Card from "../../ui/Card";
import ErrorModal, { ErrorType } from "../../ui/ErrorModal";

import classes from "./ClientForm.module.css";

const ClientForm: React.FC<{ client?: Client }> = (props) => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

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
  const [error, setError] = useState<ErrorType>();
  const [isEditMode, setIsEditMode] = useState(false);

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
        history.replace(`/clients/${postClientDetailsData.client.user_id}`);
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
          title: "Client update.",
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
  }, [
    putClientDetailsStatus,
    putClientDetailsError,
    errorHandler,
    toast,
  ]);

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
    }
    else
    {
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
      <Card className={classes.clientForm}>
        <div className={classes.control}>
          <Flex>
            <Spacer />
            <Spacer />
            <Heading>Client</Heading>
            <Spacer />
            {props.client !== undefined && (
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
            )}
            {props.client === undefined && <Spacer />}
          </Flex>
        </div>

        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="name">
              Name
            </FormLabel>
            <Input
              type="text"
              id="name"
              placeholder="Enter name"
              required
              readOnly={isReadOnly}
              value={name}
              onChange={onNameChange}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="email">
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="Enter email"
              required
              readOnly={isReadOnly}
              value={email}
              onChange={onEmailChange}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="companyName">
              Company name
            </FormLabel>
            <Input
              type="text"
              id="companyName"
              placeholder="Enter company name"
              required
              readOnly={isReadOnly}
              value={companyName}
              onChange={onCompanyNameChange}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="address">
              Company address
            </FormLabel>
            <Input
              type="text"
              id="address"
              placeholder="Enter company address"
              required
              readOnly={isReadOnly}
              value={address}
              onChange={onAddressChange}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="vatNumber">
              Company Tax/VAT number
            </FormLabel>
            <Input
              type="text"
              id="vatNumber"
              placeholder="Enter company tax/vat number"
              required
              readOnly={isReadOnly}
              value={vatNumber}
              onChange={onVatNumberChange}
            />
          </div>
          <div className={classes.control}>
            <FormLabel fontWeight="bold" htmlFor="regNumber">
              Company registration number
            </FormLabel>
            <Input
              type="text"
              id="regNumber"
              placeholder="Enter company registration number"
              required
              readOnly={isReadOnly}
              value={regNumber}
              onChange={onRegNumberChange}
            />
          </div>

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
        </form>
      </Card>
    </Fragment>
  );
};

export default ClientForm;
