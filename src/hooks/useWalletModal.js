import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { closeWallet, openWallet } from '../state/wallet/actions'

const useWalletModal = () => {
  const dispatch = useDispatch()

  const closeWalletModal = useCallback(() => {
    dispatch(closeWallet())
  }, [dispatch])

  const openWalletModal = useCallback(() => {
    dispatch(openWallet())
  }, [dispatch])

  return { openWalletModal, closeWalletModal }
}

export default useWalletModal
