# McSwap
Trustless P2P NFT/cNFT Trade dApp.

Version: 1.5 (beta)

Developed by [SolDapper](https://twitter.com/SolDapper) for [McDegens DAO](https://discord.com/invite/hXXDvYTQhj)

![McSwap](css/skins/default/img/banner-github.png)

## Live dApp
[McSwap.xyz](https://mcswap.xyz)

## ATTN
pNFTs are not yet supported by McSwap.

## Support
Create a ticket at our [Discord](https://discord.com/invite/hXXDvYTQhj)

## Requirements
* A registered domain name.
* Basic Linux web hosting with PHP8+ & SSL.
* Apache mod_rewrite enabled (usually default).
* A [Helius](https://www.helius.dev) or other cNFT compatible RPC endpoint.

## Install
1. [Download](https://github.com/McDegens-DAO/McSwap/archive/refs/heads/main.zip) McSwap.
2. Upload the package to your web server.
3. Extract the contents of the package.

## Skins
1. Copy "default" folder in skins and rename: [css/skins](https://github.com/McDegens-DAO/McSwap/tree/main/css/skins)
3. Replace images in your new folder as needed.
4. Add css to default.css file to override css rules. [css skin template](https://github.com/McDegens-DAO/McSwap/blob/main/css/template.css)
5. Update htaccess.txt with your folder name.
```javascript
# skinning css and images
RewriteRule ^img/(.*)$ /css/skins/YOUR_SKIN_FOLDER/img/$1 [L]
RewriteRule ^css/custom.css$ "/css/skins/YOUR_SKIN_FOLDER/default.css" [L]
```
5. Rename [htaccess.txt](https://github.com/McDegens-DAO/McSwap/blob/main/htaccess.txt) to .htaccess

## Configure
1. Open the RPC proxy config: [config/proxy.php](https://github.com/McDegens-DAO/McSwap/blob/main/config/proxy.php)
* Add your Helius key on line 2.
* Add your domain to the whitelist.
```php
<?php
$key = "YOUR_HELIUS_KEY";
$path = "https://rpc.helius.xyz/?api-key=".$key;
$whitelist = array("https://your-domain.com");
```

2. Open the javascript settings: [config/settings.js](https://github.com/McDegens-DAO/McSwap/blob/main/config/settings.js)
* Default values are included, adjust as neccessary.
```javascript
// config
let conf = {};
conf.wallet_name = "McSwap (beta)"; // set display name in wallet
conf.title = "McSwap"; // set app title
conf.desc = "McSwap is a Trustless P2P OTC NFT/cNFT trade contract and interface.";
conf.host = window.location.protocol+"//"+window.location.host; // host domain
conf.cluster = conf.host + "/rpc/"; // proxy folder
conf.nft_explorer = "https://solscan.io/token/"; // set path to your preferred nft explorer 
conf.cnft_explorer = "https://xray.helius.xyz/token/"; // set path to your preferred cnft explorer 
conf.cnfts = "9kYLegTSs9SVSQvSsHXgWAmKsi27We2d9kEtgbLWkKTY"; // set wallet you wish to receive nft donations
conf.sol = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu"; // set wallet you wish to receive sol donations
conf.discord = "https://discord.com/invite/hXXDvYTQhj"; // set discord invite
conf.twitter = "https://twitter.com/McDegensDAO"; // set twitter invite
conf.default = "nft"; // which list initially loads after connecting
conf.scrollbar = "#333333"; // set the color for scroll bars
conf.vanta = "WAVES"; // vanta animated background plugin, false boolean will exclude vanta
conf.vanta_color = 0x111111;
conf.vanta_mouseControls = true;
conf.vanta_touchControls = true;
conf.vanta_waveSpeed = 0.10;
conf.vanta_waveHeight = 30.00;
conf.vanta_shininess = 0.00;
```

3. Open the html template: [index.html](https://github.com/McDegens-DAO/McSwap/blob/main/index.html)
* Set the metatag titles, descriptions, and url to match your javascript settings.
```html
<!-- set and then remove the robots metatag -->
<meta name="robots" content="noindex,nofollow,noarchive">
<title>McSwap</title>
<meta id="og_title" property="og:title" content="McSwap">
<meta id="meta_desc" name="description" content="McSwap is a trustless P2P cNFT OTC swap contract and interface.">
<meta id="og_desc" property="og:description" content="McSwap is a trustless P2P cNFT OTC swap contract and interface.">
<meta id="og_url" property="og:url" content="https://mcswap.xyz">
<!-- set and then remove the robots metatag -->
```

4. Open the robots file (optional): [robots.txt](https://github.com/McDegens-DAO/McSwap/blob/main/robots.txt)
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

5. Open the combos file to customize combo tags: [config/combos.js](https://github.com/McDegens-DAO/McSwap/blob/main/config/combos.js)
* By default the template uses McDegen combos but you can add your own. 
```javascript
const combos_ = [
  {
    "name": "Calvin",
    "traits": [
      {"Headwear": "McDegens"},
      {"Outfits": "McDegens"},
      {"Masks": "Clown"}
    ]
  },
  {
    "name": "Tokers",
    "traits": [
      {"Headwear": "McDegens"},
      {"Outfits": "McDegens"},
      {"Hoods": "Blue"}
    ]
  }
]

```

6. Define Collection Names: [config/collections.js](https://github.com/McDegens-DAO/McSwap/blob/main/config/collections.js)
* There are some defaults, but you'll likely want to add more collection ids and details.
```javascript
async function group_details(id,name) {
  let rebld = {};
  let sorter = name.split("#");
  if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}
  if (id == "WoMbiTtXKwUtf4wosoffv45khVF8yA2mPkinGosCFQ4") {
    rebld.collection = "The Faceless";
    rebld.publisher = "Drip";
  }
  else if (id == "SoLPr7zxggXh9JUt8NGKyxLZGJmyWqgawcs9N9hmatP") {
    rebld.collection = "Binary Force";
    rebld.publisher = "Drip";
  }   
}
```

7. Define Supported SPL Tokens: [config/tokens.js](https://github.com/McDegens-DAO/McSwap/blob/main/config/tokens.js)
* You can add any SPL Tokens details to the list.
```javascript
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
  }
];
```

## Deeplinks

### Share Proposal
These links are automatically generated for you after deploying a new proposal. They are meant to be shared with the party you are trading with via your preferred messaging app.
```javascript
https://your-domain.com/swap/ASSET_ID_1-ASSET_ID_2
```

### Start Proposal
External apps can use deeplinks as shortcuts to start new proposals using your new swap tool.
```javascript
https://your-domain.com/propose/ASSET_ID_1
```
Reduce friction by appending a provider name that will connect the user automatically using the given provider.
```javascript
https://your-domain.com/propose/ASSET_ID_1/phantom
```
