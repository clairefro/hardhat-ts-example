import { task } from "hardhat/config"; // import function
import "@nomiclabs/hardhat-waffle"; // change require to import

// A task is kinda like a script in package.json, but for hardhat.
// You can run them with npx hardhat <task name>
// Run `npx hardhat` to see a list of available taks (including from plugins)
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

export default {
  solidity: "0.7.3",
};
