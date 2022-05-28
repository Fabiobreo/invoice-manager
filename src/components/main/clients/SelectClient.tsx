import { Box, Button, Center, Flex } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Client } from "../../../models/Client";
import { ClientChakraStyles } from "../../../models/ClientChakraStyles";
import LoadingSpinner from "../../UI/LoadingSpinner";
import ClientForm from "./ClientForm";
import classes from "./ClientForm.module.css";

type SelectClientType = {
  isLoading: boolean;
  data: { clients: Array<Client>; total: number } | null;
  onSelectClientChanged: (client: Client) => void;
};

const SelectClient: React.FC<SelectClientType> = (props) => {
  const history = useHistory();
  const [selectedClient, setSelectedClient] = useState<Client>();

  const addNewClientHandler = () => {
    history.push("/clients/add");
  };

  const selectedClientHandler = (item: any) => {
    setSelectedClient(item.value.client);
    props.onSelectClientChanged(item.value.client);
  };

  return (
    <div>
      {props.isLoading && (
        <div className="centered">
          <LoadingSpinner className={classes.spinner} />
        </div>
      )}
      {!props.isLoading && (
        <div>
          <Flex mb={2} mt={3} ml={1}>
            <Box flex="1" mr={2}>
              <Select
                name="clientsList"
                id="selectClient"
                classNamePrefix="chakra-react-select"
                options={[
                  {
                    label: "Clients",
                    options: props.data!.clients.map((client: Client) => {
                      return {
                        value: { client: client },
                        label: client.name + " | " + client.companyDetails.name,
                      };
                    }),
                  },
                ]}
                placeholder="Select a client..."
                closeMenuOnSelect={true}
                chakraStyles={ClientChakraStyles}
                onChange={selectedClientHandler}
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
      {!props.isLoading && (
        <ClientForm
          client={selectedClient}
          isReadOnly={true}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default SelectClient;
