import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";

import { GenericTable } from "../../../../components/genericTable/genericTable";
import { useGetAllDocuments } from "../../../../hooks/document/documentHooks";
import { DocumentType } from "../../../../api/documentAPI/types";
import { PaginationModel } from "../../../../consts/types";

import { COLUMNS, BUTTON_CLOSE, ARCHIVED_DOCUMENTS } from "./constants";

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

  const documentsQuery = useGetAllDocuments(
    pagination,
    {
      status: ["ARCHIVED"],
      documentPartNumber,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    ["tags", "tags.tag", "category", "processOwner"],
    ARCHIVED_DOCUMENTS(documentPartNumber)
  );

  useEffect(() => {
    if (documentsQuery.data?.data) {
      setHistoryRows(documentsQuery.data.data);
    }
  }, [documentsQuery.data]);

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
        columns={COLUMNS}
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
