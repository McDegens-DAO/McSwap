//************************************************************************************
// mcswap otc config
let conf = {};
//************************************************************************************
conf.wallet_name = "McSwap OTC (beta)"; // set display name in wallet
conf.title = "McSwap OTC"; // set app title
conf.desc = "Trustless P2P Contract Creator.";
conf.host = window.location.protocol+"//"+window.location.host; // host domain
conf.cluster = conf.host + "/rpc/"; // proxy folder
conf.nft_explorer = "https://solana.fm/address/"; // set path to your preferred nft explorer 
conf.cnft_explorer = "https://solana.fm/address/"; // set path to your preferred cnft explorer 
conf.sol = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu"; // set wallet you wish to receive sol donations
conf.discord = "https://discord.com/invite/hXXDvYTQhj"; // set discord invite
conf.twitter = "https://twitter.com/McDegensDAO"; // set twitter invite
conf.default = "nft"; // which asset standard initially loads after connecting
conf.nft_limit = 1000; // limit how many cNFTs can load in the wallet viewer
conf.idler = 10; // number of minutes before disconnecting wallet for inactivity
conf.default_priority = "Medium"; // sets the default priority fee level when the app loads
conf.wallet_cnft_enabled = true; // enable/disable cnft asset standard display in mcwallet
conf.wallet_nft_enabled = true; // enable/disable nft asset standard display in mcwallet
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
// cnft blacklist
conf.cnft_blacklist = ["ABxhEU99yGb6YDU9sCozpri57ei4czaovm4ccvCug8pA","57HzmaoGCVFpwPg78E2gqC23ZpXS2jKpSv2TmWHoGGpA","GzVyhiqKCjYQQoCJokjGMdgxyXMYLnrTVavbCkFCyszo","39RkP6mrAT6xYQzV7KRML3uJkcVw4NWvzh6KR7rGgPsc","GWfi77czDcQxwL31fnz3SUoRrWeSvXHKAkqTAQYwhEPm"];
// nft blacklist
conf.nft_blacklist = ["F7V1uB1yJ6QhnQoAe1wHiaeuGkCSdxSB1Y246EpyGxmG"];
//************************************************************************************

//************************************************************************************
// set to empty array to use blacklist instead, or add more whitelist collections
conf.cnft_whitelist = [];
// conf.cnft_whitelist = ["GokAiStXz2Kqbxwz2oqzfEXuUhE7aXySmBGEP7uejKXF","ACy3ZVXcch8mZXUtRVqsJfa2DhFHxnUJpBb4oeN9tZsX","6S4bjRhpByPRh43J6qsBuZKjhHqYy5azcFcq5kHR5vjM","3RtjqLoF6RMDWg2yUupgHZYqBFVVB8RjzNzXCHRQfF5R","WoMbiTtXKwUtf4wosoffv45khVF8yA2mPkinGosCFQ4"];
// conf.nft_whitelist = ["Da7ryJm1WRaZagzWVSYvS8dtwQnV1iN3cz76wGH7D6UX"];
conf.nft_whitelist = [];
