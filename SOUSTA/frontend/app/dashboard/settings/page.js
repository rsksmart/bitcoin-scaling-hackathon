export default function Settings() {
  return (
    <div>
      <h1 className="font-semibold mb-4 text-5xl">To Do:</h1>
      <ul className="flex flex-col gap-4 list-disc pl-8 text-xl">
        <li key={1}>
          Implement authentication to restrict who can access the app.
        </li>
        <li key={2}>
          Implement RIF multisig for controlling who can spend from the fund.
        </li>
        <li key={3}>Implement a way to time-lock investor funds.</li>
        <li key={4}>
          Implement RIF gateways to provide scheduling capability to release
          time-locked investor funds.
        </li>
      </ul>
    </div>
  )
}
