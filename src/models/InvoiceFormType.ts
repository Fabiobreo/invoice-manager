import { Client } from "./Client";
import { Invoice } from "./Invoice";

export type InvoiceFormType = {
  loadAllClients: boolean;
  invoice?: Invoice;
  client?: Client;
  print?: () => void;
  isEditMode: boolean;
  openAndPrint: boolean;
};
