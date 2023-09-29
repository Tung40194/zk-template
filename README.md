# zk-template
circom template to work with hardhat circom

A modification from https://github.com/gmchad/zardkat.git that works on js (the repo has some weird issues when adding new circuits so I mod it and fix the issues).

#### adding new circuits to the development
npx hardhat newcircuit --name <name of the circuit>

#### compiling the circuits
npx hardhat compile

#### test proof generation and solidity verifier
npx hardhat test