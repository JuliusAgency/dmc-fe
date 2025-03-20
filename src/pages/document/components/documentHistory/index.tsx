import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import { GenericTable } from "../../../../components/genericTable/genericTable";
import {
  useGetAllDocuments,
  useGetFile,
} from "../../../../hooks/document/documentHooks";
import { DocumentType } from "../../../../api/documentAPI/types";
import { PaginationModel } from "../../../../consts/types";
import {
  COLUMNS,
  BUTTON_CLOSE,
  ARCHIVED_DOCUMENTS,
  SIGNATURES_COLUMN,
  getActionColumn,
} from "./constants";
import { useTheme } from "@mui/material";

interface DocumentHistoryProps {
  onClose: () => void;
  documentPartNumber: string;
}

export const DocumentHistory = ({
  onClose,
  documentPartNumber,
}: DocumentHistoryProps) => {
  const [historyRows, setHistoryRows] = useState<DocumentType[]>([]);
  const [fileNameToDownload, setFileNameToDownload] = useState<string | null>(
    null
  );
  const { id: categoryId } = useParams();

  const fileQuery = useGetFile(fileNameToDownload ?? "");
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 10,
    page: 0,
  });

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

  useEffect(() => {
    if (documentsQuery.data?.data) {
      setHistoryRows(documentsQuery.data.data);
    }
  }, [documentsQuery.data]);

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

  const handleOpenFile = (fileName: string) => {
    setFileNameToDownload(fileName);
  };

  const ACTION_COLUMN = getActionColumn(handleOpenFile);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        bgcolor: "background.default",
        p: 3,
        borderRadius: 2,
      }}
    >
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          {BUTTON_CLOSE}
        </Button>
      </Grid>

      <GenericTable
        loading={documentsQuery.isLoading ?? false}
        columns={[...COLUMNS, SIGNATURES_COLUMN, ACTION_COLUMN]}
        pageSize={pagination.pageSize}
        onPaginationModelChange={setPagination}
        sx={{
          bgcolor: "background.default",
          height: "60vh",
          mb: 3,
          width: "100%",
        }}
        rowCount={documentsQuery?.data?.total ?? 0}
        rows={historyRows}
      />
    </Box>
  );
};
