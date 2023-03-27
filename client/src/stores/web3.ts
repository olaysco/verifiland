import { defineStore } from 'pinia'
import { getWeb3 } from '@/services/web3'
import Land from '../abis/LandRegistrationSystem.json'
import Web3 from 'web3'
import ipfs from '@/services/ipfs'

import { useUIStore } from './ui'
import { Buffer } from 'buffer'
import router from '@/router'
import { useUserStore } from './user'

declare let window: any

export type TransferData = {
  land_id: string
  new_owner: string
}

export const useWeb3Store = defineStore({
  id: 'web3',
  state: (): {
    web3Instance: Web3 | null
    provider: any
    account: string
    landContract: any
    assets: any[]
    transferredLands: any[]
    landOwnerIds: Set<string>
  } => ({
    web3Instance: null,
    provider: null,
    account: '',
    landContract: null,
    assets: [],
    transferredLands: [],
    landOwnerIds: new Set<string>()
  }),
  getters: {},
  actions: {
    async getWeb3() {
      try {
        const { provider, web3 } = await getWeb3()
        this.web3Instance = web3
        this.provider = provider
        let accounts = await this.web3Instance.eth.getAccounts()
        if (accounts.length < 1) {
          accounts = await window.ethereum.request({ method: 'eth_accounts' })
        }
        this.account = accounts[0]
        console.log(accounts)
      } catch (e) {
        console.log('error in action registerWeb3', e)
      }
    },
    async getContract() {
      const networkId = await this.web3Instance.eth.net.getId()
      const registry = Land.networks[networkId]
      if (registry) {
        const contract = window.TruffleContract(Land)
        contract.setProvider(this.provider)
        this.landContract = await contract.at('0xF9114eDFc4191205B6a10241B67A9978b0a9055d')
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
        const result = await this.landContract.registerLand(ipfsResult.path, { from: this.account })
        console.log(result)
        useUIStore().showAlert({ type: 'success', message: 'Asset registered successfully' })
        useUIStore().hideLoader()
        router.push('/assets')
      } catch (error) {
        useUIStore().hideLoader()
        console.log(error)
      }
    },
    async getOwnedLands() {
      try {
        this.assets = []
        await this.getWeb3()
        await this.getContract()
        const ownedLands = await this.landContract.getOwnedLands.call({ from: this.account })
        console.log(ownedLands)
        this.setAssets(ownedLands)
      } catch (error) {
        console.log(error)
      }
    },
    async getAllLands() {
      try {
        this.assets = []
        await this.getWeb3()
        await this.getContract()
        console.log(this.account)
        const allLands = await this.landContract.getAllLands.call({ from: this.account })
        this.setAssets(allLands)
      } catch (error) {
        console.log(error)
      }
    },
    async createTransferRequest(data: TransferData) {
      try {
        useUIStore().showLoader()
        await this.getWeb3()
        await this.getContract()

        const receipt = await this.landContract.createTransferRequest(
          data.land_id,
          data.new_owner,
          { from: this.account }
        )
        console.log(receipt)
        useUIStore().showAlert({
          type: 'success',
          message: 'Asset transfer request created successfully'
        })
        router.push('/transfer-list')
      } catch (error) {
        console.log(error)
      } finally {
        useUIStore().hideLoader()
      }
    },
    async getTransferredLands() {
      try {
        this.transferredLands = []
        await this.getWeb3()
        await this.getContract()

        const result = await this.landContract.getTransferredLands.call({ from: this.account })

        if (Array.isArray(result) && result.length > 0) {
          result.forEach((land) => {
            this.transferredLands.push({
              land_id: land['land_id'],
              current_owner: '0x',
              owner_approved: land['owner_approved'],
              new_owner: land['new_owner'],
              created_at: land['created_at'] * 1000,
              govt_approved: land['govt_approved'],
              approved_at: (land['approved_at'] ?? 0) * 1000
            })
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getAllTransferredLands() {
      try {
        this.transferredLands = []
        await this.getWeb3()
        await this.getContract()

        for (const element of this.landOwnerIds.values()) {
          const result = await this.landContract.getAddressTransferredLands.call(element, {
            from: this.account
          })

          if (Array.isArray(result) && result.length > 0) {
            result.forEach((land) => {
              this.transferredLands.push({
                land_id: land['land_id'],
                current_owner: element,
                owner_approved: land['owner_approved'],
                new_owner: land['new_owner'],
                created_at: land['created_at'] * 1000,
                govt_approved: land['govt_approved'],
                approved_at: (land['approved_at'] ?? 0) * 1000
              })
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async setAssets(retrievedAssets: any) {
      if (Array.isArray(retrievedAssets) && retrievedAssets.length > 0) {
        retrievedAssets.forEach(async (land) => {
          const chunks = []
          for await (const chunk of ipfs.cat(land['ipfsHash'])) {
            chunks.push(chunk)
          }
          const details = {
            current_owner: land['current_owner'],
            created_at: land['created_at'] * 1000,
            is_govt_approved: land['is_govt_approved'],
            land_id: land['land_id'],
            previous_owners: land['previous_owners'],
            ...JSON.parse(Buffer.concat(chunks).toString())
          }
          this.landOwnerIds.add(land['current_owner'])
          console.log(this.landOwnerIds)
          this.assets.push(details)
        })
      }
    },
    async approveTransferRequest(landId: string, currentOwnerAddress: string) {
      try {
        useUIStore().showLoader()
        await this.getWeb3()
        await this.getContract()
        if (!this.account) {
          useUIStore().showAlert({ type: 'danger', message: 'Not connected to ethereum wallet' })
          useUIStore().hideLoader()
          return
        }
        const success = await this.landContract.approveTransferRequest(
          landId,
          currentOwnerAddress,
          {
            from: this.account
          }
        )
        console.log(success)
        useUIStore().showAlert({ type: 'success', message: 'Asset transferred successfully' })
      } catch (error) {
        console.log(error)
      } finally {
        useUIStore().hideLoader()
      }
    },
    async addAdmin(address: string) {
      try {
        useUIStore().showLoader()
        await this.getWeb3()
        await this.getContract()
        await this.landContract.addAdmin(address, { from: this.account })
        useUIStore().showAlert({
          type: 'success',
          message: 'Contract Admin access granted to address.'
        })
      } catch (error) {
        console.log(error)
      } finally {
        useUIStore().hideLoader()
      }
    },
    async approveLand(landId: string) {
      try {
        useUIStore().showLoader()
        await this.getWeb3()
        await this.getContract()
        await this.landContract.approveLand(landId, { from: this.account })
        useUIStore().showAlert({
          type: 'success',
          message: 'Land approved successfully.'
        })
      } catch (error) {
        console.log(error)
      } finally {
        useUIStore().hideLoader()
      }
    }
  }
})
