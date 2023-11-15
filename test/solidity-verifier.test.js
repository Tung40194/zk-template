const { ethers } = require("hardhat");
const { expect } = require("chai");
const {generateCallData } = require("./zkHelpers");

const HASH_CIRCUIT_PATH_SUFFIX = "hash/";
const POLYNOM_CIRCUIT_PATH_SUFFIX = "simple-polynomial/";
const NONZERO_CIRCUIT_PATH_SUFFIX = "none-zero/";
const AVERAGE_CIRCUIT_PATH_SUFFIX = "average/";
const OVER21_CIRCUIT_PATH_SUFFIX = "over21/";

describe("Testing zk proof generation and solidity verifier", () => {

  beforeEach(async () => {
    // nothing
  });

  it("Should deploy hash verifier and execute on-chain zk verification successfully", async () => {
    // deploy contract
    const Verifier = await ethers.getContractFactory("contracts/HashVerifier.sol:Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();

    console.log(`Verifier deployed to ${verifier.address}`);

    // generate proof call data
    const {pi_a, pi_b, pi_c, input} = await generateCallData(HASH_CIRCUIT_PATH_SUFFIX);
    // console.log(">>>proof and expected value: ", {pi_a, pi_b, pi_c, input})

    // verify proof on contract
    //@ts-ignore
    const tx = await verifier.verifyProof(pi_a, pi_b, pi_c, input)
    
    console.log(`Verifier result: ${tx}`)
    // console.assert(tx == true, "Proof verification failed!");
    expect(tx).to.equal(true);
  });

  it("Should deploy simple polynomial verifier and execute on-chain zk verification successfully", async () => {
    // deploy contract
    const Verifier = await ethers.getContractFactory("contracts/SimplePolynomialVerifier.sol:Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();

    console.log(`Verifier deployed to ${verifier.address}`);

    // generate proof call data
    const {pi_a, pi_b, pi_c, input} = await generateCallData(POLYNOM_CIRCUIT_PATH_SUFFIX);
    // console.log(">>>proof and expected value: ", {pi_a, pi_b, pi_c, input})

    // verify proof on contract
    //@ts-ignore
    const tx = await verifier.verifyProof(pi_a, pi_b, pi_c, input)
    
    console.log(`Verifier result: ${tx}`)
    // console.assert(tx == true, "Proof verification failed!");
    expect(tx).to.equal(true);
  });

  it("Should deploy non-zero verifier and execute on-chain zk verification successfully", async () => {
    // deploy contract
    const Verifier = await ethers.getContractFactory("contracts/NoneZeroVerifier.sol:Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();

    console.log(`Verifier deployed to ${verifier.address}`);

    // generate proof call data
    const {pi_a, pi_b, pi_c, input} = await generateCallData(NONZERO_CIRCUIT_PATH_SUFFIX);
    console.log(">>>proof and expected value: ", {pi_a, pi_b, pi_c, input})

    // verify proof on contract
    //@ts-ignore
    const tx = await verifier.verifyProof(pi_a, pi_b, pi_c, input)
    
    console.log(`Verifier result: ${tx}`)
    // console.assert(tx == true, "Proof verification failed!");
    expect(tx).to.equal(true);
  });

  it("Should deploy Average verifier and execute on-chain zk verification successfully", async () => {
    // deploy contract
    const Verifier = await ethers.getContractFactory("contracts/AverageVerifier.sol:Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();

    console.log(`Verifier deployed to ${verifier.address}`);

    // generate proof call data
    const {pi_a, pi_b, pi_c, input} = await generateCallData(AVERAGE_CIRCUIT_PATH_SUFFIX);
    console.log(">>>proof and expected value: ", {pi_a, pi_b, pi_c, input})

    // verify proof on contract
    //@ts-ignore
    const tx = await verifier.verifyProof(pi_a, pi_b, pi_c, input)
    
    console.log(`Verifier result: ${tx}`)
    // console.assert(tx == true, "Proof verification failed!");
    expect(tx).to.equal(true);
  });

  it("Should deploy over21 verifier and execute on-chain zk verification successfully", async () => {
    // deploy contract
    const Verifier = await ethers.getContractFactory("contracts/Over21Verifier.sol:Verifier");
    const verifier = await Verifier.deploy();
    await verifier.deployed();

    console.log(`Verifier deployed to ${verifier.address}`);

    // generate proof call data
    const {pi_a, pi_b, pi_c, input} = await generateCallData(OVER21_CIRCUIT_PATH_SUFFIX);
    console.log(">>>proof and expected value: ", {pi_a, pi_b, pi_c, input})

    // verify proof on contract
    //@ts-ignore
    const tx = await verifier.verifyProof(pi_a, pi_b, pi_c, input)
    
    console.log(`Verifier result: ${tx}`)
    // console.assert(tx == true, "Proof verification failed!");
    expect(tx).to.equal(true);
  });
});
