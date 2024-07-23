# McSwap
Trustless P2P Contract Creator.

dApp Version: 1.8 (beta)

This repo is still experimental.

## Live dApp
[McSwap.xyz](https://mcswap.xyz)

## Support
Create a ticket at our [Discord](https://discord.com/invite/hXXDvYTQhj)

## Requirements
* A registered domain name.
* Basic LAMP web hosting with PHP8+ & SSL.
* Apache mod_rewrite enabled (usually default).
* [Helius](https://www.helius.dev) RPC credentials.
* Coin Market Cap credentials.

## Install
1. Navigate to the public_html folder of your server via terminal.
2. Run the following command:
```txt
git clone https://github.com/McDegens-DAO/McSwap.git && mv McSwap/* . && mv htaccess.txt .htaccess
```

## Configure
1. Open the RPC proxy config: [config/proxy.php](https://github.com/McDegens-DAO/McSwap/blob/main/config/proxy.php)
* Add your Helius key.
* Add your CMC key.
* Add your domain to the whitelist.
```php
<?php
// helius
$key = "YOUR_HELIUS_KEY";
$path = "https://mainnet.helius-rpc.com/?api-key=".$key;
// cmc
$cmc_key = "YOUR_CMC_KEY";
$cmc_path = "https://pro-api.coinmarketcap.com";
// wl
$whitelist = array("https://your-domain.com");
```

2. Open the javascript settings: [config/settings.js](https://github.com/McDegens-DAO/McSwap/blob/main/config/settings.js)
* Default values are included, adjust as neccessary.
```javascript
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
conf.cnft_blacklist = [];
// nft blacklist
conf.nft_blacklist = [];
//************************************************************************************

//************************************************************************************
// set to empty array to use blacklist instead, or add more whitelist collections
conf.cnft_whitelist = [];
conf.nft_whitelist = [];
```

3. Open the html template: [index.html](https://github.com/McDegens-DAO/McSwap/blob/main/index.html)
* Set the metatag titles, descriptions, and url to match your javascript settings.
```html
  <!-- remove to allow indexing -->
  <meta name="robots" content="noindex,nofollow,noarchive">
  <!-- remove to allow indexing -->

  <!-- metatags -->
  <title>McSwap OTC</title>
  <meta id="meta_desc" name="description" content="McSwap OTC Trustless Contract Creator." />
  <meta id="og_title" property="og:title" content="McSwap OTC">
  <meta id="og_desc" property="og:description" content="McSwap OTC Trustless Contract Creator.">
  <meta id="og_url" property="og:url" content="https://mcswap.xyz">
  <meta id="img_a" property="og:image" content="https://mcswap.xyz/img/mcswap-card.png" />
  <meta property="og:type" content="website" />
  <!-- metatags -->

  <!-- social card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@SolDapper" />
  <meta name="twitter:creator" content="@SolDapper" />
  <meta name="twitter:title" content="McSwap OTC" />
  <meta name="twitter:description" content="McSwap OTC Trustless Contract Creator." />
  <meta name="twitter:image" content="https://mcswap.xyz/img/mcswap-card.png" />
  <!-- social card -->
```

Create Contract Shortcuts
* Apps can also use deeplinks as shortcuts to start new cnFT/NFT trade contracts using your sweet new swap tool.
```javascript
https://your-domain.com/propose/ASSET_ID_1
```
* Reduce friction by appending a provider name that will connect the user automatically using the given provider.
```javascript
https://your-domain.com/propose/ASSET_ID_1/phantom
```

## Custom Skin
1. Copy the "default" skin folder in [css/skins](https://github.com/McDegens-DAO/McSwap/tree/main/css/skins) and give it a unique name.
2. Replace images in your new folder as needed.
3. Add/edit css rules in your default.css file in the new folder.
4. Update .htaccess with your skin folder name.
```javascript
# default
RewriteRule ^img/(.*)$ /css/skins/default/img/$1 [L]
RewriteRule ^css/custom.css$ "/css/skins/default/default.css" [L]

# change the lines above to:
RewriteRule ^img/(.*)$ /css/skins/YOUR_SKIN_FOLDER/img/$1 [L]
RewriteRule ^css/custom.css$ "/css/skins/YOUR_SKIN_FOLDER/default.css" [L]
```

## SEO
Open the robots file (optional): [robots.txt](https://github.com/McDegens-DAO/McSwap/blob/main/robots.txt)
* Only make this change if you want search engines to index your app.

Change:
```txt
User-agent: *
Disallow: /
```
To:
```txt
User-agent: *
Allow: /
```