import { type TCurrencyData } from 'types';
import { type TOPTIONS } from './types';

import cl from './Graph.module.scss';
import dayjs from 'dayjs';
import { Fragment } from 'react/jsx-runtime';
import clsx from 'clsx';

type Props = {
  currenciesData: TCurrencyData[];
	valuesArray: string[]
	valueLineStep: number
	dateLineStep: number
  OPTIONS: TOPTIONS;
};

const Labels = ({ currenciesData, valuesArray, valueLineStep, dateLineStep, OPTIONS }: Props) => {
  const { HEIGHT, BOTTOM_OFFSET, LEFT_OFFSET, FIRST_DATE_OFFSET } = OPTIONS;

  return (
    <>
      {/* Values labels */}
      {valuesArray.map((value, i) => (
        <Fragment key={value}>
          <text
            x={LEFT_OFFSET - 5}
            y={HEIGHT - BOTTOM_OFFSET - FIRST_DATE_OFFSET - i * valueLineStep}
            className={clsx(cl.valueLabel, cl.text)}>
            {value}
          </text>
          <line
            x1={LEFT_OFFSET - 2}
            x2={LEFT_OFFSET + 2}
            y1={HEIGHT - BOTTOM_OFFSET - FIRST_DATE_OFFSET - i * valueLineStep}
            y2={HEIGHT - BOTTOM_OFFSET - FIRST_DATE_OFFSET - i * valueLineStep}
            stroke='gray'
          />
        </Fragment>
      ))}
			
      {/* Dates labels */}
      {currenciesData.map((cur, i) => (
        <Fragment key={cur.date}>
          <text
            x={LEFT_OFFSET + FIRST_DATE_OFFSET + (i + 1) * dateLineStep}
            y={HEIGHT - BOTTOM_OFFSET + 21}
            className={clsx(cl.dateLabel, cl.text)}>
            {dayjs(cur.date).format('DD.MM.YY')}
          </text>
          <line
            x1={LEFT_OFFSET + FIRST_DATE_OFFSET + (i + 1) * dateLineStep}
            x2={LEFT_OFFSET + FIRST_DATE_OFFSET + (i + 1) * dateLineStep}
            y1={HEIGHT - BOTTOM_OFFSET - 2}
            y2={HEIGHT - BOTTOM_OFFSET + 2}
            stroke='gray'
          />
        </Fragment>
      ))}
    </>
  );
};

export default Labels;
