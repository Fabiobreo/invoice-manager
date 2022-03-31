import { Client } from "./Client";

export type ClientFormType = {
  client?: Client;
  className?: string;
  loadAllClients: boolean;
  onSelectedClient?: (client: Client) => void;
  showGoBack: boolean;
  isReadOnly: boolean;
  isEditMode: boolean;
};
