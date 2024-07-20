import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { approve } from "utils/callHelpers";
import { useERC20 } from "./useContract";
import { getSaleContractAddress } from "utils/addressHelpers";

export const useApprove = (tokenAddress: string) => {
  const { account } = useWallet();
  const saleContractAddress = getSaleContractAddress();
  const tokenContract = useERC20(tokenAddress);

  const handleApprove = useCallback(async () => {
    const txHash = await approve(account, tokenContract, saleContractAddress);
    return txHash;
  }, [account, saleContractAddress, tokenContract]);

  return { onApprove: handleApprove };
};
