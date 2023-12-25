import {
  Transaction,
  PublicKey,
  sendAndConfirmTransaction,
  Keypair,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";

export const Ping = async (connection: Connection, sender: Keypair) => {
  const PING_PROGRAM_ADDRESS = new PublicKey(
    "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"
  );
  const PING_PROGRAM_DATA_ADDRESS = new PublicKey(
    "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"
  );
  const transaction = new Transaction();

  const sendSolInstruction = new TransactionInstruction({
    keys: [
      { pubkey: PING_PROGRAM_DATA_ADDRESS, isSigner: false, isWritable: true },
    ],
    programId: PING_PROGRAM_ADDRESS,
  });
  transaction.add(sendSolInstruction);

  return sendAndConfirmTransaction(connection, transaction, [sender]);
};
