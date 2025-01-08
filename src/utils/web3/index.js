import { Web3 } from 'web3';
import config from "../../constants/config.json";

const network = config.networks["base-mainnet"];
const rpcEndpoint = network.rpcEndpoint;

export const getWeb3Instance = () => {
  return new Web3(rpcEndpoint);
};

export const getContract = (web3, abi, address) => {
  return new web3.eth.Contract(abi, address);
};

export * from './transactions'; 