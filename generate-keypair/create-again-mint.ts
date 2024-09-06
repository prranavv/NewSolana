require("dotenv").config()
import {Keypair,clusterApiUrl,Connection} from "@solana/web3.js"
import {createMint} from "@solana/spl-token"
import bs58 from "bs58"
import { Key } from "@metaplex-foundation/mpl-token-metadata"
import { server } from "typescript"
import { getExplorerLink } from "@solana-developers/helpers"
const conection = new Connection(clusterApiUrl("devnet"))
const secretKey = process.env.SECRET
if(!secretKey){
    console.log("Please eneter proper");
    process.exit(1)
}

const decodedkey = bs58.decode(secretKey)

const user = Keypair.fromSecretKey(decodedkey)

const tokenMint = await createMint(
    conection,
    user,
    user.publicKey,
    null,
    2
)

const link = getExplorerLink("address",tokenMint.toString(),"devnet")
console.log(link);
