'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Erc20Artifact from '../../contracts/vendor/ERC20.json'
import FactoryArtifact from '../../contracts/compiled/Factory.json'
import contractAddress from '../../contracts/compiled/contract-address.json'

const DashboardContext = createContext()

export const DashboardContextProvider = ({ children }) => {
  const [contractAddresses, setContractAddresses] = useState([])
  const [numTokens, setNumTokens] = useState(0)
  const [transactionError, setTransactionError] = useState()
  const [transactionSuccess, setTransactionSuccess] = useState()
  const [tokens, setTokens] = useState({})
  const [txBeingSent, setTxBeingSent] = useState()
  const [updatedNumTokens, setUpdatedNumTokens] = useState(0)

  // This is an error code that indicates the user canceled a transaction
  const ERROR_CODE_TX_REJECTED_BY_USER = 4001

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const factory = new ethers.Contract(
    contractAddress.Factory,
    FactoryArtifact.abi,
    provider.getSigner(0),
  )

  /**
   * Start polling token data from the blockchain every 15 seconds. The
   * polling continues for as long as the dashboard is active.
   */
  useEffect(() => {
    const pollDataInterval = setInterval(() => updateNumTokens(), 15000)

    return () => {
      clearInterval(pollDataInterval)
    }
  }, [])

  /**
   * Watch for changes to the number of tokens. If it changes; get new token
   * data from the blockchain.
   */
  useEffect(() => {
    const hasNumberOfTokensChanged = updatedNumTokens !== numTokens

    if (hasNumberOfTokensChanged) {
      getTokens()
    }
  }, [updatedNumTokens])

  /**
   * Get token data from the blockchain and update it in state.
   */
  const getTokens = async () => {
    setContractAddresses([])
    const tokens = {}

    for (let i = 0; i < updatedNumTokens; i++) {
      const address = await factory.getTokenAddress(i)
      const token = new ethers.Contract(
        address,
        Erc20Artifact.abi,
        provider.getSigner(0),
      )

      const name = await token.name()
      const symbol = await token.symbol()
      let totalSupply = await token.totalSupply()
      totalSupply = parseInt(totalSupply['_hex'], 16)

      tokens[address] = {
        contract: token,
        name,
        symbol,
        totalSupply,
      }
    }

    setContractAddresses(Object.keys(tokens))
    setNumTokens(updatedNumTokens)
    setTokens(tokens)
  }

  /**
   * Gets the wallet balance of a token.
   * @param {string} contractAddress Address of the token contract.
   * @param {string} walletAddress   Address of the wallet to check balance of.
   */
  const getBalanceAtAddress = async (contractAddress, walletAddress) => {
    try {
      console.log(walletAddress)
      setTransactionError(null)

      const token = tokens[contractAddress]
      const tx = await token.contract.balanceOf(walletAddress)
      console.log(parseInt(tx['_hex'], 16))
    } catch (e) {
      setTransactionError(e)
    }
  }

  /**
   * Deploys a new token.
   * @param {string} name   Name of the token.
   * @param {string} ticker Ticker symbol of the token.
   * @param {string} supply Initial supply of the token.
   */
  const deployToken = async (name, ticker, supply) => {
    try {
      setTransactionError(null)

      const tx = await factory.deployToken(name, ticker, supply)
      setTxBeingSent(tx.hash)

      const receipt = await tx.wait()

      if (receipt.status === 0) {
        throw new Error('Transaction failed')
      }

      setTransactionSuccess(true)
    } catch (e) {
      if (e.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return
      }

      setTransactionError(e)
    } finally {
      setTxBeingSent(null)
    }
  }

  /**
   * Gets the number of tokens from the blockchain and updates it in state.
   */
  const updateNumTokens = async () => {
    let updatedNumTokens = await factory.getNumberOfTokens()
    updatedNumTokens = parseInt(updatedNumTokens['_hex'], 16)
    setUpdatedNumTokens(updatedNumTokens)
  }

  /**
   * Formats RPC error messages for display on the frontend.
   * @param {object} error RPC error object.
   * @returns              The message of the error.
   */
  const getRpcErrorMessage = (error) => {
    if (error.data) {
      return error.data.message
    }

    return error.message
  }

  return (
    <DashboardContext.Provider
      value={{
        contractAddresses,
        deployToken,
        getBalanceAtAddress,
        getRpcErrorMessage,
        tokens,
        transactionError,
        setTransactionError,
        transactionSuccess,
        setTransactionSuccess,
        txBeingSent,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => useContext(DashboardContext)
