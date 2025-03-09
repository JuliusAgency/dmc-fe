import { GridColDef } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";
import { Chip, Stack } from "@mui/material";
import { DocumentTag } from "../../api/documentAPI/types.ts";

export const COLUMNS: GridColDef[] = [
    {
        field: "name",
        headerName: "Name",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "projectCode",
        headerName: "Project Code",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "updateDate",
        headerName: "Update Date",
        headerAlign: "center",
        align: "center",
        width: 150,
        valueGetter: (params) => formatDate(params.value),
    },
    {
        field: "revision",
        headerName: "Revision",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "revisionGroup",
        headerName: "Revision Group",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "secretLevel",
        headerName: "Secret Level",
        headerAlign: "center",
        align: "center",
        width: 150,
        valueGetter: (params) => params?.value?.name ?? ''
    },
    {
        field: "category",
        headerName: "Category",
        headerAlign: "center",
        align: "center",
        width: 150,
        valueGetter: (params) => params?.value?.name ?? ''
    },
    {
        field: "tags",
        headerName: "Tags",
        headerAlign: "center",
        align: "left",
        width: 200,
        renderCell: (params) => (
            <Stack direction="row" spacing={0.5}>
                {params?.value?.map((tag: DocumentTag, index: number) => (
                    <Chip key={index} label={tag.tag.name ?? ''} size="small"/>
                ))}
            </Stack>
        ),
    },
    {
        field: "isFinal",
        headerName: "Is Final",
        type: "boolean",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
];