import { GenericTable } from "../../components/genericTable/genericTable";
import { COLUMNS } from "./consts.ts";
import { useGetAllDocuments, useGetFile } from "../../hooks/document/documentHooks.ts";
import { useCallback, useState, useEffect } from "react";
import { PaginationModel } from "../../consts/types.ts";
import { Button, Grid } from "@mui/material";
import { AddDocument } from "./components/addDocument/index.tsx";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { GridColDef } from "@mui/x-data-grid";

export const Document = () => {
    const [pagination, setPagination] = useState<PaginationModel>({ pageSize: 10, page: 0 });
    const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState<boolean>(false);
    const [fileNameToDownload, setFileNameToDownload] = useState<string | null>(null);

    const documentsQuery = useGetAllDocuments(pagination, { isFinal: true });
    const fileQuery = useGetFile(fileNameToDownload ?? "");

    const toggleAddDocumentModal = useCallback(() => {
        setIsAddDocumentModalOpen(!isAddDocumentModalOpen);
    }, [isAddDocumentModalOpen]);

    useEffect(() => {
        if (fileQuery.data) {
            const url = window.URL.createObjectURL(new Blob([fileQuery.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileNameToDownload ?? "");
            document.body.appendChild(link);
            link.click();
            link.remove();
            setFileNameToDownload(null);
        }
    }, [fileQuery.data, fileNameToDownload]);

    const handleOpenFile = (fileName: string) => {
        setFileNameToDownload(fileName);
    };

    const ACTION_COLUMN: GridColDef = {
        field: "action",
        headerName: "פעולות",
        headerAlign: "center",
        width: 150,
        align: "center",
        cellClassName: "socialMedia",
        renderCell: ({ row }) => {
            return (
                <Button variant="outlined" onClick={() => handleOpenFile(row.fileName)}>
                    <DownloadForOfflineIcon />
                </Button>
            );
        },
    };

    return (
        <Grid container display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
            <Grid item xs={12} display={'flex'} justifyContent={'flex-end'} alignItems={'start'}>
                <Button variant="outlined" onClick={toggleAddDocumentModal}>
                    הוספת מסמך
                </Button>
            </Grid>

            <GenericTable
                loading={documentsQuery.isLoading ?? false}
                columns={[...COLUMNS, ACTION_COLUMN]}
                pageSize={pagination.pageSize}
                handlePagination={setPagination}
                sx={{ bgcolor: "background.default", height: "60vh", mb: 3 , width: '90vw'}}
                totalCount={documentsQuery?.data?.total ?? 0}
                rows={documentsQuery?.data?.data ?? []}
            />
            <AddDocument open={isAddDocumentModalOpen} onClose={toggleAddDocumentModal} refetch={documentsQuery.refetch}/>
        </Grid>
    );
};