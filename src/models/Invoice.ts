import { Client } from "./Client";

export interface TotalInvoice {
  invoice: Invoice;
  client: Client;
}

export interface InvoiceInfo {
  invoice_number: string;
  client_id?: string;
  date: number;
  dueDate: number;
  value: number;
  projectCode: string;
  meta?: Record<string, any>;
}

export interface Invoice extends InvoiceInfo {
  id: string;
  user_id: string;
}
