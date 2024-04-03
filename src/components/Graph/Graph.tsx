import { type TCurrenciesSelection, type TCurrencyData } from 'types';
import { TOPTIONS } from './types';

import { useMemo } from 'react';

import cl from './Graph.module.scss';

import { Box } from '@mui/material';

import Layout from './Layout';
import Labels from './Labels';
import LinesAndDots from './LinesAndDots';

type Props = {
  currenciesData: TCurrencyData[];
  currenciesSelection: TCurrenciesSelection[];
  dateFrom: string;
  dateTo: string;
};

const OPTIONS: TOPTIONS = {
  WIDTH: 450,
  HEIGHT: 300,
  LEFT_OFFSET: 37,
  BOTTOM_OFFSET: 37,
  RIGHT_OFFSET: 20,
  TOP_OFFSET: 20,
  FIRST_DATE_OFFSET: 20,
  FIRST_VALUE_OFFSET: 20,
  VALUE_LABELS_COUNT: 5
};

const Graph = ({ currenciesData, currenciesSelection, dateFrom, dateTo }: Props) => {
  const {
    VALUE_LABELS_COUNT,
    WIDTH,
    HEIGHT,
    TOP_OFFSET,
    BOTTOM_OFFSET,
    LEFT_OFFSET,
    RIGHT_OFFSET,
    FIRST_DATE_OFFSET
  } = OPTIONS;

  const currenciesDataInInterval = useMemo(
    () => currenciesData.filter(cur => cur.date >= dateFrom && cur.date <= dateTo),
    [currenciesData, dateFrom, dateTo]
  );

  console.log(currenciesDataInInterval);
  // Get needed currencies array
  const neededCurrencies = currenciesSelection.filter(cur => cur.checked).map(cur => cur.name);

  // Min/max values
  const minMaxInitialValues = neededCurrencies.reduce(
    (acc, cur) => {
      if (!acc.min || currenciesDataInInterval[0]?.values[cur] < acc.min)
        acc.min = currenciesDataInInterval[0]?.values[cur];
      if (!acc.max || currenciesDataInInterval[0]?.values[cur] > acc.max)
        acc.max = currenciesDataInInterval[0]?.values[cur];
      return acc;
    },
    { min: null, max: null } as { min: null | number; max: null | number }
  );

  const minMaxValues = currenciesDataInInterval.reduce((acc, cur) => {
    neededCurrencies.forEach(neededCur => {
      if (cur.values[neededCur] < acc.min) acc.min = cur.values[neededCur];
      if (cur.values[neededCur] > acc.max) acc.max = cur.values[neededCur];
    });

    return acc;
  }, minMaxInitialValues as { min: number; max: number });

  // Calculate values dimensions
  const labelsCount =
    currenciesDataInInterval.length > 1 || neededCurrencies.length > 1 ? VALUE_LABELS_COUNT : 1;
  const valuesLineLength = HEIGHT - BOTTOM_OFFSET - TOP_OFFSET - 2 * FIRST_DATE_OFFSET;
  const valueLineStep = labelsCount > 1 ? valuesLineLength / (labelsCount - 1) : 0;
  const valuesSiblingsDiff = labelsCount > 1 ? (minMaxValues.max - minMaxValues.min) / (labelsCount - 1) : 0;
  const valuesArray = new Array(labelsCount)
    .fill(null)
    .map((_, i) => (minMaxValues.min + valuesSiblingsDiff * i).toFixed(2));

  // Calculate date labels dimensions
  const dateLineLength = WIDTH - LEFT_OFFSET - RIGHT_OFFSET - 2 * FIRST_DATE_OFFSET;
  const dateLineStep = dateLineLength / (currenciesDataInInterval.length + 1);

	const isDrawGraph = neededCurrencies.length > 0 && currenciesDataInInterval.length > 0
  return (
    <Box sx={{ height: '100%', width: '100%', border: '.5px solid lightgray', lineHeight: 0 }}>
      <svg
        viewBox={`0 0 ${OPTIONS.WIDTH} ${OPTIONS.HEIGHT}`}
        fill='none'
        className={cl.graph}
        xmlns='http://www.w3.org/2000/svg'>
        {/* <Axes and titles layout /> */}
        <Layout OPTIONS={OPTIONS} />

        {/* Date titles */}
        {isDrawGraph && (
          <Labels
            currenciesData={currenciesDataInInterval}
            valuesArray={valuesArray}
            valueLineStep={valueLineStep}
            dateLineStep={dateLineStep}
            OPTIONS={OPTIONS}
          />
        )}

        {/* Lines */}
        {isDrawGraph && <LinesAndDots
          minMaxValues={minMaxValues}
          valuesLineLength={valuesLineLength}
          dateLineStep={dateLineStep}
          currenciesData={currenciesDataInInterval}
          currenciesSelection={currenciesSelection}
          OPTIONS={OPTIONS}
        />}
      </svg>
    </Box>
  );
};
export default Graph;
