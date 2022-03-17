import Web3 from 'web3'
import {ChainId, Token, Fetcher, TokenAmount, WETH} from "@uniswap/sdk";

export class BlockChecker {
    web3;
    url;
    contract;
    abi;
    c_address;
    t_address_dai;
    t_address_weth;
    amount_ETH_wei;
    amount_DAI_wei;
    eth_amount;
    eth_price; // Set up to pull from API

    constructor(url, abi, c_address, t_address_dai, t_address_weth, eth_amount, eth_price) {
        this.url = url
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.url))
        this.abi = abi
        this.c_address = c_address
        this.t_address_dai = t_address_dai
        this.t_address_weth = t_address_weth
        this.contract = new this.web3.eth.Contract(this.abi, this.c_address)
        this.eth_amount = eth_amount
        this.eth_price = eth_price
        this.amount_ETH_wei = Web3.utils.toWei(this.eth_amount.toString())
        this.amount_DAI_wei = Web3.utils.toWei((this.eth_amount * this.eth_price).toString())
    }
        
    async getKyberPrices() {
        let check = this.contract
        const kyberResults = await Promise.all([
            check
            .methods
            .getExpectedRate(
                this.t_address_dai,
                '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                this.amount_DAI_wei
            )
            .call(),
            check
            .methods
            .getExpectedRate(
                '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                this.t_address_weth,
                this.amount_ETH_wei
            )
            .call()
        ])
        const kyberRates = {
            buy: parseFloat(1/(kyberResults[0].expectedRate / (10 ** 18))), //Make the decimals pullable from the chain
            sell: parseFloat(kyberResults[1].expectedRate / (10 ** 18))
        }
        // console.log(kyberResults)
        console.log('ETH/DAI', kyberRates)
    }

    async getUniswapPrices() {
        // let check = this.contract
        const [dai, weth] = await Promise.all(
            [this.t_address_dai, this.t_address_weth].map(tokenAddress => (
                new Token(
                    ChainId.MAINNET,
                    tokenAddress,
                    18
                )
            ))
        )
        const daiWeth = await Fetcher.fetchPairData(
            dai,
            // WETH[ChainId.MAINNET]
            weth
        );
        const uniswapResults = await Promise.all([
            daiWeth.getOutputAmount(new TokenAmount(dai, this.amount_DAI_wei)), 
            daiWeth.getOutputAmount(new TokenAmount(weth, this.amount_ETH_wei)),
        ])
    // Find out what you need to do with the UniSwap results
    console.log("Uniswap Results 0", uniswapResults[0])
    console.log("Uniswap Results 1", uniswapResults[1])
    }
    checkBlocks() {
        let sub = this.web3.eth.subscribe('newBlockHeaders');
        sub.on('data', async block => {
            const milliseconds = block.timestamp * 1000
            const dateObject = new Date(milliseconds)
            const humantimestamp = dateObject.toLocaleString()
            
            console.log('New block received. Block # ', block.number, 'on', humantimestamp)
            this.getKyberPrices()
            this.getUniswapPrices()
            
        })
        .on('error', error => {
            console.log(error)
        })
    }
}