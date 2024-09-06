import { Connection,LAMPORTS_PER_SOL,PublicKey } from "@solana/web3.js";

const publicKey = new PublicKey("933T7vkodTBDyJdZi8dVjRHzsfVVfaABGfBmzjaQdEwL")

const connection = new Connection("https://api.devnet.solana.com","confirmed")

const bal = await connection.getBalance(publicKey)

const balInSol=bal/LAMPORTS_PER_SOL

console.log(`The balance for the wallet at address is`,balInSol);
