# Noma — one-time Monad testnet reset (new deployer wallet OK).
# Usage: set env vars below, then:  .\scripts\finalize-testnet.ps1
#
# NEVER commit DEPLOYER_PRIVATE_KEY. Use a throwaway testnet wallet only.

$ErrorActionPreference = "Stop"
$Forge = "$env:USERPROFILE\.foundry\bin\forge.exe"
$Cast = "$env:USERPROFILE\.foundry\bin\cast.exe"
$Rpc = if ($env:MONAD_RPC) { $env:MONAD_RPC } else { "https://testnet-rpc.monad.xyz" }
$Contracts = Join-Path $PSScriptRoot "..\contracts"

if (-not (Test-Path $Forge)) {
  Write-Host "Foundry not found. Install: https://book.getfoundry.sh/getting-started/installation"
  exit 1
}

if (-not $env:DEPLOYER_PRIVATE_KEY) {
  Write-Host @"

Missing DEPLOYER_PRIVATE_KEY.

1. Create a NEW test-only wallet (MetaMask -> Add account -> Export private key).
2. Fund it with MON: https://faucet.monad.xyz (paste deployer address, not Mera passkey).
3. In this PowerShell session:

   `$env:DEPLOYER_PRIVATE_KEY = "0x..."
   `$env:MINT_TO = "0x..."   # full Mera passkey address from Noma header

Then run this script again.

"@
  exit 1
}

Push-Location $Contracts
try {
  if ($env:SKIP_DEPLOY -ne "1") {
    Write-Host "==> Deploying Noma contracts to Monad testnet..."
    & $Forge script script/DeployNoma.s.sol --rpc-url $Rpc --broadcast
  }

  if (-not $env:SETTLEMENT_TOKEN_ADDRESS -or -not $env:MINT_TO) {
    Write-Host @"

NEXT: copy deploy log into frontend/.env.local, then mint to your Mera passkey:

  `$env:SETTLEMENT_TOKEN_ADDRESS = "0x..."   # NEXT_PUBLIC_SETTLEMENT_TOKEN_ADDRESS
  `$env:MINT_TO = "0x..."                     # full address from Noma header

  .\scripts\finalize-testnet.ps1

(Skip redeploy: set `$env:SKIP_DEPLOY = "1" first.)

"@
    if (-not $env:SETTLEMENT_TOKEN_ADDRESS) { exit 0 }
  }

  if ($env:MINT_TO -and $env:SETTLEMENT_TOKEN_ADDRESS) {
    Write-Host "==> Minting mock settlement token to passkey..."
    & $Forge script script/MintMockToken.s.sol --rpc-url $Rpc --broadcast
    Write-Host "Done. Restart npm run dev and Confirm a plan in chat."
  }
}
finally {
  Pop-Location
}
