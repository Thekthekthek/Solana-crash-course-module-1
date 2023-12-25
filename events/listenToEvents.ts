import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  Logs,
} from "@solana/web3.js";

const WSS_RPC = "wss://api.mainnet-beta.solana.com";
const HTTP_ENDPOINT = "https://api.mainnet-beta.solana.com";
const solanaConnection = new Connection(HTTP_ENDPOINT, { wsEndpoint: WSS_RPC });
export const FetchAccount = async () => {
  const ACCOUNT_TO_WATCH = new PublicKey(
    "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
  ); // Replace with your own Wallet Address
  solanaConnection.onLogs(ACCOUNT_TO_WATCH, callbackFn);
};

const callbackFn = async (updatedAccountInfo: Logs) => {
  if (updatedAccountInfo.err === null) {
    console.log(
      `---Event Notification for JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4--- \nNew Account Balance:
      ${updatedAccountInfo.logs
        .filter((str) => str.includes("Instruction"))
        .map((str) => str + "\n")}
      `
    ),
      "confirmed";
  }
};
