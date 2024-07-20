import { useEffect, useState } from "react";
import { AbiItem } from "web3-utils";
import { ContractOptions } from "web3-eth-contract";
import useWeb3 from "hooks/useWeb3";
import erc20 from "config/abi/erc20.json";
import saleABI from "config/abi/sale.json";
import { getSaleContractAddress } from "utils/addressHelpers";

export const useContract = (
  abi: AbiItem,
  address: string,
  contractOptions?: ContractOptions
) => {
  const web3 = useWeb3();
  const [contract, setContract] = useState(
    new web3.eth.Contract(abi, address, contractOptions)
  );

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address, contractOptions));
  }, [abi, address, contractOptions, web3]);

  return contract;
};

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const erc20Abi = erc20 as unknown as AbiItem;
  return useContract(erc20Abi, address);
};

export const useSaleContract = () => {
  const abi = saleABI as unknown as AbiItem;
  return useContract(abi, getSaleContractAddress());
};

export default useContract;
