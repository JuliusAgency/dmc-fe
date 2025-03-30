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
} from "../../api/signaturesAPI/signatureGroups.ts";
import { SignatureGroup } from "../../api/signaturesAPI/types.ts";

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
      queryClient.invalidateQueries({ queryKey: ["signatureGroups"] });
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
      queryClient.invalidateQueries({ queryKey: ["signatureGroups"] });
      queryClient.invalidateQueries({ queryKey: ["signatureGroup", id] });
    },
  });
};

export const useDeleteSignatureGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSignatureGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signatureGroups"] });
    },
  });
};
