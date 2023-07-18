import React, { useState, useContext , useEffect } from "react";
import { ethers } from "ethers";
import { Signercontext, HiroWalletcontext } from "../ContextApi";
import TreasuryJSON from "../utils/Treasury.json";
import TreasuryAddress from "../utils/TreasuryAddress";
import { Box, Button, Flex, Heading, Image, Input, Text } from "@chakra-ui/react";
import LendingJSON from "../utils/Lending.json"
import LendingAddress from "../utils/TreasuryAddress";
export default function Borrow() {
  const { signer } = useContext(Signercontext);
  const { add } = useContext(HiroWalletcontext);
  const TreasuryContract = new ethers.Contract(TreasuryAddress, TreasuryJSON.abi, signer);
  const LendingContract =  new ethers.Contract(
    LendingAddress,
    LendingJSON.abi,
    signer
    );

  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");
  const [ownAdd, setAdd] = useState("");
  const [satNum, setsatNum] = useState("");
  const [ordinals, setOrdinals] = useState([]);

  let num = 0.006 * 20;
  let denom = 100;
  let LTV = num / denom;
  let ordVal = 0.006;

  const handleSelectButtonClick = () => {
    setShowModal(true);
  };

  const handleOrdinalSelection = (ordinal,e) => {
    e.preventDefault()
    setShowModal(false)
    console.log("Selected Ordinal:", ordinal);
    setId(ordinal.id);
    setAdd(ordinal.address);
    setsatNum(ordinal.sat_ordinal);
  };

  const collectOrdinals = async () => {
    fetch(`https://api.hiro.so/ordinals/v1/inscriptions?address=${add}`, {
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          response.json().then((json) => {
            setOrdinals(json.results);
          });
        } else {
          console.log("Error");
        }
      });
  };


  const processLoan = async (e) => {
    e.preventDefault();
    try {
      await TreasuryContract.withdraw(ordVal * 10 ** 18);
    } catch (error) {
      alert("Error in sending transaction");
    }
    try {
      await LendingContract.requestForLoan(ordVal * 10 ** 18);
    } catch (error) {
      alert("Error in sending transaction");
    }
  };
  const fakeFund =async()=>{
     let tx = await TreasuryContract.fakeFund({value:ethers.parseUnits("0.02",18)})
  
     }
    //  fakeFund()
useEffect(()=>{
  collectOrdinals();
},[add])
  return (
    <div>
      <Flex mt={30}>
        <Box
          flex={1}
          p={40}
          borderWidth={1}
          borderRadius={30}
          background="#D9D9D9"
          width={300}
          height={650}
          flexShrink={0}
          mr={25}
          ml={50}
        >
          <Flex alignItems="center" mb={2}>
            <Box
              w={46}
              h={46}
              borderRadius="50%"
              backgroundColor="#ccc"
              marginBottom={10}
              flexShrink={0}
            />
            <Heading size="md" ml={4} mb={2}>
              Stake your Ordinal, Borrow rBTC
            </Heading>
          </Flex>

          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Ordinal Content:</Text>
            <Box ml="auto">
              <Image
                src={`https://ordinals.com/content/${id}`}
                alt=""
                w={50}
                h={50}
                borderRadius="full"
                backgroundColor="#ccc"
              />
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Ordinal Inscription ID:</Text>
            <Box ml="auto">
              <Text>{id}</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Ordinal Owner Address:</Text>
            <Box ml="auto">
              <Text>{ownAdd}</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Sat Number:</Text>
            <Box ml="auto">
              <Text>{satNum}</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Select Ordinal as Collateral</Text>
            <Box ml="auto">
              <Button
                display="inline-flex"
                padding="15px 20px"
                alignItems="center"
                gap={10}
                borderRadius={5}
                border="2px solid #000"
                cursor="pointer"
                background="#FEC34A"
                onClick={handleSelectButtonClick}
              >
                Select
              </Button>
              <option>{id}</option>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Ordinal Value:</Text>
            <Box ml="auto">
              <Text>0.00001 BTC</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Eligible to borrow (LTV):</Text>
            <Box ml="auto">
              <Text>{LTV} rBTC</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Borrowing time</Text>
            <Text>(144 blocks/day)</Text>
            <Box ml="auto">
            </Box>
          </Flex>

          <Button
            display="inline-flex"
            padding="15px 20px"
            alignItems="center"
            gap={10}
            borderRadius={5}
            border="2px solid #000"
            background="#FEC34A"
            cursor="pointer"
            mt={4}
            onClick={processLoan}
          >
            Submit
          </Button>

          {showModal && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundColor="rgba(0, 0, 0, 0.6)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={10}
            >
              <Box
                p={6}
                backgroundColor="#fff"
                borderRadius={10}
                maxWidth={1000}
                boxShadow="0px 2px 10px rgba(0, 0, 0, 0.1)"
              >
                <Heading size="md">Your ordinals</Heading>
                {ordinals.map((ordinal) => (
                  <Flex key={ordinal.id} alignItems="center" mt={4}>
                    <Image
                      src={`https://ordinals.com/content/${ordinal.id}`}
                      alt=""
                      w={40}
                      h={40}
                      borderRadius="full"
                      backgroundColor="#ccc"
                    />
                    <input type="checkbox" />
                    <Text ml={2}>{ordinal.id}</Text>
                  </Flex>
                ))}
                <Button
                  display="inline-flex"
                  padding="15px 20px"
                  alignItems="center"
                  gap={10}
                  borderRadius={5}
                  border="2px solid #000"
                  background="#FEC34A"
                  cursor="pointer"
                  mt={4}
                  onClick={(e) => handleOrdinalSelection(ordinals[0],e)}
                >
                  Select
                </Button>
                <Button
                  display="inline-flex"
                  padding="10px 10px"
                  alignItems="center"
                  gap={10}
                  borderRadius={5}
                  border="2px solid #000"
                  background="#FEC34S"
                  cursor="pointer"
                  mt={4}
                  ml={10}
                  onClick={() => setShowModal(false)}
                >
                  Close Modal
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </div>
  );
}
