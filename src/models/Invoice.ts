import { Client } from "./Client";

export type TotalInvoice = {
  invoice: Invoice;
  client: Client;
};

export type Invoice = {
  id: string;
  user_id: string;
  invoice_number: string;
  client_id: string;
  date: number;
  dueDate: number;
  value: number;
  projectCode: string;
  meta?: Record<string, any>;
};
