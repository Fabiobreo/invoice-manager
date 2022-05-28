import { Client, ClientInfo } from "./Client";

export type ClientFormType = {
  client?: Client;
  className?: string;
  isReadOnly: boolean;
  isLoading?: boolean;
  onSubmitClient?: (client: ClientInfo) => void;
};
