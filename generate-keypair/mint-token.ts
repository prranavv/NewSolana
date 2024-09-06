require("dotenv").config()
import { mintTo } from "@solana/spl-token";
import { getExplorerLink } from "@solana-developers/helpers";
import { Connection,PublicKey,clusterApiUrl,Keypair } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"))

import bs58 from "bs58"

const secretKey = process.env.SECRET
if(!secretKey){
    throw new Error("Please set enviornment variable")
}

const decoded = bs58.decode(secretKey)

const user = Keypair.fromSecretKey(decoded)

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const tokenMintAccount = new PublicKey("DzCqCWGEYzCoX7nf49Kw7r7myqpFBrpiiws1GHWY69s7")

const recipientATT = new PublicKey("9DBvHHVXYSq2UdPu64J8WKihNCRtdMvrutQHeoQsWkhh")

const transactionSignature = await mintTo(
    connection,
    user,
    tokenMintAccount,
    recipientATT,
    user,
    10*MINOR_UNITS_PER_MAJOR_UNITS
)

const link = getExplorerLink(
    "transaction",
    transactionSignature,
    "devnet"
)

console.log("Mint token transaction:",link);
