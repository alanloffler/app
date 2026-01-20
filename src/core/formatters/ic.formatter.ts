export function formatIc(ic: string) {
  return ic.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3");
}
