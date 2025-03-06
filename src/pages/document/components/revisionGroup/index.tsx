import { Props } from "./types";
import { Box, Button } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import {
  useGetAllDocuments,
  useRestoreRevision,
} from "../../../../hooks/document/documentHooks.ts";
import { useCallback, useState } from "react";
import { PaginationModel } from "../../../../consts/types.ts";
import { COLUMNS } from "./consts.tsx";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { useQueryClient } from "@tanstack/react-query";
import { GenericTable } from "../../../../components/genericTable/genericTable.tsx";

export const RevisionGroup = ({
  revisionGroup,
  refetchMainDocuments,
}: Props) => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 5,
    page: 0,
  });

  const documentsQuery = useGetAllDocuments(
    pagination,
    {
      isFinal: false,
      revisionGroup,
    },
    ["tags", "tags.tag", "category", "secretLevel"],
    "GetRevisionGroupDocuments"
  );

  const restoreRevision = useRestoreRevision();

  const handleRestoreRevision = useCallback(
    async (documentId: string) => {
      await restoreRevision.mutateAsync(documentId);
      await documentsQuery.refetch();
      await refetchMainDocuments();
    },
    [restoreRevision, queryClient]
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
        paddingLeft: 6,
      }}
    />
  );
};
