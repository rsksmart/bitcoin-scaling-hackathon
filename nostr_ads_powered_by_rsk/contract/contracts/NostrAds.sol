// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Schnorr.sol";

/*
    An escrow between Advertisers and Collaborators.
    Advertisers set up campaigns, inviting Collaborators to post a content to Nostr for a reward.
    Collaborators submit proof of the reward before a given submissionDeadline date.
    Later - at payoutDate - when the content has been published for a while, collaborators collect payment.
    A collaborator may not collect their payment if they don't submit proof,
    Alternatively - but not implemented yet - they may not collect if they delete
    the content before payoutDate, and proof of the deletion is submitted.
    Anyone can submit proof of content deletion, and anyone can trigger the outstanding payouts.
    
    NOTICE: This contract is still too expensive. There have not been substantial efforts in batching or other
      optimizations, but there may be silly tricks to shave off some gas, which will affect readability.
*/
contract NostrAds {
    /*
      The NewCollaborator is meant to be used by an advertiser when creating a campaign.
      The internal representation for a collaborator has internal fields we don't want to mix up.
      We need to know their nostrHexPubkey and the schnorr x and y points for verifying the
      collaborator messages, but they're too expensive to calculate in the smart contract.
      The advertisers must derive the "nostrAffine*" attributes themselves.
      Collaborators should also make sure their details are correct before participating.
      If fields don't match, the proof will be unverifiable, and the funds will return to the advertiser.
      It is safe to allow the collaborator to set their affineY and affineX at a later date, but we haven't
      implemented it yet
    */
    struct NewCollaborator {
        string nostrHexPubkey;
        uint256 rewardAmount;
        address rewardAddress;
        uint256 nostrAffineX;
        uint256 nostrAffineY;
    }

    struct Collaborator {
        string nostrHexPubkey;
        uint256 rewardAmount;
        address payable rewardAddress;
        uint256 nostrAffineX;
        uint256 nostrAffineY;
        bool canCollect;
    }

    struct Campaign {
        string content;
        uint256 funding;
        address payable creator;
        uint256 submissionDeadline;
        uint256 payoutDate;
        bool payoutsDone;
        uint collaboratorCount;
        mapping(uint => Collaborator) collaborators;
    }

    mapping(uint => Campaign) public campaigns;
    uint public campaignCount;

    IERC20 public rewardTokenContract;
    
    constructor(address _rewardTokenAddress) {
        rewardTokenContract = IERC20(_rewardTokenAddress);
    }

    function createCampaign(string memory _content, uint256 _funding, uint256 _submissionDeadline, uint256 _payoutDate, NewCollaborator[] memory _collaborators) public returns (uint) {
        require(_funding > 0, "Amount must be greater than zero");
        require(_collaborators.length > 0, "Must set some collaborators");

        Campaign storage campaign = campaigns[campaignCount];
        campaign.content = _content;
        campaign.funding = _funding;
        campaign.creator = payable(msg.sender);
        campaign.submissionDeadline = _submissionDeadline;
        campaign.payoutDate = _payoutDate;
        campaign.payoutsDone = false;

        uint256 totalRewards = 0;
        for (uint i = 0; i < _collaborators.length; i++) {
            NewCollaborator memory source = _collaborators[i];
            totalRewards += source.rewardAmount;
            campaign.collaborators[i] = Collaborator(
                source.nostrHexPubkey,
                source.rewardAmount,
                payable(source.rewardAddress),
                source.nostrAffineX,
                source.nostrAffineY,
                false
            );
            campaign.collaboratorCount = i + 1;
        }

        require(totalRewards == _funding, "Funding must be exactly the total rewards amount");
        require(rewardTokenContract.transferFrom(msg.sender, address(this), _funding), "Transfer failed");
        
        return campaignCount++;
    }

    // Anyone can submit proof of a message being published, likely a Collaborator or someone on their behalf.
    // The r value is the first 32 bytes of the signature, and the s value are the remaining 32,
    function submitProof(uint _campaignIndex, uint _collaboratorIndex, uint256 created_at, uint256 _r, uint256 _s) public {
        require(campaigns[_campaignIndex].funding > 0, "No such campaign");
        Campaign storage campaign = campaigns[_campaignIndex];

        require(block.timestamp <= campaign.submissionDeadline, "Submission date is over");

        Collaborator storage collaborator = campaign.collaborators[_collaboratorIndex];

        require(collaborator.rewardAmount > 0, "No such collaborator");

        bytes memory message = abi.encodePacked(
            "[0,\"",
            collaborator.nostrHexPubkey,
            "\",",
            Strings.toString(created_at),
            ",1,[],\"",
            campaign.content,
            "\"]"
        );

        require(Schnorr.verify(
            sha256(message),
            collaborator.nostrAffineX,
            collaborator.nostrAffineY,
            _r,
            _s
        ), "Invalid proof");

        collaborator.canCollect = true;
    }
    
    function payAllCollaborators(uint _campaignIndex) public {
        require(campaigns[_campaignIndex].funding > 0, "No such campaign");
        Campaign storage campaign = campaigns[_campaignIndex];
        
        require(block.timestamp >= campaign.payoutDate, "It's not payout date yet");
        require(!campaign.payoutsDone, "Payouts already done for this campaign");

        uint256 remainder = campaign.funding;
        for (uint256 i = 0; i < campaign.collaboratorCount; i++) {
            Collaborator storage collaborator = campaign.collaborators[i];
            
            if (collaborator.canCollect) {
                remainder -= collaborator.rewardAmount;
                require(rewardTokenContract.transfer(collaborator.rewardAddress, collaborator.rewardAmount), "Payout failed");
            }
        }

        if ( remainder > 0 ) {
            require(rewardTokenContract.transfer(campaign.creator, remainder), "Payout for remainder failed");
        }

        campaign.payoutsDone = true;
    }

    function getCampaignCollaborator(uint _a, uint _b) public view returns (Collaborator memory) {
        return campaigns[_a].collaborators[_b];
    }
}
