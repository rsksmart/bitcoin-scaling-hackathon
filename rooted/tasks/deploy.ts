import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy Registry contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const Registry = await hre.ethers.getContractFactory('Registry');
    const registry = await Registry.deploy();

    await registry.deployed();

    console.log('Registry deployed to:', registry.address);
  }
);