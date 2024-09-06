import {
    Connection,
    clusterApiUrl,
    PublicKey,
    LAMPORTS_PER_SOL
} from "@solana/web3.js"

import {
    getKeypairFromFile,
    airdropIfRequired
} from "@solana-developers/helpers"

import {
    Metaplex,
    keypairIdentity,
    irysStorage,
    toMetaplexFile,
} from "@metaplex-foundation/js"

import {readFileSync} from "fs"

const connection = new Connection(clusterApiUrl("devnet"))

const user=await getKeypairFromFile()

await airdropIfRequired(
    connection,
    user.publicKey,
    1*LAMPORTS_PER_SOL,
    0.1*LAMPORTS_PER_SOL
)

console.log("Loaded User:",user.publicKey.toBase58());

const metaplex = Metaplex.make(connection)
.use(keypairIdentity(user))
.use(
    irysStorage(
        {
            address:"https://devnet.irys.xyz",
            providerUrl:"https://api.devnet.solana.com",
            timeout:60000,
        }
    )
)

const collectionNftAddress = new PublicKey("FJQEGZZhP88JBsHEnrGW1pEmwkEVxmwuJ6wqxZbCJ8dG")

const nftData = {
  name: "Name",
  symbol: "SYMBOL",
  description: "Description",
  sellerFeeBasisPoints: 0,
  imageFile: "solana.png",
};

const buffer=readFileSync(nftData.imageFile)

const file = toMetaplexFile(buffer,nftData.imageFile)

const imageUri= await metaplex.storage().upload(file)

console.log("Image URI:",imageUri);

const uploadMetadataOutput = await metaplex.nfts().uploadMetadata({
    name:nftData.name,
    symbol:nftData.symbol,
    description: nftData.description,
    image:imageUri
})

const metadataUri = uploadMetadataOutput.uri

const createNftOutput = await metaplex.nfts().create(
    {
        uri:metadataUri,
        name:nftData.name,
        sellerFeeBasisPoints:nftData.sellerFeeBasisPoints,
        symbol:nftData.symbol,
        collection:collectionNftAddress
    },
    {commitment:"finalized"}
)

const nft=createNftOutput.nft

console.log(  `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`,);

