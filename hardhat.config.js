/** @type import('hardhat/config').HardhatUserConfig */
require("hardhat-circom");
require("@nomiclabs/hardhat-ethers");
const circuits = require('./circuits.config.json');

// tasks
require("./tasks/newcircuit.ts");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.6.11",
      }
    ]
  },
  circom: {
    // (optional) Base path for input files, defaults to `./circuits/`
    inputBasePath: "./circuits",
    // (required) The final ptau file, relative to inputBasePath, from a Phase 1 ceremony
    ptau: "powersOfTau28_hez_final_12.ptau",
    // (required) Each object in this array refers to a separate circuit
    circuits: JSON.parse(JSON.stringify(circuits)),
  },
};
