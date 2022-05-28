import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import classes from "./InvoiceForm.module.css";

export type InvoiceItem = {
  invoiceItem: {
    item: string;
    price: number;
  }[];
};

const InvoiceItems: React.FC<{
  invoiceItems?: Record<string, number>;
  isReadOnly: boolean;
}> = (props) => {
  const {
    register,
    control,
    formState: { errors },
    reset,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: "invoiceItem",
    control,
  });

  useEffect(() => {
    if (props.invoiceItems) {
      let propsInvoiceItems = [];
      for (let key in props.invoiceItems) {
        propsInvoiceItems.push({
          item: key,
          price: props.invoiceItems[key].toString(),
        });
      }

      reset({
        invoiceItem: propsInvoiceItems,
      });
    }
  }, [props.isReadOnly]);

  return (
    <form className={classes.control}>
      <div className={classes.control}>
        <Center>
          <FormLabel size="lg" fontWeight="bold">
            Invoice Items
          </FormLabel>
        </Center>
      </div>
      {fields.map((field, index) => (
        <FormControl key={field.id} mt={1}>
          <div className={`${classes.row} noBreakInside`}>
            <div className={classes.column}>
              <FormLabel fontWeight="bold">Item</FormLabel>
            </div>
            <div className={classes.column}>
              <FormLabel fontWeight="bold">Price ($)</FormLabel>
            </div>
            {!props.isReadOnly && <div className={classes.deleteColumn} />}
          </div>

          <div className={`${classes.row} noBreakInside`}>
            <div className={classes.column}>
              <Input
                type="text"
                isReadOnly={props.isReadOnly}
                placeholder="Insert a new item"
                id={`invoiceItem${index}item`}
                {...register(`invoiceItem.${index}.item` as const, {
                  required: true,
                })}
              />
              {errors.invoiceItem?.[index]?.item && (
                <span style={{ color: "yellow", fontWeight: "bold" }}>
                  This field is required
                </span>
              )}
            </div>
            <div className={classes.column}>
              <NumberInput
                placeholder="0.0"
                isReadOnly={props.isReadOnly}
                precision={2}
              >
                <NumberInputField
                  required
                  id={`invoiceItem${index}price`}
                  {...register(`invoiceItem.${index}.price` as const, {
                    valueAsNumber: true,
                    required: true,
                    min: 0.01,
                  })}
                />
              </NumberInput>
              {errors.invoiceItem?.[index]?.price && (
                <span style={{ color: "yellow", fontWeight: "bold" }}>
                  This field is required
                </span>
              )}
            </div>
            {!props.isReadOnly && (
              <div className={classes.deleteColumn}>
                {index ? (
                  <Button
                    type="button"
                    h="2.25rem"
                    w="7rem"
                    size="md"
                    background="#64b5f6"
                    color="white"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </FormControl>
      ))}
      {!props.isReadOnly && (
        <div>
          <Button
            mt={4}
            h="2.25rem"
            w="7rem"
            size="md"
            background="#64b5f6"
            color="white"
            type="button"
            onClick={() =>
              append({
                item: "",
                price: 0.0,
              })
            }
          >
            Add
          </Button>
        </div>
      )}
    </form>
  );
};

export default InvoiceItems;
