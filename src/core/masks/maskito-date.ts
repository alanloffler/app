import { maskitoDateOptionsGenerator } from "@maskito/kit";

export const dateMask = maskitoDateOptionsGenerator({
  mode: "dd/mm/yyyy",
  separator: "/",
});
