import { CompanyDetails } from "./CompanyDetails";

export type Client = {
  id: string;
  name: string;
  email: string;
  user_id: string;
  totalBilled: number;
  invoicesCount: number;
  companyDetails: CompanyDetails;
};
