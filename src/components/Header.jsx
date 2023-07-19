import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Box, Button } from "@chakra-ui/react";

export default function Header({ sendSigner }) {
  // const [authenticated, setAuthenticated] = useState(false);
  let authenticated;
  const connectWallet = async (e) => {
    e.preventDefault();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner()
      // if(signer!="undefined")
      // {
      //     authenticated = true;
      //     console.log(authenticated)
      // }
      sendSigner(signer);
  }
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // sendSigner(signer);
    // setAuthenticated(true);

  return (
    <header className="my-5">
        <Box display="flex" alignItems="center" flex={1}> 
          {authenticated ? (
            <Button
              display="inline-flex"
              padding="15px 20px"
              alignItems="center"
              gap={10}
              borderRadius={5}
              border="2px solid #000"
              cursor="pointer"
              background="#FEC34A"
              mr={4}
            >
              Connected
            </Button>
          ) : (
            <>
              <Button
                display="inline-flex"
                padding="15px 20px"
                alignItems="center"
                gap={10}
                borderRadius={5}
                border="2px solid #000"
                cursor="pointer"
                background="#FEC34A"
                onClick={e=>connectWallet(e)}
                mr={4}
              >
                Connect Metamask 
              </Button>
            </>
          )}
        </Box>
    </header>
  );
}
