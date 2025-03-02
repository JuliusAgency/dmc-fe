import daysjs from "dayjs";

export const formatDate = (date: string) => {
  return daysjs(date).isValid() ? daysjs(date).format("DD/MM/YYYY") : "";
}