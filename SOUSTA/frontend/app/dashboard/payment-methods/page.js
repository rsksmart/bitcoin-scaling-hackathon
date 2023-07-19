'use client'

import { Card, Typography } from '@material-tailwind/react'
import { Checkbox } from '@material-tailwind/react'

const CRYPTO_TABLE_HEAD = ['', 'Crypto']
const FIAT_TABLE_HEAD = ['', 'Fiat']
const STABLE_TABLE_HEAD = ['', 'Stable Coins']

const CRYPTO_TABLE_ROWS = [
  {
    name: 'Bitcoin (BTC)',
  },
  {
    name: 'Rootstock (RBTC)',
  },
  {
    name: 'Ethereum (ETH)',
  },
  {
    name: 'Litecoin (LTC)',
  },
]

const FIAT_TABLE_ROWS = [
  {
    name: 'US Dollar (USD)',
  },
  {
    name: 'Euro (EUR)',
  },
  {
    name: 'British Pound (GBP)',
  },
  {
    name: 'Mexican Peso (MXN)',
  },
]

const STABLE_TABLE_ROWS = [
  {
    name: 'USD Coin (USDC)',
  },
  {
    name: 'Tether (USDT)',
  },
  {
    name: 'Binance USD (BUSD)',
  },
  {
    name: 'Dollar on Chain (DOC)',
  },
  {
    name: 'RIF Dollar on Chain (RDOC)',
  },
  {
    name: 'Babelfish (XUSD)',
  },
]

export default function Overview() {
  return (
    <>
      <h1 className="font-semibold mb-4 text-5xl">Payment Methods</h1>
      <h2 className="text-lg">
        Fund managers will be able to select which currencies to accept as
        payment from investors to get into a fund.
      </h2>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <Card className="">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {CRYPTO_TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRYPTO_TABLE_ROWS.map(({ name }, index) => (
                <tr key={name} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue"
                      className="font-medium"
                    >
                      <Checkbox defaultChecked />
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {FIAT_TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIAT_TABLE_ROWS.map(({ name }, index) => (
                <tr key={name} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue"
                      className="font-medium"
                    >
                      <Checkbox defaultChecked />
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {STABLE_TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STABLE_TABLE_ROWS.map(({ name }, index) => (
                <tr key={name} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue"
                      className="font-medium"
                    >
                      <Checkbox defaultChecked />
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  )
}
