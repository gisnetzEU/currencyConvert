
const inputs = document.querySelectorAll('input')
const [euroInput, dollarInput, poundInput] = inputs;
const currencyInputs = { 'EUR': euroInput, 'USD': dollarInput, 'GBP': poundInput };
const currencies = ['EUR', 'USD', 'GBP'];

const BASE_API_URL = "https://api.exchangeratesapi.io/latest?base=";

class Request {
    constructor() {
        this.xhr = new XMLHttpRequest();
    }

    get(url, callback) {
        this.xhr.open('GET', url); // connection is open
        this.xhr.onload = () => {
            if (this.xhr.status === 200) {
                callback(null, this.xhr.responseText); // request done
            } else {
                callback('GetReq: Fail', null)
            }
        }
        this.xhr.send();
    }
}

const converter = new Request();

const convertCurrencies = (origCurrency) => {
    converter.get(BASE_API_URL + origCurrency, function (err, response) {
        if (err === null) {
            let resultJSON = JSON.parse(response);
            console.log(resultJSON);

            const destCurrencies = currencies.filter(c => c !== origCurrency);
            const origCurrencyAmount = currencyInputs[origCurrency].value;

            destCurrencies.forEach(destCurrency => {
                const newAmount = origCurrencyAmount * resultJSON.rates[destCurrency];
                currencyInputs[destCurrency].value = newAmount.toFixed(2)
            });
        } else {
            // Error
            console.log(err);
        }
    })
};

euroInput.addEventListener('change', (e) => convertCurrencies('EUR'));
dollarInput.addEventListener('change', (e) => convertCurrencies('USD'));
poundInput.addEventListener('change', (e) => convertCurrencies('GBP'));
