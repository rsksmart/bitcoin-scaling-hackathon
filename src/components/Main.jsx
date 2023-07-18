import Header from './Header'
import Borrow from './Borrow'
import Repay from './Repay'
import { Box, Flex } from "@chakra-ui/react";
import Navbar from './Navbar';

// import './Main.scss'
import { useState } from 'react'
import { Signercontext , HiroWalletcontext } from '../ContextApi'

export default function Main() {
    const [add,setadd]=useState("");// hiro wallet
    const [signer , setSigner]=useState()// metamask wallet

   const  sendSigner=(receivedSigner)=>{
    setSigner(receivedSigner);
   }
   console.log(signer)
    const showPopUp =async(e)=>{// this function is for hiro wallet
    e.preventDefault();
    const userAddresses = await window.btc?.request('getAddresses');
    setadd(userAddresses.result.addresses[1].address);
    }

// Not getting the array length
   
  return (
    <div className="container">
        <button  className="btn btn-md btn-primary border border-2 border-black text-black" onClick={e=>showPopUp(e)}>Connect Hiro</button>
      {add?add:"undefined"}
     <Header sendSigner={sendSigner}  />
      <main className="row align-items-start">
        <Signercontext.Provider value={{signer}}>
            <HiroWalletcontext.Provider value={{add}}>

        {/* <Borrow />
        <Repay /> */}

        <Navbar />
        <Flex mt={30}>
          <Box flex={1} mr={1} mb={50}>
            <Borrow />
          </Box>
          <Box flex={1} mb={50}>
            <Repay />
          </Box>
        </Flex>
        
            </HiroWalletcontext.Provider>
        </Signercontext.Provider>
      </main>
      
    </div>
  )
}