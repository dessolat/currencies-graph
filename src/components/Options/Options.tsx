import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Stack } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { type THandleDateChange, type THandleCurrencyChange, type TCurrenciesSelection } from 'types';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

type Props = {
  currenciesSelection: TCurrenciesSelection[];
  handleCurrencyChange: THandleCurrencyChange;
  dateFrom: string;
  dateTo: string;
  handleDateChange: THandleDateChange;
};

const Options = ({
  currenciesSelection,
  handleCurrencyChange,
  dateFrom,
  dateTo,
  handleDateChange
}: Props) => {
  const datesOptions: { label: string; field: 'dateFrom' | 'dateTo' }[] = [
    { label: 'Дата с:', field: 'dateFrom' },
    { label: 'Дата по:', field: 'dateTo' }
  ];

  return (
    <Box width={160} minWidth={160}>
      <Stack height='100%' justifyContent='space-between'>
        <FormControl component='fieldset' variant='standard'>
          <FormGroup>
            <FormLabel component='legend' focused={false}>
              Выберите валюту:
            </FormLabel>
            {currenciesSelection.map(({ label, name, checked, color }) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleCurrencyChange}
                    name={name}
                    sx={{
                      color,
                      '&.Mui-checked': {
                        color
                      }
                    }}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>
        <FormControl component='fieldset' variant='standard'>
          <FormLabel component='legend'>Выберите дату:</FormLabel>
          {datesOptions.map(({ field, label }) => (
            <Stack key={field} direction='row' alignItems='center' justifyContent='space-between' mt={1}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                <DatePicker
                  sx={{
                    width: 145
                  }}
                  slotProps={{ textField: { size: 'small' } }}
                  value={dayjs(field === 'dateFrom' ? dateFrom : dateTo)}
                  views={['year', 'month', 'day']}
                  onChange={handleDateChange(field)}
                  maxDate={dayjs(new Date())}
                  label={label}
                />
              </LocalizationProvider>
            </Stack>
          ))}
        </FormControl>
      </Stack>
    </Box>
  );
};
export default Options;
