<?php
header('Content-Type: application/json');
require(dirname(__DIR__)."/config/proxy.php");
function isJson($string) {
  json_decode($string);
  return json_last_error() === JSON_ERROR_NONE;
}
echo "syncing jupiter strict list...\n";
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://token.jup.ag/strict",  
  CURLOPT_RETURNTRANSFER=>true,
  CURLOPT_HTTPHEADER=>array('Content-Type:application/json'),
));  
$tokens = curl_exec($curl);
if (curl_errno($curl)) {
  $error_msg = curl_error($curl);
  echo json_encode($error_msg);
  curl_close($curl);
  exit;
}
$tokens = json_decode($tokens);
curl_close($curl);

// load the active list
$token_list = json_decode(file_get_contents(dirname(__DIR__)."/config/tokens.json"));
// $token_list = array();
// $tokens = array($tokens[5],$tokens[8],$tokens[12]);

if(is_array($tokens)){

  foreach($tokens as $key => $token){
    if($token->address != "So11111111111111111111111111111111111111112" && $token->address != "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
      $found = false;
      foreach($token_list as $k => $token_){
        if($token_->address == $token->address){  
          $found = true;
          break;
        }
      }
      if($found == false){
        $item = new stdClass;
        $item->name =  trim($token->name);
        $item->symbol = str_replace("$", "", trim($token->symbol));
        $item->address =  trim($token->address);
        $item->image =  trim($token->logoURI);
        $item->decimals =  trim($token->decimals);
        $item->cmc = 0;
        $token_list[] = $item;
      }
    }
  }

  $test_list = json_encode($token_list);
  if(isJson($test_list)){
    if (file_put_contents(dirname(__DIR__)."/config/tokens.json", json_encode($token_list,JSON_PRETTY_PRINT)) !== false) {
      echo "tokens.json file updated\n";
      echo "auto syncing cmc...\n";
      $autosync = true;
      require(dirname(__DIR__)."/rpc/cmc_sync.php");
    }
    else{
      echo "failed to write tokens.json file\n";
    }
  }
  else{
    echo "invalid json\n";
  }
  exit;

}

else{
  exit;
}
