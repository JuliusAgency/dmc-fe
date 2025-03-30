import { SearchReturnType } from "../../api/searchAPI/search";
import { Document } from "../../pages/pendingSignatures/types";

export function getNameFromSearchResult(result: SearchReturnType) {
  if (result.table === "Document") {
    return (result.value as Document).name || "";
  }

  return "";
}

export function getUrlFromSearchResult(result: SearchReturnType) {
  if (result.table === "Document") {
    return `/category/${(result.value as Document).categoryId || ""}`;
  }

  return "";
}
