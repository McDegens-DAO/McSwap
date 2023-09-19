<?php
require($_SERVER["DOCUMENT_ROOT"]."/config/config.php");
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
header('Content-Type: application/json');
$json = file_get_contents('php://input');
$dat = json_decode($json);
if (!class_exists('RPCX')) {
class RPCX {
  public function __construct($path){
    $this->path=$path;
    $this->payload=new stdClass;
    $this->payload->jsonrpc="2.0";
    $this->payload->id="rpd-op-123";
    $this->payload->method="";
  }
  public function call($method,$params){
    $this->payload->method=$method;
    $this->payload->params=$params;
    $data=json_encode($this->payload);
    $ch=curl_init($this->path);
    $options=array( 
      CURLOPT_URL=>$this->path, 
      CURLOPT_RETURNTRANSFER=>true,
      CURLOPT_HTTPHEADER=>array('Content-Type:application/json'),
      CURLOPT_POSTFIELDS=>$data 
    );
    curl_setopt_array($ch,$options);
    $result=json_decode(curl_exec($ch));
    curl_close( $ch );
    return $result;
  }
}
$rpcx = new RPCX($path);
}
if(isset($dat->method) && isset($dat->params)){
  echo json_encode($rpcx->call($dat->method,$dat->params));
}