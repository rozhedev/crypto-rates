const currenciesInfo = [
    {
        name: 'bitcoin',
        titleName: 'Bitcoin (BTC):',
        ws: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
        imgPath: 'img/bitcoin.svg',
    },
    {
        name: 'ethereum',
        titleName: 'Ethereum (ETH):',
        ws: 'wss://stream.binance.com:9443/ws/ethusdt@trade',
        imgPath: 'img/ethereum.svg',
    },
    {
        name: 'binance-coin',
        titleName: 'Binance Coin (BNB):',
        ws: 'wss://stream.binance.com:9443/ws/bnbusdt@trade',
        imgPath: 'img/binance-coin.svg',
    },
    {
        name: 'bitcoin-cash',
        titleName: 'Bitcoin Cash (BCH):',
        ws: 'wss://stream.binance.com:9443/ws/bchusdt@trade',
        imgPath: 'img/bitcoin-cash.svg',
    },
    {
        name: 'monero',
        titleName: 'Monero (XMR):',
        ws: 'wss://stream.binance.com:9443/ws/xmrusdt@trade',
        imgPath: 'img/monero.svg',
    },
    {
        name: 'solana',
        titleName: 'Solana (SOL)',
        ws: 'wss://stream.binance.com:9443/ws/solusdt@trade',
        imgPath: 'img/solana.svg',
    },
    {
        name: 'litecoin',
        titleName: 'Litecoin (LTC)',
        ws: 'wss://stream.binance.com:9443/ws/ltcusdt@trade',
        imgPath: 'img/litecoin.svg',
    },
    {
        name: 'zcash',
        titleName: 'Zcash (ZEC):',
        ws: 'wss://stream.binance.com:9443/ws/zecusdt@trade',
        imgPath: 'img/zcash.svg',
    },
    {
        name: 'dash',
        titleName: 'Dash (DASH):',
        ws: 'wss://stream.binance.com:9443/ws/dashusdt@trade',
        imgPath: 'img/dash.svg',
    },
    {
        name: 'avalanche',
        titleName: 'Avalanche (AVAX)',
        ws: 'wss://stream.binance.com:9443/ws/avaxusdt@trade',
        imgPath: 'img/avalanche.svg',
    },
    {
        name: 'polkadot',
        titleName: 'Polkadot (DOT)',
        ws: 'wss://stream.binance.com:9443/ws/dotusdt@trade',
        imgPath: 'img/polkadot.svg',
    },
    {
        name: 'chainlink',
        titleName: 'Chainlink (LINK):',
        ws: 'wss://stream.binance.com:9443/ws/linkusdt@trade',
        imgPath: 'img/chainlink.svg',
    },
    {
        name: 'cardano',
        titleName: 'Cardano (ADA):',
        ws: 'wss://stream.binance.com:9443/ws/adausdt@trade',
        imgPath: 'img/cardano.svg',
    },
    {
        name: 'algorand',
        titleName: 'Algorand (ALGO):',
        ws: 'wss://stream.binance.com:9443/ws/algousdt@trade',
        imgPath: 'img/algorand.svg',
    },
    {
        name: 'stellar',
        titleName: 'Stellar (XRP):',
        ws: 'wss://stream.binance.com:9443/ws/xrpusdt@trade',
        imgPath: 'img/stellar.svg',
    },
    {
        name: 'dogecoin',
        titleName: 'Dogecoin (DOGE):',
        ws: 'wss://stream.binance.com:9443/ws/dogeusdt@trade',
        imgPath: 'img/dogecoin.svg',
    },
    {
        name: 'tron',
        titleName: 'TRON (TRX):',
        ws: 'wss://stream.binance.com:9443/ws/trxusdt@trade',
        imgPath: 'img/tron.svg',
    },
];

const STATE_LIST = {
    top: "_top",
    bottom: "_bottom",
}

const cryptoRateTable = document.querySelector('.crypto-rate');
let stockObj, price, prevPrice;

function genTableFragment(imgPath, curName, curTitle) {
    return `<td class="crypto-rate__item-content">
                <img class="crypto-rate__item-img" src="${imgPath}" alt="${curName}">
                <h3 class="crypto-rate__item-title">${curTitle}</h3>
            </td>
            <td class="crypto-rate__item-course" data-output="${curName}"></td>
            `;
}

function comparePrice(price, prevPrice, output, {top = "_top", bottom = "_bottom"}) {
    if (price > prevPrice) {
        output.classList.add(top);
        output.classList.remove(bottom);
    } else if (price < prevPrice) {
        output.classList.add(bottom);
        output.classList.remove(top);
    } else {
        output.classList.remove(top);
        output.classList.remove(bottom);
    }
}

function getTableRate() {
    for (let i = 0; i < currenciesInfo.length; i++) {

        // * TABLE GEN
        
        let tableItem = document.createElement('tr');
        tableItem.classList.add('crypto-rate__item');
        tableItem.innerHTML = genTableFragment(
            currenciesInfo[i].imgPath,
            currenciesInfo[i].name,
            currenciesInfo[i].titleName
        );
        cryptoRateTable.appendChild(tableItem);

        // * GET COURSE FROM WS

        let ws = new WebSocket(currenciesInfo[i].ws);
        ws.onmessage = function (e) {
            stockObj = JSON.parse(e.data);
            price = (+stockObj.p);

            if (price > 10) price = parseFloat(stockObj.p).toFixed(2);
            else price = parseFloat(stockObj.p).toFixed(4);

            let outputList = document.querySelectorAll('.crypto-rate__item-course');

            // * LIVE RELOAD

            for (let outputItem of outputList) {
                if (outputItem.getAttribute('data-output') == currenciesInfo[i].name) {
                    outputItem.textContent = price + '$';

                    comparePrice(price, prevPrice, outputItem, STATE_LIST);
                    prevPrice = price;
                }
            }
        }
    }
}

getTableRate();