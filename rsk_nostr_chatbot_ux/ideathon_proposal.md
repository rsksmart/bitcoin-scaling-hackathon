# RSK decentralized chatbot on nostr.

All current smart contract UI's - web frontends and chatbots - suffer from centralization. 

Nostr supports FROST (treshold signatures), which means a more decentralized entity may exist, producing messages by consensus of multiple independent parties.

Also, chatbots are gaining traction as the UI for financial, government and healthcare applications. With the rise of generative AI, they're becoming the UI for multimedia creation tools as well.

We want to build a chatbot for people to interact with RSK via nostr messages such as:
- Buy 10 bpro.
- Show me my portfolio.
- Register cooldomain.rsk
- Send 10 DoC to someone.rsk
- Timestamp and store this message and its attachments.
- Long RBTC/DoC at 4x.
- Convert 10000 sats to rbtc.
- Convert 10000 rbtc sats to btc.

This could make RSK dapps more user friendly, and at the same time help dapps decentralize their UI concerns.

## Background & Context

Centralized Web UI and centralized notifications add risks that may erase the benefits of using a dapp.
The HTTP protocol and other messaging protocols work under the premise that each party in a communication is a single centralized entity. But these UI's are fundamental to make dapps usable. Nostr offers a unique infrastructure that allows for collective entities to participate in the protocol as if they were a single entity.

## Value proposition

We propose creating a multi-party entity on nostr (using FROST) that can chat with users translating from text form into blockchain queries and transactions the user can then sign with their wallet of choice.

Text UI has proven to be extremely flexible yet intuitive. Nostr clients run in most platforms.

One current approach for improving a decentralizing UX in dapps is to move things into the wallet GUI. But there's always tension between features and attack surface of the wallet, so the GUI's end up being too generic not refleting any specific use case. Another approach is to build a specific GUI for a contract (usually on the web). Specific client apps become a good target for cyberattacks.

By chatting with a decentralized entity users can interact with smart contracts without trusting a single party.

Dapp builders don't need to carry the burden of securing a centralized UI, and can leverage (and contribute) to the security efforts in the more generic nostr clients.

## Technical description

We will build a chatbot software that is to be run by a 'federation' of nodes. Each has its own access to the RSK blockchain and participates as a possible signer in a FROST scheme.

When the federation address receives a message, a reply is produced by a consensus algorithm between its members, signed by some of them and relayed back to the user.

User messages may be a query about some information on the RSK blockchain, or may require signing a transaction. For the later, the federation produces the transaction and gives it back to the user for signing. (Hopefully using deep links, but we need to make sure they work in all nostr clients).

The federation may keep state about the user such as their RSK account and events they suscribed to.

Initially the chatbot will only support interaction with known specific contracts, such as the two way peg, RNS, Rif identity, sovryn, money on chain, and rif storage. 

## Market Analysis
Nostr is still on its infancy and is a niche community of bitcoin, developers and social networking enthusiasts. It has over ~300000 users of which ~75000 can be deemed as trusted. 8000 trusted users publish something every day and around 300 USD are sent as micropayments for liking content. (zaps). The "trusted" user base grows almost 5% a month (the not trusted user base grows about 15%).

(data taken from https://stats.nostr.band/)

There are no other projects doing this at the moment (that we know of).

We think nostr can become the preferred way to interact with RSK for most contracts.

## Project Plan, Team & Resources
Our team has experience with the RSK ecosystem and decentralized technology, and we have been eager to work with Nostr for some time.

We will use part of the funds to promote RSK in nostr circles, and to propose nostr as the first UX into RSK smart contracts.

We are 2 full time developers participating as mentors in an apprentinceship program for junior developers who can contribute to the project.

We will need a number of federator nodes running the chatbot consensus protocol and preferrably their own RSK blockchain copy.

Current two way peg federators are a good fit for this role. Constata will be on board from the start.

We will offer this role to protocols that benefit from the chatbot as well, such as sovryn and money on chain. An incentive to pay for server costs may be needed as well.



