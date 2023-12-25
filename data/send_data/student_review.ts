import * as borsh from "@coral-xyz/borsh";
import * as web3 from "@solana/web3.js";

export class Course {
  name: string;
  message: string;
  constructor(name: string, message: string) {
    this.name = name;
    this.message = message;
  }

  static borshInstructionSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("name"),
    borsh.str("message"),
  ]);

  studentIntro(): Buffer {
    const buffer = Buffer.alloc(1000);
    Course.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer);
    return buffer.slice(0, Course.borshInstructionSchema.getSpan(buffer));
  }

  static borshDeserialization = borsh.struct([
    borsh.bool("initialized"),
    borsh.str("name"),
    borsh.str("message"),
  ]);

  static studentDeserialize(buffer: Buffer): Course {
    return Course.borshDeserialization.decode(buffer);
  }
}
export const ReviewCourse = async (
  { name, message }: Course,
  connection: web3.Connection,
  keypair: web3.Keypair
) => {
  const COURSE_REVIEW_PROGRAM_ID =
    "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

  const course = new Course(name, message);
  const buffer = course.studentIntro();
  const transaction = new web3.Transaction();
  const [pda] = web3.PublicKey.findProgramAddressSync(
    [keypair.publicKey.toBuffer()],
    new web3.PublicKey(COURSE_REVIEW_PROGRAM_ID)
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
    programId: new web3.PublicKey(COURSE_REVIEW_PROGRAM_ID),
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

export const FetchCourse = async (): Promise<(Course | null)[]> => {
  const MOVIE_REVIEW_PROGRAM_ID =
    "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const pda = await connection.getProgramAccounts(
    new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
  );
  const movies = pda.map((accountInfo) => {
    const deserializedMovie = Course.studentDeserialize(
      accountInfo.account.data
    );
    return deserializedMovie;
  });
  return movies;
};
