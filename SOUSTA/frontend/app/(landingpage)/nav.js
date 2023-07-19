'use client'

import routes from '../routes'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Button,
  Collapse,
  IconButton,
  Navbar,
  Typography,
} from '@material-tailwind/react'
import WalletConnect from './walletconnect'

export default function Nav() {
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false),
    )
  }, [])

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link href={routes.ourProcess}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <div className="flex items-center">Our Process</div>
        </Typography>
      </Link>
      <Link href={routes.invest}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <div className="flex items-center">Invest</div>
        </Typography>
      </Link>
      <Link href={routes.products}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <div className="flex items-center">Products</div>
        </Typography>
      </Link>
      <Link href={routes.aboutUs}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <div className="flex items-center">About Us</div>
        </Typography>
      </Link>
      <WalletConnect />
    </ul>
  )

  return (
    <Navbar className="bg-white border-none z-10 h-max max-w-full rounded-none shadow-none py-2 px-24">
      <div className="flex items-center justify-between">
        <Link href={routes.home}>
          <div className="flex h-12 items-center relative w-60">
            <Image
              alt="SOUSTA Logo"
              className="absolute right-12"
              src={'/SOUSTA-Logo.svg'}
              width={240}
              height={48}
            />
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
          >
            <span>Investor Login</span>
          </Button>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-black hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
        <Button variant="gradient" size="sm" fullWidth className="mb-2">
          <span>Investor Login</span>
        </Button>
      </Collapse>
    </Navbar>
  )
}
