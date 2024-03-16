//************************************************************************************
// config
let conf = {};
conf.fee = 5000000;
conf.chips_fee = 100000000;
// if the program fees changes, you will update that above
//************************************************************************************

//************************************************************************************
conf.wallet_name = "McSwap (beta)"; // set display name in wallet
conf.title = "McSwap"; // set app title
conf.desc = "Trustless P2P Contract Creator.";
conf.host = window.location.protocol+"//"+window.location.host; // host domain
conf.cluster = conf.host + "/rpc/"; // proxy folder
conf.nft_explorer = "https://solana.fm/address/"; // set path to your preferred nft explorer 
conf.cnft_explorer = "https://solana.fm/address/"; // set path to your preferred cnft explorer 
conf.sol = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu"; // set wallet you wish to receive sol donations
conf.discord = "https://discord.com/invite/hXXDvYTQhj"; // set discord invite
conf.twitter = "https://twitter.com/McDegensDAO"; // set twitter invite
conf.default = "cnft"; // which list initially loads after connecting
conf.nft_limit = 1000; // limit how many cNFTs can load in the wallet viewer
conf.idler = 10; // number of minutes before disconnecting wallet for inactivity
conf.wallet_cnft_enabled = true;
conf.wallet_nft_enabled = false;
conf.priority = 50000;
//************************************************************************************

//************************************************************************************
// conf.scrollbar = "#e99200"; // set the scroll bar color for the menu
conf.scrollbar = "#333333"; // set the color for scroll bars
conf.vanta = "WAVES"; // vanta animated background plugin, false boolean will exclude vanta
conf.vanta_color = 0x111111; // mcswap
// conf.vanta_color = 0x1254a5; // mycelium
// conf.vanta_color = 0xc08a28; // duck trader
conf.vanta_mouseControls = true;
conf.vanta_touchControls = true;
conf.vanta_waveSpeed = 0.10;
conf.vanta_waveHeight = 20.00;
conf.vanta_shininess = 0.00;
//************************************************************************************

//************************************************************************************
// blacklist collections
conf.blacklist = ["ABxhEU99yGb6YDU9sCozpri57ei4czaovm4ccvCug8pA","57HzmaoGCVFpwPg78E2gqC23ZpXS2jKpSv2TmWHoGGpA","GzVyhiqKCjYQQoCJokjGMdgxyXMYLnrTVavbCkFCyszo","39RkP6mrAT6xYQzV7KRML3uJkcVw4NWvzh6KR7rGgPsc","GWfi77czDcQxwL31fnz3SUoRrWeSvXHKAkqTAQYwhEPm"];
//************************************************************************************

//************************************************************************************
// set to empty array to use blacklist instead, or add more whitelist collections
conf.whitelist = ["ACy3ZVXcch8mZXUtRVqsJfa2DhFHxnUJpBb4oeN9tZsX"];
