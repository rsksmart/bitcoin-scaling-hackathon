import { ethers } from "ethers";
import TreasuryJSON from "../utils/Treasury.json"
import LendingJSON from "../utils/Lending.json"
import TreasuryAddress from "../utils/TreasuryAddress";
import LendingAddress from "../utils/TreasuryAddress";
import React, { useState , useContext } from "react";
import { Signercontext } from "../ContextApi";
import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
const BigNumber = require('bignumber.js');


export default function Repay() {
const {signer} = useContext(Signercontext)
const [intAmount,setIntAmount] = useState("")
const [priAmount,setPriAmount] = useState('')
const [totalAmount,settotalAmount] = useState('')
const [time,settime] = useState('')
let totalamt;

    const TreasuryContract =  new ethers.Contract(
        TreasuryAddress,
        TreasuryJSON.abi,
        signer
        );
    const LendingContract =  new ethers.Contract(
        LendingAddress,
        LendingJSON.abi,
        signer
        );
        const handleClick=(e)=>{
          e.preventDefault();
          console.log("clicked")
        }
        const fetchLoanDetails=async(e)=>{
            e.preventDefault();
            let priAmt; let time; let interest; 
            time = await LendingContract.fetchLoanDetails()
            interest = await LendingContract.calculateInterest()
            totalamt = await LendingContract.calculateTotalPayable() 
            priAmt = totalamt - interest
            setIntAmount(ethers.formatUnits(interest.toString(),18))
            setPriAmount(ethers.formatUnits(priAmt.toString(),18))
            settotalAmount(ethers.formatUnits(totalamt.toString(),18))
            settime(time.toString())
            console.log(totalAmount)
            console.log("ji")
        }
        const makePayment=async(e)=>{
          e.preventDefault();
          try{
            let tx =  await TreasuryContract.receiveFund({value:ethers.parseUnits(totalAmount,18)}) 
          }catch(error){
            alert("tx cancelled")
            console.log(error)
          }
        
        } 

    
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
          height={600}
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
            <Heading size="md" mb={2}>
              Repay & Redeem Ordinal
            </Heading>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Principle owing:</Text>
            <Box ml="auto">
              <Text> {priAmount}  rBTC</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
              <Text flexShrink={0}>Interest amount:</Text>
              <Text>(0.02739% daily interest)</Text>
            <Box ml="auto">
              <Text>{intAmount} rBTC</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Total owing:</Text>
            <Box ml="auto">
              <Text>{totalAmount} rBTC</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Time spend:</Text>
            <Box ml="auto">
              <Text>{time}</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Repayment address:</Text>
            <Box ml="auto">
              <Text>0xAc18efe0E1beF9c53411A899F4AD8eFD9E0976ff</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Box ml="auto">
              <Button  onClick={e=>fetchLoanDetails(e)}
                display="inline-flex"
                padding="15px 20px"
                alignItems="center"
                gap={10}
                borderRadius={5}
                border="2px solid #000"
                background="#FEC34A"
                cursor="pointer"
                mr={25}
              >
              Get Loan Info
              </Button>
              {/* <button onclick={e=>handleClick(e)}>click me</button> */}
              <Box mt={20}>
                <Button  onClick={e=>makePayment(e)}
                  display="inline-flex"
                  padding="15px 20px"
                  alignItems="center"
                  gap={10}
                  borderRadius={5}
                  border="2px solid #000"
                  background="#FEC34A"
                  cursor="pointer"
                  ml={2}
                >
                  Repay rBTC
                </Button>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
      </div>
    )
  }
  