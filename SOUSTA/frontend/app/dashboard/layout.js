import Header from './header'
import Nav from './nav'
import { DashboardContextProvider } from './store'

export default function DashboardLayout({ children }) {
  return (
    <main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl">
      <div className="flex items-start justify-between">
        <Nav />
        <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
          <Header />
          <div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
            <DashboardContextProvider>{children}</DashboardContextProvider>
          </div>
        </div>
      </div>
    </main>
  )
}
