# Executive Summary

We want to bring Ads to Nostr cutting out the middle man.

Content creators will be able to monetize their accounts and have full control of the ads they publish and frequency in which they publish. Payment is guaranteed to them when they submit a signed nostr event that meets the advertiser's requirements to an RSK smart contract.

Advertisers will be able to reach the Nostr audience, which they can't do now.
And they can verify the cost and reach of their campaigns without trusting a centralized media marketplace.

Nostriches can support content creators paying with their attention instead of sats. They will get curated ads and won't be tracked by ad companies.

## Background and Context

Nostr is a messaging network like Twitter, supporting various use cases, but with a focus on micro-blogging. Unlike Twitter or Facebook, Nostr doesn't use a centralized algorithm to boost specific content or ads.

The absense of a centralized ad network to exploit means that bot armies that fake engagement and discourse are unnecessary. Follower counts and impressions become less important, making it harder for a few users to hoard followers.

To support the infrastructure micropayments are used across the board: Peers donate to quality content using Lightning Network through a protocol extension called Zaps, and paid relays guarantee quality services and anti-spam measures.

As Nostr grows the attention it captures becomes valuable for advertising, and to be compatible with its decentralized organization nature, ads should acknowledge that advertisers, content creators and users are free agents. Users reward content creators with their attention, which they then sell to advertisers. (Update: After this was initially written twitter has at least started acknowledging that the relationship between content creators and their audience is theirs and not twitter's. https://twitter.com/elonmusk/status/1666331961281900545?t=D7tqicZWjYlMyfsaMJZWCA&s=19)

Advertisement is a powerful tool, but it has a bad reputation, mostly on account of it being taken over by a cartel of middlemen. Advertisers, content creators and users relinquish control to ad platforms that cannot be independently audited.

Content creators have little to no control over the ads served to their followers. Also, the terms and revenue from monetization are set by the platform operators.

Advertisers cannot verify if their ads are being served or if they're being targetted correctly.

Users have no say in any of this, as they're captive to the platform selling their attention.

## Value Proposition

We want to use public market mechanisms to drive attention where it's most valuable and build a decentralized ad network. Anyone can advertise or boost their content by paying peers to post, like, or repost.

Nostriches can take on the role of advertisers of various sizes, they decide which product gets the spotlight and how often they want to participate in ads. The rewards they receive are public, which helps with targetting and accountability.

Some users have already created robots to send zaps to users who post something or comment on a specific post. However, these interactions are not seen as a contractual obligation, and there is no guarantee of payment if a bot breaks, runs out of money, or misses a message. All participants are paid the same even if some have better reach. Additionally, robots are vulnerable to sybil attacks and spam, and only Lightning Network Bitcoin is supported, which is susceptible to high fees on the Bitcoin network. No stablecoins are supported yet.

### Key benefits

- Content creators know when and how much they will get paid on a per-campaign basis, before they decide to participate in it. They can decide what messages to pass on to their audience and how often. They can get paid in RBTC or stablecoins on RSK, and the advertiser cannot take their payment back.

- Advertisers can monitor their campaigns in the open network and have a more direct relationship with content creators. They can choose which content creators participate in the campaign, and thus control the context in which their ad will be presented. They can advertise anything they want as long as there are content creators willing to participate in the campaign.

- Users accept ads as a way to support content creators. They should get a curated and highly relevant ad experience, otherwise they can take their concerns directly to the content creator.

## Technical description

We plan to create tools that enable transparent and automated advertising campaigns on Nostr, using smart contracts to ensure that Nostr users are paid for their participation and advertisers only pay for the publicity they receive. Our tools will also include an open appraisal algorithm and database to assess the value of a Nostr user's account, backoffice tools for advertisers, a customized Nostr relay, and a chatbot for advertisers to communicate with Nostr users.

We have chosen RSK as the smart contract platform for Nostr due to its popularity among Bitcoin users, who make up a significant portion of Nostr's user base. Using well-known units of account like RBTC and DOC stablecoin will provide certainty when budgeting and assessing liquidity or cash-out options.

Our account "appraisal" algorithm will consist of mapping and weighting the entire nostr social graph. This kind of large dataset is costly to build and maintain, and can possibly be rented out in several ways to continue funding the project.

We've been laying some groundwork regarding on-chain validation of nostr messages and mapping the whole nostr network for building the appraisal algorithm. You can see the code here: https://github.com/constata-eu/rsk-nostr

### THE SMART CONTRACT

The smart contract represents an advertisement campaign, acting as an escrow between Advertisers and Participants. To prevent spam, Nostriches must be pre-approved (appraised) by the Advertiser.

The worflow is as follows:

#### Step 1
The Advertiser creates a Campaign, by deploying the contract which should have:
  - A template Nostr post, which is the content and tags participants should post.
  - An event id and reccommended relay for a message announcing this campaign. (This event ID will be known as the campaign id).
  - An entry limit date: Participants may claim their reward before this date.
  - An end date for the campaign, which is when participants get paid and may delete the post if they wish.
  - A list of hex encoded pubkeys belonging to the advertiser and helpers.
  - The funds to pay participants, which may be increased at any point by the advertiser.

The contract also keeps a list of all the rewards claimed.

#### Step 2
A Nostrich willing to participate requests an appraisal from the Advertiser, this is done off-chain, via nostr direct messages.
The appraisal is digitally signed by the advertiser, non transferable and usable only in this specific campaign.
The Nostrich may suggest the reward they expect to receive for participating.
An appraisal may be denied if the Advertiser deems the Nostrich account to be fraudulent or not in the campaign audience target.
An appraisal does not lock funds in the contract, participants are encouraged to not speculate and post as soon as possible.

An appraisal may be requested with a type 1 note sent to the advertiser.
```
{
  "id": "...",
  "pubkey": <Participant pubkey>,
  "created_at": "...",
  "kind": 1,
  "tags": [
    ["p", <pubkey of the advertiser>],
    ...
  ],
  "content": "<any text><any whitespace><participants payout account><any whitesapce><campaign id>",
  "sig": "...",
}
```

The appraisal is sent back as a reply event to that message.
```
{
  "id": "...",
  "pubkey": <the advertiser pubkey>,
  "created_at": "...",
  "kind": 1,
  "tags": [
    ["p", <pubkey of the participant>],
    ["e", <event id of the appraisal request>],
    ["t", "accepted"], # Only if the appraisal was accepted.
    ["amount", <the reward amount>], # Only if the appraisal was accepted.
  ],
  "content": <Further instructions from the advertiser or a rejection reason>,
  "sig": "...",
}
```

#### Step 3
The Nostrich makes a post following the campaign's instructions for content and tags, then invokes the contracts "claim reward" function,
which receives the JSON payload of the three events:
  - The appraisal request.
  - The appraisal.
  - The post event json.

The contract verifies the received events and adds the claim amount and rsk payout account to the claimed reward list.

Claim may be denied if: 
  - The signatures are wrong, or the three events are incoherent.
  - The Nostrich already claimed a reward in this campaign.
  - The entry limit date is over.

The Advertiser monitors claims to further relay the post. 
The Advertiser also monitors relevant public relays for delete events on the claimed post.
Early deletions can be reported to the contract, and will remove the participant's claim.

Appraisals do not lock funds to prevent DoS &mdash; participants should check the contract's balance before issuing a claim to avoid this.
A successful campaign may receive claims in excess of its funding, if so, participants may either delete their post, or may wait and see if the advertiser increases the campaign budget.
  
#### Step 4
At the end date the contract pays the participants in the same order the claims were received, and they may delete their post.

### IMPROVED UX FOR NOSTR USERS

Both Constata and Advertisers will work on improving the Nostr User user experience.

The advertiser has their own Nostr account where they announce new campaigns and provide instructions on how to participate. They may also directly invite relevant participants to the campaign.

Participants can also participate in a campaign without requesting an appraisal if they are willing to do so out of goodwill. In this case, the advertiser can message the participant with an appraisal message and wait for the participant's RSK account as a reply.

Additionally, the advertiser can monitor all accounts that have requested an appraisal and offer to claim the bounty on their behalf as soon as they detect that the required message has been posted. The contract will provision a refund of transaction fees deducted from the participant's reward.

Finally, Constata will provide a web frontend that allows any user to claim rewards on any campaign from their own wallet. The participant only needs to enter their pubkey, and the tool will scan for rewards they may be ready to claim.

## Market Analysis
  Nostr is still on its infancy and is a niche community of bitcoin, developers and social networking enthusiasts.
  It has over ~300000 users of which ~75000 can be deemed as trusted.
  8000 trusted users publish something every day and around 300 USD are sent as micropayments for liking content. (zaps).
  The "trusted" user base grows almost 5% a month (the not trusted user base grows about 15%).

  (data taken from https://stats.nostr.band/)

  There are no other projects doing this at the moment (that we know of).
  
  The project may be viable for niche advertisers (crypto projects) but nostr as a whole needs to grow a lot more before it can become viable for more general advertisers.
  
## Project Plan, Team & Resources

Our team has experience with the RSK ecosystem and decentralized technology, and we have been eager to work with Nostr for some time.

After we build the required tools, we plan to fund campaigns for popular RSK ecosystem projects at no charge, and in the future, we may provide technology for advertisers for a fee and participate in their campaigns.

We are 2 full time developers participating as mentors in an apprentinceship program for junior developers who can contribute to the project.

For running the chatbot we will need around 100USD a month in infrastructure. And we can use third party API's to appraise nostr accounts. But we will eventually need to build our own appraisal algorithm and map the entire nostr network, which may drive server costs up to 1000USD a month.

We will also need some help reviewing the smart contract to reduce gas consumption, as validating schnorr signatures on-chain is expensive.

## This would be only the beginning
While this project may change the way we think about ads, and foster RSK and Nostr adoption, we think there's more to it.
It's an in-bound channel from nostr into rsk. After this, we can build an outbound channel using nostr MuSig accounts, and end up with a nostr-rsk bridge.
We think a nostr client can be a decentralized front-end for smart contracts, that replaces the current centralized web UIs with a conversational interface which is also more compatible with the current AI chat offerings.

