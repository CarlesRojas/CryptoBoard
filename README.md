# CryptoPlace

### Compile the smart contracts

`truffle complie`

### Make migrations to Ganache

`truffle migrate`

### Deploy to Ropsten or MainNet

`truffle migrate --reset --network ropsten`
`truffle migrate --reset --network mainnet`

### Check in which networks the contract is deployed

`truffle networks`

### Compile and test smart contracts

`truffle test`

#### Get Info

`truffle console`
`truffle console --network ropsten`
`truffle console --network mainnet`

`contract = await CryptoPlace.deployed()`

`numRows = await contract.NUM_ROWS()`
`numRows.toNumber()`

`pixelLimit = await contract.PIXEL_LIMIT()`
`pixelLimit.toNumber()`

`pixelCount = await contract.pixelCount()`
`pixelCount.toNumber()`

#### Mint

`await contract.mintBatch([0, 255, 65280, 65305], ["#ededed", "#e5e5e5","#e5e5e5", "#ededed"], ["10000000000000000000", "10000000000000000000", "10000000000000000000", "10000000000000000000"])`

#### Change Color

`await contract.changeColor(432, "#000000")`
