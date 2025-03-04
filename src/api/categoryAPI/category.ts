import {API} from "../API.ts";
import {Category} from "./types.ts";
import {CategoryEndpoints} from "./consts.ts";

export const getAllCategories = async (): Promise<Category[]> => {

    const {data} = await API.get(CategoryEndpoints.getAllCategories);

    return data;
};