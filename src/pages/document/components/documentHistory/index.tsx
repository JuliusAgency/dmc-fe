import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import { GenericTable } from "../../../../components/genericTable/genericTable";
import { useGetAllDocuments } from "../../../../hooks/document/documentHooks";
import { DocumentType } from "../../../../api/documentAPI/types";
import { PaginationModel } from "../../../../consts/types";
import {
  BUTTON_CLOSE,
  ARCHIVED_DOCUMENTS,
  getActionColumn,
  DOCUMENT_HISTORY_TITLE,
} from "./constants";
import { useFileDownload } from "../../../../hooks/utils/useFileDownload";
import { CONFIG } from "../../../../consts/config.ts";
import { useColumns } from "../../useColumns.tsx";
import { DisplaySignatures } from "../displaySignatures";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup.tsx";

interface DocumentHistoryProps {
  onClose: () => void;
  documentPartNumber: string;
  open: boolean;
}

export const DocumentHistory = ({
  onClose,
  documentPartNumber,
  open,
}: DocumentHistoryProps) => {
  const [historyRows, setHistoryRows] = useState<DocumentType[]>([]);
  const { id: categoryId } = useParams();

  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );

  const { handleDownloadFile } = useFileDownload();

  const handleViewFile = (fileName: string) => {
    if (!fileName) return;
    const fileUrl = new URL(`document/view/${fileName}`, CONFIG.BASE_URL).href;
    window.open(fileUrl, "_blank");
  };

  const documentsQuery = useGetAllDocuments(
    pagination,
    {
      status: ["ARCHIVED"],
      documentPartNumber,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    [
      "tags",
      "tags.tag",
      "category",
      "processOwner",
      "signatures",
      "signatures.user",
    ],
    ARCHIVED_DOCUMENTS(documentPartNumber)
  );

  const handleOpenSignatures = (doc: DocumentType) => {
    setSelectedDocument(doc);
  };

  const handleCloseSignatures = () => {
    setSelectedDocument(null);
  };

  useEffect(() => {
    if (documentsQuery.data?.data) {
      setHistoryRows(documentsQuery.data.data);
    }
  }, [documentsQuery.data]);

  const ACTION_COLUMN = getActionColumn(handleDownloadFile, handleViewFile);
  const COLUMNS = useColumns(handleOpenSignatures);

  return (
    <GenericPopup
      open={open}
      onClose={onClose}
      title={DOCUMENT_HISTORY_TITLE}
      cancelButtonText={BUTTON_CLOSE}
      fullScreen={true}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          height: "70vh",
          overflow: "auto",
        }}
      >
        <GenericTable
          loading={documentsQuery.isLoading ?? false}
          columns={[...COLUMNS, ACTION_COLUMN]}
          pageSize={pagination.pageSize}
          onPaginationModelChange={setPagination}
          sx={{
            width: "98%",
            height: "100%",
            border: "none",
            minWidth: "unset",
          }}
          rowCount={documentsQuery?.data?.total ?? 0}
          rows={historyRows}
          fileName="documents history"
        />

        {selectedDocument && (
          <DisplaySignatures
            open={Boolean(selectedDocument)}
            onClose={handleCloseSignatures}
            documentId={selectedDocument.id}
            signatures={selectedDocument.signatures || []}
          />
        )}
      </Box>
    </GenericPopup>
  );
};
