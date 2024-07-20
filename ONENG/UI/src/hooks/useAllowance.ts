import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { getAllowance } from "utils/callHelpers";
import { useERC20 } from "./useContract";

const useAllowance = (
  tokenAddress: string,
  spenderAddress: string,
  account: string
) => {
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const contract = useERC20(tokenAddress);

  useEffect(() => {
    const fetchAllowance = async () => {
      const res = await getAllowance(contract, account, spenderAddress);
      setAllowance(new BigNumber(res));
    };
    if (account) {
      fetchAllowance();
    }
  }, [account, tokenAddress, spenderAddress, contract]);

  return allowance;
};

export default useAllowance;
