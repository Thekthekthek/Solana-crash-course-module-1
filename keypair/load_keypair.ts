import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";

export const GenerateKeypair = async (
  connection: Connection
): Promise<Keypair> => {
  const keypair = getKeypairFromEnvironment("SECRET_KEY");
  console.log(`✅ Connected!`);

  const address = new PublicKey(keypair.publicKey.toBase58());
  const balance = await connection.getBalance(address);
  const balanceInSol = balance / LAMPORTS_PER_SOL;

  console.log(
    `The balance of the account at ${address} is ${balanceInSol} SOLs`
  );
  console.log(`✅ Finished!`);
  return keypair;
};
