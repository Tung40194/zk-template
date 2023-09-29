# zk-template
circom template to work with hardhat circom

A modification from https://github.com/gmchad/zardkat.git that works on js (the repo has some weird issues when adding new circuits so I mod it and fix the issues).

#### 1. adding new circuits to the development
npx hardhat newcircuit --name <name of the circuit>

#### 2. compiling the circuits
npx hardhat compile

#### 3. test proof generation and solidity verifier
npx hardhat test