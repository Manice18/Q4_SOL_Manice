import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";

import { Vault } from "../target/types/vault";

const confirmTx = async (signature: string) => {
  const startTime = Date.now();
  const timeoutMs = 60000; // 1 minute timeout

  while (Date.now() - startTime < timeoutMs) {
    const response = await anchor
      .getProvider()
      .connection.getSignatureStatuses([signature]);
    const status = response.value[0];

    if (status && status.confirmationStatus === "confirmed") {
      return signature;
    }

    // Wait 100ms before next check
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(
    `Transaction confirmation timeout after ${
      timeoutMs / 1000
    } seconds: ${signature}`
  );
};

describe("Vault Test:", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Vault as Program<Vault>;
  console.log("Program ID", program.programId.toBase58());
  const user = Keypair.generate();

  console.log("User Wallet Address: ", user.publicKey.toBase58());

  const [state] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), user.publicKey.toBytes()],
    program.programId
  );

  const [vault] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), state.toBytes()],
    program.programId
  );

  it("Airdrop", async () => {
    const airdropAmount = 100;
    const tx2 = await provider.connection
      .requestAirdrop(user.publicKey, LAMPORTS_PER_SOL * airdropAmount)
      .then(confirmTx);
    console.log("Your airdrop transaction signature", tx2);
  });

  it("Initialize Account", async () => {
    try {
      const tx = await program.methods
        .initialize()
        .accountsPartial({
          user: user.publicKey,
          state: state,
          vault: vault,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc()
        .then(confirmTx);
      console.log("Initialized, your transaction signature", tx);
      console.log("Vault id: ", vault.toBase58());
    } catch (error) {
      console.log("Error", error);
    }
  });

  it("Deposit SOL", async () => {
    try {
      const depositAmount = 5;
      const tx = await program.methods
        .deposit(new BN(LAMPORTS_PER_SOL * depositAmount))
        .accountsPartial({
          user: user.publicKey,
          state: state,
          vault: vault,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc()
        .then(confirmTx);
      console.log(
        `Deposited ${depositAmount} SOL successfully.\nYour deposit transaction signature: `,
        tx
      );
    } catch (error) {
      console.log("Error", error);
    }
  });
  it("Withdraw", async () => {
    try {
      const withdrawAmount = 2;
      const tx = await program.methods
        .withdraw(new BN(LAMPORTS_PER_SOL * withdrawAmount))
        .accountsPartial({
          user: user.publicKey,
          state: state,
          vault: vault,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc()
        .then(confirmTx);
      console.log(
        `Successfully withdrawn ${withdrawAmount} SOL\nYour withdraw signature is: `,
        tx
      );
    } catch (error) {
      console.log("Error", error);
    }
  });
});
