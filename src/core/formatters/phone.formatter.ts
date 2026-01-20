export function formatPhone(phone: string) {
  return phone.replace(/(\d{4})(\d{6})/, "$1-$2");
}
