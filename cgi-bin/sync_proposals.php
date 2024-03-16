<?php

// define header
header('Content-Type: application/json');
// define header

// solana program id
$SPL_PROGRAM = "AAyM7XH9w7ApeSuEat8AwUW1AA7dBuj2vXv7SuUGpNUp";
// solana program id

// include config
require(dirname(dirname(__FILE__))."/config/proxy.php");
// include config

// include rpc•x
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
// include rpc•x

// define arrays
$SPL = array();
$NFT = array();
$cNFT = array();
$pNFT = array();
// define arrays

// get McSwap SPL proposals
$proposals = array();
$filters = array();
$params = array();
$param = new stdClass();
$param->encoding = "base64";
$filter = new stdClass();
$filter->dataSize = 297;
$filters[0] = $filter;
$param->filters = $filters;
$params[0] = $SPL_PROGRAM;
$params[1] = $param;
$proposals_ = $rpcx->call("getProgramAccounts",$params);
$proposals_ = $proposals_->result;
if(count($proposals_) > 0){
  foreach($proposals_ as $key => $proposal){
    $proposals[] = $proposal->pubkey;
  }
}
unset($proposals_);
$SPL = $proposals;
file_put_contents(dirname(dirname(__FILE__))."/data/proposals/spl.json",json_encode($SPL, JSON_PRETTY_PRINT));
// echo json_encode($SPL, JSON_PRETTY_PRINT)."\n\n";