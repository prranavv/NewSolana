import { Connection,clusterApiUrl,LAMPORTS_PER_SOL } from "@solana/web3.js";
import { airdropIfRequired,getKeypairFromFile } from "@solana-developers/helpers";
import { 
    Metaplex,
    keypairIdentity,
    irysStorage,
    toMetaplexFile,
} from "@metaplex-foundation/js";

import {readFileSync} from "fs"

const connection = new Connection(clusterApiUrl("devnet"))

const user = await getKeypairFromFile()

await airdropIfRequired(
    connection,
    user.publicKey,
    1*LAMPORTS_PER_SOL,
    0.1*LAMPORTS_PER_SOL
)

console.log("Loaded user:",user.publicKey.toBase58());

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

const collectionNftData = {
  name: "TestCollectionNFT",
  symbol: "TEST",
  description: "Test Description Collection",
  sellerFeeBasisPoints: 100,
  imageFile: "success.png",
  isCollection: true,
  collectionAuthority: user,
};

const buffer = readFileSync(collectionNftData.imageFile)

const file = toMetaplexFile(buffer,collectionNftData.imageFile)

const imageURI = await metaplex.storage().upload(file)

console.log("Image URI:",imageURI);

const uploadMetadataOutput = await metaplex.nfts().uploadMetadata(
    {
        name:collectionNftData.name,
        symbol:collectionNftData.symbol,
        description:collectionNftData.description,
        image:imageURI
    }
)

const collectionURI = uploadMetadataOutput.uri
console.log("Collection offchain metadata URI:",collectionURI);

const createNFTOutput = await metaplex.nfts().create(
    {
        uri:collectionURI,
        name:collectionNftData.name,
        sellerFeeBasisPoints:collectionNftData.sellerFeeBasisPoints,
        symbol:collectionNftData.symbol,
        isCollection:true
    },
    {commitment: "finalized"}
)

const collectionNft = createNFTOutput.nft

console.log(`Collection NFT: https://explorer.solana.com/address/${collectionNft.address.toString()}?cluster=devnet`);

console.log("Collection NFT address is",collectionNft.address.toString());

console.log("Finished successfully");

