import "./App.css";
import Main from './components/Main'
import { ethers } from "ethers";
import { useState } from "react";
// const provider =  new ethers.BrowserProvider(window.ethereum);
// const signer = await provider.getSigner();
// const contract = new ethers.Contract(
//   "0x542FDA317318eBf1d3DeAF76E0B632741a7e677d",
//   contractJson,
//   signer
// );
// console.log(contract);

function App() {

  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
