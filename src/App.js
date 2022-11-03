import './App.css';
import { useEffect, useState } from "react";
import { Contract, providers } from "ethers";
import NFT from "./abi/horoscopeNFT.json";
import MetaMaskLogo from './metamask.png'
import errorLogo from './error.png'
 
const NFT_CONTRACT_ADDRESS = "0x83163c7154E06147E614522b4EE58E465167704b";
 
function App() {
  // state to keep track whether the user has installed wallet or not.
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [date, setDate] = useState("2000-01-01");
 
  // state for zodiacSign derived from date.
  const [zodiacSign, setZodiacSign] = useState(null);
 
  // state for keeping track of current connected account.
  const [account, setAccount] = useState(null);
 
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
 
  const [NFTContract, setNFTContract] = useState(null);
 
  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  useEffect(() => {
    calculateZodiacSign(date);
  }, [date]);
 
  function handleDateInput({ target }) {
    setDate(target.value);
  }
 
  function calculateZodiacSign(date) {
    let dateObject = new Date(date);
    let day = dateObject.getDate();
    let month = dateObject.getMonth();
    if (month == 0) {
      if (day >= 20) {
          setZodiacSign("Verseau");
      } else {
          setZodiacSign("Capricorne");
      }
    } else if (month == 1) {
      if (day >= 20) {
          setZodiacSign("Poissons");
      } else {
          setZodiacSign("Verseau");
      }
    } else if (month == 2) {
      if (day >= 21) {
          setZodiacSign("Bélier");
      } else {
          setZodiacSign("Poissons");
      }
    } else if (month == 3) {
      if (day >= 20) {
          setZodiacSign("Taureau");
      } else {
          setZodiacSign("Bélier");
      }
    } else if (month == 4) {
      if (day >= 21) {
          setZodiacSign("Gémeaux");
      } else {
          setZodiacSign("Taureau");
      }
    } else if (month == 5) {
      if (day >= 21) {
          setZodiacSign("Cancer");
      } else {
          setZodiacSign("Gémeaux");
      }
    } else if (month == 6) {
      if (day >= 22) {
          setZodiacSign("Lion");
      } else {
          setZodiacSign("Cancer");
      }
    } else if (month == 7) {
      if (day >= 23) {
          setZodiacSign("Vierge");
      } else {
          setZodiacSign("Lion");
      }
    } else if (month == 8) {
      if (day >= 23) {
          setZodiacSign("Balance");
      } else {
          setZodiacSign("Vierge");
      }
    } else if (month == 9) {
      if (day >= 23) {
          setZodiacSign("Scorpion");
      } else {
          setZodiacSign("Balance");
      }
    } else if (month == 10) {
      if (day >= 23) {
          setZodiacSign("Sagittaire");
      } else {
          setZodiacSign("Scorpion");
      }
    } else if (month == 11) {
      if (day >= 22) {
          setZodiacSign("Capricorne");
      } else {
          setZodiacSign("Sagittaire");
      }
    }
  }

  useEffect(() => {
    function initNFTContract() {
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer));
    }
    initNFTContract();
  }, [account]);
 
  async function mintNFT() {
    setIsMinting(true);
    try {
      await NFTContract.mintNFT(account, zodiacSign);
    } catch (e) {
    } finally {
      setIsMinting(false);
    }
  }

 if (account === null) {
  return (
    <div className="App-header"> 
    {" "}
    <br/>
      {
        isWalletInstalled ? (
          <>
            <img src={MetaMaskLogo} alt='metaMaskLogo' width={200} height={200} />
            <button 
              className='connectWallet' 
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </>
        ) : (
          <p>
            <img className='logoContainer' src={errorLogo} alt='errorLogo' width={200} height={200} />
            <a
              target='_blank'
              rel='noreferrer'
              href={`https://metamask.io/download.html`}
            >
              You must install Metamask, a <br /> virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        )
      }
  
    </div>
  );
  }

  return (
    <div className="App">
      <h1>Horoscope NFT Minting Dapp</h1>
      <p>
        Connected as:
        <h4 className='accountstyle'>{account}</h4>
      </p>
      <input onChange={handleDateInput} value={date} type="date" id="dob"/>
      <br />
      <div className='zodiacSign'>
        {zodiacSign ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin meet"
            viewBox="0 0 300 300"
            width="300px"
            height="300px"
          >
            <style>{`.base { fill: white; font-family: serif; font-size: 24px; `}</style>
            <rect width="100%" height="100%" fill="black" rx="30"/>
            <text
              x="50%"
              y="50%"
              class="base"
              dominant-baseline="middle"
              text-anchor="middle"
            >
              {zodiacSign}
            </text>
          </svg>
        ) : null}
      </div>
      <br/>
      <button className='mintButtun' isLoading={isMinting} onClick={mintNFT}>
        Mint
      </button>
    </div>
   );
 }
   
export default App;