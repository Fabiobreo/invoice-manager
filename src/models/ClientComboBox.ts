import { Client } from "./Client";

export type ClientComboBox = {
  label: string;
  options: ClientItem[];
};

export type ClientItem = {
  value: { client: Client };
  label: string;
};
