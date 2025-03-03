import { GenericTable } from "../../components/genericTable/genericTable";
import { COLUMNS } from "./consts.ts";
import { useGetAllDocuments } from "../../hooks/document/documentHooks.ts";
import { useCallback, useState } from "react";
import { PaginationModel } from "../../consts/types.ts";
import { Button, Grid } from "@mui/material";
import { AddDocument } from "./components/addDocument/index.tsx";

export const Document = () => {
    const [pagination, setPagination] = useState<PaginationModel>({ pageSize: 10, page: 0 });
    const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState<boolean>(false);

    const documentsQuery = useGetAllDocuments(pagination);

    const toggleAddDocumentModal = useCallback(() => {
        setIsAddDocumentModalOpen(!isAddDocumentModalOpen);
    }, [isAddDocumentModalOpen]);

    return (
        <Grid container display={'flex'} justifyContent={'center'}>
            <Button variant="outlined" onClick={toggleAddDocumentModal}>
                הוספת מסמך
            </Button>
            <GenericTable
                loading={documentsQuery.isLoading ?? false}
                columns={COLUMNS}
                pageSize={pagination.pageSize}
                handlePagination={setPagination}
                sx={{ bgcolor: "background.default", height: "60vh", mb: 3 }}
                totalCount={documentsQuery?.data?.total ?? 0}
                rows={documentsQuery?.data?.data ?? []}
            />
            <AddDocument open={isAddDocumentModalOpen} onClose={toggleAddDocumentModal} />
        </Grid>
    );
};