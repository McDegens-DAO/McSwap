<?php header("Access-Control-Allow-Origin:*");header('Access-Control-Max-Age:86400');header('Content-Type:application/json');
header("Access-Control-Allow-Methods:GET");if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");}
$response=new stdClass;
$rules=array();
$rule=new stdClass;
// define rules below

// ***************************************************************
// repeat for each rule
$rule=new stdClass;
$rule->pathPattern = "/spl/*";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-spl-config/*";
$rules[] = $rule;
$rule=new stdClass;
$rule->pathPattern = "/swap/*";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-swap-config/*";
$rules[] = $rule;
$rule=new stdClass;
$rule->pathPattern = "/createSPL";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-spl-create";
$rules[] = $rule;
$rule=new stdClass;
$rule->pathPattern = "/createNFT";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-nft-create";
$rules[] = $rule;
$rule=new stdClass;
$rule->pathPattern = "/createPNFT";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-pnft-create";
$rules[] = $rule;
$rule=new stdClass;
$rule->pathPattern = "/createCNFT";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-cnft-create";
$rules[] = $rule;
$rule=new stdClass;
$rule->pathPattern = "/createCORE";
$rule->apiPath = "https://www.solana-action-express.com/mcswap-core-create";
$rules[] = $rule;
// ***************************************************************

// output data
$response->rules=$rules;
echo json_encode($response);
exit();