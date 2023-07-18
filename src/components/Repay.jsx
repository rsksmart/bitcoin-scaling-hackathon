import { ethers } from "ethers";
import TreasuryJSON from "../utils/Treasury.json"
import LendingJSON from "../utils/Lending.json"
import TreasuryAddress from "../utils/TreasuryAddress";
import React, { useState , useContext } from "react";
import { Signercontext } from "../ContextApi";
import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';

export default function Repay() {
const {signer} = useContext(Signercontext)
   const [amount,setAmount] = useState()
   const [time,settime] = useState()
   const [totalAmt,settotalAmt] = useState()

    const TreasuryContract =  new ethers.Contract(
        TreasuryAddress,
        TreasuryJSON.abi,
        signer
        );
    const LendingContract =  new ethers.Contract(
        TreasuryAddress,
        LendingJSON.abi,
        signer
        );
        const fetchLoanDetails=async(e)=>{
            e.preventDefault();
            let amt; let time;
           [amt,time] = await LendingContract.fetchLoanDetails()
           setAmount(amt)
           settime(time)

        }
        const makePayment=async(e)=>{
        e.preventDefault();
         let totalamt =   await TreasuryContract.receiveFund()
         settotalAmt(totalamt)
        } 
    
    return (
      <div>
            {/* Side B */}
  {/* <section className="col-12 col-lg-5">
    <span className="d-flex align-items-center">
      <h3 className="badge h3 fw-bold align-self-center">
        B
      </h3>
      <h4 className="h5 align-self-center">Repay and redeem your Ordinal</h4>
    </span>
    <span className="m-0 p-0 ms-5">
      {/* Principle owing */}
      {/* <span className="d-flex align-items-center ">
        <h6 className="h6 align-self-center col-9">
          Principle owing: 
        </h6>
        <p className="p align-self-center col-3">
         {amount}
        </p>
      </span> */}
      {/* Interest amount: */}
      {/* <span className="d-flex align-items-center ">
        <h6 className="h6 align-self-center col-9">
          Interest amount:
          (0.02739% daily interest)
        </h6>
        <p className="small align-self-center col-1 text-wrap lh-sm ">
          0.0000019178 rBTC
        </p>
      </span> */}
      {/* Total owing */}
      {/* <span className="d-flex align-items-center ">
        <h6 className="h6 align-self-center col-9">
          Total owing: 
        </h6>
        <p className="small align-self-center col-1 text-wrap lh-sm ">
          0.1000019178 rBTC
        </p>
      </span> */}
      {/* Time to pay */}
      {/* <span className="d-flex align-items-center ">
        <h6 className="h6 align-self-center col-9">
          Time to pay:  
        </h6>
        <p className="small align-self-center col-1 text-wrap lh-sm ">
         {time}
        </p>
      </span> */}
      {/* Repayment address */}
      {/* <span className="d-flex align-items-center ">
        <h6 className="h6 align-self-center col-9">
          Repayment address:  
        </h6>
        <p className="small align-self-center col-1 text-wrap lh-sm ">
        0xAc18efe0E1beF9c53411A899F4AD8eFD9E0976ff
        </p>
      </span> */}
      {/* Button */}
      {/* <span className="d-flex align-items-center ">
        <h6 className="h6 align-self-center col-4">
        </h6>
        <span className="d-flex ms-auto align-self-center col-auto text-wrap lh-sm ">
          <p className="small align-self-center col-2 text-wrap lh-sm ">
            <label htmlFor="inputnumber" className="visually-hidden">number</label>
            <input type="number" className="form-control" id="inputnumber" placeholder />
          </p>
          <button onClick={e=>fetchLoanDetails(e)} className="mx-2 btn btn-md btn-primary border border-2 border-black text-black">
          Repay details
          </button>
          <button onclick={e=>makePayment(e)} className="mx-2 btn btn-md text-black">
          Make Repayment
          </button>
        </span>
      </span>
    </span> */}
    {/* Down Button */}
    {/* <span className="d-flex align-items-center my-5">
      <h6 className="h6 align-self-center col-4">
      </h6> */}
      {/* <span className="d-flex ms-auto align-self-center col-auto text-wrap lh-sm ">
        <button onClick={e=>fetchLoanDetails(e)} className="mx-2 btn btn-md btn-primary border border-2 border-black text-black">
          Repay details
        </button>
        <button onclick={e=>makePayment(e)} className="mx-2 btn btn-md text-black">
          Make Repayment
        </button>
      </span> */}
    {/* </span>
  </section> */}
  
      {/* <Navbar /> */}
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
              <Text>{amount}</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
              <Text flexShrink={0}>Interest amount:</Text>
              <Text>(0.02739% daily interest)</Text>
            <Box ml="auto">
              <Text>0.0000019178 rBTC</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Total owing:</Text>
            <Box ml="auto">
              <Text>0.1000019178 rBTC</Text>
            </Box>
          </Flex>
          <Flex alignItems="center" mb={2}>
            <Text flexShrink={0}>Time to pay:</Text>
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
            <Input
              display="flex"
              width={162}
              height={48}
              padding="15px 20px"
              alignItems="center"
              gap={10}
              flexShrink={0}
              borderRadius={5}
              border="2px solid #000"
              background="#FFF"
            />
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
                Repay rBTC
              </Button>
              <Box mt={20}>
                <Button  onclick={e=>makePayment(e)}
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
                  Redeem Ordinal
                </Button>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
      </div>
    )
  }
  