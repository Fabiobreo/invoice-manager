import { Button, FormLabel, Input } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ClientFormType } from "../../../models/ClientFormType";

import classes from "./ClientForm.module.css";

export interface ClientInputs {
  name: string;
  email: string;
  companyName: string;
  companyAddress: string;
  companyVat: string;
  companyReg: string;
};

const ClientForm: React.FC<ClientFormType> = (props) => {
  const { register, handleSubmit, setValue } = useForm<ClientInputs>();

  const submitHandler: SubmitHandler<ClientInputs> = (data) => {
    if (props.onSubmitClient) {
      props.onSubmitClient({
        name: data.name,
        email: data.email,
        companyDetails: {
          name: data.companyName,
          address: data.companyAddress,
          vatNumber: data.companyVat,
          regNumber: data.companyReg,
        },
      });
    }
  };

  if (props.client) {
    setValue("name", props.client.name);
    setValue("email", props.client.email);
    setValue("companyName", props.client.companyDetails.name);
    setValue("companyAddress", props.client.companyDetails.address);
    setValue("companyVat", props.client.companyDetails.vatNumber);
    setValue("companyReg", props.client.companyDetails.regNumber);
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className={classes.control}>
        <div className={classes.row}>
          <div className={classes.column}>
            <FormLabel fontWeight="bold" htmlFor="name">
              Name
            </FormLabel>
          </div>
          <div className={classes.column}>
            <FormLabel fontWeight="bold" htmlFor="email">
              Email
            </FormLabel>
          </div>
        </div>

        <div className={classes.row}>
          <div className={classes.column}>
            <Input
              type="text"
              id="name"
              placeholder="Enter name"
              required
              readOnly={props.isReadOnly}
              {...register("name")}
            />
          </div>
          <div className={classes.column}>
            <Input
              type="email"
              id="email"
              placeholder="Enter email"
              required
              readOnly={props.isReadOnly}
              {...register("email")}
            />
          </div>
        </div>
      </div>

      <div className={classes.control}>
        <div className={classes.row}>
          <div className={classes.column}>
            <FormLabel fontWeight="bold" htmlFor="companyName">
              Company name
            </FormLabel>
          </div>
          <div className={classes.column}>
            <FormLabel fontWeight="bold" htmlFor="address">
              Company address
            </FormLabel>
          </div>
        </div>

        <div className={classes.row}>
          <div className={classes.column}>
            <Input
              type="text"
              id="companyName"
              placeholder="Enter company name"
              required
              readOnly={props.isReadOnly}
              {...register("companyName")}
            />
          </div>
          <div className={classes.column}>
            <Input
              type="text"
              id="address"
              placeholder="Enter company address"
              required
              readOnly={props.isReadOnly}
              {...register("companyAddress")}
            />
          </div>
        </div>
      </div>

      <div className={classes.control}>
        <div className={classes.row}>
          <div className={classes.column}>
            <FormLabel fontWeight="bold" htmlFor="vatNumber">
              Company Tax/VAT number
            </FormLabel>
          </div>
          <div className={classes.column}>
            <FormLabel fontWeight="bold" htmlFor="regNumber">
              Company registration number
            </FormLabel>
          </div>
        </div>

        <div className={classes.row}>
          <div className={classes.column}>
            <Input
              type="text"
              id="vatNumber"
              placeholder="Enter company tax/vat number"
              required
              readOnly={props.isReadOnly}
              {...register("companyVat")}
            />
          </div>
          <div className={classes.column}>
            <Input
              type="text"
              id="regNumber"
              placeholder="Enter company registration number"
              required
              readOnly={props.isReadOnly}
              {...register("companyReg")}
            />
          </div>
        </div>
      </div>

      {!props.isReadOnly && (
        <div className={classes.actions}>
          {!props.isLoading && (
            <Button type="submit" id="createClientButton">
              Submit
            </Button>
          )}
          {props.isLoading && (
            <Button isLoading loadingText="Submitting">
              Submitting
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default ClientForm;
