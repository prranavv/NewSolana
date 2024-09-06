import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getKeypairFromFile,
  airdropIfRequired,
  getExplorerLink,
} from "@solana-developers/helpers";
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { readFileSync } from "fs";
 
// create a new connection to the cluster's API
const connection = new Connection(clusterApiUrl("devnet"));
 
// initialize a keypair for the user
const user = await getKeypairFromFile();
 
await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.1 * LAMPORTS_PER_SOL,
);
 
console.log("Loaded user:", user.publicKey.toBase58());

const metaplex = Metaplex.make(connection)
.use(keypairIdentity(user))
.use(
    irysStorage(
        {
            address:"https://devnet.irys.xyz",
            providerUrl:"https://api.devnet.solana.com",
            timeout:60000
        }
    )
)

const nftAddress= new PublicKey("82ogo51rUwdjJQ2DfpRrnFvMedXTYTTqnNq1HLnxZDd3")

const nft = await metaplex.nfts().findByMint({mintAddress:nftAddress})

const updatedNftData = {
  name: "Updated",
  symbol: "UPDATED",
  description: "Updated Description",
  sellerFeeBasisPoints: 100,
  imageFile: "solana.png",
};

const buffer = readFileSync(updatedNftData.imageFile)

const file = toMetaplexFile(buffer,updatedNftData.imageFile)

const imageUri = await metaplex.storage().upload(file)
console.log("Image Uri:",imageUri);

const uploadMetadataOutput = await metaplex.nfts().uploadMetadata({
    name:updatedNftData.name,
    symbol:updatedNftData.symbol,
    description:updatedNftData.description,
    image:imageUri
})

const updatedUri = uploadMetadataOutput.uri

const {response} = await metaplex.nfts().update(
    {
        nftOrSft:nft,
        uri:updatedUri
    },
    {commitment:"finalized"}
)

console.log(
  `NFT updated with new metadata URI: ${getExplorerLink(
    "transaction",
    response.signature,
    "devnet",
  )}`,
);
 
console.log("✅ Finished successfully!");
