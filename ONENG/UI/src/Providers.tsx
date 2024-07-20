import React from 'react'
import * as bsc from '@binance-chain/bsc-use-wallet'

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID!)
  return (
    <bsc.UseWalletProvider
      chainId={chainId}
      connectors={{
        bsc,
      }}
    >
      {children}
    </bsc.UseWalletProvider>
  )
}

export default Providers
