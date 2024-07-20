import BigNumber from "bignumber.js";
import { ethers } from "ethers";

export const getUsdtAddress = async (saleContract) => {
  return saleContract.methods.usdt().call((err, res) => {
    if (err) {
      console.log("An error occured: ", err);
      return;
    }
    return res;
  });
};

export const getBalance = async (tokenContract, account) => {
  return tokenContract.methods.balanceOf(account).call((err, res) => {
    if (err) {
      console.log("An error occured: ", err);
      return;
    }
    return res;
  });
};

export const getDecimals = async (tokenContract) => {
  return tokenContract.methods.decimals().call((err, res) => {
    if (err) {
      console.log("An error occured: ", err);
      return;
    }
    return res;
  });
};

export const getAllowance = async (
  tokenContract,
  account,
  spenderContractAddress
) => {
  return tokenContract.methods
    .allowance(account, spenderContractAddress)
    .call((err, res) => {
      if (err) {
        console.log("An error occured: ", err);
        return;
      }
      return res;
    });
};

export const getOwner = async (salesContract) => {
  return salesContract.methods.owner().call((err, res) => {
    if (err) {
      console.log("An error occured: ", err);
      return;
    }
    return res;
  });
};

export const getOneVPrice = async (salesContract) => {
  return salesContract.methods.oneVPrice().call((err, res) => {
    if (err) {
      console.log("An error occured: ", err);
      return;
    }
    return res;
  });
};

export const approve = async (
  account,
  tokenContract,
  spenderContractAddress
) => {
  return tokenContract.methods
    .approve(spenderContractAddress, ethers.constants.MaxUint256)
    .send({ from: account, gasPrice: "32000000000" });
};

export const buyOneV = async (saleContract, amount, account) => {
  return saleContract.methods
    .buyOneV(new BigNumber(amount).toFixed())
    .send({ from: account, gasPrice: "100000000000" })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const buyOneVWithReferral = async (
  saleContract,
  amount,
  code,
  account
) => {
  return saleContract.methods
    .withdraw(new BigNumber(amount).toFixed(), code)
    .send({ from: account, gasPrice: "100000000000" })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

// ADMIN FUNCTIONS

export const changePrice = async (saleContract, price, account) => {
  return saleContract.methods
    .changePrice(new BigNumber(price).toFixed())
    .send({ from: account, gasPrice: "100000000000" })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const setReferral = async (
  saleContract,
  code,
  to,
  reward,
  isActive,
  account
) => {
  return saleContract.methods
    .setReferral(code, to, new BigNumber(reward).toFixed(), isActive)
    .send({ from: account, gasPrice: "100000000000" })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const withdrawUsdt = async (saleContract, amount, account) => {
  return saleContract.methods
    .withdrawUsdt(new BigNumber(amount).toFixed())
    .send({ from: account, gasPrice: "100000000000" })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};
