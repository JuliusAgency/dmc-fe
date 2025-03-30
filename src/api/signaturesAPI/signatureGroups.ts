import { API } from "../API.ts";
import { SignatureGroup } from "./types.ts";
import { SignatureGroupEndpoints } from "./consts.ts";

export const getAllSignatureGroups = async (): Promise<SignatureGroup[]> => {
  const { data } = await API.get(SignatureGroupEndpoints.getAll);
  return data;
};

export const getSignatureGroupById = async (
  id: number
): Promise<SignatureGroup> => {
  const { data } = await API.get(SignatureGroupEndpoints.getById(id));
  return data;
};

export const createSignatureGroup = async (group: {
  name: string;
  userIds: number[];
}) => {
  return API.post(SignatureGroupEndpoints.create, group);
};

export const updateSignatureGroup = async (
  id: number,
  group: {
    name: string;
    userIds: number[];
  }
) => {
  return API.put(SignatureGroupEndpoints.update(id), group);
};

export const deleteSignatureGroup = async (id: number) => {
  return API.delete(SignatureGroupEndpoints.delete(id));
};
