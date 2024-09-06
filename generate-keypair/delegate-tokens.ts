require("dotenv").config()
import { getExplorerLink } from "@solana-developers/helpers"
import { Connection,PublicKey,clusterApiUrl,Keypair } from "@solana/web3.js"
import { approve,getOrCreateAssociatedTokenAccount,revoke } from "@solana/spl-token"

const connection = new Connection(clusterApiUrl("devnet"))

import bs58 from "bs58"

const secretKey = process.env.SECRET
if(!secretKey){
    throw new Error("Please set enviornment variable")
}

const decoded = bs58.decode(secretKey)

const user = Keypair.fromSecretKey(decoded)

console.log("Loaded keypair");

const delegate = new PublicKey("9DBvHHVXYSq2UdPu64J8WKihNCRtdMvrutQHeoQsWkhh")

// const tokenMintAccount = new PublicKey("DzCqCWGEYzCoX7nf49Kw7r7myqpFBrpiiws1GHWY69s7")

// const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
//     connection,
//     user,
//     tokenMintAccount,
//     user.publicKey
// )

// const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

// const approveTransactionSignature= await approve(
//     connection,
//     user,
//     sourceTokenAccount.address,
//     delegate,
//     user.publicKey,
//     10*MINOR_UNITS_PER_MAJOR_UNITS
// )

// const link = getExplorerLink("transaction",approveTransactionSignature,"devnet")

// console.log("Transaction Link",link);


// Code to revoke the delegate tokens
const revokTx = await revoke(
    connection,
    user,
    delegate,
    user.publicKey,
)

const link = getExplorerLink("transaction",revokTx,"devnet")
console.log("Revoke delgate link:",link);
