require("dotenv").config()
import { getExplorerLink } from "@solana-developers/helpers"
import { Connection,PublicKey,Keypair,clusterApiUrl } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token"
import bs58 from "bs58"

const connection = new Connection(clusterApiUrl("devnet"))


const secretKey = process.env.SECRET
if(!secretKey){
    throw new Error("Please set enviornment variable")
}
const decoded = bs58.decode(secretKey)

const sender = Keypair.fromSecretKey(decoded)

const recipient = new PublicKey("FoVtS4DhRKwT7bnwPAheFgXhmTFkUS3AvZrocD6A3182")

const tokenMintAccount = new PublicKey("DzCqCWGEYzCoX7nf49Kw7r7myqpFBrpiiws1GHWY69s7")

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`Attempting to send 1 token to ${recipient.toBase58()}`);

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    sender.publicKey
)

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient
)

const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    1*MINOR_UNITS_PER_MAJOR_UNITS
)

const link = getExplorerLink("transaction",signature,"devnet")

console.log(`✅ Transaction confirmed, explorer link is: ${link}!`);