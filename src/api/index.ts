import axios from "axios";
import { type AxiosCurrencyResponse } from "types";

export const getCurrenciesByDate = (currencyName: 'rub', date: string) => {
	return axios.get<AxiosCurrencyResponse>(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${currencyName}.min.json`)
}