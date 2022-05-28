import { Box, Button, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { InvoiceFormType } from "../../../models/InvoiceFormType";
import Card from "../../UI/Card";
import { SingleDatepicker } from "../../UI/DatePicker";

import classes from "./InvoiceForm.module.css";
import InvoiceItems, { InvoiceItem } from "./InvoiceItems";

export interface InvoiceInputs extends InvoiceItem {
  invoiceNumber: string;
  projectIdentifier: string;
}

const today = new Date();
const nextMonth = new Date(today);
nextMonth.setDate(nextMonth.getDate() + 30);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const InvoiceForm: React.FC<InvoiceFormType> = (props) => {
  const form = useForm<InvoiceInputs>({
    defaultValues: {
      invoiceNumber: "",
      projectIdentifier: "",
      invoiceItem: [{ item: "", price: 0 }],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const [invoiceDate, setInvoiceDate] = useState<Date>(
    props.invoice ? new Date(props.invoice.date) : today
  );

  const [invoiceDueDate, setInvoiceDueDate] = useState<Date>(
    props.invoice ? new Date(props.invoice.dueDate) : nextMonth
  );

  const invoiceItemsValues = useWatch({
    name: "invoiceItem",
    control,
  });

  if (props.invoice) {
    setValue("invoiceNumber", props.invoice.invoice_number);
    setValue("projectIdentifier", props.invoice.projectCode);
  }

  let propsInvoiceItems = [];

  if (props.invoice && props.invoice.meta) {
    for (let key in props.invoice.meta) {
      propsInvoiceItems.push({
        item: key,
        price: props.invoice.meta[key].toString(),
      });
    }
  }

  const submitHandler: SubmitHandler<InvoiceInputs> = (data) => {
    const meta = {} as Record<string, number>;
    for (const element of data.invoiceItem) {
      meta[element.item] = element.price;
    }

    if (props.onSubmitInvoice)
      props.onSubmitInvoice({
        date: invoiceDate.getTime(),
        dueDate: invoiceDueDate.getTime(),
        invoice_number: data.invoiceNumber,
        projectCode: data.projectIdentifier,
        value: total,
        meta: meta,
      });
  };

  const total = invoiceItemsValues.reduce(
    (acc, current) => acc + (!Number.isNaN(current.price) ? current.price : 0),
    0
  );

  return (
    <FormProvider {...form}>
      <form>
        <div className={classes.control}>
          <div className={classes.row}>
            <div className={classes.column}>
              <FormLabel fontWeight="bold" htmlFor="invoiceDate">
                Invoice date
              </FormLabel>
            </div>
            <div className={classes.column}>
              <FormLabel fontWeight="bold" htmlFor="invoiceDueDate">
                Due date
              </FormLabel>
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.column}>
              <Box>
                <SingleDatepicker
                  name="invoiceDate"
                  id="invoiceDate"
                  date={invoiceDate}
                  onDateChange={setInvoiceDate}
                  isReadOnly={props.isReadOnly}
                />
              </Box>
            </div>
            <div className={classes.column}>
              <SingleDatepicker
                name="invoiceDueDate"
                id="invoiceDueDate"
                date={invoiceDueDate}
                onDateChange={setInvoiceDueDate}
                isReadOnly={props.isReadOnly}
              />
            </div>
          </div>
        </div>

        <div className={classes.control}>
          <div className={classes.row}>
            <div className={classes.column}>
              <FormLabel fontWeight="bold" htmlFor="invoiceNumber">
                Invoice number
              </FormLabel>
            </div>
            <div className={classes.column}>
              <FormLabel fontWeight="bold" htmlFor="projectIdentifier">
                Project identifier
              </FormLabel>
            </div>
          </div>

          <div className={classes.row}>
            <div className={classes.column}>
              <Input
                type="text"
                id="invoiceNumber"
                placeholder="Enter the invoice number"
                readOnly={props.isReadOnly}
                {...register("invoiceNumber", { required: true })}
              />
              {errors.invoiceNumber && (
                <span style={{ color: "yellow", fontWeight: "bold" }}>
                  This field is required
                </span>
              )}
            </div>
            <div className={classes.column}>
              <Input
                type="text"
                id="projectIdentifier"
                placeholder="Enter the project identifier"
                readOnly={props.isReadOnly}
                {...register("projectIdentifier", { required: true })}
              />
              {errors.projectIdentifier && (
                <span style={{ color: "yellow", fontWeight: "bold" }}>
                  This field is required
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
      <Card className={`${classes.invoiceDeeperForm} cardBreak`}>
        <InvoiceItems isReadOnly={props.isReadOnly} invoiceItems={props.invoice?.meta}/>
      </Card>

      <div className={`${classes.control} noBreakInside`}>
        <div className={classes.row}>
          <div className={classes.column} />
          <div className={classes.column}>
            <FormLabel fontWeight="bold" htmlFor="projectIdentifier">
              Invoice Total
            </FormLabel>
          </div>
          <div className={classes.column} />
        </div>

        <div className={classes.row}>
          <div className={classes.column} />
          <div className={classes.column}>
            <Input
              type="text"
              id="invoiceTotal"
              placeholder="$0.0"
              required
              readOnly={true}
              value={formatter.format(total)}
            />
          </div>
          <div className={classes.column} />
        </div>
      </div>

      {!props.isReadOnly && (
        <div className={classes.actions}>
          {!props.isLoading && (
            <Button
              type="submit"
              id="createInvoiceButton"
              onClick={handleSubmit(submitHandler)}
            >
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
    </FormProvider>
  );
};

export default InvoiceForm;
