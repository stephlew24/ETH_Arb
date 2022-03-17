const kyberMainnet = require('./kyber_mainnet.json')
const uniswapMainnet = require('./uniswap_mainnet.json')
const dydxMainnet = require('./dydx_mainnet.json')
const tokensMainnet = require('./tokens_mainnet.json')

module.exports = {
    mainnet: {
        kyber: kyberMainnet,
        uniswap: uniswapMainnet,
        dydx: dydxMainnet,
        tokens: tokensMainnet
    }
}