<?php
header('Content-Type: application/json');
// // RPC•X PHP SOLANA RPC PROXY
require($_SERVER["DOCUMENT_ROOT"]."/config/proxy.php");
if (isset($_SERVER['HTTP_ORIGIN'])) {
  if(!in_array($_SERVER['HTTP_ORIGIN'],$whitelist)){
    header("Location: https://www.google.com/search?rlz=1C1ONGR_enUS1036US1036&sxsrf=AB5stBgOtYYWYM0lRLqCwqiLbb_JWud7iw:1689913872575&q=loser&tbm=isch&sa=X&ved=2ahUKEwj0is3g-56AAxVIQzABHSLCCK4Q0pQJegQIBBAB&biw=2158&bih=1192&dpr=1.1");
    exit;
  }
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Max-Age: 86400');
}
else{
  header("Location: https://www.google.com/search?rlz=1C1ONGR_enUS1036US1036&sxsrf=AB5stBgOtYYWYM0lRLqCwqiLbb_JWud7iw:1689913872575&q=loser&tbm=isch&sa=X&ved=2ahUKEwj0is3g-56AAxVIQzABHSLCCK4Q0pQJegQIBBAB&biw=2158&bih=1192&dpr=1.1");
  exit;
}
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");         
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
  header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}
$endpoint = '/v2/tools/price-conversion';
$url = $cmc_path.$endpoint;
$json = file_get_contents('php://input');
$data = json_decode($json);
if(!isset($data->amount) or !isset($data->id) or !isset($data->symbol)){exit;}
$data->amount = (float) $data->amount;
$parameters = ['amount'=>$data->amount,'id'=>$data->id,'convert'=>'USD',];
$headers = ['Accepts: application/json','X-CMC_PRO_API_KEY: '.$cmc_key];
$qs = http_build_query($parameters); // query string encode the parameters
$request = "{$url}?{$qs}"; // create the request URL
$curl = curl_init(); // Get cURL resource
curl_setopt_array($curl, array(
  CURLOPT_URL => $request,            // set the request URL
  CURLOPT_HTTPHEADER => $headers,     // set the headers 
  CURLOPT_RETURNTRANSFER => 1         // ask for raw response instead of bool
));
$response = curl_exec($curl); // Send the request, save the response
$response = json_decode($response);
if(isset($response->data->quote->USD->price)){
  $response = $response->data->quote->USD->price;
}
$response = json_encode($response);
echo $response; // print json decoded response
curl_close($curl); // Close request
?>