import { isPromise } from '@vue/shared'
import Web3 from 'web3'
declare let window: any

export const getWeb3 = new Promise(function (resolve: (value: { web3(): Web3 }) => void, reject) {
  //  First check if web3js was injected with metamask.
  const web3js = window.web3
  let web3: Web3
  if (typeof web3js !== 'undefined') {
    web3 = new Web3(window.ethereum)
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'))
  }
  const request = window.ethereum.request({ method: 'eth_requestAccounts' })
  if (isPromise(request)) {
    request.then(() => {
      resolve({
        web3() {
          return web3
        }
      })
    })
  }

  resolve({
    web3() {
      return web3
    }
  })
})
