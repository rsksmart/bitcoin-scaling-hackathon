export default function AboutUs() {
  return (
    <>
      <main className="flex flex-col items-center justify-between">
        <div className="flex flex-col sm:flex-row mx-auto items-center px-24 py-16 bg-blue-900 dark:bg-gradient-to-t dark:from-lofty-darkest dark:to-lofty-dark w-full">
          <div className="hidden sm:block flex-1">
            <img
              src="/logo-rootstock-white.png"
              width="400"
              alt=""
              className="w-96"
            />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-center text-3xl sm:text-left sm:font-bold leading-105 text-transparent bg-clip-text bg-gradient-to-tl from-blue-400 to-white sm:tracking-tight-1 mb-10">
              We use the Rootstock blockchain
            </h2>
            <p className="text-xl font-light text-blue-50 mb-12">
              Rootstock offers faster transaction speeds and lower fees than the
              Bitcoin blockchain.
            </p>
          </div>
          <div className="block sm:hidden flex-1">
            <img
              src="/logo-rootstock-white.png"
              width="620"
              alt=""
              className="w-full"
            />
          </div>
        </div>
      </main>
    </>
  )
}
