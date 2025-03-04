import { Autocomplete, Grid, SxProps, Chip } from "@mui/material";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";


export type Option = {
  id: number
  name: string
}

export interface AutocompleteData {
  label: string;
  accessorId: string;
  options: Option[];
}

export interface GridMultipleAutocompleteProps {
  selectorData: AutocompleteData;
  value: Option[] | undefined | Option | null;
  onChange: (newValue: Option[] | Option) => void;
  gridSize?: number;
  size?: "small" | "medium" | undefined;
  disabled?: boolean;
  multiple?: boolean;
  required?: boolean;
  name?: string;
  sx?: SxProps;
}

const StyledChip = styled(Chip)({
    '& .MuiChip-deleteIcon': {
        marginLeft: '2px', // Adjust this value to move the cancel button
    },
});

export const GridMultipleAutocomplete = ({
  selectorData,
  gridSize = 2,
  value,
  onChange,
  size,
  disabled = false,
  multiple = true,
  required = false,
  name,
  sx,
}: GridMultipleAutocompleteProps) => {


    return (
    <Grid item xs={gridSize}>
      <Autocomplete
        disabled={disabled}
        multiple={multiple}
        isOptionEqualToValue={(option: Option, value: Option): boolean =>
          option.id === value.id
        }
        size={size}
        value={value}
        id={`${selectorData.accessorId}-multiple-autocomplete`}
        options={selectorData.options}
        getOptionLabel={(option: Option) => (option?.name ?? '') ?? "לא צוין"}
        onChange={(_: any, newValue: Option[] | null | Option): void => {
          onChange(newValue!);
        }}
        renderTags={(value: Option[], getTagProps) =>
            value.map((option: Option, index: number) => (
                <StyledChip
                    label={option.name ?? ''}
                    {...getTagProps({ index })}
                />
            ))
      }
        renderInput={(params) => (
          <TextField
            sx={{ ...sx }}
            required={required}
            name={name}
            {...params}
            variant="outlined"
            label={selectorData.label}
          />
        )}
      />
    </Grid>
  );
};
