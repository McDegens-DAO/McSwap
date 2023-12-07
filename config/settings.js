//************************************************************************************
// config
let conf = {};
conf.fee = 25000000;
conf.chips_fee = 100000000;
// if the program fees change, you will update that above
//************************************************************************************

//************************************************************************************
conf.wallet_name = "McSwap (beta)"; // set display name in wallet
conf.title = "McSwap"; // set app title
conf.desc = "McSwap is a Trustless P2P OTC NFT/cNFT/SPL trade program.";
conf.host = window.location.protocol+"//"+window.location.host; // host domain
conf.cluster = conf.host + "/rpc/"; // proxy folder
conf.nft_explorer = "https://solana.fm/address/"; // set path to your preferred nft explorer 
conf.cnft_explorer = "https://solana.fm/address/"; // set path to your preferred cnft explorer 
conf.cnfts = "9kYLegTSs9SVSQvSsHXgWAmKsi27We2d9kEtgbLWkKTY"; // set wallet you wish to receive nft donations
conf.sol = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu"; // set wallet you wish to receive sol donations
conf.discord = "https://discord.com/invite/hXXDvYTQhj"; // set discord invite
conf.twitter = "https://twitter.com/McDegensDAO"; // set twitter invite
conf.default = "nft"; // which list initially loads after connecting
conf.nft_limit = 250; // limit how many cNFTs can load in the wallet viewer
conf.idler = 5; // number of minutes before disconnecting wallet for inactivity
// conf.nft_explorer = "https://solscan.io/token/"; // set path to your preferred nft explorer 
// conf.cnft_explorer = "https://xray.helius.xyz/token/"; // set path to your preferred cnft explorer 
//************************************************************************************

//************************************************************************************
// conf.scrollbar = "#e99200"; // set the scroll bar color for the menu
conf.scrollbar = "#333333"; // set the color for scroll bars
conf.vanta = "WAVES"; // vanta animated background plugin, false boolean will exclude vanta
// conf.vanta_color = 0x111111; // mcswap
conf.vanta_color = 0x1254a5; // mycelium
// conf.vanta_color = 0xc08a28; // duck trader
conf.vanta_mouseControls = true;
conf.vanta_touchControls = true;
conf.vanta_waveSpeed = 0.10;
conf.vanta_waveHeight = 30.00;
conf.vanta_shininess = 0.00;
//************************************************************************************
