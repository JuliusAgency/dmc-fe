import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@mui/material'

interface Props {
  label: string
  size?: 'small' | 'large' | 'medium'
  gridSizeXL?: number
  value?: boolean
  readOnly?: boolean
  onChange?: (newValue: boolean) => void
  disabled?: boolean
  withoutWrapper?: boolean
}

const GridCheckbox = ({
  label,
  size = 'small',
  gridSizeXL = 2,
  value,
  onChange = () => {},
  readOnly = false,
  disabled = false,
  withoutWrapper = false,
}: Props) => {
  return (
      <Grid item xs={gridSizeXL}>
        {withoutWrapper ? (
            <FormControlLabel
                control={
                  <Checkbox
                      disabled={disabled}
                      readOnly={readOnly}
                      onChange={(e) => onChange(e.target.checked)}
                      value={value}
                      checked={value}
                      size={size}
                  />
                }
                label={<Typography variant='body1'>{label}</Typography>}
            />
        ) : (
            <Box className='checkbox-wrapper'>
              <Checkbox
                  disabled={disabled}
                  readOnly={readOnly}
                  onChange={(e) => onChange(e.target.checked)}
                  value={value}
                  checked={value}
                  size='small'
              />
              {label}
            </Box>
        )}
      </Grid>
  )
}

export default GridCheckbox
