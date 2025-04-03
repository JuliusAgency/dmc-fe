import { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import {
  useGetMyReports,
  useAnswerReport,
  useDeleteReport,
} from "../../hooks/report/reportHooks";
import { GenericTable } from "../../components/genericTable/genericTable";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import {
  REPORTS_PAGE_TITLE,
  REPORTS_RESPOND_DIALOG_TITLE,
  REPORTS_RESPOND_PLACEHOLDER,
  REPORTS_RESPOND_CANCEL,
  REPORTS_RESPOND_SUBMIT,
  REPORT_ANSWER_SUCCESS,
  REPORT_ANSWER_ERROR,
} from "./constants";
import { useReportColumns } from "./columns";
import { GenericPopup } from "../../components/genericPopup/genericPopup";

export const ReportsPage = () => {
  const { data, isLoading, refetch } = useGetMyReports();
  const answerMutation = useAnswerReport();
  const deleteMutation = useDeleteReport();

  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");

  const handleAnswerClick = (reportId: number, currentAnswer?: string) => {
    setSelectedReportId(reportId);
    setAnswerText(currentAnswer || "");
  };

  const handleSubmitAnswer = () => {
    if (!selectedReportId) return;

    answerMutation.mutate(
      { reportId: selectedReportId, response: answerText },
      {
        onSuccess: () => {
          snackBarSuccess(REPORT_ANSWER_SUCCESS);
          setSelectedReportId(null);
          refetch();
        },
        onError: () => {
          snackBarError(REPORT_ANSWER_ERROR);
        },
      }
    );
  };

  const handleDelete = (reportId: number) => {
    deleteMutation.mutate(reportId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const COLUMNS = useReportColumns(handleAnswerClick, handleDelete);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {REPORTS_PAGE_TITLE}
      </Typography>

      <GenericTable
        rows={data ?? []}
        columns={COLUMNS}
        loading={isLoading}
        pageSize={10}
        rowCount={data?.length || 0}
        onPaginationModelChange={() => {}}
      />

      <GenericPopup
        open={!!selectedReportId}
        onClose={() => setSelectedReportId(null)}
        title={REPORTS_RESPOND_DIALOG_TITLE}
        onConfirm={handleSubmitAnswer}
        onCancel={() => setSelectedReportId(null)}
        confirmButtonText={REPORTS_RESPOND_SUBMIT}
        cancelButtonText={REPORTS_RESPOND_CANCEL}
      >
        <TextField
          fullWidth
          multiline
          minRows={4}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder={REPORTS_RESPOND_PLACEHOLDER}
        />
      </GenericPopup>
    </Box>
  );
};
