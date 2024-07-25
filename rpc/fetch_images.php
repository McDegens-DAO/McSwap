<?php
if(!isset($autosync)){
  header('Content-Type: application/json');
  require(dirname(__DIR__)."/config/proxy.php");
  $token_list = json_decode(file_get_contents(dirname(__DIR__)."/config/tokens.json"));
}
function file_get_contents_curl($url) { 
  $cha = curl_init(); 
  curl_setopt($cha, CURLOPT_HEADER, 0); 
  curl_setopt($cha, CURLOPT_RETURNTRANSFER, 1); 
  curl_setopt($cha, CURLOPT_URL, $url); 
  $data = curl_exec($cha); 
  curl_close($cha); 
  return $data; 
} 
foreach($token_list as $key => $token) {

  $check_for_jpg = dirname(__DIR__)."/data/tokens/".$token->address.".jpg";
  $check_for_png = dirname(__DIR__)."/data/tokens/".$token->address.".png";

  if(!file_exists($check_for_jpg) and !file_exists($check_for_png)){

    $ch = curl_init($token->image);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    $info = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    $ext = false;
    if($info=="image/png"){
      $ext = "png";
    }
    else if($info=="image/jpeg"){
      $ext = "jpg";
    }
    if($ext != false){
      $content = file_get_contents_curl($token->image); 
      if($content==false or $content==null){
        echo "failed: ".$token->image."\n";
        $token_list[$key]->img = false;
      }
      else{
        $name = dirname(__DIR__)."/data/tokens/".$token->address.".".$ext;
        $token_list[$key]->img = "/data/tokens/".$token->address.".".$ext;
        echo $token->address.".".$ext."\n";
        file_put_contents( $name, $content );
      }
    }

  }
  
}
// write back to the token list
file_put_contents(dirname(__DIR__)."/config/tokens.json",json_encode($token_list));