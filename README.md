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

`numRows = await contract.NUM_ROWS()`
`numRows.toNumber()`

`pixelLimit = await contract.PIXEL_LIMIT()`
`pixelLimit.toNumber()`

`pixelCount = await contract.pixelCount()`
`pixelCount.toNumber()`

#### Mint

`await contract.mintBatch([12, 234, 6789], ["#FF0000", "#00FF00", "#0000FF"])`

#### Change Color

`await contract.changeColor(432, "#000000")`
