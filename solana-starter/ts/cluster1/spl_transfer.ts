import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./wallet/wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("4Cgj8HTF1MNRMLWZh7jrEhB8GEFFUEKaXUtfjTrMux8v");

// Recipient address
const to = new PublicKey("9aYZU8Ed6cfHbqQNHXtjXLqPsLq1p9ft7Wv6n3vYHZFN");

(async () => {
  try {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    const atb = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );
    const tx = await transfer(
      connection,
      keypair,
      ata.address,
      atb.address,
      keypair,
      1_000_0n
    );
    console.log(`Your transfer txid: ${tx}`);
    // Get the token account of the fromWallet address, and if it does not exist, create it
    // Get the token account of the toWallet address, and if it does not exist, create it
    // Transfer the new token to the "toTokenAccount" we just created
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
