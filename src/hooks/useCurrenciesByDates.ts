import { useCallback, useEffect, useRef, useState } from 'react';

import { getCurrenciesByDate } from 'api';

import dayjs from 'dayjs';

import { type AxiosError, type AxiosResponse } from 'axios';
import { type TCurrenciesSelection, type AxiosCurrencyResponse, type TCurrencyData } from 'types';

type TPromiseFulfilledResult = {
  status: 'fulfilled';
  value: AxiosResponse<AxiosCurrencyResponse>;
};

type TPromiseRejectedResult = {
  status: 'rejected';
  reason: AxiosError;
};

type TPromiseAllSettled = TPromiseFulfilledResult | TPromiseRejectedResult;

type TCurrenciesByDates = (
  dateFrom: string,
  dateTo: string,
  currenciesSelection: TCurrenciesSelection[]
) => [TCurrencyData[], boolean, string | null, (dateFrom: string, dateTo: string) => void, number];

const useCurrenciesByDates: TCurrenciesByDates = (dateFrom, dateTo, currenciesSelection) => {
  const [currenciesData, setCurrenciesData] = useState<TCurrencyData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
	const [apiRequestCount, setApiRequestCount] = useState(0)

  const firstMountRef = useRef(true);

  const currenciesDataStr = JSON.stringify(currenciesData);

  const getFulfilledResponses = useCallback(
    (responses: TPromiseAllSettled[]) =>
      responses.filter(response => response.status === 'fulfilled') as TPromiseFulfilledResult[],
    []
  );

  const convertResponsesToCurrenciesArray = useCallback(
    (fulfilledResponses: TPromiseFulfilledResult[]) =>
      fulfilledResponses.map(({ value }) =>
        currenciesSelection.reduce(
          (acc, cur) => {
            acc.values[cur.name] = 1 / value.data.rub[cur.name];

            return acc;
          },
          { date: value.data.date, values: {} } as TCurrencyData
        )
      ),
    []
  );

  const getNewData = useCallback(
    async (dateFrom: string, dateTo: string) => {
      const parsedCurrenciesData = JSON.parse(currenciesDataStr);

      // Getting needed dates for fetching
      const neededDates = [];

      let minDate = dateFrom;
      const maxDate = dateTo;
      let currenciesIndex = 0;

      while (maxDate >= minDate) {
        if (
          parsedCurrenciesData.length === 0 ||
          !parsedCurrenciesData[currenciesIndex] ||
          parsedCurrenciesData[currenciesIndex].date > minDate
        ) {
          neededDates.push(minDate);
          minDate = dayjs(minDate).add(1, 'day').format('YYYY-MM-DD');
          continue;
        }

				if (parsedCurrenciesData[currenciesIndex].date < minDate) {
					currenciesIndex++
					continue
				}

        currenciesIndex++;
        minDate = dayjs(minDate).add(1, 'day').format('YYYY-MM-DD');
      }

      // Fetching dates
      try {
        setLoading(true);

        const fetchArray = neededDates.map(date => getCurrenciesByDate('rub', date));

				setApiRequestCount(prev => prev + fetchArray.length)
				
        const responses = (await Promise.allSettled(fetchArray)) as TPromiseAllSettled[];

        const fulfilledResponses = getFulfilledResponses(responses);
        const currenciesData = convertResponsesToCurrenciesArray(fulfilledResponses);

        // Set data state if new data length > 0
        if (currenciesData.length > 0) {
          setCurrenciesData(prevData => {
            if (prevData.length === 0) return currenciesData;

            let prevDataIndex = 0;
            let curDataIndex = 0;

            let result = [];

            while (prevDataIndex < prevData.length || curDataIndex < currenciesData.length) {
              if (
                !currenciesData[curDataIndex] ||
                prevData[prevDataIndex]?.date < currenciesData[curDataIndex].date
              ) {
                result.push(prevData[prevDataIndex]);
                prevDataIndex++;
                continue;
              }
              if (
                !prevData[prevDataIndex] ||
                prevData[prevDataIndex].date > currenciesData[curDataIndex].date
              ) {
                result.push(currenciesData[curDataIndex]);
                curDataIndex++;
              }
            }

            return result;
          });
        }

        setError(null);
      } catch (error) {
				console.error(error);
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [currenciesDataStr]
  );

  useEffect(() => {
    if (!firstMountRef.current) return;

    firstMountRef.current = false;

    getNewData(dateFrom, dateTo);
  }, [dateFrom, dateTo, getNewData]);

  return [currenciesData, isLoading, error, getNewData, apiRequestCount];
};

export default useCurrenciesByDates;
