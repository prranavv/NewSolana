import { Keypair } from "@solana/web3.js";

import bs58 from "bs58"

const keypair = Keypair.generate()

console.log("The public key is:",keypair.publicKey.toBase58());

console.log("Private key is:",JSON.stringify(Array.from(keypair.secretKey)));

console.log(bs58.encode(keypair.secretKey));
