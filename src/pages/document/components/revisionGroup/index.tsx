import { Props } from "./types";
import { useGetAllDocuments } from "../../../../hooks/document/documentHooks.ts";
import { useState } from "react";
import { PaginationModel } from "../../../../consts/types.ts";
import { GenericTable } from "../../../../components/genericTable/genericTable.tsx";
import { useColumns } from "../../useColumns.tsx";
import { useParams } from "react-router-dom";
import { REVISION_GROUP_DOCUMENTS } from "./consts.ts";

export const RevisionGroup = ({ documentPartNumber }: Props) => {
  const { id: categoryId } = useParams();
  const [pagination, setPagination] = useState<PaginationModel>({
    pageSize: 5,
    page: 0,
  });

  const documentsQuery = useGetAllDocuments(
    pagination,
    {
      status: ["IN_PROGRESS"],
      documentPartNumber,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
    ["tags", "tags.tag", "category", "processOwner"],
    REVISION_GROUP_DOCUMENTS(documentPartNumber)
  );

  const COLUMNS = useColumns();

  return (
    <GenericTable
      loading={documentsQuery.isLoading ?? false}
      columns={COLUMNS}
      rows={documentsQuery.data?.data || []}
      rowCount={documentsQuery?.data?.total ?? 0}
      onPaginationModelChange={setPagination}
      hideFooterPagination={true}
      disableColumnMenu
      disableColumnFilter
      disableColumnSelector
      fileName="rivision"
      sx={{
        "& .MuiDataGrid-columnHeaders": { display: "none" },
        "& .MuiDataGrid-footerContainer": { display: "none" },
        border: "none",
        backgroundColor: "transparent",
        paddingLeft: "1.5%",
        width: "83%",
        maxWidth: "100%",
      }}
    />
  );
};
