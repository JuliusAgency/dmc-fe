import { Box, Dialog, DialogContent, Grid, Button, Typography, IconButton } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentType } from "../../../../api/documentAPI/types.ts";
import GridInput from "../../../../components/gridItems/gridInput/GridInput.tsx";
import { Props } from "./types.ts";
import { GridCloseIcon } from "@mui/x-data-grid-pro";
import { useCreateDocument, useUploadDocument } from "../../../../hooks/document/documentHooks.ts";
import {useGetAllCategories} from "../../../../hooks/category/categoryHooks.ts";
import {
    GridMultipleAutocomplete, Option
} from "../../../../components/gridItems/gridMultipleAutocomplete/GridMultipleAutocomplete.tsx";
import {useGetAllTags} from "../../../../hooks/tag/tagHooks.ts";
import {useGetAllSecretLevels} from "../../../../hooks/secretLevel/tagHooks.ts";
import GridButton from "../../../../components/gridItems/gridButton/GridButton.tsx";

export const AddDocument = ({ open, onClose, refetch, documentToEdit }: Props) => {
    const { mutate: uploadDocument, isLoading: uploadingDocument } = useUploadDocument();
    const createDocument = useCreateDocument();
    const {data: categories} = useGetAllCategories()
    const {data: tags} = useGetAllTags()
    const {data: secretLevel} = useGetAllSecretLevels()

    const [formData, setFormData] = useState<Partial<DocumentType>>({});
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (field: keyof DocumentType, value: string | boolean | Date | Option | Option[]) => {
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
                const allowedTypes = [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                ];
                if (allowedTypes.includes(file.type)) {
                    setFile(file);
                } else {
                    alert("Invalid file format. Please upload a PDF, Word, Excel, or Photo file.");
                }
            }
        },
        [],
    );

    const onCloseHandler = () => {
        handleRemoveCVFile();
        setFormData({});
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { id, updateDate, ...data } = formData;

        if (documentToEdit && !file) {
            await createDocument.mutateAsync({ ...data, isFinal: true } as DocumentType, {
                onSuccess: () => {
                    refetch();
                    onCloseHandler();
                },
            });

            return;
        }

        const fileFormData = new FormData();
        if (file) {
            fileFormData.append("file", file);
        }
        fileFormData.append("entityData", JSON.stringify(data));

        uploadDocument(fileFormData, {
            onSuccess: async () => {
                await refetch();
                onCloseHandler();
            },
        });
    };

    useEffect(() => {
        if (documentToEdit) {
            setFormData(documentToEdit);
        }
    }, [documentToEdit]);

    return (
        <Dialog open={open} onClose={onCloseHandler}>
            <DialogContent>
                <form onSubmit={handleSubmit} style={{ height: "100%", padding: 10 }}>
                    <Grid
                        container
                        display={"flex"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                        height={"100%"}
                        spacing={2}
                    >
                        <GridInput
                            required
                            label="שם"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("name", value)}
                            defaultValue={formData.name ?? ''}
                        />
                        <GridInput
                            required
                            label="קוד פרויקט"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("projectCode", value)}
                            defaultValue={formData.projectCode ?? ''}
                        />
                        <GridInput
                            required={Boolean(documentToEdit)}
                            label="קבוצת גרסאות"
                            gridSize={12}
                            gridSizeXL={12}
                            type="text"
                            onChange={(value) => handleInputChange("revisionGroup", value)}
                            defaultValue={formData.revisionGroup ?? ''}
                            disabled={Boolean(documentToEdit)}
                        />
                        <GridMultipleAutocomplete
                            onChange={(value) => handleInputChange("secretLevel", value)}
                            value={formData.secretLevel}
                            gridSize={12}
                            size={"medium"}
                            selectorData={{
                                label: "רמת סיווג",
                                accessorId: 'tags',
                                options: secretLevel || [],
                            }}
                        />
                        <GridMultipleAutocomplete
                            multiple={false}
                            onChange={(value) => handleInputChange("category", value)}
                            value={formData.category}
                            gridSize={12}
                            size={"medium"}
                            selectorData={{
                                label: "קטגוריה",
                                accessorId: 'categories',
                                options: categories || [],
                            }}
                        />
                        <GridMultipleAutocomplete
                            onChange={(value) => handleInputChange("tags", value)}
                            value={formData.category}
                            gridSize={12}
                            size={"medium"}
                            selectorData={{
                                label: "תגיות",
                                accessorId: 'tags',
                                options: tags || [],
                            }}
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
                                accept={"application/pdf,.docx,.doc,.xls,.xlsx,.jpg,.jpeg,.png,.gif"}
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
                                    <Typography variant={"caption"} style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {file.name}
                                    </Typography>
                                    <IconButton size={"small"} onClick={handleRemoveCVFile}>
                                        <GridCloseIcon sx={{ fontSize: "15px" }} color={"warning"} />
                                    </IconButton>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                    <GridButton buttonText={"שמור"} type="submit" variant="contained" fullWidth={true} gridSize={12} disabled={uploadingDocument}/>
                </form>
            </DialogContent>
        </Dialog>
    );
};