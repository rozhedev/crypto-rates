const currenciesInfo = [
    {
        titleName: 'Bitcoin (BTC):',
        ws: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
        imgPath: 'img/bitcoin.svg',
        imgAlt: 'bitcoin',
    },
    {
        titleName: 'Ethereum (ETH):',
        ws: 'wss://stream.binance.com:9443/ws/ethusdt@trade',
        imgPath: 'img/ethereum.svg',
        imgAlt: 'ethereum',
    },
    {
        titleName: 'Binance Coin (BNB):',
        ws: 'wss://stream.binance.com:9443/ws/bnbusdt@trade',
        imgPath: 'img/binance-coin.svg',
        imgAlt: 'binance-coin',
    },
    {
        titleName: 'Bitcoin Cash (BCH):',
        ws: 'wss://stream.binance.com:9443/ws/bchusdt@trade',
        imgPath: 'img/bitcoin-cash.svg',
        imgAlt: 'bitcoin-cash',
    },
    {
        titleName: 'Monero (XMR):',
        ws: 'wss://stream.binance.com:9443/ws/xmrusdt@trade',
        imgPath: 'img/monero.svg',
        imgAlt: 'monero',
    },
    {
        titleName: 'Solana (SOL)',
        ws: 'wss://stream.binance.com:9443/ws/solusdt@trade',
        imgPath: 'img/solana.svg',
        imgAlt: 'solana',
    },
    {
        titleName: 'Litecoin (LTC)',
        ws: 'wss://stream.binance.com:9443/ws/ltcusdt@trade',
        imgPath: 'img/litecoin.svg',
        imgAlt: 'litecoin',
    },
    {
        titleName: 'Zcash (ZEC):',
        ws: 'wss://stream.binance.com:9443/ws/zecusdt@trade',
        imgPath: 'img/zcash.svg',
        imgAlt: 'zcash',
    },
    {
        titleName: 'Dash (DASH):',
        ws: 'wss://stream.binance.com:9443/ws/dashusdt@trade',
        imgPath: 'img/dash.svg',
        imgAlt: 'dash',
    },
    {
        titleName: 'Avalanche (AVAX)',
        ws: 'wss://stream.binance.com:9443/ws/avaxusdt@trade',
        imgPath: 'img/avalanche.svg',
        imgAlt: 'avalanche',
    },
    {
        titleName: 'Polkadot (DOT)',
        ws: 'wss://stream.binance.com:9443/ws/dotusdt@trade',
        imgPath: 'img/polkadot.svg',
        imgAlt: 'polkadot',
    },
    {
        titleName: 'Chainlink (LINK):',
        ws: 'wss://stream.binance.com:9443/ws/linkusdt@trade',
        imgPath: 'img/chainlink.svg',
        imgAlt: 'chainlink',
    },
    {
        titleName: 'Cardano (ADA):',
        ws: 'wss://stream.binance.com:9443/ws/adausdt@trade',
        imgPath: 'img/cardano.svg',
        imgAlt: 'cardano',
    },
    {
        titleName: 'Algorand (ALGO):',
        ws: 'wss://stream.binance.com:9443/ws/algousdt@trade',
        imgPath: 'img/algorand.svg',
        imgAlt: 'algorand',
    },
    {
        titleName: 'Stellar (XRP):',
        ws: 'wss://stream.binance.com:9443/ws/xrpusdt@trade',
        imgPath: 'img/stellar.svg',
        imgAlt: 'stellar',
    },
    {
        titleName: 'Dogecoin (DOGE):',
        ws: 'wss://stream.binance.com:9443/ws/dogeusdt@trade',
        imgPath: 'img/dogecoin.svg',
        imgAlt: 'dogecoin',
    },
    {
        titleName: 'TRON (TRX):',
        ws: 'wss://stream.binance.com:9443/ws/trxusdt@trade',
        imgPath: 'img/tron.svg',
        imgAlt: 'tron',
    },
];

const STATE_LIST = {
    top: "_top",
    bottom: "_bottom",
}

const cryptoRateTable = document.querySelector('.crypto-rate');

function genTableFragment({imgPath, imgAlt, titleName}) {
    return `<td class="crypto-rate__item-content">
                <img class="crypto-rate__item-img" src="${imgPath}" alt="${imgAlt}">
                <h3 class="crypto-rate__item-title">${titleName}</h3>
            </td>
            <td class="crypto-rate__item-course" data-output="${imgAlt}"></td>
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
    let stockObj, price, prevPrice;
    let itemClass = "crypto-rate__item"; 

    for (let i = 0; i < currenciesInfo.length; i++) {
        // * TABLE GEN
        let tableItem = document.createElement('tr');
        tableItem.classList.add(itemClass);
        
        tableItem.innerHTML = genTableFragment(currenciesInfo[i]);
        cryptoRateTable.appendChild(tableItem);

        // * GET COURSE FROM WS
        
        let ws = new WebSocket(currenciesInfo[i].ws);
        ws.onmessage = (e) => {
            stockObj = JSON.parse(e.data);
            price = (+stockObj.p);

            if (price > 10) price = parseFloat(stockObj.p).toFixed(2);
            else price = parseFloat(stockObj.p).toFixed(4);

            let outputList = document.querySelectorAll('.crypto-rate__item-course');

            // * LIVE RELOAD
            for (let outputItem of outputList) {
                if (outputItem.getAttribute('data-output') == currenciesInfo[i].imgAlt) {
                    outputItem.textContent = price + '$';

                    comparePrice(price, prevPrice, outputItem, STATE_LIST);
                    prevPrice = price;
                }
            }
        }
        ws.onerror = (e) => {
            console.error(e);
        }
    }
}

getTableRate();