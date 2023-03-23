import { defineStore } from 'pinia'
import { getWeb3 } from '@/services/web3'
import Land from '../abis/LandRegistry.json'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

export const useWeb3Store = defineStore({
  id: 'web3',
  state: () => ({
    web3Instance: Web3,
    account: '',
    landContract: Contract
  }),
  getters: {},
  actions: {
    async getWeb3() {
      getWeb3
        .then((result) => {
          this.web3Instance = result.web3()
          const accounts = this.web3Instance.eth.getAccounts()
          this.account = accounts[0]
        })
        .catch((e) => {
          console.log('error in action registerWeb3', e)
        })
    },
    async getContract() {
      const landContract = new this.web3Instance.eth.Contract(Land.abi, Land.address)
      this.landContract = landContract
    }
  }
})
