import { useWallet } from '@binance-chain/bsc-use-wallet';
import BigNumber from 'bignumber.js';
import useAllowance from 'hooks/useAllowance';
import { useApprove } from 'hooks/useApprove';
import useBalanceAndDecimals from 'hooks/useBalanceAndDecimals';
import { useBuyOneV, useBuyOneVWithReferral } from 'hooks/useBuyOne';
import useChangePrice from 'hooks/useChangePrice';
import useSalesContractInfo from 'hooks/useSalesContractInfo';
import useSetReferral from 'hooks/useSetReferral';
import useWithdrawUsdt from 'hooks/useWithdrawUsdt';
import React, { useCallback, useEffect } from 'react';
import { useRef } from 'react';
import styled from 'styled-components'
import { getSaleContractAddress } from 'utils/addressHelpers';

const Input = styled.input``
const Button = styled.button``
const Text = styled.h3``
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 2px solid red;
  border-radius: 8px;
  padding: 32px;
`
const H5 = styled.h5``

const DECIMALS = 2

function App() {
  const { account, connect } = useWallet()

  const amountInput = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)
  const codeInput = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)
  const priceInput = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)
  const codeInputAdmin = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)
  const toInput = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)
  const rewardInput = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)
  const activeInput = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)
  const amountInputAdmin = useRef<HTMLInputElement>((Input as unknown) as HTMLInputElement)

  const { onBuyV } = useBuyOneV()
  const { onBuyVWithReferral } = useBuyOneVWithReferral()
  const { onChangePrice } = useChangePrice()
  const { onSetReferral } = useSetReferral()
  const { onWithdrawUsdt } = useWithdrawUsdt()

  const { address: usdtAddress, owner, oneVPrice } = useSalesContractInfo()
  const saleContractAddress = getSaleContractAddress()

  const { onApprove } = useApprove(usdtAddress)

  const allowance = useAllowance(usdtAddress, saleContractAddress, account!)
  const { balance, decimals } = useBalanceAndDecimals(account || "", usdtAddress)

  const accountBalance = balance.div(10 ** decimals)
  const price = new BigNumber(oneVPrice).div(10 ** decimals)

  const isApproved = allowance.isGreaterThan(0)
  const isOwner = owner === account

  const handleBuy = useCallback(async () => {
    const amount = parseInt(amountInput.current.value) * 10 ** DECIMALS
    if (codeInput.current.value) {
      return await onBuyVWithReferral(`${amount}`, codeInput.current.value)
    }
    return await onBuyV(`${amount}`)
  }, [onBuyV, onBuyVWithReferral])

  const handleChangePrice = useCallback(async () => {
    const price = parseInt(priceInput.current.value) * 10 ** DECIMALS
    return await onChangePrice(`${price}`)
  }, [onChangePrice])

  const handleSetReferral = useCallback(async () => {
    const code = codeInputAdmin.current.value
    const to = toInput.current.value
    const reward = rewardInput.current.value
    const isActive = activeInput.current.value
    console.log('kdsda: ', isActive)
    return await onSetReferral(code, to, reward, isActive === 'on')
  }, [onSetReferral])

  const handleWithdrawUsdt = useCallback(async () => {
    const amount = parseInt(amountInputAdmin.current.value) * 10 ** DECIMALS
    return await onWithdrawUsdt(`${amount}`)
  }, [onWithdrawUsdt])

  const handleMax = useCallback(async () => {
    amountInput.current.value = accountBalance.div(price).toFixed(0)
  }, [accountBalance, price])

  useEffect(() => {
    if (!account && window.localStorage.getItem('accountStatus')) {
      connect('injected')
    }
  }, [account, connect])

  if (!account) return (
    <div className="App">
      <Button onClick={() => connect('injected')}>CONNECT</Button>
    </div>
  )

  return (
    <div className="App">
      <Text>{accountBalance.toFixed()} USDT available in your wallet</Text>
      <Input ref={amountInput} placeholder='Amount' />
      <Input ref={codeInput} placeholder='Code' />
      <Button onClick={isApproved ? handleBuy : onApprove}>{isApproved ? "BUY" : "APPROVE"}</Button>
      {isApproved && <Button onClick={handleMax}>MAX</Button>}
      <Text>Each V costs {price.toFixed()} USDT</Text>
      {isOwner ?
        <Container>
          <Text style={{ margin: '0' }}>ADMIN</Text>
          <div>
            <Input ref={priceInput} placeholder='Price without decimals' />
            <Button onClick={handleChangePrice}>Change Price</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Input ref={codeInputAdmin} placeholder='Code' />
            <Input ref={toInput} placeholder='To' />
            <Input ref={rewardInput} placeholder='Reward' />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <H5 style={{ margin: '0' }}>Is Active</H5>
              <Input ref={activeInput} type="checkbox" />
            </div>
            <Button onClick={handleSetReferral}>Set Referral</Button>
          </div>
          <div>
            <Input ref={amountInputAdmin} placeholder='Amount' />
            <Button onClick={handleWithdrawUsdt}>Withdraw USDT</Button>
          </div>
        </Container>
        : <Text>Your wallet does not have admin privileges.</Text>}
    </div>
  );
}

export default App;
