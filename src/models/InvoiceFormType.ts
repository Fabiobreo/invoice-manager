import { Client } from "./Client";
import { Invoice } from "./Invoice";

export type InvoiceFormType = {
  loadAllClients: boolean;
  invoice?: Invoice;
  client?: Client;
  print?: () => void;
  showGoBack: boolean;
  showActions: boolean;
  isEditMode: boolean;
  openAndPrint: boolean;
};
