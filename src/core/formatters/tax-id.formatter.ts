export function formatTaxId(taxId: string) {
  return taxId.replace(/(\d{2})(\d{8})(\d{1})/, "$1-$2-$3");
}
