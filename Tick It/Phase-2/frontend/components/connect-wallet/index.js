import React, { useEffect, useState } from "react";
import { ConnectWalletComponent, Identicon } from "@cryptogate/react-ui";
import { linkWallet, getWalletsByUser } from "../../axios/wallets.axios";
import { useEvm } from "@cryptogate/react-providers";

const ConnectWallet = ({ active, connected = <Identicon /> }) => {
  const { account } = useEvm();
  return (
    <ConnectWalletComponent
      ActiveComponent={active}
      ConnectedComponent={connected}
      LocalStorage
      onSign={() => {
        linkWallet({ address: account });
      }}
    />
  );
};

export default ConnectWallet;
