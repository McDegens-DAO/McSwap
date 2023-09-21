# McSwap
The Open Source Compressed NFT Swap Interface.
* Developed by [SolDapper](https://twitter.com/SolDapper) Web3 Studio in support of [McDegens DAO](https://twitter.com/McDegensDAO)

## Demo
[McSwap.xyz](https://mcswap.xyz)

## Support
[Discord](https://discord.com/invite/mcdegensdao)

## Requirements
* A registered domain name.
* Basic Linux web hosting with PHP.
* [Helius](https://www.helius.dev) or other cNFT compatible RPC endpoint.

## Install

## Configure
1. Open the RPC proxy config file: [config/config.php](https://github.com/McDegens-DAO/McSwap/blob/main/config/config.php)
* Add your Helius key on line 2.
* Add your domain to the whitelist.
```php
<?php
$key = "YOUR_HELIUS_KEY";
$path = "https://rpc.helius.xyz/?api-key=".$key;
$whitelist = array("https://your-domain-name.com");
```

2. Open the javascript settings file: [config/settings.js](https://github.com/McDegens-DAO/McSwap/blob/main/config/settings.js)
* Default values are included, adjust as neccessary.
```javascript
conf.cluster = conf.host + "/rpc/"; // proxy folder (recommended) or full endpoint address
conf.nft_explorer = "https://solscan.io/token/"; // set path to your preferred nft explorer 
conf.cnft_explorer = "https://xray.helius.xyz/token/"; // set path to your preferred cnft explorer 
conf.cnfts = "9kYLegTSs9SVSQvSsHXgWAmKsi27We2d9kEtgbLWkKTY"; // set wallet you wish to receive nft donations
conf.sol = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu"; // set wallet you wish to receive sol donations
conf.pikl = "AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3"; // set custom token mint for proposals
conf.pikl_image = "https://pikl.mcdegen.xyz/pictures/PIKL.png"; // set custom token image for proposals
conf.pikl_symbol = "PIKL"; // set custom token symbol for proposals
conf.pikl_decimals = 9; // set custom token decimals for proposals
conf.logo = "https://mcswap.xyz/img/M-300.png"; // set centered logo image
conf.logo_wallet = "https://mcswap.xyz/img/M-300-DIM.png"; // set wallet background
conf.logo_icon = "https://mcswap.xyz/img/favicon.png"; // set icon image
conf.discord = "https://discord.gg/mcdegensdao"; // set discord invite
conf.twitter = "https://twitter.com/McDegensDAO"; // set twitter invite
conf.wallet_name = "McSwap"; // set display name in wallet
conf.title = "McSwap"; // set app title
conf.desc = "McSwap is a trustless P2P cNFT OTC trade contract and interface."; // set app description
```

3. Open the html template file: [index.html](https://github.com/McDegens-DAO/McSwap/blob/main/index.html)
* Set the Metatag titles, descriptions, and domain to match your javascript settings.
```html
<!-- set and then remove the robots metatag -->
<meta name="robots" content="noindex,nofollow,noarchive">
<title>McSwap</title>
<meta id="og_title" property="og:title" content="McSwap">
<meta id="meta_desc" name="description" content="McSwap is a trustless cNFT powered P2P OTC trade contract and interface." />
<meta id="og_desc" property="og:description" content="McSwap is a trustless cNFT powered P2P OTC trade contract and interface.">
<meta id="og_url" property="og:url" content="https://mcswap.xyz">
<!-- set and then remove the robots metatag -->
```

4. Open the robots file (optional): [robots.txt](https://github.com/McDegens-DAO/McSwap/blob/main/robots.txt)
* Do not make this change until you're ready for search engines to index your site.
Change
```txt
User-agent: *
Disallow: /
```
To
```txt
User-agent: *
Allow: /
```


## Skins

## Deeplinks

## Create Swap Proposal

## Execute Swap Proposal
