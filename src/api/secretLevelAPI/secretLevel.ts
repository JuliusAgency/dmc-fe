import {API} from "../API.ts";
import {SecretLevel} from "./types.ts";
import {SecretLevelEndpoints} from "./consts.ts";

export const getAllSecretLevels = async (): Promise<SecretLevel[]> => {

    const {data} = await API.get(SecretLevelEndpoints.getAllSecretLevels);

    return data;
};