require("dotenv").config()
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { getExplorerLink } from "@solana-developers/helpers";
import { Connection,PublicKey,Keypair,clusterApiUrl } from "@solana/web3.js";
import bs58 from "bs58"

const secretKey = process.env.SECRET
if(!secretKey){
    throw new Error("Please set enviornment variable")
}
const connection = new Connection(clusterApiUrl("devnet"))

const decoded = bs58.decode(secretKey)

const user = Keypair.fromSecretKey(decoded)

console.log("Loaded keypair");

const tokenMintAccount = new PublicKey("DzCqCWGEYzCoX7nf49Kw7r7myqpFBrpiiws1GHWY69s7")

const recipient = user.publicKey

const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    tokenMintAccount,
    recipient,
)

console.log(`Token account: ${tokenAccount.address.toBase58()}`);

const link = getExplorerLink(
    "address",
    tokenAccount.address.toBase58(),
    "devnet"
)

console.log(`Created token account: ${link}`);
