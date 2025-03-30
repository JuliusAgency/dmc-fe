import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getAllSignatureGroups,
  getSignatureGroupById,
  createSignatureGroup,
  updateSignatureGroup,
  deleteSignatureGroup,
} from "../../api/signaturesAPI/signatureGroups";
import { SignatureGroup } from "../../api/signaturesAPI/types";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import {
  SIGNATURE_GROUP_CREATE_SUCCESS,
  SIGNATURE_GROUP_CREATE_ERROR,
  SIGNATURE_GROUP_UPDATE_SUCCESS,
  SIGNATURE_GROUP_UPDATE_ERROR,
  SIGNATURE_GROUP_DELETE_SUCCESS,
  SIGNATURE_GROUP_DELETE_ERROR,
} from "./constants";

export const useGetAllSignatureGroups = (): UseQueryResult<
  SignatureGroup[],
  Error
> => {
  return useQuery({
    queryKey: ["signatureGroups"],
    queryFn: getAllSignatureGroups,
    refetchOnWindowFocus: false,
  });
};

export const useGetSignatureGroupById = (
  id: number
): UseQueryResult<SignatureGroup, Error> => {
  return useQuery({
    queryKey: ["signatureGroup", id],
    queryFn: () => getSignatureGroupById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateSignatureGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSignatureGroup,
    onSuccess: () => {
      snackBarSuccess(SIGNATURE_GROUP_CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["signatureGroups"] });
    },
    onError: () => {
      snackBarError(SIGNATURE_GROUP_CREATE_ERROR);
    },
  });
};

export const useUpdateSignatureGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      group,
    }: {
      id: number;
      group: { name: string; userIds: number[] };
    }) => updateSignatureGroup(id, group),
    onSuccess: (_, { id }) => {
      snackBarSuccess(SIGNATURE_GROUP_UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["signatureGroups"] });
      queryClient.invalidateQueries({ queryKey: ["signatureGroup", id] });
    },
    onError: () => {
      snackBarError(SIGNATURE_GROUP_UPDATE_ERROR);
    },
  });
};

export const useDeleteSignatureGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSignatureGroup,
    onSuccess: () => {
      snackBarSuccess(SIGNATURE_GROUP_DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["signatureGroups"] });
    },
    onError: () => {
      snackBarError(SIGNATURE_GROUP_DELETE_ERROR);
    },
  });
};
