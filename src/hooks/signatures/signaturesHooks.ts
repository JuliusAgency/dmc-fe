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
} from "../../api/signaturesAPI/signatures";
import { Signature } from "../../api/signaturesAPI/types";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import {
  SIGNATURES_ADD_SUCCESS,
  SIGNATURES_ADD_ERROR,
  SIGNATURES_SIGN_SUCCESS,
  SIGNATURES_SIGN_ERROR,
  SIGNATURES_REJECT_SUCCESS,
  SIGNATURES_REJECT_ERROR,
} from "./constants";

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
      snackBarSuccess(SIGNATURES_ADD_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["getSignatures", documentId],
      });
    },
    onError: () => {
      snackBarError(SIGNATURES_ADD_ERROR);
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
      snackBarSuccess(SIGNATURES_SIGN_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["getSignatures", documentId],
      });
    },
    onError: () => {
      snackBarError(SIGNATURES_SIGN_ERROR);
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
      snackBarSuccess(SIGNATURES_REJECT_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: ["getSignatures", documentId],
      });
    },
    onError: () => {
      snackBarError(SIGNATURES_REJECT_ERROR);
    },
  });
};

export const useGetPendingSignatures = (
  userId: number
): UseQueryResult<Signature[], Error> => {
  return useQuery({
    queryKey: ["pendingSignatures", userId],
    queryFn: () => getPendingSignatures(userId),
    refetchOnWindowFocus: false,
  });
};
