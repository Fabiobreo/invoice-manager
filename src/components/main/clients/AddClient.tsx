import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Center,
  Flex,
  Heading,
  IconButton,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { postClient } from "../../../lib/api";
import Card from "../../UI/Card";
import ErrorModal, { ErrorType } from "../../UI/ErrorModal";

import classes from "./ClientForm.module.css";
import ClientForm from "./ClientForm";
import { ClientInfo } from "../../../models/Client";

const AddClient: React.FC<{ className?: string }> = (props) => {
  const [error, setError] = useState<ErrorType>();
  const history = useHistory();
  const toast = useToast();

  const {
    sendRequest: sendPostClientRequest,
    data: postClientDetailsData,
    status: postClientDetailsStatus,
    error: postClientDetailsError,
  } = useHttp(postClient);

  const errorHandler = useCallback(() => {
    setError(undefined);
  }, []);

  useEffect(() => {
    if (postClientDetailsStatus === "completed" && !postClientDetailsError) {
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
      setError({
        title: "Client registration failed",
        message: postClientDetailsError,
        onConfirm: errorHandler,
      });
    }
  }, [postClientDetailsStatus, postClientDetailsData, postClientDetailsError]);

  const submitClientHandler = (client: ClientInfo) => {
    sendPostClientRequest({ client: client });
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
            <Heading>Add new client</Heading>
            <Spacer />
          </Flex>
        </div>
        <ClientForm
          isReadOnly={false}
          isLoading={postClientDetailsStatus === "pending"}
          onSubmitClient={submitClientHandler}
        />
      </Card>
    </Fragment>
  );
};

export default AddClient;
