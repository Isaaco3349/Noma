# Noma contracts (Foundry)

Solidity contracts for authorization, spend limits, and recurring schedules on Monad.

**Day 1**: skeleton only — no contract logic yet. Install [Foundry](https://book.getfoundry.sh/getting-started/installation), then:

```bash
cd contracts
forge install foundry-rs/forge-std --no-commit   # when adding first contract
forge test
```

Every change under `src/` must include tests under `test/`.
