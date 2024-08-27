// ************************************************************************************
// mcswap otc config
let conf = {};
// ************************************************************************************

// ************************************************************************************
// main settings
conf.wallet_name = "McSwap OTC (beta)"; // set display name in wallet
conf.title = "McSwap OTC"; // set app title
conf.desc = "Trustless P2P Contract Creator.";
conf.sol = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu"; // set wallet you wish to receive sol donations
conf.scrollbar = "#333333"; // set the color for scroll bars
conf.default = "nft"; // which asset standard initially loads after connecting nft or cnft
conf.default_priority = "Low"; // sets the default priority fee level on load
conf.wallet_cnft_enabled = true; // enable/disable cnft asset standard display in mcwallet
conf.wallet_nft_enabled = true; // enable/disable nft asset standard display in mcwallet
conf.idler = 10; // number of minutes before auto disconnecting wallet for inactivity
// ************************************************************************************

// ************************************************************************************
// display bottom social links
conf.social = true; // true or false
conf.discord = "https://discord.com/invite/hXXDvYTQhj"; // set host discord
conf.github = "https://github.com/McDegens-DAO/McSwap"; // set host github
conf.twitter = "https://x.com/mcswapotc"; // set author or host twitter
// ************************************************************************************

// ************************************************************************************
// vanta background
conf.vanta = "WAVES"; // vanta animated background plugin, false boolean will exclude vanta
conf.vanta_color = 0x111111; // mcswap grey
conf.vanta_mouseControls = true;
conf.vanta_touchControls = true;
conf.vanta_waveSpeed = 0.10;
conf.vanta_waveHeight = 20.00;
conf.vanta_shininess = 0.00;
// ************************************************************************************

// ************************************************************************************
// use explorers
conf.cnft_explorer = "https://solana.fm/address/"; // set path to your preferred cnft explorer 
conf.nft_explorer = "https://solana.fm/address/"; // set path to your preferred nft explorer 
// ************************************************************************************

// ************************************************************************************
// cnft blacklist
conf.cnft_blacklist = [];
// nft blacklist
conf.nft_blacklist = [];
// ************************************************************************************

// ************************************************************************************
// cnft whitelist
conf.cnft_whitelist = [];
// nft whitelist
conf.nft_whitelist = [];
// ************************************************************************************

// ************************************************************************************
// host name and proxy path (no edit)
conf.host = window.location.protocol+"//"+window.location.host; // host domain
conf.cluster = conf.host + "/rpc/"; // proxy folder
conf.nft_limit = 1000; // loader limit * 3
// ************************************************************************************