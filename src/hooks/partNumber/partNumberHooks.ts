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
} from "../../api/partNumberAPI/partNumber";
import { PartNumber } from "../../api/partNumberAPI/types";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import {
  PART_NUMBER_CREATE_SUCCESS,
  PART_NUMBER_CREATE_ERROR,
  PART_NUMBER_DELETE_SUCCESS,
  PART_NUMBER_DELETE_ERROR,
} from "./constants";

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
      snackBarSuccess(PART_NUMBER_CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["getAllPartNumbers"] });
    },
    onError: () => {
      snackBarError(PART_NUMBER_CREATE_ERROR);
    },
  });
};

export const useDeletePartNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (partNumberId: number) => deletePartNumber(partNumberId),
    onSuccess: () => {
      snackBarSuccess(PART_NUMBER_DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["getAllPartNumbers"] });
    },
    onError: () => {
      snackBarError(PART_NUMBER_DELETE_ERROR);
    },
  });
};
