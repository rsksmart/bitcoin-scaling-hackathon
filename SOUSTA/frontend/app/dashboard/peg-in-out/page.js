'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {
  Alert,
  Card,
  Input,
  Button,
  CardBody,
  Spinner,
} from '@material-tailwind/react'

export default function Overview() {
  return (
    <div className="flex-col flex font-semibold h-full items-center justify-center relative">
      <div
        className="absolute bg-contain bg-no-repeat h-8 left-0 top-0 w-40"
        style={{
          backgroundImage: 'url("/logo-rootstock.png")',
          backgroundPosition: 'left center',
        }}
      ></div>
      <h1 className="mb-8 text-7xl">2-Way Peg App</h1>
      <h2 className="mb-8 text-4xl">Bridging BTC and RBTC</h2>
      <div className="mb-8">Select your token conversion</div>

      <div className="flex gap-6 mb-8">
        <Card className="">
          <CardBody className="mx-10">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center">
                <div className="">
                  <div
                    className="h-10 w-10"
                    style={{
                      backgroundImage:
                        'url("data:image/png;base64,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")',
                      backgroundPosition: 'center center',
                    }}
                  ></div>
                </div>
                <FontAwesomeIcon
                  style={{ height: 20, width: 20 }}
                  icon={faArrowRight}
                />
                <div className="">
                  <div
                    className="h-10 w-10"
                    style={{
                      backgroundImage:
                        'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAmCAYAAABH/4KQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAZXSURBVHgBtVhrbBRVFP5mdruttNAq1JZS7fJGlJRHqTx8FBWEEoVWEQ1GwMQfRAwgIfILSozxEVMwGqPRKP4xSiGtIRoagZZnoaiAhIA1bbcUCqU8Fiil3d2Z8Zy7u7Mz03229Uvu7p1z79z7zbnnnHvuldAHaJrmpL/FVPKpTKbCzxmBZjcVV+D/AJVaSZJq8X+CCGVQWUulRksczVS2Bj5qwImtoXJTGxhsppKB/oK/VIulKVXV1Nutmtp+WlMu1WnqzX81TfHEIthMZXKs+aUoxPjlSvjtydx25yKUhl+gXqiBdvUMNG9n74EzJ0EePh220cWQR8yMNE0Z2eMWJEIuQKwGISMPkGqFd996qBePIBFID4xD0oz3II+aj0QISvES89V9BN+fn6M/sI0vhX3GRkiDR1ibtsHv2S4ieiosOc3vTUzMqct6bsH765tQ245hICANeQiOpdWQktMjdXFR2c7atFsaNpuIdd+Ap+pVaNfOYqBgm/CKTuy3ul1wXW5Ch/sKUlPSkJc9GgtnlToHpaSVkaK26+ToYQX9rTAO5Kt+O25i9sc3QErPg+/gJkDxhHUS26jnYS98l8i049MfNxGxxtBcKUk44P4bTxUuwCCkuUlzLbLh3c0mYifKobQeRLywjSuBLXe20HbSnI+RvOIEaWiIuU/+W+K/Yv8PyEzPxvQJ1F+W0D10ELpyBuORkZORlZbJXQ6ID+afgNacwUHYK331W6OSccz/GrhvKNSW/dBuNAitqU3Vok3KKSRbvS2KDiIaDCnFM0vhHD5G1FdXbkCju0XU5459Oti7SidHWG6c2FdfTgxVRAN7nJQ1xRTDpMyJSJr3BaS0HKgWrcvDHtXrQWJ3PV3o9HWJ+rIpSzB3TJGJnBTw0Gb9TVqW7m8nIR7IwwvheKkybBtrTW3eA9/xcvLQXCQ9uQWSgWB7ZwfKD30Jjeqz8qZj8cRi4+tzOFlgcpxd6DMo5yvg3bsW8YDDQvIbgRDj64Fn9zLY8p6BPPZF0myuTtJqe3HgMyK3lh2iyChVyIbihXGp1Cv1UC/VwXv0A/TsKIba7o+lQWJid9m7ThTuF7RHoeG249ahhfGxzeWbxNfOIW5yzudC5Fz7Qg33rkP5pwJyVmBv7+qA56d5OiHl/I5eYyUvrzfuHM4gOdM2RVkF4iaXNTX0kJIhNKnduyE80z5lVWjMi0fNnhsGmrvRSI5zxwwTOY2+MF6wvUlDx+vP9gKy04LetqqRFr11HyIWtK5rVlG6bO4RPXwYwZ4ahHr5hNh/ebm0O5dCnZQeeHe/LuwtFnxSUu854M/1BSQKqnGTy50VIte0B0pztTB2z86F8J38yt9gS4Zj0c+QUrNjjpeUOswqusXkXKEZ7XoIiEiKEkj2QDn3iRA50lwQ2t0O+I59Qqro9guor23sC4gFNhMDeG91s821mCcvgEKZbtgBMkZR0K0yCzkUXD1t7pf6IBlhSkigKYhKjHcbs1Jc/MPkTpnI0XakNFSFHUTOLoB2/Sw5Qii+sWZSVjVRrKon27rAU0Eeac54labfEQ3yiNlWkeAkBU5CN3UxaaL7u3yR9kQC7522gtWwP7acswYSRDyKQDn9DbyHyhANjuLvKYWfZxSV0LJWyby29FCrizlGTXwt6mBaZxt/lah7KhbAe+R9UVcv1PqjP8VKtaUGvtqNMYmxrVmIsb2ZshI+YBQFW23TVtPSVkYNnLzE6GonezsDx7R3hIwTTdXdiERgL1xvFek2JeJc4LrAFRT6l20NooGTUS8dekT/7GkiliVKzDZyLqXtS6xi/SSmG4s1O2F4qpbS1nMYsSCl3E/Hv/EJHYLEQadkp9VL+WCzshe5AEE+eRXpAlpWz85FtN82YCAhpWaJkCQNedgodsGfx7mCAtny3koYgzI5h6OEsovsqRgwYqyx0korMTG3kVgvcoHGEhi2NAwaBsfLu8MZbsLgqwnH0j3ivGHBlnDXZAlfR/D5Qjm3A4mAAzt/XIQ7EyZWFq6hjxc55Jmthymh3EUZ8F8i+zCPSrsEOYjMKbvzWcg5MyJNs46IbUNfENcVGN+C3WrVlLbjmnr5D/91mPdurFeaqRRhIMDn2sCA/QVfQPJVQ/8vDyOQPKkljj6RktAHaKELaz4lOdH7wpoLZxacS/X5wvo/cYAbWH5jX/AAAAAASUVORK5CYII=")',
                      backgroundPosition: 'center center',
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-sm">BTC to RBTC</div>
            </div>
          </CardBody>
        </Card>
        <Card className="">
          <CardBody className="mx-10">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center">
                <div className="">
                  <div
                    className="h-10 w-10"
                    style={{
                      backgroundImage:
                        'url("data:image/png;base64,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")',
                      backgroundPosition: 'center center',
                    }}
                  ></div>
                </div>
                <FontAwesomeIcon
                  style={{ height: 20, width: 20 }}
                  icon={faArrowRight}
                />
                <div className="">
                  <div
                    className="h-10 w-10"
                    style={{
                      backgroundImage:
                        'url("data:image/png;base64,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")',
                      backgroundPosition: 'center center',
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-sm">RBTC to BTC</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mb-8">Or check the status of your transaction</div>

      <Card className="">
        <CardBody className="mx-10">
          <div className="flex flex-col items-center">
            <div
              className="bg-contain bg-no-repeat h-10 w-14"
              style={{
                backgroundImage:
                  'url("https://app.2wp.rootstock.io/img/status-icon.1d6aefa0.svg"',
                backgroundPosition: 'center center',
              }}
            ></div>
            <div className="text-sm">Transaction status</div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
