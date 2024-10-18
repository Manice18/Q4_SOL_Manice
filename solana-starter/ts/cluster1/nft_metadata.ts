import wallet from "./wallet/wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://devnet.irys.xyz/3MjAWSsFkXHHdQJRoBAH2JTxzwX6uBbtgD6HwS72Yyxx";
    const metadata = {
      name: "W RUG",
      symbol: "WRUG",
      description: "You have been rugged.",
      image: image,
      attributes: [
        {
          trait_type: "Rug-level",
          value: "100",
        },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [keypair.publicKey],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log(
      "Your metadata URI: ",
      myUri.replace("arweave.net", "devnet.irys.xyz")
    );
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
