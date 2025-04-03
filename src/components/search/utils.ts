import { SearchReturnType } from "../../api/searchAPI/search";
import { Document } from "../../pages/signature/types";

export function getNameFromSearchResult(result: SearchReturnType): string {
  if (result.table === "Document" && result.value) {
    console.log(result);
    return (result.value as Document).name || "";
  }
  return "";
}

export function getUrlFromSearchResult(result: SearchReturnType): string {
  if (result.table === "Document" && result.value) {
    const categoryId = (result.value as Document).categoryId;
    return categoryId ? `/category/${categoryId}` : "";
  }
  return "";
}
