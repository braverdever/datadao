import axios from "axios";

const convertFromWei = (value, round = 4) => {
	if (value < 1000000) {
		return Math.round(value * (10 ** round)) / (10 ** round) + ' Wei';
	} else if (value < 1000000000000000) {
		return Math.round(value / 1e9 * (10 ** round)) / (10 ** round) + ' Gwei';
	} else {
		return Math.round(value / 1e18 * (10 ** round)) / (10 ** round) + ' Eth';
	}
}
let usdPrice = Number(localStorage.getItem('ethPrice')) || 0;
let lastFetchTime = Number(localStorage.getItem('lastPriceFetch')) || 0;
const convertToUSDFromWei = async (value, round = 1) => {
	try {
		value = Number(value);
		const now = Date.now();
		if ((now - lastFetchTime) > 20000 || usdPrice === 0) {
			const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDC');
			if (response?.data?.price) {
				usdPrice = Number(response.data.price);
				lastFetchTime = now;
				// Store values in localStorage
				localStorage.setItem('ethPrice', usdPrice.toString());
				localStorage.setItem('lastPriceFetch', lastFetchTime.toString());
			} else {
				return "N/A";
			}
		}
		return Math.round(usdPrice * (value / 1e18) * (10 ** round)) / (10 ** round);
	} catch {
		return "N/A";
	}
}

const convertWithFixedRate = (value, rate, round = 1) => {
	const price = Math.round(rate * (value / 1e18) * (10 ** round)) / (10 ** round);
	if (!isNaN(price))
		return price;
	return "N/A";
}

export {
	convertFromWei,
	convertToUSDFromWei,
	convertWithFixedRate
};