import { Category } from "../categoryAPI/types.ts";
import { Tag } from "../tagsAPI/types.ts";
import { SecretLevel } from "../secretLevelAPI/types.ts";

export interface DocumentType {
  id: number;
  name: string;
  fileName: string;
  type: FileType;
  documentPartNumber: string;
  docType: Tag;
  classification: Classification;
  revision: string;
  isFinal: boolean;
  revisionGroup: string;
  updateDate: Date;
  createdBy: User;
  processOwner: User;
  dcoNumber: string;
  category: Category;
  secretLevel: SecretLevel;
  tags: DocumentTag[] | Tag[];
  department: string;
  nextReview: Date;
  signatures: DocumentSignature[];
  updatedBy: string;
}

export enum FileType {
  PDF = "PDF",
  DOCX = "DOCX",
  XLSX = "XLSX",
  PPTX = "PPTX",
  PNG = "PNG",
  JPG = "JPG",
  EXCEL = "EXCEL",
  WORD = "WORD",
}

export enum Classification {
  PUBLIC = "PUBLIC",
  INTERNAL = "INTERNAL",
  CONFIDENTIAL = "CONFIDENTIAL",
  SECRET = "SECRET",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
}

export enum SignatureStatus {
  USER = "PENDING",
  ADMIN = "SIGNED",
  SYSTEM_ADMIN = "REJECTED",
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface DocumentTag {
  tagId: number;
  documentId: number;
  tag: Tag;
}

export interface DocumentSignature {
  id: number;
  documentId: number;
  document: DocumentType;
  userId: number;
  user: User;
  status: SignatureStatus;
  signedAt: Date;
}

export type GetAllDocumentsResponse = { data: DocumentType[]; total: number };
