import { type Dayjs } from 'dayjs';

export type TCurrencyName = 'eur' | 'usd' | 'cny';

export type TCurrencyValue = {
  [index in TCurrencyName]: number;
};

export type TCurrenciesSelection = {
  label: string;
  name: TCurrencyName;
  checked: boolean;
	color: 'blue' | 'green' | 'purple'
};

export type TCurrencyData = {
  date: string;
  values: TCurrencyValue;
};

export type THandleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
export type THandleDateChange = (name: 'dateFrom' | 'dateTo') => (value: Dayjs | null) => void;

export type AxiosCurrencyResponse = {
	date: string;
	rub: Record<string, number>
}
