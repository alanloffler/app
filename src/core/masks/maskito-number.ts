import { maskitoNumberOptionsGenerator } from "@maskito/kit";

export const numberMask = maskitoNumberOptionsGenerator({
  decimalSeparator: ",",
  maximumFractionDigits: 2,
  min: 0,
  thousandSeparator: "",
});
