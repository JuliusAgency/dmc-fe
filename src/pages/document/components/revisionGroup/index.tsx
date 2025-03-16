import { Props } from "./types";
import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid-pro";
import {
  useGetAllDocuments,
  useRestoreRevision,
} from "../../../../hooks/document/documentHooks.ts";
import { useCallback, useState } from "react";
import { PaginationModel } from "../../../../consts/types.ts";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { useQueryClient } from "@tanstack/react-query";
import { GenericTable } from "../../../../components/genericTable/genericTable.tsx";
import { COLUMNS } from "../../consts.tsx";
import { DocumentType } from "../../../../api/documentAPI/types.ts";
import { useParams } from "react-router-dom";

export const RevisionGroup = ({ revisionGroup, rows, setRows }: Props) => {
  const queryClient = useQueryClient();
  const { id: categoryId } = useParams();
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 5,
    page: 0,
  });

  const documentsQuery = useGetAllDocuments(
    pagination,
    {
      isFinal: false,
      revisionGroup,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    ["tags", "tags.tag", "category", "processOwner"],
    "GetRevisionGroupDocuments"
  );

  const restoreRevision = useRestoreRevision();

  const handleRestoreRevision = useCallback(
    async (documentId: string) => {
      const restoredDocument = documentsQuery?.data?.data.find(
        (doc) => doc.id === parseInt(documentId)
      );
      const mainDocumentIndex = rows.findIndex(
        (doc: DocumentType) => doc.revisionGroup === revisionGroup
      );

      if (!restoredDocument) return;

      const updatedRows = [...rows];

      // Replace main document with the restored revision
      updatedRows[mainDocumentIndex] = { ...restoredDocument, isFinal: true };

      // Update the state
      setRows(updatedRows);

      await restoreRevision.mutateAsync(documentId);
      await documentsQuery.refetch();
    },
    [restoreRevision, queryClient, rows]
  );

  const ACTION_COLUMN: GridColDef = {
    field: "action",
    headerName: "",
    width: 80,
    align: "center",
    cellClassName: "socialMedia",
    renderCell: ({ row }) => (
      <Button
        variant="outlined"
        onClick={() => handleRestoreRevision(row.id)}
        disabled={restoreRevision.isLoading}
      >
        <SettingsBackupRestoreIcon />
      </Button>
    ),
  };

  return (
    <GenericTable
      loading={documentsQuery.isLoading ?? false}
      columns={[...COLUMNS, ACTION_COLUMN]}
      rows={documentsQuery?.data?.data ?? []}
      rowCount={documentsQuery?.data?.total ?? 0}
      onPaginationModelChange={setPagination}
      hideFooterPagination={true}
      disableColumnMenu
      disableColumnFilter
      disableColumnSelector
      sx={{
        "& .MuiDataGrid-columnHeaders": { display: "none" },
        "& .MuiDataGrid-footerContainer": { display: "none" },
        border: "none",
        backgroundColor: "transparent",
        width: "auto",
        height: "auto",
        paddingLeft: "1.5%",
      }}
    />
  );
};
