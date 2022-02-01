# Red Packet Vault

The vault to store the funds for the sending of the red packets. The funds will be stored in a map with the public address of the EOA + block.number as key. 

Controls
----------------
1) Ensure that only one transaction can be made per EOA per block
    a) User will be able to trace their transactions via contract data (migration and refund purposes)
    b) EOA public address will be keccak 256ed to ensure privacy    
2) This vault only supports the storage of one token that is defined upon contract creation.
3) Transaction fee will be set for the following amount:-
    a) There will be 2 tiers: Petty Cash, Large Amount
    a) 100e18 token is the threshold between petty cash and large amount
    b) Petty cash will be charged fixed amount of transaction fee
    c) Large amount will be charged a percentage of the transaction.
    d) settlement currency is in the token defined during contract creation
    e) Only the contract owner can change the transaction fee charged for the tiers
    f) Charged Transaction fee will be sent to payment splitter.



Legends
----------------
EOA - External Owner Address


Please be reminded to change the private key in hardhat.config.js before deploying. 


```shell
npm install 
npm install --save-dev hardhat

npx hardhat run --network binance_test scripts/deploy.js
```
