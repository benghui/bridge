# Bridge

## Interacting with smart contract

1. Query bridge token list
2. Extract relevant data
3. Output supply of each token inside of contract

## Querying fx-core network layer

To get validators:

```console
curl -X POST https://fx-json.functionx.io -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"validators\",\"params\":{\"height\":\"1\", \"page\":\"1\", \"per_page\":\"20\"}}"
```
