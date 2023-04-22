import Web3 from 'web3'
declare let window: any

export const getWeb3 = async () => {
  //  First check if ethereum is injected.
  let provider: any
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum
    try {
      await window.ethereum.enable()
    } catch (error) {
      console.error('User denied access')
    }
  } else if (window.web3) {
    provider = window.web3.currentProvider
  } else {
    provider = new Web3.providers.HttpProvider('http://localhost:7545')
  }
  const web3 = new Web3(provider)
  await window.ethereum.request({ method: 'eth_accounts' })

  return { provider, web3 }
}
