import {
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Keypair,
  Connection,
} from "@solana/web3.js";

export const Transfer = async (
  connection: Connection,
  sender: Keypair,
  recipient: PublicKey,
  amount: number
) => {
  const transaction = new Transaction();

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient,
    lamports: LAMPORTS_PER_SOL * amount,
  });
  transaction.add(sendSolInstruction);

  return sendAndConfirmTransaction(connection, transaction, [sender]);
};
