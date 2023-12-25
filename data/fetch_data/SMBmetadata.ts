import { Connection, PublicKey } from "@solana/web3.js";
import * as borsh from "@coral-xyz/borsh";

const borshDeserialization = borsh.struct([
  borsh.u8("key"),
  borsh.publicKey("updateAuthority"),
  borsh.publicKey("mint"),
  borsh.str("name"),
  borsh.str("symbol"),
  borsh.str("uri"),
  borsh.u16("sellerFeeBasisPoints"),
  borsh.option(
    borsh.vec(
      borsh.struct([borsh.publicKey("address"), borsh.bool("verified"), borsh.u8("share")]),
      "CreatorArray"
    ),
    "creators"
  ),
  borsh.bool("primarySaleHappened"),
  borsh.bool("isMutable"),
  borsh.option(borsh.struct([borsh.u16("editionNonceValue")]), "editionNonce"),
  // borsh.option(borsh.struct([borsh.u16("tokenStandardValue")]), "tokenStandard"),
]);

export const fetchMetadata = async (connection: Connection) => {
  const tokenMint = new PublicKey("EoETM2nvkuLaSejbAqwEJxWFKA1B2cXgDgT4RoGN6S6k");
  const programID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
  const seeds = [Buffer.from("metadata"), programID.toBytes(), tokenMint.toBytes()];

  const [metadataPDA, _] = PublicKey.findProgramAddressSync(seeds, programID);

  const AccountInfo = await connection.getAccountInfo(metadataPDA);
  if (AccountInfo) {
    const metadata = borshDeserialization.decode(AccountInfo.data);
    console.log(metadata);
  }
};
