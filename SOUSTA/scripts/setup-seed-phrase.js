const fs = require('fs').promises;

const hre = require('hardhat');
const bip39 = require('bip39');

async function main() {
    try {
      const networkName = hre.network.name;
      console.log('set up seed phrase', networkName);
      const seedPhrase = bip39.generateMnemonic();
      const seedPhraseFile = `.${networkName}-seed-phrase`;
      await fs.writeFile(seedPhraseFile, seedPhrase, 'utf8');
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
  }
  
  main();
  