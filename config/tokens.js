// custom spl tokens list for proposal token requests
const spl_tokens = [
   {
     "name": "Pickle",
     "symbol": "PIKL",
     "address": "AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3",
     "image": "https://piklme.com/pictures/PIKL.png",
     "decimals": 9
   },
  {
    "name": "BlazeStake Staked SOL",
    "symbol": "bSOL",
    "address": "bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png",
    "decimals": 9
  },
  {
    "name": "Only Possible On Solana",
    "symbol": "OPOS",
    "address": "BqVHWpwUDgMik5gbTciFfozadpE2oZth5bxCDrgbDt52",
    "image": "https://arweave.net/k8uU2yLoYwL4zTBZ-TO-7bs6hgtLNaHhzP4FLUMuaS0",
    "decimals": 9
  },
  {
    "name": "COCO Token",
    "symbol": "COCO",
    "address": "74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ",
    "image": "https://shdw-drive.genesysgo.net/EV1ARo89dwRzR1kv7JMr7V97qrcXjffkcwEuNHMJfJmz/COCO_icon.png",
    "decimals": 5
  },
  {
    "name": "Mycelium McToken",
    "symbol": "TOKE",
    "address": "AmgUMQeqW8H74trc8UkKjzZWtxBdpS496wh4GLy2mCpo",
    "image": "https://arweave.net/kVddfi0QG_NfS_cRQQ0vehEt7n25wVk3O4ilHaeidqY",
    "decimals": 3
  },
  {
    "name": "FORGE",
    "symbol": "FORGE",
    "address": "FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds/logo.png",
    "decimals": 9
  },
  {
    "name": "NANA Token",
    "symbol": "NANA",
    "address": "HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr",
    "image": "https://shdw-drive.genesysgo.net/EV1ARo89dwRzR1kv7JMr7V97qrcXjffkcwEuNHMJfJmz/Banan.png",
    "decimals": 9
  },  
  {
    "name": "Guacamole",
    "symbol": "GUAC",
    "address": "AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR",
    "image": "https://shdw-drive.genesysgo.net/36JhGq9Aa1hBK6aDYM4NyFjR5Waiu9oHrb44j1j8edUt/image.png",
    "decimals": 5
  },    
  {
    "name": "BOOTY",
    "symbol": "BOOTY",
    "address": "bootyAfCh1eSQeKhFaDjN9Pu6zwPmAoQPoJWVuPasjJ",
    "image": "https://arweave.net/N-9sTPFfUhoFzJ6prtY2hItNkVaHVAktRDiuQrHwWhQ",
    "decimals": 9
  },    
  {
    "name": "Marinade staked SOL",
    "symbol": "mSOL",
    "address": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
    "decimals": 9
  },      
  {
    "name": "Marinade",
    "symbol": "MNDE",
    "address": "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png",
    "decimals": 9
  },   
  {
    "name": "USDT",
    "symbol": "USDT",
    "address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
    "decimals": 6
  },   
  {
    "name": "$PESKY",
    "symbol": "PESKY",
    "address": "nooot44pqeM88dcU8XpbexrmHjK7PapV2qEVnQ9LJ14",
    "image": "https://arweave.net/-hLGPqUv_ecNu86H7v2NyTy9ec0L9iGfhpN65lTfg-M",
    "decimals": 9
  },   
  {
    "name": "Jelly",
    "symbol": "JELLY",
    "address": "9WMwGcY6TcbSfy9XPpQymY3qNEsvEaYL3wivdwPG2fpp",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9WMwGcY6TcbSfy9XPpQymY3qNEsvEaYL3wivdwPG2fpp/logo.png",
    "decimals": 6
  },   
  {
    "name": "DUST Protocol",
    "symbol": "DUST",
    "address": "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
    "image": "https://gateway.pinata.cloud/ipfs/Qmb5qNLPhR8fJaz5MN1W55iSCXdNgMMSdWn94Z9oiFjw3o",
    "decimals": 9
  },   
  {
    "name": "Wrapped Ether (Wormhole)",
    "symbol": "WETH",
    "address": "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png",
    "decimals": 8
  },
  {
    "name": "Bonk",
    "symbol": "Bonk",
    "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    "image": "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    "decimals": 5
  },
  {
    "name": "Samoyed Coin",
    "symbol": "SAMO",
    "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "image": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU/logo.png",
    "decimals": 9
  }
];