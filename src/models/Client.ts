import { CompanyDetails } from "./CompanyDetails";

export interface ClientInfo {
  name: string;
  email: string;
  companyDetails: CompanyDetails;
}

export interface Client extends ClientInfo {
  id: string;
  user_id: string;
  totalBilled: number;
  invoicesCount: number;
};