import { HDKey } from "@scure/bip32";
import { entropyToMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

/** BIP-44 EVM path from Mera PRF output — https://docs.monad.xyz/guides/mera */
export function deriveEvmPrivateKey(
  prfOutput: Uint8Array,
  index = 0,
): Uint8Array {
  const seed = mnemonicToSeedSync(entropyToMnemonic(prfOutput, wordlist));
  const node = HDKey.fromMasterSeed(seed).derive(`m/44'/60'/0'/0/${index}`);
  if (node.privateKey === null) {
    throw new Error("derivation produced no key");
  }
  return node.privateKey;
}

export function prfOutputToRecoveryPhrase(prfOutput: Uint8Array): string {
  return entropyToMnemonic(prfOutput, wordlist);
}
