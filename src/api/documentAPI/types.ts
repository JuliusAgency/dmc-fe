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

export type GetAllDocumentsResponse = { data: DocumentType[]; total: number };
