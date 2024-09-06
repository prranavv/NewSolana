require("dotenv").config()

import { Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    Keypair,
} from "@solana/web3.js";

import bs58 from "bs58"

const secretKey =process.env.SECRET;
if (!secretKey) {
    throw new Error(`Please enter in environment.`);
}
const decodedkey = bs58.decode(secretKey)
const sndkeypair = Keypair.fromSecretKey(decodedkey)
const suppliedpubkey = process.argv[2] || null
if (!suppliedpubkey){
    console.log(`please provide a pub key to send to`);
    process.exit(1)
}

console.log(sndkeypair.publicKey.toBase58());


console.log(`Supplied to pub key: ${suppliedpubkey}`);
const toPubkey = new PublicKey(suppliedpubkey)
const connection = new Connection("https://api.devnet.solana.com","confirmed")
console.log("loaded our own keypair,dest and connected to solana");


const transaction = new Transaction()

const LAMPORTS_TO_SEND = 5000

const sendsolinstruction = SystemProgram.transfer({
    fromPubkey:sndkeypair.publicKey,
    toPubkey,
    lamports:LAMPORTS_TO_SEND
})

transaction.add(sendsolinstruction)

const signature = await sendAndConfirmTransaction(connection,transaction,[
    sndkeypair
])

console.log(`fin! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}`);

console.log(`Transaction signature is ${signature}`);
