import { useEffect, useState } from "react";
import { useGetFile } from "../document/documentHooks";

export const useFileDownload = () => {
  const [fileNameToDownload, setFileNameToDownload] = useState<string | null>(
    null
  );
  const fileQuery = useGetFile(fileNameToDownload ?? "");

  useEffect(() => {
    if (fileQuery.data) {
      const url = window.URL.createObjectURL(new Blob([fileQuery.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileNameToDownload ?? "");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setFileNameToDownload(null);
    }
  }, [fileQuery.data, fileNameToDownload]);

  const handleDownloadFile = (fileName: string) => {
    setFileNameToDownload(fileName);
  };

  return { handleDownloadFile };
};
