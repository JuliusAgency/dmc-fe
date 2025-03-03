import {GridColDef} from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";


export const COLUMNS: GridColDef[] = [
    {
        field: "name",
        headerName: "שם",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "fileName",
        headerName: "שם קובץ",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "format",
        headerName: "פורמט",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "projectCode",
        headerName: "קוד פרויקט",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "createDate",
        headerName: "תאריך יצירה",
        headerAlign: "center",
        align: "center",
        width: 150,
        valueGetter: (params) => formatDate(params.value),
    },
    {
        field: "updateDate",
        headerName: "תאריך עדכון",
        headerAlign: "center",
        align: "center",
        width: 150,
        valueGetter: (params) => formatDate(params.value),
    },
    {
        field: "revision",
        headerName: "גרסה",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
    {
        field: "isFinal",
        headerName: "סופי",
        headerAlign: "center",
        align: "center",
        type: "boolean",
        width: 150,
    },
    {
        field: "revisionGroup",
        headerName: "קבוצת גרסאות",
        headerAlign: "center",
        align: "center",
        width: 150,
    },
];