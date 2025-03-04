import { Props } from "./types";
import { Box, Button, Grid } from "@mui/material";
import { GenericTable } from "../../../../components/genericTable/genericTable.tsx";
import { useGetAllDocuments, useRestoreRevision } from "../../../../hooks/document/documentHooks.ts";
import { useCallback, useState } from "react";
import { PaginationModel } from "../../../../consts/types.ts";
import { COLUMNS } from "./consts.tsx";
import { GridColDef } from "@mui/x-data-grid";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { useQueryClient } from "@tanstack/react-query";

export const RevisionGroup = ({ revisionGroup, refetchMainDocuments }: Props) => {
    const queryClient = useQueryClient();
    const [pagination, setPagination] = useState<PaginationModel>({ pageSize: 10, page: 0 });
    const documentsQuery = useGetAllDocuments(pagination, {
        isFinal: false,
        revisionGroup
    }, ["tags", "tags.tag", "category", "secretLevel"], "GetRevisionGroupDocuments");

    const restoreRevision = useRestoreRevision();

    const handleRestoreRevision = useCallback(async (documentId: string) => {
        await restoreRevision.mutateAsync(documentId);
        await documentsQuery.refetch();
        await refetchMainDocuments();
    }, [restoreRevision, queryClient]);

    const ACTION_COLUMN: GridColDef = {
        field: "action",
        headerName: "שחזור גרסא",
        headerAlign: "center",
        width: 150,
        align: "center",
        cellClassName: "socialMedia",
        renderCell: ({ row }) => {
            return (
                <Box display={'flex'} gap={1}>
                    <Button variant="outlined" onClick={() => handleRestoreRevision(row.id)} disabled={restoreRevision.isLoading}>
                        <SettingsBackupRestoreIcon />
                    </Button>
                </Box>
            );
        },
    };

    return (
        <Grid container display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} p={5}>
            <GenericTable
                loading={documentsQuery.isLoading ?? false}
                columns={[...COLUMNS, ACTION_COLUMN]}
                pageSize={pagination.pageSize}
                handlePagination={setPagination}
                sx={{ bgcolor: "background.default", height: "60vh", mb: 3 }}
                totalCount={documentsQuery?.data?.total ?? 0}
                rows={documentsQuery?.data?.data ?? []}
            />
        </Grid>
    );
};