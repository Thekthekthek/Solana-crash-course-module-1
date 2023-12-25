import * as borsh from "@coral-xyz/borsh";
import * as web3 from "@solana/web3.js";

export class Movie {
  title: string;
  rating: number;
  description: string;
  constructor(title: string, rating: number, description: string) {
    this.title = title;
    this.rating = rating;
    this.description = description;
  }

  static borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("title"),
    borsh.u8("rating"),
    borsh.str("description"),
  ]);

  serialize(): Buffer {
    const buffer = Buffer.alloc(1000);
    Movie.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
    return buffer.slice(0, Movie.borshInstructionSchema.getSpan(buffer));
  }

  static borshAccountSchema = borsh.struct([
    borsh.bool("initialized"),
    borsh.u8("rating"),
    borsh.str("title"),
    borsh.str("description"),
  ]);

  static deserialize(buffer: Buffer): Movie | null {
    if (!buffer) {
      throw new Error("Invalid buffer");
    }
    try {
      // return Movie.borshAccountSchema.decode(buffer);
      const { title, rating, description } =
        Movie.borshAccountSchema.decode(buffer);
      return new Movie(title, rating, description);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export const ReviewMovie = async (
  { title, rating, description }: Movie,
  connection: web3.Connection,
  keypair: web3.Keypair
) => {
  const MOVIE_REVIEW_PROGRAM_ID =
    "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";
  const movie = new Movie(title, rating, description);
  const buffer = movie.serialize();
  const transaction = new web3.Transaction();
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [keypair.publicKey.toBuffer(), Buffer.from(movie.title)],
    new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
  );
  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: keypair.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: buffer,
    programId: new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
  });

  transaction.add(instruction);
  try {
    let txid = await web3.sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    console.log(
      `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
    );
  } catch (e) {
    console.log(JSON.stringify(e));
  }
};

export const FetchMovies = async (): Promise<(Movie | null)[]> => {
  const MOVIE_REVIEW_PROGRAM_ID =
    "CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN";
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const pda = await connection.getProgramAccounts(
    new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
  );
  const movies = pda.map((accountInfo) => {
    const deserializedMovie = Movie.deserialize(accountInfo.account.data);
    return deserializedMovie;
  });
  return movies;
};
