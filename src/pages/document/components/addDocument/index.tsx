import { Box, Dialog, DialogContent, Grid, Button, Typography, IconButton } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { DocumentType } from "../../../../api/documentAPI/types.ts";
import GridInput from "../../../../components/gridItems/gridInput/GridInput.tsx";
import { Props } from "./types.ts";
import { GridCloseIcon } from "@mui/x-data-grid-pro";
import { useUploadDocument } from "../../../../hooks/document/documentHooks.ts";

export const AddDocument = ({ open, onClose }: Props) => {
    const { mutate: uploadDocument, isLoading: uploadingDocument } = useUploadDocument();

    const [formData, setFormData] = useState<Partial<DocumentType>>({
        name: "",
        fileName: "",
        format: "",
        projectCode: "",
        revision: "",
        isFinal: false,
        revisionGroup: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: keyof DocumentType, value: string | boolean | Date) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleRemoveCVFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleChangeCV = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                setFile(file);
            }
        },
        [],
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fileFormData = new FormData();
        if (file) {
            fileFormData.append("file", file);
        }
        fileFormData.append("entityData", JSON.stringify(formData));

        await uploadDocument(fileFormData);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                    <Grid
                        container
                        display={"flex"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                        height={"100%"}
                        spacing={1}
                    >
                        <GridInput
                            label="שם"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("name", value)}
                        />
                        <GridInput
                            label="שם קובץ"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("fileName", value)}
                        />
                        <GridInput
                            label="קוד פרויקט"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("projectCode", value)}
                        />
                        <GridInput
                            label="גרסה"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("revision", value)}
                        />
                        <GridInput
                            label="סופי"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("isFinal", value === "true")}
                        />
                        <GridInput
                            label="קבוצת גרסאות"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("revisionGroup", value)}
                        />
                    </Grid>
                    <Grid>
                        <Grid
                            item
                            xs={12}
                            py={2}
                            px={4}
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <input
                                accept={"application/pdf,.docx,.txt"}
                                style={{ display: "none" }}
                                type={"file"}
                                onChange={handleChangeCV}
                                id="raised-button-file"
                                ref={fileInputRef}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="outlined" component="span">
                                    העלה קובץ
                                </Button>
                            </label>

                            {file && (
                                <Box display={"flex"} alignItems={"center"} pt={0.5}>
                                    <Typography variant={"caption"}>{file.name}</Typography>
                                    <IconButton size={"small"} onClick={handleRemoveCVFile}>
                                        <GridCloseIcon sx={{ fontSize: "15px" }} color={"warning"} />
                                    </IconButton>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" fullWidth={true} disabled={uploadingDocument}>
                        שמור
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};