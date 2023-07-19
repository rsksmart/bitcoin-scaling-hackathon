'use client'

import { useDashboardContext } from '../store'
import {
  Alert,
  Button,
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Spinner,
} from '@material-tailwind/react'

export default function Mint() {
  const {
    deployToken,
    getRpcErrorMessage,
    transactionError,
    setTransactionError,
    transactionSuccess,
    setTransactionSuccess,
    txBeingSent,
  } = useDashboardContext()

  const onSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target.form)
    const name = formData.get('name')
    const ticker = formData.get('ticker')
    const supply = formData.get('supply')

    if (name && ticker && supply) {
      deployToken(name, ticker, supply)
    }
  }

  return (
    <>
      {txBeingSent && (
        <Alert className="mb-4">
          <div className="flex">
            <Spinner />
            <div className="ml-4">
              Waiting for transaction{' '}
              <span className="font-bold">{txBeingSent}</span> to be mined.
            </div>
          </div>
        </Alert>
      )}

      {transactionError && (
        <Alert
          className="break-all mb-4"
          color="red"
          open={!!transactionError}
          onClose={() => setTransactionError(null)}
        >
          {getRpcErrorMessage(transactionError)}
        </Alert>
      )}

      {transactionSuccess && (
        <Alert
          className="mb-4"
          color="green"
          open={transactionSuccess}
          onClose={() => setTransactionSuccess(null)}
        >
          Transaction <span className="font-bold">{txBeingSent}</span> mined
          successfully.
        </Alert>
      )}

      <Card className="w-1/3">
        <CardBody>
          <form>
            <div className="flex flex-col mb-4">
              <span className="font-bold">Mint SOUSTA Token</span>
            </div>
            <div className="mb-4 flex flex-col gap-6">
              <Input size="lg" label="Token Name" name="name" required />
              <Input size="lg" label="Token Ticker" name="ticker" required />
              <Input
                size="lg"
                label="Initial Supply"
                name="supply"
                required
                type="number"
              />
              <Select label="Token Type">
                <Option>Asset Token</Option>
                <Option>Fund Token</Option>
                <Option>Third-Party Token</Option>
              </Select>
            </div>
            <div className="">
              <Button disabled={!!txBeingSent} onClick={onSubmit}>
                Mint
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  )
}
