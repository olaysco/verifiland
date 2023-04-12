import ipfs from '@/services/ipfs'
import { useWeb3Store } from './../stores/web3'
import { ref } from 'vue'
import type { Land } from '@/stores/types'
import { Buffer } from 'buffer'

export function useVerifyLand() {
  const landId = ref('')
  const land = ref<Land>()
  const isShowVerifyModal = ref<boolean>(false)

  const verify = async () => {
    try {
      if (landId.value.length < 1) {
        throw new Error('Land ID not valid')
      }
      const res = await useWeb3Store().getLand(landId.value)
      if (res == undefined || !Array.isArray(res)) {
        throw new Error('Land ID not valid')
      }

      displayModal(res)
    } catch (error) {
      console.log(error)
    }
  }

  const displayModal = async (detail: any) => {
    const chunks = []
    for await (const chunk of ipfs.cat(detail['ipfsHash'])) {
      chunks.push(chunk)
    }
    land.value = {
      current_owner: detail['current_owner'],
      created_at: detail['created_at'] * 1000,
      approved_at: detail['approved_at'] * 1000,
      is_govt_approved: detail['is_govt_approved'],
      land_id: detail['land_id'],
      previous_owners: detail['previous_owners'],
      ...JSON.parse(Buffer.concat(chunks).toString())
    }
    isShowVerifyModal.value = true
  }

  const closeVerifyModal = () => {
    isShowVerifyModal.value = false
  }
  return { verify, landId, isShowVerifyModal, closeVerifyModal, land }
}
