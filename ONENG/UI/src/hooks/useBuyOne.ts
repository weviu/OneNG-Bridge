import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { buyOneV, buyOneVWithReferral } from "utils/callHelpers";
import { useSaleContract } from "./useContract";

export const useBuyOneV = () => {
  const { account } = useWallet();
  const contract = useSaleContract();

  const handleBuy = useCallback(
    async (amount: string) => {
      const txHash = await buyOneV(contract, amount, account);
      return txHash;
    },
    [account, contract]
  );

  return { onBuyV: handleBuy };
};

export const useBuyOneVWithReferral = () => {
  const { account } = useWallet();
  const contract = useSaleContract();

  const handleBuy = useCallback(
    async (amount: string, code: string) => {
      const txHash = await buyOneVWithReferral(contract, amount, code, account);
      return txHash;
    },
    [account, contract]
  );

  return { onBuyVWithReferral: handleBuy };
};
