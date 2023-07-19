'use client'

import { Typography } from '@material-tailwind/react'
import { useGlobalContext } from '../context/store'

export default function WalletConnect() {
  const { login, logout, signer } = useGlobalContext()

  return (
    <button
      onClick={() => {
        !!signer ? logout() : login()
      }}
    >
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <div className="flex items-center">
          {!!signer ? 'Disconnect Wallet' : 'Fund Manager Login'}
        </div>
      </Typography>
    </button>
  )
}
