import { Grid} from "@mui/system";
import { GenericTable } from "../../components/genericTable/genericTable";
import {COLUMNS} from "./consts.ts";
import {useGetAllDocuments} from "../../hooks/document/documentHooks.ts";
import {useState} from "react";
import {PaginationModel} from "../../consts/types.ts";

export const Document = () => {
    const [pageination, setPagination] = useState<PaginationModel>({ pageSize: 10, page: 1 })

    const documentsQuery = useGetAllDocuments({ pageSize: 10, page: 1 })


    return (
        <Grid container display={'flex'} justifyContent={'center'}>
            <GenericTable
                loading={documentsQuery.isLoading ?? false}
                columns={COLUMNS}
                pageSize={pageination.pageSize}
                handlePagination={setPagination}
                sx={{ bgcolor: "background.default", height: "60vh", mb: 3 }}
                totalCount={documentsQuery?.data?.total ?? 0}
                rows={documentsQuery?.data?.data ?? []}
            />
        </Grid>
    )
}