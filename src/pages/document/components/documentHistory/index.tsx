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
  SIGNATURES_COLUMN,
  getActionColumn,
} from "./constants";
import { useFileDownload } from "../../../../hooks/utils/useFileDownload";
import { CONFIG } from "../../../../consts/config.ts";
import { useColumns } from "../../consts.tsx";

interface DocumentHistoryProps {
  onClose: () => void;
  documentPartNumber: string;
}

export const DocumentHistory = ({
  onClose,
  documentPartNumber,
}: DocumentHistoryProps) => {
  const [historyRows, setHistoryRows] = useState<DocumentType[]>([]);
  const { id: categoryId } = useParams();

  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const { handleDownloadFile } = useFileDownload();

  const handleViewFile = (fileName: string) => {
    if (!fileName) {
      return;
    }

    const fileUrl = `${CONFIG.BASE_URL}/document/view/${fileName}`;
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

  useEffect(() => {
    if (documentsQuery.data?.data) {
      setHistoryRows(documentsQuery.data.data);
    }
  }, [documentsQuery.data]);

  const ACTION_COLUMN = getActionColumn(handleDownloadFile, handleViewFile);
  const COLUMNS = useColumns();

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
