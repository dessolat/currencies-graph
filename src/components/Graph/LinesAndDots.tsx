import { type TCurrencyName, type TCurrencyData, type TCurrenciesSelection } from 'types';
import { type TOPTIONS } from './types';

import cl from './Graph.module.scss';
import { Fragment } from 'react/jsx-runtime';

type Props = {
  minMaxValues: { min: number; max: number };
  valuesLineLength: number;
  dateLineStep: number;
  currenciesData: TCurrencyData[];
  currenciesSelection: TCurrenciesSelection[];
  OPTIONS: TOPTIONS;
};

const LinesAndDots = ({
  minMaxValues,
  valuesLineLength,
  dateLineStep,
  currenciesData,
  currenciesSelection,
  OPTIONS
}: Props) => {
  const { LEFT_OFFSET, BOTTOM_OFFSET, FIRST_VALUE_OFFSET, FIRST_DATE_OFFSET, HEIGHT } = OPTIONS;

  const lineLengthPerValue = valuesLineLength / (minMaxValues.max - minMaxValues.min);

  const initialLinePathsAndColors = currenciesSelection.reduce(
    (acc, cur) => {
      if (cur.checked)
        acc[cur.name] = {
          path: '',
          dots: [],
          options: cur
        };

      return acc;
    },
    {} as {
      [index in TCurrencyName]: {
        path: string;
        dots: [number, number][];
        options: TCurrenciesSelection;
      };
    }
  );

  const linesPaths = currenciesData.reduce((acc, cur, i) => {
    Object.keys(acc).forEach((value, _, arr) => {
      const xCoord = LEFT_OFFSET + FIRST_DATE_OFFSET + (i + 1) * dateLineStep;
      const yCoord =
        HEIGHT -
        BOTTOM_OFFSET -
        FIRST_VALUE_OFFSET -
        (currenciesData.length > 1 || arr.length > 1
          ? (cur.values[value as keyof typeof cur.values] - minMaxValues.min) * lineLengthPerValue
          : 0);

      acc[value as keyof typeof acc].path += i === 0 ? `M${xCoord},${yCoord}` : `L${xCoord},${yCoord}`;
      acc[value as keyof typeof acc].dots.push([xCoord, yCoord]);
    });

    return acc;
  }, initialLinePathsAndColors);

  return (
    <>
      {Object.entries(linesPaths).map(cur => (
        <Fragment key={cur[0]}>
          <path d={cur[1].path} stroke={cur[1].options.color} className={cl.animatedPath} />
          {cur[1].dots.map(dot => (
            <circle
              key={cur[1].path + '' + dot[0]}
              cx={dot[0]}
              cy={dot[1]}
              r={2}
              fill={cur[1].options.color}
              className={cl.animatedDot}
            />
          ))}
        </Fragment>
      ))}
    </>
  );
};
export default LinesAndDots;
