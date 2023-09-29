const { ethers } = require("hardhat");
const { utils } = require("ffjavascript");
const { BigNumber } = require("ethers");
const { expect } = require("chai");
const path = require('path');

const { unstringifyBigInts } = utils;
const fs = require("fs");
const snarkjs = require("snarkjs");

const BASE_PATH = "./circuits/"
const HASH_CIRCUIT_PATH_SUFFIX = "hash/";
const POLYNOM_CIRCUIT_PATH_SUFFIX = "simple-polynomial/";

function p256(n) {
  let nstr = n.toString(16);
  while (nstr.length < 64) nstr = "0" + nstr;
  nstr = `0x${nstr}`;
  return BigNumber.from(nstr);
}

async function generateCallData(circuit_path_suffix) {
  let zkProof = await generateProof(circuit_path_suffix);

  const proof = unstringifyBigInts(zkProof.proof);
  const pub = unstringifyBigInts(zkProof.publicSignals);

  let inputs = "";
  for (let i = 0; i < pub.length; i++) {
    if (inputs != "") inputs = inputs + ",";
    inputs = inputs + p256(pub[i]);
  }

  let pi_a = [p256(proof.pi_a[0]), p256(proof.pi_a[1])]
  let pi_b = [[p256(proof.pi_b[0][1]), p256(proof.pi_b[0][0])], [p256(proof.pi_b[1][1]), p256(proof.pi_b[1][0])]]
  let pi_c = [p256(proof.pi_c[0]), p256(proof.pi_c[1])]
  let input = [inputs]

  return { pi_a, pi_b, pi_c, input };
}

async function generateProof(circuit_path_suffix) {

  circuit_path = path.join(BASE_PATH, circuit_path_suffix)
  // read input parameters
  const inputData = fs.readFileSync(circuit_path + "input.json", "utf8");
  const input = JSON.parse(inputData);

  // calculate witness
  const out = await snarkjs.wtns.calculate(
    input,
    circuit_path + "out/circuit.wasm",
    circuit_path + "out/circuit.wtns"
  )

  // calculate proof
  const proof = await snarkjs.groth16.prove(
    circuit_path + "out/" + circuit_path_suffix.slice(0, -1) + ".zkey",
    circuit_path + "out/circuit.wtns"
  )

  // write proof to file
  fs.writeFileSync(circuit_path + "out/proof.json", JSON.stringify(proof, null, 1));

  return proof
}

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
});
