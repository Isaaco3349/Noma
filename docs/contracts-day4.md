# Day 4 — on-chain schedules

## Contracts

| Contract | Role |
| --- | --- |
| `NomaScheduleRegistry` | Stores authorized plans, enforces spend caps and schedule timing |
| `DirectTransferAdapter` | `INomaSettlementAdapter` — ERC-20 `transferFrom` payer → payout sink |
| `INomaSettlementAdapter` | Swap point for Agora / other settlement (Day 6+) |

## Plan fields (summary)

- **Authorization**: only plan `owner` creates/cancels; `setExecutor` allows a relayer to call `executePlan`.
- **Spend limits**: `amountPerExecution` and lifetime `maxTotalSpend` (`spentTotal` tracked on-chain).
- **Schedules**: `OneTime`, `Monthly` (30-day period, day 1–28), `Weekly` (7 days).

## Assumptions

- **Settlement token**: per-plan `token` address — use verified **AUSD on Monad** when available (`TODO(verify)` in deploy docs).
- **Payout sink**: licensed partner vault or orchestration wallet (not chosen in repo).
- **beneficiaryRef**: `bytes32` hash of off-chain beneficiary (e.g. `keccak256("mum-lagos-ng")`); NGN delivery remains off-chain.

## Commands

```bash
cd contracts
~/.foundry/bin/forge test
```

Deploy (testnet): set `DEPLOYER_PRIVATE_KEY` and `forge script script/DeployNoma.s.sol --rpc-url $NEXT_PUBLIC_MONAD_TESTNET_RPC_URL --broadcast`
