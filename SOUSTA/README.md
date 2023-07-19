# SOUSTA Asset Tokenization

This repository contains the contracts and frontend Dapp to demonstrate how we
as the SOUSTA fund managers will deploy and interact with an asset token on the
Rootstock blockchain.

[SOUSTA Dapp demo video](https://www.loom.com/share/2bc733b7e0ff4e2d90806d058ff7864a?sid=8663320f-1b20-4900-ae02-a3ece5bf7e95)

[SOUSTA pitch deck]()

[SOUSTA executive summary](https://github.com/gp22/bitcoin-scaling-hackathon/blob/0f4b9e86b20928dfaec5fc42188ee6b44875470a/SOUSTA/SOUSTA-executive-summary.pdf)

## Landing Page

It also contains a landing page highlighting four of our current investment
opportunities. Which are real investments we at SOUSTA have experience with.

![Landing Page Screenshot](https://github.com/gp22/bitcoin-scaling-hackathon/blob/ef65f2c047a1b029ee8fd89215b9f6fdef408ccd/SOUSTA/landing-page.jpg)

### Our Process

The landing page also includes a link to the Our Process page. Which explains
how we use AI in our evaluation of real estate investments.

### Dashboard

Access to the fund manager dashboard is handled with the rLogin service.

It's currently only mock authentication. We plan to use the rLogin service to
handle real authentication so dashboard access is restricted to fund managers
only.

---

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/gp22/bitcoin-scaling-hackathon.git
cd bitcoin-scaling-hackathon/SOUSTA
yarn install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to
deploy the contract:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

To deploy the contract to the Rootstock test network (with this option you
don't need to run the Hardhat test network or deploy to localhost):

```sh
npx hardhat run scripts/deploy.js --network rsktestnet
```

Finally, we can run the frontend with:

```sh
cd frontend
yarn install
yarn run dev
```

Open [http://localhost:3000/](http://localhost:3000/) to see the Dapp. You will
need to have [Metamask](https://metamask.io) installed and listening on
`localhost 8545` if you're using the Hardhat test network.

If you deployed to the Rootstock test network you'll need to
[add it](https://dev.rootstock.io/wallet/use/metamask/) to your
[Metamask](https://metamask.io).

Then you'll need to go to the [RSK Faucet](https://faucet.rsk.co/) to get
tRBTC to use for testing.

## Seed phrases

To make sure we use the same wallet for the Rootstock test network and
[Metamask](https://metamask.io); either copy the seed phrase from Metamask
into a file named `.rsktestnet-seed-phrase` in the root directory of this
repository.

Or run:

```sh
yarn run new-rsktestnet-seed-phrase
```

Then copy the seed phrase from the `.rsktestnet-seed-phrase` file and import
the account into Metamask.

## Testing

To run the Hardhat test suite to test the contracts:

```sh
yarn run test
```

To generate a test coverage report:

```sh
yarn run coverage
```

---

## Next.js Dapp

The `frontend` directory has the Dapp to interact with the contracts, along
with the landing page, built using [Next.js](https://nextjs.org/).

### Running the Dapp

The Dapp uses [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To run it, you just need to execute `yarn run dev` in the `frontend` directory
in a terminal, and open [http://localhost:3000](http://localhost:3000).

### Architecture of the Dapp

The Dapp consists of multiple React Components, which you can find in
`frontend/app`.

Most of them are presentational components.

The logic for connecting [Metamask](https://metamask.io) to the Rootstock
network and maintaining global state is in `frontend/app/context/store.js`.

The logic for interacting with the contracts and maintaining dashboard
state is in `frontend/app/dashboard/store.js`. All dashboard components
use functions and state from this file.

### Contracts

The contract addresses and ABI's are in the `frontend/contracts/compiled`
directory. They are compiled and copied to this directory when you run either
of the Hardhat deploy scripts above.

The `frontend/contracts/vendor` directory contains the ABI for interacting
with the ERC20 token. It's an [OpenZeppelin ERC20 token contract](https://docs.openzeppelin.com/contracts/4.x/erc20)
and is here because it isn't compiled by Hardhat. So it needs to live in the
repository.
