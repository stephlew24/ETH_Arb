import {BlockChecker} from '../helpers/BlockChecker.js'
// import Web3 from 'web3'
import abis from '../abis/index.cjs'
import addressesr from '../addresses/rinkeby/index.cjs'
import addresses from '../addresses/mainnet/index.cjs'

// Define the Variables
const AMOUNT_ETH = 100 // Set this up to pull from your wallet address
const ETH_PRICE = 3139 // Set this up to pull from a price oracle
const ABI = abis.kyber.kyberNetworkProxy
const C_ADDRESSR = addressesr.rinkeby.kyber.kyberNetworkProxyR
const T_ADDRESSR_DAI = addressesr.rinkeby.tokens.daiR
const T_ADDRESSR_WETH = addressesr.rinkeby.tokens.wethR
const C_ADDRESS = addresses.mainnet.kyber.kyberNetworkProxy
const T_ADDRESS_DAI = addresses.mainnet.tokens.dai
const T_ADDRESS_WETH = addresses.mainnet.tokens.weth

// Start the searcher (Rinkerby)
// let searcher = new BlockChecker(process.env.RINKEBY_RPC_NODE_PROVIDER, ABI, C_ADDRESSR, T_ADDRESSR_DAI, T_ADDRESSR_WETH, AMOUNT_ETH, ETH_PRICE);
// searcher.checkBlocks()

// Start the searcher (Mainnet)
let searcher = new BlockChecker(process.env.ETH_RPC_NODE_PROVIDER, ABI, C_ADDRESS, T_ADDRESS_DAI,T_ADDRESS_WETH, AMOUNT_ETH, ETH_PRICE);
searcher.checkBlocks()
