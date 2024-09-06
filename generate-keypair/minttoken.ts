require("dotenv").config()
import { createMint } from "@solana/spl-token";
import { getExplorerLink } from "@solana-developers/helpers";
import { Connection,Keypair,clusterApiUrl } from "@solana/web3.js";
import bs58 from "bs58" 

const connection = new Connection(clusterApiUrl("devnet"))
const secretKey = process.env.SECRET
if(!secretKey){
    console.log("Please enter in enviornment");
    process.exit(1)
}

const decodedkey = bs58.decode(secretKey)

const user = Keypair.fromSecretKey(decodedkey)

const tokenMint = await createMint(connection,user,user.publicKey,null,2)

const link = getExplorerLink("address",tokenMint.toString(),"devnet")

console.log(`✅ Finished! Created token mint: ${link}`);