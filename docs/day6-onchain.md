# Day 6 — chat confirm → Monad testnet

## Deploy (once)

```powershell
cd contracts
$env:DEPLOYER_PRIVATE_KEY = "0x..."   # testnet wallet with MON for gas
& "$env:USERPROFILE\.foundry\bin\forge.exe" script script/DeployNoma.s.sol `
  --rpc-url https://testnet-rpc.monad.xyz `
  --broadcast
```

Copy logged addresses into `frontend/.env.local` (see root `.env.example`).

Mint demo tokens: deploy script mints `MockERC20` to the deployer. Send tokens to your passkey address or mint if you extend the mock.

## Confirm flow

1. Parse plan in chat → **Confirm** (passkey session).
2. Approve settlement token for `DirectTransferAdapter` (auto).
3. `createPlan` on `NomaScheduleRegistry`.
4. `executePlan` for the first installment when due (immediate for new plans).

## AUSD

Replace `NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS` with verified **AUSD on Monad** when available (`TODO(verify)` in docs). Adapter interface stays the same.
