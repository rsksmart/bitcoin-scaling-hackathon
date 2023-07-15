const { network }  =  require("hardhat")

export async function moveBlocks(amount) {
  console.log("Moving blocks...")
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    })
  }
    console.log(`----------------MOVED ${amount} BLOCKS------------------`); 
}
