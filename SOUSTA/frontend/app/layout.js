import './globals.css'
import { Inter } from 'next/font/google'
import { GlobalContextProvider } from './context/store'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SOUSTA',
  description: 'Asset Tokenization',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-blue-50 min-h-screen`}
      >
        <GlobalContextProvider>{children}</GlobalContextProvider>
      </body>
    </html>
  )
}
