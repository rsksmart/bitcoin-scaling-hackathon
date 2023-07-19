'use client'

import { useGlobalContext } from '../context/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons'
import { Card, CardBody } from '@material-tailwind/react'

export default function Header() {
  const { signer } = useGlobalContext()

  return (
    <header>
      <Card>
        <CardBody className="p-2">
          <div className="relative flex items-center justify-between w-full lg:max-w-68 sm:pr-2 sm:ml-0">
            <div className="relative left-0 z-50 flex h-full">
              <div className="relative flex items-center w-full h-full lg:w-64 group">
                <FontAwesomeIcon
                  className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                  style={{ height: 16, width: 16 }}
                  icon={faMagnifyingGlass}
                />
                <input
                  type="text"
                  className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
                  placeholder="Search"
                />
                <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                  +
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-end p-1 ml-5 mr-4 sm:mr-0 sm:right-auto">
              <div className="text-sm">
                <span className="text-gray-500">Connected Account </span>
                <br />
                <span className="font-mono">{signer}</span>
              </div>
              <a href="#" className="block relative ml-5">
                <FontAwesomeIcon
                  className="text-yellow-700"
                  style={{ height: 30, width: 30 }}
                  icon={faUser}
                />
              </a>
            </div>
          </div>
        </CardBody>
      </Card>
    </header>
  )
}
