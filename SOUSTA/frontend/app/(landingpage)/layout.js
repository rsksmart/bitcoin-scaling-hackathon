import Nav from './nav'
import Footer from './footer'

export default function RootLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
