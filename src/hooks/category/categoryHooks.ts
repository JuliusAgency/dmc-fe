import {useQuery, UseQueryResult} from "react-query";
import {Category} from "../../api/categoryAPI/types.ts";
import {getAllCategories} from "../../api/categoryAPI/category.ts";

export const useGetAllCategories = (): UseQueryResult<Category[], Error> => {
    return useQuery(
        ["getAllCategories"],
        () => getAllCategories(),
        {
            refetchOnWindowFocus: false,
        },
    );
};