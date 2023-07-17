import { ethers } from "ethers";
import { useEffect } from "react";
export default function Header({sendSigner}) {
    let authenticated;
    const connectWallet= async(e)=>{
        e.preventDefault()
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()

        // if(signer!="undefined")
        // {
        //     authenticated = true;
        //     console.log(authenticated)
        // }
        sendSigner(signer);
    }

 
return (
<div>
    <header className="my-5">
<div className="row justify-content-between mx-5 px-5 align-items-center">
  <div className="col-12 col-lg-4">
    <img src="public/logo.png" className="w-75" alt="Brand logo" />
    <p className="small">A Lending Protocol for Ordinals on RSK</p>
  </div>
      
      <div className="col-12 col-lg-2 align-self-end">

         {authenticated ?  (<button  className="btn btn-md btn-primary border border-2 border-black text-black">Connected</button>
         ) : (<button onClick={e=>connectWallet(e)} className="btn btn-md btn-primary border border-2 border-black text-black">
      Connect Wallet
    </button>)}
    </div>
    </div>
</header>
</div>
)
}
