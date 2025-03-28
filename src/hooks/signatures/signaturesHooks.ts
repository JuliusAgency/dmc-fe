import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getSignaturesForDocument,
  addSignersToDocument,
  signDocument,
  rejectSignature,
  getPendingSignatures,
} from "../../api/signaturesAPI/signatures.ts";
import { Signature } from "../../api/signaturesAPI/types.ts";

export const useGetSignaturesForDocument = (
  documentId: number
): UseQueryResult<Signature[], Error> => {
  return useQuery({
    queryKey: ["getSignatures", documentId],
    queryFn: () => getSignaturesForDocument(documentId),
    refetchOnWindowFocus: false,
  });
};

export const useAddSignersToDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      userIds,
    }: {
      documentId: number;
      userIds: number[];
    }) => addSignersToDocument(documentId, userIds),
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["getSignatures", documentId],
      });
    },
  });
};

export const useSignDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      userId,
    }: {
      documentId: number;
      userId: number;
    }) => signDocument(documentId, userId),
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["getSignatures", documentId],
      });
    },
  });
};

export const useRejectSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      userId,
      rejectReason,
    }: {
      documentId: number;
      userId: number;
      rejectReason: string;
    }) => rejectSignature(documentId, userId, rejectReason),
    onSuccess: (_, { documentId }) => {
      queryClient.invalidateQueries({
        queryKey: ["getSignatures", documentId],
      });
    },
  });
};

export const useGetPendingSignatures = (userId: number) => {
  return useQuery({
    queryKey: ["pendingSignatures", userId],
    queryFn: () => getPendingSignatures(userId),
    refetchOnWindowFocus: false,
  });
};
