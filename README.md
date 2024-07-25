# McSwap OTC
Trustless Contract Creator

![alt text](https://github.com/McDegens-DAO/McSwap/blob/main/css/skins/default/img/banner-github.png?raw=true)

Version: 1.8 (alpha)

Hosting: cPanel

Blockchain: Solana

Protocol: McSwap

## Status

We are currently adding Token2022 support and IDLs to all McSwap Protocol Programs on Solana. A Production version of McSwap OTC App will be availble as soon as possibly. Follow [@SolDapper](https://x.com/SolDapper) or the [McDegens DAO Discord](https://discord.com/invite/hXXDvYTQhj) for updates. And thank you for your interest.

## Live Demo
[McSwap.xyz](https://mcswap.xyz) (currently testing)

## Features
* Direct P2P SPL Asset Swaps/Sales
* Direct P2P NFT Asset Swaps/Sales
* Direct P2P CNFT Asset Swaps/Sales
* Direct P2P PNFT Asset Swaps/Sales
* Direct P2P CORE Asset Swaps/Sales

## McSwap Programs
The McSwap Protocol is comprised of five Solana Programs. The McSwap OTC App interactes with the McSwap Programs to create (OTC) over-the-counter (P2P) peer-to-peer trade contracts between two wallets. Below are the 5 Program IDs.

<sup>McSwap SPL <code>AAyM7XH9w7ApeSuEat8AwUW1AA7dBuj2vXv7SuUGpNUp</code> [View Details](https://solana.fm/address/AAyM7XH9w7ApeSuEat8AwUW1AA7dBuj2vXv7SuUGpNUp/transactions)</sup>

<sup>McSwap NFT <code>AyJBbGQzUQSvhivZnHMDCCk6eSLupkeBh4fvMAD8T4Xx</code> [View Details](https://solana.fm/address/AyJBbGQzUQSvhivZnHMDCCk6eSLupkeBh4fvMAD8T4Xx/transactions)</sup>

<sup>McSwap CNFT <code>6RUcK9T1hYAZGBxN82ERVDUi4vLAX4hN1zAyy3cU5jav</code> [View Details](https://solana.fm/address/6RUcK9T1hYAZGBxN82ERVDUi4vLAX4hN1zAyy3cU5jav/transactions)</sup>

<sup>McSwap PNFT <code>2bY36scRMEUJHJToVGjJ2uY8PdSrRPr73siNwGbv1ZNT</code> [View Details](https://solana.fm/address/2bY36scRMEUJHJToVGjJ2uY8PdSrRPr73siNwGbv1ZNT/transactions)</sup>

<sup>McSwap CORE <code>EYMc51BuTRTfc5XCYqSWW92risZvMP217N2VYaTdFMHh</code> [View Details](https://solana.fm/address/EYMc51BuTRTfc5XCYqSWW92risZvMP217N2VYaTdFMHh/transactions)</sup>

## Host Your Own
You can host your own instance of the McSwap OTC App and rebrand it for your community or project.

## Requirements
* A registered domain name.
* Basic cPanel web hosting with PHP8+ & SSL.
* Apache mod_rewrite enabled (usually default).
* [Helius RPC](https://www.helius.dev) credentials.
* [Coin Market Cap API](https://coinmarketcap.com/api/documentation/v1/#section/Quick-Start-Guide) credentials.

## Install

• Because we include a default set of token images this process can take a few minutes.

1. Navigate to the public_html folder of your server in your terminal.
2. Run the following command: 
```txt
git clone https://github.com/McDegens-DAO/McSwap.git && mv McSwap/* . && mv htaccess.txt .htaccess
```

## Configure
1. Open the proxy config: [config/proxy.php](https://github.com/McDegens-DAO/McSwap/blob/main/config/proxy.php)
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
conf.default_priority = "Medium"; // sets the default priority fee level on load
conf.wallet_cnft_enabled = true; // enable/disable cnft asset standard display in mcwallet
conf.wallet_nft_enabled = true; // enable/disable nft asset standard display in mcwallet
conf.idler = 10; // number of minutes before auto disconnecting wallet for inactivity
// ************************************************************************************

// ************************************************************************************
// display bottom social links
conf.social = true; // true or false
conf.discord = "https://discord.com/invite/hXXDvYTQhj"; // set discord invite
conf.github = "https://github.com/McDegens-DAO/McSwap"; // set discord invite
conf.twitter = "https://twitter.com/McDegensDAO"; // set twitter invite
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
Open the robots file: [robots.txt](https://github.com/McDegens-DAO/McSwap/blob/main/robots.txt)
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
Also remove or comment out this [robots metatag](https://github.com/McDegens-DAO/McSwap/blob/4b3c4756b4007810e4e3f83df1412c4e07159415/index.html#L12) from your html.

## Blinks & Actions
The McSwap OTC app is integrated with the McSwap Actions API out-of-the-box. OTC Contracts created using McSwap OTC can be executed by the intended peer party via Blink. The user creates a new contract and sends the provided link to their peer in a private X message to be executed as a Blink.

**actions.json**

Ref: [actions.php](https://github.com/McDegens-DAO/McSwap/blob/main/actions.php) 
```php
<?php header("Access-Control-Allow-Origin:*");header('Access-Control-Max-Age:86400');header('Content-Type:application/json');
header("Access-Control-Allow-Methods:GET");if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");}
$response=new stdClass;
$rules=array();
$rule=new stdClass;
// define rules below

// ***************************************************************
// repeat for each rule
$rule->pathPattern = "/spl*";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-spl-config*";
$rules[] = $rule;
$rule->pathPattern = "/swap*";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-swap-config*";
$rules[] = $rule;
// ***************************************************************

// output data
$response->rules=$rules;
echo json_encode($response);
exit();
```
**Social Card**

The Social Card metadata is defined in the [index.html](https://github.com/McDegens-DAO/McSwap/blob/8833957ff89c98e99954b56b661da1a964a1dc88/index.html#L26) file.

```html
<!-- social card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@SolDapper" />
<meta name="twitter:creator" content="@SolDapper" />
<meta name="twitter:title" content="McSwap OTC" />
<meta name="twitter:description" content="McSwap OTC Trustless Contract Creator." />
<meta name="twitter:image" content="https://mcswap.xyz/img/mcswap-card.png" />
<!-- social card -->
```
## Maintenance

**Sync Jupiter Strict List**

The repo comes with a default token list and token image files. Should it become necessary to re-sync 
with the Jupiter Strict List or Coin Market Cap IDs, you can run the following command from your terminal.
```php
php public_html/rpc/jup_sync.php
```

**Sync Coin Market Cap IDs**

• runs after jup_sync but can also be run directly

• a full sync can take roughly 7 minutes or more.

Any tokens in the config/tokens.js file with "cmc":"0" will be checked and the CMC ID will be added if the token is listed on CMC. You can sync the CMC IDs using the following command.
```php
php public_html/rpc/cmc_sync.php
```

**Fetch Token Images**

• runs after jup_syc > cmc_sync but can also be run directly

• local images that already exist are skipped

Saving the token images on the server allows the images to load much faster and provide a better user experience with the app. You can fetch any new or missing images for your token list by running this command.
```php
php public_html/rpc/fetch_images.php
```

## Support
Create a ticket at [Discord](https://discord.com/invite/hXXDvYTQhj) or contact [@SolDapper](https://x.com/SolDapper) on X.