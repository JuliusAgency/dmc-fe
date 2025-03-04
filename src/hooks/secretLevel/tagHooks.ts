import {useQuery, UseQueryResult} from "react-query";
import {getAllSecretLevels} from "../../api/secretLevelAPI/secretLevel.ts";
import { SecretLevel } from "../../api/secretLevelAPI/types.ts";

export const useGetAllSecretLevels = (): UseQueryResult<SecretLevel[], Error> => {
    return useQuery(
        ["getAllSecretLevels"],
        () => getAllSecretLevels(),
        {
            refetchOnWindowFocus: false,
        },
    );
};