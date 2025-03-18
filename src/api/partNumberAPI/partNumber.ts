import { API } from "../API.ts";
import { PartNumber } from "./types.ts";
import { PartNumberEndpoints } from "./consts.ts";

export const getAllPartNumbers = async (): Promise<PartNumber[]> => {
  const { data } = await API.get(PartNumberEndpoints.getAllPartNumbers);

  return data;
};

export const createPartNumber = async (partNumber: Partial<PartNumber>) => {
  return API.post(PartNumberEndpoints.createPartNumber, partNumber);
};

export async function deletePartNumber(id: number) {
  await API.delete(PartNumberEndpoints.deletePartNumber(id));
}
