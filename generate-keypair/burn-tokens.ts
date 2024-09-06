require("dotenv").config()
import { getExplorerLink } from "@solana-developers/helpers"
import { Connection,PublicKey,Keypair,clusterApiUrl } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount,burn } from "@solana/spl-token"

const connection = new Connection(clusterApiUrl("devnet"))

import bs58 from "bs58"

const secretKey = process.env.SECRET
if(!secretKey){
    throw new Error("Please set enviornment variable")
}

const decoded = bs58.decode(secretKey)

const user = Keypair.fromSecretKey(decoded)

console.log("Loaded keypair");

const tokenMintAccount =new PublicKey("DzCqCWGEYzCoX7nf49Kw7r7myqpFBrpiiws1GHWY69s7")

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    user.publicKey
)

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const transactionSignature= await burn(
    connection,
    user,
    sourceTokenAccount.address,
    tokenMintAccount,
    user,
    25*MINOR_UNITS_PER_MAJOR_UNITS
)

const link = getExplorerLink("transaction",transactionSignature,"devnet")

console.log("Burn Transaction Signature:",link);

