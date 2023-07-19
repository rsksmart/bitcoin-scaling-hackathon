import { useState } from "react";
import { Signercontext, HiroWalletcontext } from "../ContextApi";
import Header from "./Header";
import Borrow from "./Borrow";
import Repay from "./Repay";
import { Box, Flex, Button } from "@chakra-ui/react";
import image from './OrdinalDAO.png';

export default function Main() {
  const [add, setAdd] = useState(""); // Hiro wallet
  const [signer, setSigner] = useState(); // Metamask wallet

  const sendSigner = (receivedSigner) => {
    setSigner(receivedSigner);
  };
  console.log(signer)
  const showPopUp = async (e) => {
    e.preventDefault();
    const userAddresses = await window.btc?.request("getAddresses");
    setAdd(userAddresses.result.addresses[1].address);
  };

  // // Not getting the array length

  return (
    <div className="container">
      <Box overflowX="hidden">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box flexBasis={{ base: "100%", md: "auto" }}>
          <Flex alignItems="center" mt={30} >
            <img src={image} alt="OrdinalDAO" width={100} height={100} borderRadius="50%"
            backgroundColor="#ccc"
            marginBottom={10}
            flexShrink={0}
            ml={24}/>
            <Box as="span" fontSize="xl" fontWeight="bold" ml={14}>
              OrdinalDAO
            </Box>
          </Flex>
        </Box>
        <Flex mt={10}>
        <Box flex={1}>
          <Button
            display="inline-flex"
            padding="15px 20px"
            alignItems="center"
            gap={10}
            borderRadius={5}
            border="2px solid #000"
            background="#FEC34A"
            cursor="pointer"
            mr={15}
            onClick={e=>showPopUp(e)}
          >
            Connect Hiro
          </Button>
          {/* {add ? add : "undefined"} */}
        </Box>
      <Header sendSigner={sendSigner} />
      </Flex>
      </Box>
      </Box>
      <main className="row align-items-start">
        <Signercontext.Provider value={{ signer }}>
          <HiroWalletcontext.Provider value={{ add }}>
            <Flex mt={10}>
              <Box flex={1} mr={1} mb={15}>
                <Borrow />
              </Box>
              <Box flex={1} mb={15}>
                <Repay />
              </Box>
            </Flex>
          </HiroWalletcontext.Provider>
        </Signercontext.Provider>
      </main>
    </div>
  );
}
