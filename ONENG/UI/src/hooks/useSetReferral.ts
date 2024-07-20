import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { setReferral } from "utils/callHelpers";
import { useSaleContract } from "./useContract";

export const useSetReferral = () => {
  const { account } = useWallet();
  const contract = useSaleContract();

  const handleSetReferral = useCallback(
    async (code: string, to: string, reward: string, isActive: boolean) => {
      const txHash = await setReferral(
        contract,
        code,
        to,
        reward,
        isActive,
        account
      );
      return txHash;
    },
    [account, contract]
  );

  return { onSetReferral: handleSetReferral };
};

export default useSetReferral;
