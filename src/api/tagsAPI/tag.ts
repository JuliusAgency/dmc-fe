import { API } from "../API.ts";
import { Tag } from "./types.ts";
import { TagEndpoints } from "./consts.ts";

export const getAllTags = async (): Promise<Tag[]> => {
  const { data } = await API.get(TagEndpoints.getAllTags);

  return data;
};

export const createTag = async (name: string) => {
  return API.post(TagEndpoints.createTag, { name });
};

export async function deleteTag(id: number) {
  await API.delete(TagEndpoints.deleteTag(id));
}
