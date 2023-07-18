// import React, { useState , useContext } from "react";
// import { ethers  } from "ethers";
// import { Signercontext , HiroWalletcontext } from "../ContextApi";
// import TreasuryJSON from "../utils/Treasury.json"
// import TreasuryAddress from "../utils/TreasuryAddress";
// import { Box, Button, Flex, Heading, Image, Input, Text } from '@chakra-ui/react';
// // import Navbar from './Navbar';

// export default  function Borrow() {
//     // let ordinals = []
//     let myOrdinals
//     let imageUrl;
//     const [id,setId]=useState()
//     const [ownAdd , setAdd]=useState()
//     const [satNum , setsatNum]=useState()
//     let num = 0.006*20;
//     let denom = 100;
//     let LTV = num/denom;
//     let ordVal=0.006
//     const {signer} = useContext(Signercontext)
//     const {add} = useContext(HiroWalletcontext)
//     console.log(signer)
    
//     const TreasuryContract =  new ethers.Contract(
//         TreasuryAddress,
//         TreasuryJSON.abi,
//         signer
//         );


//     const [showModal, setShowModal] = useState(false);
//     const [ordinals, setOrdinals] = useState([
//     {
//       id: "9b5ad40e4166aa1228c814c1295ecffba541215adafd95bd5ead5b25e342e6f3i0",
//       imageUrl: "/path/to/profile-image.png",
//     },
//   ]);

//   const handleSelectButtonClick = () => {
//     setShowModal(true);
//   };

//   const handleOrdinalSelection = (ordinalId) => {
//     console.log("Selected Ordinal:", ordinalId);
//   };

// //    const fakeFund =async()=>{
// //    let tx = await TreasuryContract.fakeFund({value:ethers.parseUnits("0.03",8)})

// //    }
// //    fakeFund()
// // const showBal =async()=>{
// //     let bal = await TreasuryContract.getContractBalance();
// //     console.log(bal)

// // }
// // showBal()
  
//    const processLoan=async(e)=>{
//     e.preventDefault();
//     try{
//       await TreasuryContract.withdraw(ordVal*10**18);
//     }catch(error){
//       alert("Error in sendind transaction")
//     }
   
//    }
   
//     const collectOrdinals = async()=>
//     {
       
//         fetch(`https://api.hiro.so/ordinals/v1/inscriptions?address=${add}`, {
//             method: 'GET',
//           },
//           ).then(response => {
//             console.log(response)
//             if (response.ok) {
//               response.json().then(json => {
//                 ordinals.push(...json.results)
//               });
//             }else{
//                 console.log("Error")
//             }
//           });
          
//     }
//     const handleSelectOrdinal = async(e)=>{
//     //    e.preventDefault();
//     collectOrdinals()

//     if(ordinals[0])
//     {
//         myOrdinals = ordinals[0]
//         console.log(myOrdinals); // Here furthur modification is needed , we should accept a the ordinals from collectOrdinals() and then list it in createOptions()
//         setId(myOrdinals.id)
//         setAdd(myOrdinals.address)
//         setsatNum(myOrdinals.sat_ordinal) 
       
//     }
    
// }
// imageUrl=`https://ordinals.com/content/${id}`
    
//     return (
//       <div>
//     {/* Side A */}
//     {/* <section className="col-12 col-lg-6">
//       <span className="d-flex align-items-center ">
//         <h3 className="badge h3 fw-bold align-self-center">
//           A
//         </h3>
//         <h4 className="h5 align-self-center">Stake your Ordinal, Borrow BTC</h4>
//       </span>
//       {/* List */}
//       {/* <span className="m-0 p-0 ms-5"> */} 
//         {/* Ordinal Content */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Ordinal Content: 
//           </h6>
//           <p className="p align-self-center col-3">
//             <img src={imageUrl} className="img-fluid rounded" alt="user image" />
//           </p>
//         </span> */}
//         {/* Ordinal Inscription */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Ordinal Inscription ID: 
//           </h6>
//           <p className="small align-self-center col-1 text-wrap lh-sm ">
//            {id}
//           </p>
//         </span> */}
//         {/* Ordinal Owner Address */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Ordinal Owner Address: 
//           </h6>
//           <p className="small align-self-center col-1 text-wrap lh-sm ">
//            {ownAdd}
//           </p>
//         </span> */}
//         {/* Sat Number */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Sat Number:  
//           </h6>
//           <p className="small align-self-center col-1 text-wrap lh-sm ">
//            {satNum}
//           </p>
//         </span> */}
//         {/* Select Ordinal as Collateral */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Select Ordinal as Collateral
//           </h6>
//           <p className="small align-self-center col-2 text-wrap lh-sm ">
//             <select onClick={e=>handleSelectOrdinal(e)} className="form-select btn btn-md btn-primary border border-2 border-black text-black" aria-label="Default select example">
//               <option defaultValue >Select</option>
//              <option>{id}</option>
//             </select>
//           </p>
//         </span> */}
//         {/* ordinal Value */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Ordinal Value: 
//           </h6>
//           <p className="small align-self-center col-1 text-wrap lh-sm ">
//           0.006 RBTC
//           </p>
//         </span> */}
//         {/* Elibible to borrow */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Eligible to borrow (LTV):   
//           </h6>
//           <p className="small align-self-center col-auto text-wrap lh-sm ">
//           {LTV} RBTC
//           </p>
//         </span> */}
//         {/* Borrowing Time */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//             Borrowing time in blocks:  
//             (144 blocks/day) 
//           </h6>
//           <p className="small align-self-center col-2 text-wrap lh-sm ">
//             <label htmlFor="inputnumber" className="visually-hidden">number</label>
//             <input type="number" className="form-control" id="inputnumber" placeholder />
//           </p>
//         </span> */}
//         {/* Button */}
//         {/* <span className="d-flex align-items-center ">
//           <h6 className="h6 align-self-center col-9">
//           </h6>
//           <p className="small align-self-center col-1 text-wrap lh-sm ">
//             <button onClick={e=>processLoan(e)} className="btn btn-md btn-primary border border-2 border-black text-black">
//               Submit
//             </button>
//           </p>
//         </span>
//       </span>
//     </section> */}
//     {/* Space */}
//     {/* <section className="col-12 my-5 my-lg-0 col-lg-1" /> */}

//     {/* <Navbar /> */}
//       <Flex mt={30}>
//         <Box
//           flex={1}
//           p={40}
//           borderWidth={1}
//           borderRadius={30}
//           background="#D9D9D9"
//           width={300}
//           height={650}
//           flexShrink={0}
//           mr={25}
//           ml={50}
//         >
//           <Flex alignItems="center" mb={2}>
//             <Box
//               w={46}
//               h={46}
//               borderRadius="50%"
//               backgroundColor="#ccc"
//               marginBottom={10}
//               flexShrink={0}
//             />
//             <Heading size="md" ml={4} mb={2}>
//               Stake your Ordinal, Borrow rBTC
//             </Heading>
//           </Flex>

//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Ordinal Content:</Text>
//             <Box ml="auto">
//               <Image src={`${imageUrl}`} alt="" w={50} h={50} borderRadius="full" backgroundColor="#ccc" />
//             </Box>
//           </Flex>
//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Ordinal Inscription ID:</Text>
//             <Box ml="auto">
//               <Text>{id}</Text>
//             </Box>
//           </Flex>
//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Ordinal Owner Address:</Text>
//             <Box ml="auto">
//               <Text>{ownAdd}</Text>
//             </Box>
//           </Flex>
//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Sat Number:</Text>
//             <Box ml="auto">
//               <Text>{satNum}</Text>
//             </Box>
//           </Flex>
//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Select Ordinal as Collateral</Text>
//             <Box ml="auto">
//               <Button
//                 display="inline-flex"
//                 padding="15px 20px"
//                 alignItems="center"
//                 gap={10}
//                 borderRadius={5}
//                 border="2px solid #000"
//                 cursor="pointer"
//                 background="#FEC34A"
//                 onClick={handleSelectButtonClick}
//                 // onClick={e=>handleSelectOrdinal(e)}
//               >
//                 Select
//               </Button>
//               <option>{id}</option>
//             </Box>
//           </Flex>
//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Ordinal Value:</Text>
//             <Box ml="auto">
//               <Text>0.00001 BTC</Text>
//             </Box>
//           </Flex>
//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Eligible to borrow (LTV):</Text>
//             <Box ml="auto">
//               <Text>{LTV} rBTC</Text>
//             </Box>
//           </Flex>
//           <Flex alignItems="center" mb={2}>
//             <Text flexShrink={0}>Borrowing time (in blocks):</Text>
//             <Text>(144 blocks/day)</Text>
//             <Box ml="auto">
//               <Input
//                 display="flex"
//                 width={162}
//                 height={48}
//                 padding="15px 20px"
//                 alignItems="center"
//                 gap={10}
//                 flexShrink={0}
//                 borderRadius={5}
//                 border="2px solid #000"
//                 background="#FFF"
//               />
//             </Box>
//           </Flex>

//           <Button
//             display="inline-flex"
//             padding="15px 20px"
//             alignItems="center"
//             gap={10}
//             borderRadius={5}
//             border="2px solid #000"
//             background="#FEC34A"
//             cursor="pointer"
//             mt={4}
//             onClick={e=>processLoan(e)}
//           >
//             Submit
//           </Button>

//           {showModal && (
//             <Box
//               position="fixed"
//               top={0}
//               left={0}
//               right={0}
//               bottom={0}
//               backgroundColor="rgba(0, 0, 0, 0.6)"
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               zIndex={10}
//             >
//               <Box
//                 p={6}
//                 backgroundColor="#fff"
//                 borderRadius={10}
//                 maxWidth={1000}
//                 boxShadow="0px 2px 10px rgba(0, 0, 0, 0.1)"
//               >
//                 <Heading size="md">Your ordinals</Heading>
//                 {ordinals.map((ordinal) => (
//                   <Flex key={ordinal.id} alignItems="center" mt={4}>
//                     <Image
//                       src={ordinal.imageUrl}
//                       alt=""
//                       w={40}
//                       h={40}
//                       borderRadius="full"
//                       backgroundColor="#ccc"
//                     />
//                     <input type="checkbox" />
//                     <Text ml={2}>{ordinal.id}</Text>
//                   </Flex>
//                 ))}
//                 <Button
//                   display="inline-flex"
//                   padding="15px 20px"
//                   alignItems="center"
//                   gap={10}
//                   borderRadius={5}
//                   border="2px solid #000"
//                   background="#FEC34A"
//                   cursor="pointer"
//                   mt={4}
//                   onClick={() => handleOrdinalSelection(ordinals[0].id)}
//                 >
//                   Select
//                 </Button>
//                 <Button
//                   display="inline-flex"
//                   padding="10px 10px"
//                   alignItems="center"
//                   gap={10}
//                   borderRadius={5}
//                   border="2px solid #000"
//                   background="#FEC34S"
//                   cursor="pointer"
//                   mt={4}
//                   ml={10}
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close Modal
//                 </Button>
//               </Box>
//             </Box>
//           )}

//           {/* {showModal && (
//             <Box
//               position="fixed"
//               top={0}
//               left={0}
//               right={0}
//               bottom={0}
//               backgroundColor="rgba(0, 0, 0, 0.6)"
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               zIndex={10}
//             >
//               <Box
//                 p={6}
//                 backgroundColor="#fff"
//                 borderRadius={10}
//                 maxWidth={1000}
//                 boxShadow="0px 2px 10px rgba(0, 0, 0, 0.1)"
//               >
//                 <Heading size="md">Your ordinals</Heading>
//                 <Flex alignItems="center" mt={4}>
//                   <Image src="/path/to/profile-image.png" alt="" w={40} h={40} borderRadius="full" backgroundColor="#ccc" />
//                   <input type="checkbox" />
//                   <Text ml={2}>d8c2e6fca21b41817dc162445f2a0c0f5b0995c0cae12799a39571cd974c4ea2i0</Text>
//                 </Flex>
//                 <Flex alignItems="center" mt={4}>
//                   <Image src="/path/to/profile-image.png" alt="" w={40} h={40} borderRadius="full" backgroundColor="#ccc" />
//                   <input type="checkbox" />
//                   <Text ml={2}>38783c7a3852cfa8cf37bf0c341c34d7babe8926b9526dcd022fc84e58919a0ai0</Text>
//                 </Flex>
//                 <Button
//                   display="inline-flex"
//                   padding="15px 20px"
//                   alignItems="center"
//                   gap={10}
//                   borderRadius={5}
//                   border="2px solid #000"
//                   background="#FEC34A"
//                   cursor="pointer"
//                   mt={4}
//                 >
//                   Select
//                 </Button>
//                 <Button
//                   display="inline-flex"
//                   padding="10px 10px"
//                   alignItems="center"
//                   gap={10}
//                   borderRadius={5}
//                   border="2px solid #000"
//                   background="#FEC34S"
//                   cursor="pointer"
//                   mt={4}
//                   ml={10}
//                   onClick={() => setShowModal(false)}
//                 >
//                   Close Modal
//                 </Button>
//               </Box>
//             </Box>
//           )} */}
//         </Box>

//         {/* <Borrow /> */}
//       </Flex>
//     </div>
  
//     )
//   }


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
  const [ordinals, setOrdinals] = useState([
    {
      id: "9b5ad40e4166aa1228c814c1295ecffba541215adafd95bd5ead5b25e342e6f3i0",
    },
  ]);

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
