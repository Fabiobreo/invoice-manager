import { CompanyDetails } from "./CompanyDetails"

export type User = {
    user_id: string,
    email: string,
    name: string,
    token: string,
    companyDetails: CompanyDetails | null
}