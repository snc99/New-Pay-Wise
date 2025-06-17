export const formatRupiah = (value: number | string) => {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "Rp 0";

  return `Rp ${number.toLocaleString("id-ID")}`;
};
