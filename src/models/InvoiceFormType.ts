import { Invoice, InvoiceInfo } from "./Invoice";

export type InvoiceFormType = {
  invoice?: Invoice;
  isReadOnly: boolean;
  isLoading: boolean;
  onSubmitInvoice?: (invoice: InvoiceInfo) => void;
  openAndPrint?: boolean;
};
