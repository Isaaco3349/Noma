# Noma contracts (Foundry)

Solidity on Monad for **authorization**, **spend limits**, and **recurring schedules**. Settlement uses `INomaSettlementAdapter` (direct ERC-20 today; Agora path TBD).

## Setup

Install [Foundry](https://book.getfoundry.sh/getting-started/installation), then:

```bash
cd contracts
forge install foundry-rs/forge-std --no-commit   # if lib/forge-std is missing
forge test
```

(`lib/` is gitignored; each clone runs `forge install` once.)

## Layout

- `src/NomaScheduleRegistry.sol` — plans, executors, execution timing, caps
- `src/adapters/DirectTransferAdapter.sol` — pulls approved ERC-20 to payout sink
- `src/interfaces/` — `INomaSettlementAdapter`, minimal `IERC20`
- `test/NomaScheduleRegistry.t.sol` — 7 tests (required for every `src/` change)
- `script/DeployNoma.s.sol` — testnet deploy (needs `DEPLOYER_PRIVATE_KEY`)

See [docs/contracts-day4.md](../docs/contracts-day4.md).

## Deploy (Monad testnet)

Chain ID **10143** per [Monad docs](https://docs.monad.xyz/developer-essentials/testnet). Settlement token address per plan — **AUSD `TODO(verify)`** when integrating Day 6.

### Lost deployer key?

Create a **new** testnet wallet, fund MON, redeploy, update `frontend/.env.local`. Mint mock token to your Mera passkey:

```powershell
$env:DEPLOYER_PRIVATE_KEY = "0x..."
$env:SETTLEMENT_TOKEN_ADDRESS = "0x..."  # from deploy log
$env:MINT_TO = "0x..."                   # Mera address from Noma
& "$env:USERPROFILE\.foundry\bin\forge.exe" script script/MintMockToken.s.sol `
  --rpc-url https://testnet-rpc.monad.xyz --broadcast
```

Full checklist: [docs/finalize-hackathon.md](../docs/finalize-hackathon.md).
