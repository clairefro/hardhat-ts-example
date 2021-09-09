import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

chai.use(solidity);

describe("Bored Ape", () => {
  let boredApeContract: Contract;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;

  beforeEach(async () => {
    // We can refer to the contract by the contract name in
    // `artifacts/contracts/bored-ape.sol/BoredApeYachtClub.json`
    // initialize the contract factory: https://docs.ethers.io/v5/api/contract/contract-factory/
    const BoredApeFactory = await ethers.getContractFactory(
      "BoredApeYachtClub"
    );
    [owner, address1] = await ethers.getSigners();
    boredApeContract = await BoredApeFactory.deploy(
      "Bored Ape Yacht Club",
      "BAYC",
      10000,
      1
    );
  });

  it("Should initialize the Bored Ape contract", async () => {
    expect(await boredApeContract.MAX_APES()).to.equal(10000);
  });

  it("Should set the right owner", async () => {
    expect(await boredApeContract.owner()).to.equal(await owner.address);
  });

  it("Should mint an ape", async () => {
    await boredApeContract.flipSaleState(); // activate sale state
    const apePrice = await boredApeContract.apePrice();
    const tokenId = await boredApeContract.totalSupply();
    // add ether price as value prop in overrides object in second arg
    // more about overrides: https://docs.ethers.io/ethers.js/html/api-contract.html#overrides
    // the example below sets msg.value to our apePrice
    expect(
      await boredApeContract.mintApe(1, {
        value: apePrice,
      })
    )
      .to.emit(boredApeContract, "Transfer")
      // test the three args that the Transfer event emits in _mint
      // more about AddressZero: https://ethereum.stackexchange.com/questions/13523/what-is-the-zero-account-as-described-by-the-solidity-docs
      .withArgs(ethers.constants.AddressZero, owner.address, tokenId);
  });
});
