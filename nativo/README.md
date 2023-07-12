# Idea Description: Nativo - An Advanced and Efficient Version of WETH

What is the Idea About?

**Nativo** is an optimized and advanced version of the **Wrapped Ether (WETH)**. It aims to provide improved gas efficiency and user experience while maintaining complete compliance with ERC20. WETH is used on **RSK** for wrapping **RBTC**, and is one of the most used contracts.

Features to Build

1. **ERC20 Compliance:** Nativo should be fully compliant with ERC20. Unlike WETH, it must emit a Transfer event from address(0) to the user after minting tokens and from the user to address(0) after burning tokens.
2. **Gas Savings:** Nativo should offer substantial gas savings over WETH. It needs to use optimized algorithms and advanced methods to improve gas usage efficiency.
3. **Advanced Functions:** Nativo should provide additional functions like depositTo, withdrawTo, and withdrawFromTo for superior user experience.
4. **ERC20Permit Support:** Nativo should support gasless token approval as standardized in ERC2612, allowing approvals to be made via signatures. [REF](https://eips.ethereum.org/EIPS/eip-2612)
5. **ERC-1363 Payable Token:** Implement the ERC-1363 standard to execute code after a transfer or approval, providing a more robust and fluid operation. [REF](https://eips.ethereum.org/EIPS/eip-1363)
6. **Flash Loans (ERC-3156):** Implement the Flash Loans standard, allowing the protocol to lend an amount of tokens without collateral, under the condition they're returned within the same transaction. [REF](https://eips.ethereum.org/EIPS/eip-3156)
7. **Efficiency:** Improve efficiency over the original WETH9 contract through methods like infinity approve and a unique method to store user balances.
8. **Secure:** Remove the phantom functions and the usage of .transfer, see [this incident](https://media.dedaub.com/phantom-functions-and-the-billion-dollar-no-op-c56f062ae49f).

Good to Have Features

1. **Cross-Chain Compatibility:** In the future, compatibility with other blockchains could be a beneficial feature, making Nativo a truly universal wrapped asset.

Constraints

1. **Security Concerns:** As with all blockchain projects, security is paramount. Nativo will need to undergo rigorous security audits to ensure the safety of users' funds.

Known Issues

1. **Gas Fees:** Despite our best efforts to optimize, transactions will still require gas fees.
2. **Adoption:** As a new standar it will have some initial friction until developer get familiarized with Nativo

Remember, Nativo is not just about creating another wrapped token. It's about elevating the functionality of wrapped assets to new heights, creating more efficient, fluid, and usable DeFi ecosystems.