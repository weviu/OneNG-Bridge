import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { withdrawUsdt } from "utils/callHelpers";
import { useSaleContract } from "./useContract";

export const useWithdrawUsdt = () => {
  const { account } = useWallet();
  const contract = useSaleContract();

  const handleWithdrawUsdt = useCallback(
    async (amount: string) => {
      const txHash = await withdrawUsdt(contract, amount, account);
      return txHash;
    },
    [account, contract]
  );

  return { onWithdrawUsdt: handleWithdrawUsdt };
};

export default useWithdrawUsdt;
