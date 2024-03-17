# McSwap
rustless P2P Contract Creator.

Version: 1.7 (beta)

This repo is currently for experimental use only.

## Live dApp
[McSwap.xyz](https://mcswap.xyz)

## Support
Create a ticket at our [Discord](https://discord.com/invite/hXXDvYTQhj)

## Requirements
* A registered domain name.
* Basic Linux web hosting with PHP8+ & SSL.
* Apache mod_rewrite enabled (usually default).
* A [Helius](https://www.helius.dev) RPC endpoint.

## Install
1. [Download](https://github.com/McDegens-DAO/McSwap/archive/refs/heads/main.zip) McSwap.
2. Upload the package to your web server.
3. Extract the contents of the package.
4. Rename [htaccess.txt](https://github.com/McDegens-DAO/McSwap/blob/main/htaccess.txt) to .htaccess

## Configure
1. Open the RPC proxy config: [config/proxy.php](https://github.com/McDegens-DAO/McSwap/blob/main/config/proxy.php)
* Add your Helius key on line 2.
* Add your domain to the whitelist.
```php
<?php
$key = "YOUR_HELIUS_KEY";
$path = "https://mainnet.helius-rpc.com/?api-key=".$key;
$whitelist = array("https://your-domain.com");
$cmc_key = "YOUR_CMC_KEY";
$cmc_path = "https://pro-api.coinmarketcap.com";
```

2. Open the javascript settings: [config/settings.js](https://github.com/McDegens-DAO/McSwap/blob/main/config/settings.js)
* Default values are included, adjust as neccessary.
```javascript
// ************************************************************************************
// config
let conf = {};
conf.fee = 5000000;
conf.chips_fee = 100000000;
// only edit above if the program fees changes
// ************************************************************************************

// ************************************************************************************
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
conf.priority = 1000;
// ************************************************************************************

// ************************************************************************************
// conf.scrollbar = "#e99200"; // set the scroll bar color for the menu
conf.scrollbar = "#333333"; // set the color for scroll bars
conf.vanta = "WAVES"; // vanta animated background plugin, false boolean will exclude vanta
conf.vanta_color = 0x111111; // mcswap
// conf.vanta_color = 0x1254a5; // mycelium
// conf.vanta_color = 0xc08a28; // dashingducks
conf.vanta_mouseControls = true;
conf.vanta_touchControls = true;
conf.vanta_waveSpeed = 0.10;
conf.vanta_waveHeight = 20.00;
conf.vanta_shininess = 0.00;
// ************************************************************************************

//************************************************************************************
// blacklist collections
conf.blacklist = ["ABxhEU99yGb6YDU9sCozpri57ei4czaovm4ccvCug8pA","57HzmaoGCVFpwPg78E2gqC23ZpXS2jKpSv2TmWHoGGpA"];
//************************************************************************************

// ************************************************************************************
// set to empty array to use blacklist instead, or add more whitelist collections
conf.whitelist = ["ACy3ZVXcch8mZXUtRVqsJfa2DhFHxnUJpBb4oeN9tZsX"];
// ************************************************************************************
```

3. Open the html template: [index.html](https://github.com/McDegens-DAO/McSwap/blob/main/index.html)
* Set the metatag titles, descriptions, and url to match your javascript settings.
```html
<!-- set and then remove the robots metatag -->
<meta name="robots" content="noindex,nofollow,noarchive">
<title>McSwap</title>
<meta id="og_title" property="og:title" content="McSwap">
<meta id="meta_desc" name="description" content="P2P Blockchain Contract Creator." />
<meta id="og_desc" property="og:description" content="P2P Blockchain Contract Creator.">
<meta id="og_url" property="og:url" content="https://mcswap.xyz">
<!-- set and then remove the robots metatag -->
```

4. Define Supported SPL Tokens: [config/tokens.json](https://github.com/McDegens-DAO/McSwap/blob/main/config/tokens.json)
* Add a new tokens details, i.e. Bonk, and leave the "cmc" value 0.
```javascript
[
  {
    "name": "Pickle",
    "symbol": "PIKL",
    "address": "AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3",
    "image": "https:\/\/piklme.com\/pictures\/PIKL.png",
    "decimals": 9,
    "cmc": 0
  },
  {
    "name": "Bonk",
    "symbol": "BONK",
    "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    "image": "https:\/\/arweave.net\/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    "decimals": 5,
    "cmc": 0
  }
]
```

5. Sync CMC IDs
* CMC IDs are used to estimate token values which are displayed to users when they create a p2p contract, and for peer review prior to execution.
* Accurate estimated values can not always be fetched for a token and should not be relied upon. It's important that your users continue verify asset values elsewhere.
* Any time you add one or more tokens to your list you'll need to sync it with Coin Market Cap.
* This will attempt to retrieve the CMC ID associated with any token in the list with a "cmc" value of 0.
* If an Id is found, the Id is added and tokens.json file is updated.
* To sync:

  a. open your terminal and navigate to the rpc folder.
  ```cli
    [user@domain rpc]$ cd rpc
  ```
  b. run the sync and wait
  ```cli
    [user@domain rpc]$ php cmc_sync.php sync
  ```
  c. expected response
  ```cli
    CMC Sync Complete!
  ```

5. Sync Sent/Received Contracts
* Coming Soon
* Instead of users sharing links, their sent and received contracts will be availalbe upon connecting their wallet.

## Deeplink Patterns

cNFT & NFT trade contracts invloving two non fungible assets
```javascript
https://your-domain.com/swap/ASSET_ID_1-ASSET_ID_2
```
cNFT & NFT trade contracts involving one non fungible asset
```javascript
https://your-domain.com/swap/ASSET_ID_1-
```
SPL token trade contracts between two peers
```javascript
https://your-domain.com/spl/PEER_1_WALLET-PEER_2_WALLET
```

Start Contract Shortcuts
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
