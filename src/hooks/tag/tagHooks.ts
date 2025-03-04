import {useQuery, UseQueryResult} from "react-query";
import {getAllTags} from "../../api/tagsAPI/tag.ts";
import {Tag} from "../../api/tagsAPI/types.ts";

export const useGetAllTags = (): UseQueryResult<Tag[], Error> => {
    return useQuery(
        ["getAllTags"],
        () => getAllTags(),
        {
            refetchOnWindowFocus: false,
        },
    );
};