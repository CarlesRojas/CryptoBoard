# CryptoPlace

### Compile the smart contracts

`truffle complie`

### Make migrations

`truffle migrate`

### Compile and test smart contracts

`truffle test`

### Deploy contract

`truffle console`
`contract = await CryptoPlace.deployed()`

#### Get Info

`numRows = await contract.numRows()`
`numRows.toNumber()`

`pixelCount = await contract.pixelCount()`
`pixelCount.toNumber()`

`pixelLimit = await contract.pixelLimit()`
`pixelLimit.toNumber()`

#### Mint

`await contract.mintBatch([12, 234, 6789], ["#FF0000", "#00FF00", "#0000FF"])`

#### Change Color

`await contract.changeColor(432, "#000000")`
