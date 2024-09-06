//Public key to send to HoAFX2eXX6ABaBdW35kxUZLqQe8DRNJC91RSjG9qMTMs

require("dotenv").config()
import * as web3 from "@solana/web3.js"
import { airdropIfRequired } from "@solana-developers/helpers"
import bs58 from "bs58"

const payerSecret = process.env.SECRET

const PING_PROGRAM_ADDRESS = new web3.PublicKey(
  "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa",
);

const PING_PROGRAM_DATA_ADDRESS = new web3.PublicKey(
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod",
);

if(!payerSecret){
    throw new Error("Please enter enviornment variable")
}

const decodedkey = bs58.decode(payerSecret)
const payer = web3.Keypair.fromSecretKey(decodedkey)

const connection = new web3.Connection(web3.clusterApiUrl("devnet"))

const newBalance = await airdropIfRequired(
    connection,
    payer.publicKey,
    1*web3.LAMPORTS_PER_SOL,
    0.5*web3.LAMPORTS_PER_SOL
)

const transaction = new web3.Transaction()
const programID = new web3.PublicKey(PING_PROGRAM_ADDRESS)
const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS)

const instruction = new web3.TransactionInstruction({
    keys:[
        {
            pubkey:pingProgramDataId,
            isSigner:false,
            isWritable:true,
        },
    ],
    programId:programID,
})

transaction.add(instruction)

const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
)

console.log("Transaction completed! Signature is",signature);
