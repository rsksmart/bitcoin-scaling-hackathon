'use client'

import { useDashboardContext } from '../../store'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Input,
  Spinner,
} from '@material-tailwind/react'

export default function Page({ params }) {
  const { contractAddress } = params
  const { getBalanceAtAddress, tokens } = useDashboardContext()
  const token = tokens[contractAddress]

  const onGetBalance = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target.form)
    const walletAddress = formData.get('walletAddress')

    if (walletAddress) {
      getBalanceAtAddress(contractAddress, walletAddress)
    }
  }

  return (
    <>
      {token && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <form>
                <div className="flex flex-col mb-4">
                  <span className="font-bold">Transfer {token.symbol}</span>
                </div>
                <div className="mb-4 flex flex-col gap-6">
                  <Input size="lg" label="To Address" name="address" required />
                </div>
                <div className="">
                  <Button>Transfer</Button>
                </div>
              </form>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <form>
                <div className="flex flex-col mb-4">
                  <span className="font-bold">
                    Get {token.symbol} balance at wallet address
                  </span>
                </div>
                <div className="mb-4 flex flex-col gap-6">
                  <Input
                    size="lg"
                    label="Wallet Address"
                    name="walletAddress"
                    required
                  />
                </div>
                <div className="">
                  <Button onClick={onGetBalance}>Get Balance</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  )
}
