import { API } from "../API.ts";
import { Signature } from "./types.ts";
import { SignatureEndpoints } from "./consts.ts";
import { SentSignatureType } from "../../pages/signature/components/sentSignatureStatus/types.ts";

export const getSignaturesForDocument = async (
  documentId: number
): Promise<Signature[]> => {
  const { data } = await API.get(SignatureEndpoints.getSignatures(documentId));
  return data;
};

export const addSignersToDocument = async (
  documentId: number,
  userIds: number[]
) => {
  return API.post(SignatureEndpoints.addSigners(documentId), { userIds });
};

export const signDocument = async (
  documentId: number,
  userId: number,
  signReason: string
) => {
  return API.post(SignatureEndpoints.signDocument(documentId, userId), {
    signReason,
  });
};

export const rejectSignature = async (
  documentId: number,
  userId: number,
  rejectReason: string
) => {
  return API.post(SignatureEndpoints.rejectSignature(documentId, userId), {
    rejectReason,
  });
};

export const getPendingSignatures = async (
  userId: number
): Promise<Signature[]> => {
  const { data } = await API.get(
    SignatureEndpoints.getPendingSignatures(userId)
  );
  return data;
};

export const getSentSignatures = async (
  userId: number
): Promise<SentSignatureType[]> => {
  const { data } = await API.get(SignatureEndpoints.getSentSignatures(userId));
  return data;
};
