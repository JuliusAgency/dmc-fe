import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getAllPartNumbers,
  createPartNumber,
  deletePartNumber,
} from "../../api/partNumberAPI/partNumber.ts";
import { PartNumber } from "../../api/partNumberAPI/types.ts";

export const useGetAllPartNumbers = (): UseQueryResult<PartNumber[], Error> => {
  return useQuery({
    queryKey: ["getAllPartNumbers"],
    queryFn: getAllPartNumbers,
    refetchOnWindowFocus: false,
  });
};

export const useCreatePartNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPartNumber: Partial<PartNumber>) =>
      createPartNumber(newPartNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPartNumbers"] });
    },
  });
};

export const useDeletePartNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partNumberId: number) => deletePartNumber(partNumberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllPartNumbers"] });
    },
  });
};
