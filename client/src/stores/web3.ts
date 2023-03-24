import { defineStore } from 'pinia'
import { getWeb3 } from '@/services/web3'
import Land from '../abis/LandRegistrationSystem.json'
import Web3 from 'web3'
import ipfs from '@/services/ipfs'

import { useUIStore } from './ui'
import { Buffer } from 'buffer'

export const useWeb3Store = defineStore({
  id: 'web3',
  state: (): { web3Instance: Web3 | null; account: string; landContract: any } => ({
    web3Instance: null,
    account: '',
    landContract: null
  }),
  getters: {},
  actions: {
    async getWeb3() {
      try {
        const result = await getWeb3
        this.web3Instance = result.web3()
        let accounts = await this.web3Instance.eth.getAccounts()
        if (accounts.length < 1) {
          accounts = await window.ethereum.request({ method: 'eth_accounts' })
        }
        this.account = accounts[0]
      } catch (e) {
        console.log('error in action registerWeb3', e)
      }
    },
    async getContract() {
      const networkId = await this.web3Instance.eth.net.getId()
      const registry = Land.networks[networkId]
      if (registry) {
        const landContract = new this.web3Instance.eth.Contract(Land.abi, registry.address)
        this.landContract = landContract
      }
    },
    async registerLand(data) {
      try {
        useUIStore().showLoader()
        await this.getWeb3()
        await this.getContract()
        if (!this.account) {
          useUIStore().showAlert({ type: 'danger', message: 'Not connected to ethereum wallet' })
          useUIStore().hideLoader()
          return
        }

        const buf = Buffer.from(JSON.stringify(data))
        const ipfsResult = await ipfs.add(buf)
        console.log(ipfsResult)
        this.landContract.methods
          .registerLand(ipfsResult.path)
          .send({ from: this.account })
          .on('receipt', (receipt) => {
            console.log(receipt)
            useUIStore().showAlert({ type: 'success', message: 'Asset registered successfully' })
            useUIStore().hideLoader()
          })
          .on('error', (error) => {
            console.log(error)
          })
      } catch (error) {
        useUIStore().hideLoader()
        console.log(error)
      }
    }
  }
})
