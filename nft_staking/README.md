## Instructions for using Metaplex on Localnet

1. Dump the target program to .so from devnet, testnet or mainnet with the following command: `solana program dump -u m metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s tests/metaplex_token_metadata_program.so`
2. In your Anchor.toml, add the following:

```[[test.genesis]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
program = "tests/metaplex_token_metadata_program.so"
```

3. Now start your local validator with the following command: `solana-test-validator -r --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s tests/metaplex_token_metadata_program.so`
