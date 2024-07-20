import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { changePrice } from "utils/callHelpers";
import { useSaleContract } from "./useContract";

export const useChangePrice = () => {
  const { account } = useWallet();
  const contract = useSaleContract();

  const handleChange = useCallback(
    async (price: string) => {
      const txHash = await changePrice(contract, price, account);
      return txHash;
    },
    [account, contract]
  );

  return { onChangePrice: handleChange };
};

export default useChangePrice;
