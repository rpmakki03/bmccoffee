import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export const SOLANA_CLUSTER = "https://api.mainnet-beta.solana.com"; // or devnet
export const SOL_RECIPIENT = new PublicKey("4bms6zGBR86QHmTPFQ9R4qicX39C43mgnHaH9R4hK6X5");

export function getConnection() {
  return new Connection(SOLANA_CLUSTER, "confirmed");
}

export async function buildSolTransferTx(sender: PublicKey, amountSol: number) {
  const connection = getConnection();
  const { blockhash } = await connection.getLatestBlockhash();
  const tx = new Transaction({ recentBlockhash: blockhash, feePayer: sender });
  tx.add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: SOL_RECIPIENT,
      lamports: BigInt(Math.floor(amountSol * LAMPORTS_PER_SOL))
    })
  );
  return tx;
}


