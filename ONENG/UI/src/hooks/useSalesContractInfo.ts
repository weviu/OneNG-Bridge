import { useEffect, useState } from "react";
import { getDefaultUsdtContractAddress } from "utils/addressHelpers";
import { getUsdtAddress, getOwner, getOneVPrice } from "utils/callHelpers";
import { useSaleContract } from "./useContract";

const useSaleContractInfo = () => {
  const [address, setAddress] = useState(getDefaultUsdtContractAddress());
  const [owner, setOwner] = useState("");
  const [oneVPrice, setOneVPrice] = useState("");
  const contract = useSaleContract();

  useEffect(() => {
    const getInfo = async () => {
      const usdt = await getUsdtAddress(contract);
      setAddress(usdt);
      const owner = await getOwner(contract);
      setOwner(owner);
      const price = await getOneVPrice(contract);
      setOneVPrice(price);
    };

    getInfo();
  }, [contract]);

  return { address, owner, oneVPrice };
};

export default useSaleContractInfo;
