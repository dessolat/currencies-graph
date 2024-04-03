import { Container, Paper, Stack, Typography } from '@mui/material';
import Graph from 'components/Graph/Graph';
import Options from 'components/Options/Options';
import { type THandleDateChange, type THandleCurrencyChange, type TCurrenciesSelection } from 'types';
import { useState } from 'react';
import dayjs from 'dayjs';
import { getSlicedDate } from 'utils';
import useCurrenciesByDates from 'hooks/useCurrenciesByDates';

function App() {
  const [currenciesSelection, setCurrenciesSelection] = useState<TCurrenciesSelection[]>([
    { label: 'Евро', name: 'eur', checked: false, color: 'blue' },
    { label: 'Доллар', name: 'usd', checked: false, color: 'green' },
    { label: 'Юань', name: 'cny', checked: false, color: 'purple' }
  ]);

  const [dateFrom, setDateFrom] = useState<string>(() =>
    dayjs(new Date()).subtract(6, 'day').format('YYYY-MM-DD')
  );
  const [dateTo, setDateTo] = useState<string>(() => getSlicedDate(new Date()));

  const [currenciesData, isLoading, error, getNewData, apiRequestsCount] = useCurrenciesByDates(
    dateFrom,
    dateTo,
    currenciesSelection
  );

  const handleCurrencyChange: THandleCurrencyChange = (e, checked) => {
    setCurrenciesSelection(prev => prev.map(cur => (cur.name === e.target.name ? { ...cur, checked } : cur)));
  };

  const handleDateChange: THandleDateChange = name => value => {
    if (!value) return;

    const stringValue = value.format('YYYY-MM-DD');

    if (name === 'dateFrom') {
      if (stringValue > dateTo) setDateTo(stringValue);
      setDateFrom(stringValue);
      getNewData(stringValue, stringValue > dateTo ? stringValue : dateTo);
      return;
    }

    if (stringValue < dateFrom) setDateFrom(stringValue);
    setDateTo(stringValue);
    getNewData(stringValue < dateFrom ? stringValue : dateFrom, stringValue);
  };

  return (
    <section>
      <Container>
        <Paper elevation={4} sx={{ p: 3, mx: 'auto', mt: 5, maxWidth: 750 }}>
          <Stack direction='row' justifyContent='space-between' spacing={2}>
            <Options
              currenciesSelection={currenciesSelection}
              handleCurrencyChange={handleCurrencyChange}
              dateFrom={dateFrom}
              dateTo={dateTo}
              handleDateChange={handleDateChange}
            />
            <Graph
              currenciesData={currenciesData}
              currenciesSelection={currenciesSelection}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </Stack>
          <Stack direction='row' justifyContent='space-between' mt={4}>
            <Typography>Число запросов в API: {apiRequestsCount}</Typography>
            <Typography>{isLoading ? 'Получение данных...' : error ?? ''}</Typography>
          </Stack>
        </Paper>
      </Container>
    </section>
  );
}

export default App;
