# Agora integration (Noma)

Noma targets the **Agora — Best Cross-Border Payments App on Monad** bounty alongside Track 02 and Mera.

## What is integrated today (no purchase required)

| Piece | Cost | What judges see |
| --- | --- | --- |
| **Public Agora metrics** | Free | `GET https://api.agora.finance/v0/metrics` — live AUSD supply on **monad** in the app navbar |
| **Settlement token = AUSD** | Free (on-chain gas only) | Set `NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS` to Agora AUSD on Monad testnet; same `DirectTransferAdapter` + registry |
| **`INomaSettlementAdapter`** | N/A | On-chain swap point documented in contracts; direct ERC-20 pull today |

## Optional: Agora API key (still free to create)

Authenticated endpoints (accounts, routes, transactions, mint/redeem) need an **API key** from the [Agora dashboard](https://docs.agora.finance/api) (Owners/Admins → API keys). There is **no paid “API plan”** in the docs — institutional **mint/redeem** may require KYB for production rails.

Env (server-only):

```env
AGORA_API_KEY=your_access_key
```

Noma calls `POST /v0/auth/token` and shows **Agora API connected** in `/api/agora/status` when the key is valid.

## AUSD on Monad testnet

TODO(verify) before mainnet:

```env
NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS=0xa9012a055bd4e0eDfF8Ce09f960291C09D5322dC
NEXT_PUBLIC_SETTLEMENT_TOKEN_DECIMALS=6
```

Keep your deployed `NEXT_PUBLIC_NOMA_*` registry/adapter addresses. Users need **AUSD balance + MON gas** on the Mera passkey address to confirm on-chain (not mock ERC-20).

## What full Agora mint/redeem would add (post-hackathon)

1. Register wallet via `POST /v0/accounts`
2. Create route via `POST /v0/routes`
3. Mint AUSD or wallet transfer via authenticated `/v0/transfers` (see OpenAPI)

Noma’s Nigeria flow stays: **AUSD settlement on Monad → Paystack NGN orchestration**.

## References

- [Agora Public API](https://docs.agora.finance/api)
- [OpenAPI](https://api.agora.finance/v0/openapi.json)
- [Agora on Monad app hub](https://app.monad.xyz/app-hub/agora)
