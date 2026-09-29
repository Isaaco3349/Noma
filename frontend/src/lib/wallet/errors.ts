import { isMeraError } from "@category-labs/mera";
import { MERA_AUTHENTICATOR_SUPPORT_URL } from "./constants";

export type FriendlyWalletError = {
  title: string;
  message: string;
  learnMoreHref?: string;
};

export function toFriendlyWalletError(error: unknown): FriendlyWalletError {
  if (isMeraError(error)) {
    switch (error.code) {
      case "PRF_UNAVAILABLE":
        return {
          title: "Passkey not compatible",
          message:
            "This passkey cannot unlock your account here. On desktop Chrome, save the passkey to Google Password Manager (not only this browser profile), then try again.",
          learnMoreHref: MERA_AUTHENTICATOR_SUPPORT_URL,
        };
      case "PASSKEY_OPERATION_FAILED":
        return {
          title: "Passkey cancelled",
          message: "The passkey prompt was dismissed or could not finish. Try again when you are ready.",
        };
      case "CRYPTO_UNAVAILABLE":
        return {
          title: "Secure connection required",
          message:
            "Passkeys need a secure page. Use HTTPS or open the app on localhost during development.",
        };
      default:
        return {
          title: "Something went wrong",
          message: "We could not complete passkey sign-in. Please try again.",
        };
    }
  }

  if (
    typeof window !== "undefined" &&
    window.PublicKeyCredential === undefined
  ) {
    return {
      title: "Browser not supported",
      message:
        "This browser does not support passkeys. Try a recent version of Chrome, Safari, Edge, or Firefox.",
      learnMoreHref: MERA_AUTHENTICATOR_SUPPORT_URL,
    };
  }

  if (error instanceof Error && error.message === "derivation produced no key") {
    return {
      title: "Account error",
      message: "We could not derive your account from this passkey. Please contact support if this persists.",
    };
  }

  return {
    title: "Something went wrong",
    message: "We could not complete passkey sign-in. Please try again.",
  };
}
