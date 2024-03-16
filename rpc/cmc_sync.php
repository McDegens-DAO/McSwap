<?php
header('Content-Type: application/json');
require(dirname(__DIR__)."/config/proxy.php");
$url = $cmc_path.'/v1/cryptocurrency/map';
parse_str(implode('&', array_slice($argv, 1)), $_GET);
if( !isset($_GET["sync"]) and !isset($_GET["symbol"]) ){exit;}
if( isset($_GET["sync"]) ){
  $token_list=json_decode(file_get_contents(dirname(__DIR__)."/config/tokens.json"));
}
else{
  $toke = new stdClass();
  $toke->symbol = $_GET["symbol"];
  if(isset($_GET["mint"])){ $toke->address = $_GET["mint"]; }
  $token_list = array($toke);
}
$headers = ['Accepts: application/json','X-CMC_PRO_API_KEY: '.$cmc_key];
$curl = curl_init();
foreach($token_list as $key => $toke){
  $parameters = ['symbol'=>$toke->symbol];
  $qs = http_build_query($parameters);
  $request = "{$url}?{$qs}";
  curl_setopt_array($curl, array(
    CURLOPT_URL => $request,  
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => 1
  ));  
  $response = curl_exec($curl);
  $response = json_decode($response);
  if(isset($_GET["sync"]) and isset($toke->cmc)){
    if($toke->cmc == 0){
      if(isset($response->data) and count($response->data) > 0){
        foreach($response->data as $k => $token){
          if($token->platform->id != 16){
            unset($response->data[$key]);
          }
          else if(isset($toke->address) and $token->platform->token_address != $toke->address){
            unset($response->data[$key]);
          }
        }
        if(count($response->data) > 0){
          $token_list[$key]->cmc = $response->data[0]->id;
        }
      }
    } 
  }
  else{
    if(isset($response->data) and count($response->data) > 0){
      foreach($response->data as $k => $token){
        if($token->platform->id != 16){
          unset($response->data[$k]);
        }
        else if(isset($toke->address) and $token->platform->token_address != $toke->address){
          unset($response->data[$k]);
        }
      }
      if(count($response->data) > 0){
        $response = $response->data[0];
      }
      else{
        $response = "Unavailable";
      }
    }
    else{
      $response = "Unavailable";
    } 
    echo json_encode($response,JSON_PRETTY_PRINT);
  }
}
if( isset($_GET["sync"]) ){
  file_put_contents(dirname(__DIR__)."/config/tokens.json",json_encode($token_list,JSON_PRETTY_PRINT));
  echo "CMC Sync Complete!\n";
}
curl_close($curl);