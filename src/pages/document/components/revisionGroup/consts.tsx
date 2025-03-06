import { GridColDef } from "@mui/x-data-grid";
import { formatDate } from "../../../../utils/formatDate.ts";
import { Chip, Stack } from "@mui/material";
import { DocumentTag } from "../../../../api/documentAPI/types.ts";

export const COLUMNS: GridColDef[] = [
  {
    field: "name",
    headerName: "שם",
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
    field: "",
    headerName: "",
    headerAlign: "center",
    align: "center",
    width: 150,
  },
  {
    field: "secretLevel",
    headerName: "רמת סיווג",
    headerAlign: "center",
    align: "center",
    width: 150,
    valueGetter: (params) => params?.value?.name ?? "",
  },
  {
    field: "category",
    headerName: "קטגוריה",
    headerAlign: "center",
    align: "center",
    width: 150,
    valueGetter: (params) => params?.value?.name ?? "",
  },
  {
    field: "tags",
    headerName: "תגיות",
    headerAlign: "center",
    align: "left",
    width: 200,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5}>
        {params?.value?.map((tag: DocumentTag, index: number) => (
          <Chip key={index} label={tag.tag.name ?? ""} size="small" />
        ))}
      </Stack>
    ),
  },
  {
    field: "isFinal",
    headerName: "האם סופי",
    type: "boolean",
    headerAlign: "center",
    align: "center",
    width: 150,
  },
];
