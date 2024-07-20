import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { getBalance, getDecimals } from "utils/callHelpers";
import { useERC20 } from "./useContract";

const useBalanceAndDecimals = (account: string, tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const [decimals, setDecimals] = useState(0);
  const contract = useERC20(tokenAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await getBalance(contract, account);
      setBalance(new BigNumber(res));
      const decimals = await getDecimals(contract);
      setDecimals(parseInt(decimals));
    };
    if (account) {
      fetchBalance();
    }
  }, [account, tokenAddress, contract]);

  return { balance, decimals };
};

export default useBalanceAndDecimals;
