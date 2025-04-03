import dayjs from "dayjs";

export const formatDate = (date: string) => {
  return dayjs(date).isValid() ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
};
