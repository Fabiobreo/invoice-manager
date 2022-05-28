import { ChakraStylesConfig } from "chakra-react-select";

export const ClientChakraStyles: ChakraStylesConfig = {
  dropdownIndicator: (prev, { selectProps: { menuIsOpen } }) => ({
    ...prev,
    "> svg": {
      transitionDuration: "normal",
      transform: `rotate(${menuIsOpen ? -180 : 0}deg)`,
    },
  }),

  control: (provided) => ({
    ...provided,
    background: "#e3f2fd",
    font: "inherit",
    color: "#1976d2",
    borderRadius: "4px",
    border: "1px solid white",
    width: "100%",
    textAlign: "left",
    padding: "0.25rem",
  }),

  groupHeading: (provided) => ({
    ...provided,
    background: "#64b5f6",
    color: "white",
  }),

  group: (provided) => ({
    ...provided,
    background: "#e3f2fd",
    color: "#1976d2",
  }),
};
