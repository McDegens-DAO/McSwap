conf.version = 1.1;
conf.provider = false;
conf.fee = 25000000;
conf.billion = 1000000000;
conf.usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
conf.vault = "HieZydxjXUxTJRRvj4ovNPWzTKgxcGo1jLsPdXCiith2";
conf.system_alt = "6rztYc8onxK3FUku97XJrzvdZHqWavwx5xw8fB7QufCA";
conf.treasury = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu";
conf.treasury_studio = "2Gs1H87sQDmHS91iXaVQnhdWTGzsgo2vypAwdDRJTLqX";
conf.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
conf.BUBBLEGUM_PROGRAM_ID = "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY";
conf.MCSWAP_PROGRAM_ID = "ABDXeLg3NiQKf7xRyEjZ3HTCTP1dWezCAjVmxJ8NdWz1";
conf.tool = "mcwallet";
conf.shop_name = "McSwap Shop"; // set disply name of shop
conf.shop_enabled = false; // set shop status
conf.logo = conf.host+"/img/logo-300.png"; // set centered logo image
conf.logo_wallet = conf.host+"/img/logo-300-dim.png"; // set wallet background
conf.logo_icon = conf.host+"/img/favicon.png"; // set icon image

const BufferLayout = require("@solana/buffer-layout");
const BN = require("bn.js");
const splToken = require("@solana/spl-token");
const Metadata_ = require("@metaplex-foundation/mpl-token-metadata");
const Metadata = Metadata_.Metadata;
const publicKey = (property = "publicKey") => {return BufferLayout.blob(32, property);}
const uint64 = (property = "uint64") => {return BufferLayout.blob(8, property);}
const SWAP_STATE = BufferLayout.struct([
  BufferLayout.u8("is_initialized"),
  publicKey("initializer"),
  publicKey("asset_id"),
  publicKey("merkle_tree"),
  publicKey("root"),
  publicKey("data_hash"),
  publicKey("creator_hash"),
  uint64("nonce"),
  publicKey("swap_asset_id"),
  publicKey("swap_merkle_tree"),
  publicKey("swap_root"),
  publicKey("swap_data_hash"),
  publicKey("swap_creator_hash"),
  uint64("swap_nonce"),
  publicKey("swap_leaf_owner"),
  uint64("swap_lamports"),
  publicKey("swap_token_mint"),
  uint64("swap_tokens"),
  uint64("swap_usdc"),
]);

let social_1 = new Image();
let social_2 = new Image();
let social_3 = new Image();
social_1.src = "/img/discord.png";
social_2.src = "/img/twitter.png";
social_3.src = "/img/sol-black.png";
social_1.id = "social_discord";
social_2.id = "social_twitter";

let initializedSwapIx = false;
let createTempTokenAccountIx = false;
let createTempUSDCAccountIx = false;
let initTempTokenAccountIx = false;
let lookupTableAccount = false;
let lookupTableAccountSaved = false;
let tempFeeAccountSaved = false;
let swap_createATA = false;
let createTokenATAIx = false;
let createUSDCATAIx = false;
let changeUSDCAuthorityIx = false;
let changeTokenAuthorityIx = false;
let lookupTableAddress = false;
let swapTokens = false;
let swapUSDC = false;
let transferTokenIx = false;
let initTempUSDCAccountIx = false;
let transferUSDCIx = false;
let swapcNFTsIx = false;
let createALTIx = false;
let tempFeeAccount = false;
let tempTokenAccount = false;
let tempUSDCAccount = false;
let swapInitializer = false;
let initializerUSDCATA = false;
let initializerTokenATA = false;
let providerTokenATA = false;
let swapTreeAuthorityPDA = false;
let usdcMint = false;
let swapTokenMint = false;
let swapLamports = false;
let extendALTIx = false;
var provider;

// returns matching combos for provided attributes
async function get_combos(attributes) {
  let matches = [];
  for (let i = 0; i < combos_.length; i++) {
    let counter = 0;
    let combo = combos_[i];
    let traits = combo.traits;
    let items = [];
    
    for (let a = 0; a < attributes.length; a++) {
      let attribute = attributes[a];
      let item = {};
      item[attribute.trait_type] = attribute.value;
      items.push(item);
    }
    for (let t = 0; t < traits.length; t++) {
      let trait = traits[t];
      let trait_key = Object.keys(trait);
      trait_key = trait_key[0];
      let trait_val = trait[trait_key];
      for (let d = 0; d < items.length; d++) {
        let key = Object.keys(items[d]);
        key = key[0];
        let val = items[d];
        let result = Array.isArray(trait_val);
        if (result === false && trait_key == key && val[trait_key] == trait_val) {
          counter = counter + 1;
        } else if (result === true && trait_key == key) {
          for (let tv = 0; tv < trait_val.length; tv++) {
            let tval = trait_val[tv]
            if (tval == val[trait_key]) {
              counter = counter + 1;
            }
          }
        }
      }
    }
    if (counter == traits.length) {
      matches.push(combo.name);
    }
  }
  return matches;
}

// copies a string to clipboard
async function copy(save_string) {
  var textArea = document.createElement('textarea');
  textArea.setAttribute('style', 'width:1px;border:0;opacity:0;');
  textArea.setAttribute('id', 'temp_copy');
  document.body.appendChild(textArea);
  textArea.value = save_string;
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  return "success";
}

// returns the proofs required for a mint
async function required_proofs(id){
  if (id.length < 32) {return;}
  let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
  let axiosInstance = axios.create({baseURL: conf.cluster});
  let response = await axiosInstance.post(conf.cluster, {
    jsonrpc: "2.0",
    method: "getAssetProof",
    id: "rpd-op-123",
    params: {id: id},
  });
  let ck_treeId = response.data.result.tree_id;
  let ck_Proof = response.data.result.proof;
  let ck_Root = response.data.result.root;
  let ck_treeIdPubKey = new solanaWeb3.PublicKey(ck_treeId);
  let treeAccount = await splAccountComp.ConcurrentMerkleTreeAccount.fromAccountAddress(connection, ck_treeIdPubKey, );
  let treeAuthority = treeAccount.getAuthority();
  return (response.data.result.proof.length-treeAccount.getCanopyDepth());

//   let owner = response.data.result.ownership.owner;
//   if (owner == $("#create_a_owner").val()) {
//     $("#mc_swap_create .mc_title").html("New Proposal");
//     alert("Same Owner!");
//     $("#create_b_id").prop("disabled", false).val("");
//     return;
//   }
//   $("#create_b_owner").val(owner);
//   $("img.swap_img_b").attr("src", response.data.result.content.links.image);
//   $("#mc_swap_create .mc_title").html("New Proposal");
//   $("#create_b_id, #sol_request, #pikl_request, #usdc_request, #swap_create").prop("disabled", false);
//   $("#sol_request").focus();  
 
}

// wallet providers
const wallet_provider = () => {
  const isBackpackInstalled = window.backpack && window.backpack.isBackpack;
  const isSolflareInstalled = window.solflare && window.solflare.isSolflare;
  const isPhantomInstalled = window.solana && window.solana.isPhantom;
  if (isBackpackInstalled && conf.provider == "backpack") {
    return window.backpack;
  }
  else if (isSolflareInstalled && conf.provider == "solflare") {
    return window.solflare;
  } 
  else if (isPhantomInstalled && conf.provider == "phantom") {
    return window.solana;
  }
}

// master connect
async function master_connect() {
  $("#wallet_connect").prop("disabled", true);
  $(".sol_balance").html("Connecting...");
  provider = await wallet_provider();
  if (typeof provider == "undefined") {
    /////////////////////////////////////////////////
    // automatic deep link
    /////////////////////////////////////////////////
    var link;
    if (conf.provider == "solflare") {
      let app_link = "https://solflare.com/ul/v1/browse/" + encodeURIComponent("https://" + window.location.hostname+window.location.pathname+"#connect-solflare") + "?ref=" + encodeURIComponent("https://"+window.location.hostname);
      $("#wallet_connect").prop("disabled", false);
      $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
      link = document.getElementById('gogo_deep');
      link.click();
      $("a#gogo_deep").remove();
      $("#chooser_cancel").click();
      $(".sol_balance").html("Connect");
    } else if (conf.provider == "phantom") {
      let app_link = "https://phantom.app/ul/browse/" + encodeURIComponent("https://" + window.location.hostname+window.location.pathname+"#connect-phantom") + "?ref=" + encodeURIComponent("https://"+window.location.hostname);
      $("#wallet_connect").prop("disabled", false);
      $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
      link = document.getElementById('gogo_deep');
      link.click();
      $("a#gogo_deep").remove();
      $("#chooser_cancel").click();
      $(".sol_balance").html("Connect");
    }
    else{
      $(".sol_balance").html("Connect");
      return;
    }
    /////////////////////////////////////////////////
  } 
  else {
    if (provider.isConnected === false) {
      $("#cover, #wallet_chooser").fadeOut(400);
      await provider.connect()
        .then(function() {
          if (provider.isConnected !== true) {
            $(".sol_balance").addClass("connect_me").html("Connect");
            $("#wallet_connect").prop("disabled", false);
            $("#wallet_disconnect").hide().css({"display": "none"});
          } else {
            $("#wallet_connect").prop("disabled", false).hide();
            $("#wallet_disconnect").show().css({
              "display": "block"
            });
            $("#wallet_cnfts").prop("disabled", false).click();
            $("#nav_compose, #nav_view").prop("disabled", false);
          }
          swap_viewer();
        })
        .catch(function(err) {
          $(".sol_balance").addClass("connect_me").html("Connect");
          $("#wallet_connect").prop("disabled", false);
          $("#wallet_disconnect").hide().css({
            "display": "none"
          });
          swap_viewer();
        });
    } 
    else if (provider.isConnected === true) {
      $("#wallet_connect").prop("disabled", false).hide();
      $("#wallet_disconnect").show().css({
        "display": "block"
      });
      $("#wallet_cnfts").prop("disabled", false).click();
      $("#nav_compose, #nav_view").prop("disabled", false);
      swap_viewer();
    }
  }
}

// alt connect button on ui
$(document).delegate(".sol_balance", "click", async function() {
  if ($(this).html() == "Connect") {
    $("#wallet_connect").click();
  }
});

// master disconnect
$(document).delegate("#wallet_disconnect", "click", async function() {
  provider = wallet_provider();
  provider.disconnect();
  conf.provider = false;
  $("#mcprofile_nav ul li").first().find("button").click();
  $(".asset").remove();
  $("#wallet_connect").show();
  $("#wallet_disconnect").hide().css({
    "display": "none"
  });
  $("#wallet_nfts, #wallet_cnfts").prop("disabled", true).removeClass("active_view");
  $("#wallet_nfts span, #wallet_cnfts span").html("(0)");
  $(".sol_balance").addClass("connect_me").html("Connect");
  setTimeout(() => {
    $(".pikl_balance, .usdc_balance").html("");
  },1000);
});

// wallet choice
$(document).delegate("#chooser_backpack, #chooser_solflare, #chooser_phantom", "click", async function() {
  conf.provider = $(this).attr("id").replace("chooser_", "");
  
  let link;
  
  if (conf.tool == "mcwallet") {
    master_connect();
    setTimeout(() => {
      mcswap_balances();
    }, 1000);
  } 
  else if (conf.tool == "donate_sol") {
    provider = await wallet_provider();
    if (typeof provider == "undefined") {
      /////////////////////////////////////////////////
      if (conf.provider == "solflare") {
        let app_link = "https://solflare.com/ul/v1/browse/" + encodeURIComponent("https://" + window.location.hostname+window.location.pathname+"#connect-solflare")+ "?ref=" + encodeURIComponent("https://"+window.location.hostname);
        $("#wallet_connect").prop("disabled", false);
        $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
        link = document.getElementById('gogo_deep');
        link.click();
        $("a#gogo_deep").remove();
        $("#chooser_cancel").click();
      } else if (conf.provider == "phantom") {
        let app_link = "https://phantom.app/ul/browse/" + encodeURIComponent("https://" + window.location.hostname+window.location.pathname+"#connect-phantom") + "?ref=" + encodeURIComponent("https://"+window.location.hostname);
        $("#wallet_connect").prop("disabled", false);
        $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
        link = document.getElementById('gogo_deep');
        link.click();
        $("a#gogo_deep").remove();
        $("#chooser_cancel").click();
      }
      /////////////////////////////////////////////////
    } else {
      $("#cover_message").html("Requesting Connection...");
      await provider.connect()
        .then(function() {
          if (provider.isConnected === true) {
            $("#wallet_connect").hide();
            $("#wallet_disconnect").show().css({
              "display": "block"
            });
            $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
            $("#wallet_chooser").hide();
            $("#cover_message").html("");
            $("#donation_box").show().addClass("animate__animated animate__zoomInDown");
            $("#donation_amount").focus();
            $("#wallet_cnfts").click();
            conf.tool = "mcwallet";
          }
        })
        .catch(function(err) {
          $("#cover_message").html("");
          //       console.log(err.message);
          conf.tool = "mcwallet";
        });
    }
  } 
  else if (conf.tool == "pubkey") {
    provider = await wallet_provider();
    if (typeof provider == "undefined") {
      /////////////////////////////////////////////////
      if (conf.provider == "solflare") {
        let app_link = "https://solflare.com/ul/v1/browse/" + encodeURIComponent("https://" + window.location.hostname+window.location.pathname+"#connect-solflare")+ "?ref=" + encodeURIComponent("https://"+window.location.hostname);
        $("#wallet_connect").prop("disabled", false);
        $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
        link = document.getElementById('gogo_deep');
        link.click();
        $("a#gogo_deep").remove();
        $("#chooser_cancel").click();
      } else if (conf.provider == "phantom") {
        let app_link = "https://phantom.app/ul/browse/" + encodeURIComponent("https://" + window.location.hostname+window.location.pathname+"#connect-phantom") + "?ref=" + encodeURIComponent("https://"+window.location.hostname);
        $("#wallet_connect").prop("disabled", false);
        $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
        link = document.getElementById('gogo_deep');
        link.click();
        $("a#gogo_deep").remove();
        $("#chooser_cancel").click();
      }
      /////////////////////////////////////////////////
    } else {
      $("#my_mcdegens").addClass("disabled").html("<li>Requesting Connection...</li>");
      await provider.connect()
      .then(function() {
        if (provider.isConnected === true) {
          $("#cover, #wallet_connect").fadeOut(400);
          $("#wallet_disconnect").show().css({
            "display": "block"
          });
          $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
          $("#wallet_chooser").hide();
          $("#cover_message").html("");
          $("#my_mcdegens").removeClass("disabled").html("<li>Check Combos</li>");
          $("#my_mcdegens").click();
          conf.tool = "mcwallet";
        } else {
          $("#my_mcdegens").removeClass("disabled").html("<li>Check Combos</li>");
          conf.tool = "mcwallet";
        }
})
      .catch(function(err) {
        $("#my_mcdegens").removeClass("disabled").html("<li>Check Combos</li>");
        $("#cover_message").html("");
});
    }
  }
  
});

// cancel wallet chooser
$(document).delegate("#chooser_cancel", "click", async function() {
  $("#my_mcdegens").removeClass("disabled").html("<li>Check Combos</li>");
  $("#cover, #wallet_chooser").fadeOut(500);
  $("#wallet_connect").prop("disabled", false);
  conf.tool = "mcwallet";
});

// close donation
$(document).delegate("#donation_close", "click", async function() {
  $("#donation_box").removeClass().addClass("animate__animated animate__zoomOut");
  setTimeout(function() {
    $("#donation_box").hide().removeClass();
    $("#cover").fadeOut(400);
  }, 500);
});

// wallet refresh
$(document).delegate("#wallet_refresh", "click", async function() {
  let active_view = $(".active_view").attr("id");
  if (active_view == "wallet_nfts") {
    $("#view_nfts").html("");
  } else if (active_view == "wallet_cnfts") {
    $("#view_cnfts").html("");
  }
  $(".active_view").click();
});

// open ui
$(document).delegate(".mcprofile_open", "click", async function() {
  $(this).removeClass().addClass("mcprofile_close");
  $("#container").hide();
  $("#mcprofile").fadeIn(400);
  $("#scroll_wrapper").removeClass("body_default").addClass("body_mcprofile");
  $("#scroll_wrapper").getNiceScroll().resize();
  $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
});

// landing page logo click
$(document).delegate("#center_logo", "click", async function() {
  $(".mcprofile_open").click();
});

// close ui
$(document).delegate(".mcprofile_close", "click", async function() {
  $(this).removeClass().addClass("mcprofile_open");
  $("#mcprofile").hide();
  $("#container").fadeIn(400);
  $("#scroll_wrapper").removeClass("body_mcprofile").addClass("body_default");
  $("#scroll_wrapper").getNiceScroll().resize();
  $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
});

// format a number with commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// gets balances for display
async function mcswap_balances() {
  provider = wallet_provider();
  if (typeof provider == "undefined") {} else if (provider.isConnected != true) {} else if (provider.isConnected == true) {
    
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let balance_sol = await connection.getBalance(provider.publicKey)
      .then(function(data) {
        let res = parseFloat(data).toFixed(9);
        let balance = data / conf.billion;
        balance = parseFloat(balance).toFixed(9);
        let ui_split = balance.split(".");
        let formatted = numberWithCommas(ui_split[0]);
        formatted = formatted + "." + ui_split[1];
        $(".sol_balance").removeClass("connect_me").html(formatted);
      });
    
    let accountPublicKey;
    let mintAccount;
    let resp;
    
    // get spl token balance
    accountPublicKey = new solanaWeb3.PublicKey(provider.publicKey.toString());
    mintAccount = new solanaWeb3.PublicKey(conf.pikl);
    resp = await connection.getTokenAccountsByOwner(accountPublicKey, {mint: mintAccount});
    if (resp.value.length === 0) {
      $(".pikl_balance").html("0.000000000");
    } 
    else {
      let token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
      let resps = await connection.getTokenAccountBalance(token_acct);
      let amount = resps.value.amount;
      amount = amount / conf.billion;
      amount = parseFloat(amount).toFixed(conf.pikl_decimals);
      let ui_split = amount.split(".");
      let formatted = numberWithCommas(ui_split[0]);
      formatted = formatted + "." + ui_split[1];
      $(".pikl_balance").html(formatted);
    }
    
    // get usdc token balance
    accountPublicKey = new solanaWeb3.PublicKey(provider.publicKey.toString());
    mintAccount = new solanaWeb3.PublicKey(conf.usdc);
    resp = await connection.getTokenAccountsByOwner(accountPublicKey, {mint: mintAccount});
    if (resp.value.length === 0) {
      $(".usdc_balance").html("0.000000");
    } 
    else {
      let token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
      let resps = await connection.getTokenAccountBalance(token_acct);
      let amount = resps.value.amount;
      amount = amount / 1000000;
      amount = parseFloat(amount).toFixed(6);
      let ui_split = amount.split(".");
      let formatted = numberWithCommas(ui_split[0]);
      formatted = formatted + "." + ui_split[1];
      $(".usdc_balance").html(formatted);
    }
    
  }
}

// wallet
async function getMintPDA(mint) {
  let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
  let meta_program_id = new solanaWeb3.PublicKey(conf.METADATA_PROGRAM_ID);
  let meta_mint = new solanaWeb3.PublicKey(mint);
  let MetaPubkey = await solanaWeb3.PublicKey.findProgramAddress(
      [Buffer.from("metadata"), meta_program_id.toBytes(), meta_mint.toBytes()],
      meta_program_id
    )
    .catch(function(err) {
      ///console.log("error 3");
    });
  return MetaPubkey[0].toString();
}
$(document).delegate("#donate_nft", "click", async function() {
  if ($("#wallet_view").css("left") == "0px") {
    $("#wallet_view").click();
  } else {
    $("#wallet_close").click();
  }
});
$(document).delegate("#wallet_view", "click", async function() {
  $(this).stop().animate({
      left: "-=50"
    }, 400,
    function() {
      $(".loader").show();
      $("#wallet_box").removeClass().addClass("animate__animated animate__slideInLeft").show();
      setTimeout(() => {
        $(".loader").hide();
      }, 1200);
    });
});
$(document).delegate("#wallet_close", "click", async function() {
  $(".loader").hide();
  $("#wallet_box").removeClass().addClass("animate__animated animate__slideOutLeft");
  setTimeout(() => {
    $("#wallet_box").hide();
    $("#wallet_view").stop().animate({
      left: "0"
    }, 400);
  }, 1000);
});
$(document).delegate("#wallet_connect", "click", async function() {
  conf.tool = "mcwallet";
  $("#cover").fadeIn(400);
  $("#cover_message").html("");
  $("#wallet_chooser").removeClass().addClass("animate__animated animate__zoomIn").show();
});

// sol donation
async function send_donation() {
  //   $("#wallet_chooser").hide();
  let val = $("#donation_amount").val();
  if (val == 0 || val == "") {
    return;
  }
  let lamps = val * conf.billion;
  $("#cover").fadeIn(400);
  $("#cover_message").html("Requesting Approval...");
  $("#donation_box").hide();
  let provider = wallet_provider();
  if (provider == undefined) {
    alert("You need a Solflare or Phantom wallet for this.");
  } else {
    if (provider.isConnected == false) {
      await provider.connect()
        .then(function() {
          provider = wallet_provider();
        })
        .catch(function(err) {
          $("#donation_box").show();
          $("#cover_message").html("");
          //           console.log(err.message);
        });
    }
    if (provider.isConnected === true) {
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let from_b58 = provider.publicKey.toString();
      let to = new solanaWeb3.PublicKey(conf.sol);
      const transferTx = solanaWeb3.SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        lamports: lamps,
        toPubkey: to,
      });
      let tx = new solanaWeb3.Transaction();
      tx.add(transferTx);
      tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
      tx.feePayer = provider.publicKey;
      try {
        let signedTransaction = await provider.signTransaction(tx);
        const serializedTransaction = signedTransaction.serialize();
        const signature = await connection.sendRawTransaction(
          serializedTransaction, {
            skipPreflight: false,
            preflightCommitment: 'confirmed'
          },
        );
        $("#cover_message").html("Finalizing Transaction...");
        const intervalID = setInterval(async function() {
          let tx_status = await connection.getSignatureStatuses([signature], {
            searchTransactionHistory: true,
          });
          if (tx_status.value[0].confirmationStatus == undefined) {
            //             console.log("Bad Status...");
          } else if (tx_status.value[0].confirmationStatus == "finalized") {
            clearInterval(intervalID);
            //             console.log("Signature: ", signature);
            // console.log(`https://solscan.io/tx/${signature}`);
            $("#cover_message").html("");
            // <img id="thankyouborger" src="/img/borger.jpg" />
            $("#donation_box").after('<div id="donation_thanks">McDegens appreciates your donation degen! 🍔</div><div id="donation_sig"><a href="https://solscan.io/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
          }
        }, 3000);
      } catch (error) {
        $("#cover_message").html("");
        $("#donation_box").show();
          // console.log("Error: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          // console.log("Error Logs: ", error);
      }
    }
  }
}
// send donation
$(document).delegate("#send_donation", "click", send_donation);
// after thank you
$(document).delegate("#donation_continue", "click", async function(e) {
  $("#cover").fadeOut(400);
  $("#donation_thanks, #donation_sig, #donation_continue").remove();
});
// open donation
$(document).delegate("#donate_sol", "click", async function(e) {
  e.preventDefault();
  let donate_yes = confirm("Would you like to donate SOL to: "+conf.wallet_name+"?");
    if(donate_yes){
    conf.tool = "donate_sol";
    $("#cover").fadeIn(400);
    provider = wallet_provider();
    if (typeof provider == "undefined") {
      e.preventDefault();
      conf.tool = "donate_sol";
      $("#cover_message").html("");
      $("#wallet_chooser").removeClass().addClass("animate__animated animate__zoomIn").show();
    } else if (provider.isConnected != true) {
      $("#cover_message").html("");
      $("#wallet_chooser").removeClass().addClass("animate__animated animate__zoomIn").show();
    } else {
      $("#cover_message").html("");
      $("#donation_box").show().addClass("animate__animated animate__zoomInDown");
      $("#donation_amount").focus();
    }
  }
});

// nfts
$(document).delegate("#wallet_nfts", "click", async function() {
  $("#wallet_refresh").addClass("refresh_rotate").prop("disabled", true);
  $(".wallet_filter, .wallet_rarity").hide();
  let nfts = [];
  $(".loader").show();
  $("#wallet_nfts, #wallet_cnfts").removeClass("active_view");
  $(this).addClass("active_view");
  $("#view_cnfts").removeClass().addClass("wallet_views animate__animated animate__fadeOutRight");
  setTimeout(() => {
    $("#view_cnfts").hide();
    $("#view_nfts").removeClass().addClass("wallet_views animate__animated animate__fadeInLeft").show();
  }, 500);
  if ($("ul[data-type='nft']").length == 0) {
    provider = wallet_provider();
    if (typeof provider == "undefined" || provider.isConnected != true) {
      $(".loader").hide();
      return;
    }
    let wallet = provider.publicKey;
    let wallet_b58 = provider.publicKey.toString();
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let TokenAccounts = await connection.getParsedTokenAccountsByOwner(
    wallet, {
        programId: new solanaWeb3.PublicKey(splToken.TOKEN_PROGRAM_ID)
})
    .then(function(data) {
      let tokens = [];
      let other = [];
      let nfts_ = [];
      let tokens_ = [];
      let other_ = [];
      // separate tokens/nfts/forgets
      for (let i = 0; i < data.value.length; i++) {
        let token = data.value[i];
        let amount = token.account.data.parsed.info.tokenAmount.amount;
        let mint = token.account.data.parsed.info.mint;
        if (amount > 0) {
          let ui_amount = token.account.data.parsed.info.tokenAmount.uiAmountString;
          let decimals = token.account.data.parsed.info.tokenAmount.decimals;
          if (amount == 1 && decimals == 0) {
            nfts.push(data.value[i].account.data.parsed.info.mint);
          } else {
            tokens.push(data.value[i].account.data.parsed);
          }
        }
      }
      // get the additional metadata for each nft
      let assets = [];
      for (let i = 0; i < nfts.length; i++) {
        let pda = getMintPDA(nfts[i])
          .then(function(response) {
            let account = new solanaWeb3.PublicKey(response);
            let res = Metadata_.Metadata.fromAccountAddress(connection, account)
              .then(function(meta) {
                if (meta.data.name.includes("BobbleHeads") || typeof meta.collection != null && typeof meta.collection != undefined && typeof meta.collection.key != undefined) {
                  if (meta.data.name.includes("BobbleHeads") || meta.collection.verified === true) {
                    let asset = {};
                    asset.name = meta.data.name.replace(/\0/g, '');
                    asset.symbol = meta.data.symbol.replace(/\0/g, '');
                    asset.uri = meta.data.uri.replace(/\0/g, '');
                    asset.mint = meta.mint.toString();
                    asset.data = false;
                    const get_data = fetch(asset.uri)
                      .then((response) => response.json())
                      .then((nft_dat) => {
                        return nft_dat;
                      })
                      .catch(function(err) {
                        //                           console.log(err);
                      });
                    const fetch_data = async () => {
                      const b = await get_data;
                      asset.data = b;
                      let found = false;
                      for (var i = 0; i < assets.length; i++) {
                        if (assets[i].mint == asset.mint) {
                          found = true;
                          break;
                        }
                      }
                      if (found === false) {
                        assets.push(asset);
                      }
                    };
                    fetch_data();
                  }
                }
              })
              .catch(function(err) {});
          })
          .catch(function(err) {});
        if (i == (nfts.length - 1)) {
          /////////////////////////////////////////////////////////////
          setTimeout(function() {
            assets.sort(function(a, b) {
              if (a.data.name > b.data.name) return 1;
              if (a.data.name < b.data.name) return -1;
              return 0;
            });
            let items = "";
            for (let i = 0; i < assets.length; i++) {
              let ass = assets[i];
              if (ass.data.name.includes("BobbleHeads")) {
                ass.data.collection = {};
                ass.data.collection.name = "BobbleHeads";
              }
              if (!$("ul[data-id='" + ass.mint + "']").length) {
                let item = '<ul data-id="' + ass.mint + '" data-type="nft" class="asset">';
                item += '<li class="ass_name">' + ass.data.name + '</li>';
                if (typeof ass.data.collection === 'undefined') {
                  ass.data.collection = {};
                  ass.data.collection.name = "Unknown";
                }
                item += '<li class="ass_collection">' + ass.data.collection.name + '</li>';
                item += '<li class="ass_options"><button class="ass_meta">Meta</button><button disabled class="ass_donate">Donate</button><button data-wallet="' + provider.publicKey.toString() + '" data-mint="' + ass.mint + '" class="ass_sell">Sell</button></li>';
                item += '<li><img src="' + ass.data.image + '" class="ass_img" /></li>';
                item += '<li class="clear"></li>';
                item += '</ul>';
                items += item;
              }
            }
            $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
            $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
            $("#view_nfts").append(items);
            $("#view_nfts ul.asset").show();
            $(".loader").hide();
            $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
            // only allow txs to initialize after all images have loaded into the browser
            Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
              img.onload = img.onerror = resolve;
            }))).then(() => {
              $('ul[data-type="nft"] li.ass_options button.ass_donate').prop("disabled", false);
            });
          }, 3000);
          /////////////////////////////////////////////////////////////
        }
      }
      if (nfts.length == 0) {
        $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
        $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
        $(".loader").hide();
      }
})
    .catch(function(err) {
      $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
      $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
      $(".loader").hide();
    });
  } else {
    setTimeout(() => {
      $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
      $(".loader").hide();
    }, 500);
  }
});
$(document).delegate("#view_nfts button.ass_meta", "click", async function() {
  let mint = $(this).parent().parent().data("id");
  window.open(conf.nft_explorer + mint);
});
$(document).delegate("#view_nfts button.ass_donate", "click", async function() {
  $(".ass_donate").prop("disabled", true);
  let mint = $(this).parent().parent().data("id");
  $("#cover").fadeIn(400);
  $("#nft_donation_box").show().addClass("animate__animated animate__zoomInDown");
  let main = $("ul[data-id='" + mint + "']");
  let src = main.find(".ass_img").attr("src");
  let name = main.find(".ass_name").html();
  let collection = main.find(".ass_collection").html();
  $("#nft_donation_image").attr("src", src);
  $("#nft_donation_name").html(name);
  $("#nft_donation_collection").html(collection);
  $("#nft_donation_mint").val(mint);
});
$(document).delegate("#nft_donation_close", "click", async function() {
  $("#nft_donation_box").removeClass().addClass("animate__animated animate__zoomOut");
  setTimeout(function() {
    $("#nft_donation_box").hide().removeClass();
    $("#cover").fadeOut(400);
    $(".ass_donate").prop("disabled", false);
    $("#nft_donation_mint").val("");
    $("#cnft_send_donation").attr("id", "nft_send_donation");
  }, 600);
});
$(document).delegate(".ass_img", "click", async function() {
  $("#view_cover").fadeIn(400);
  let src = $(this).attr("src");
  $("#view_preview").attr("src", src).fadeIn(400).css({
    "display": "block"
  });
});
$(document).delegate("#view_preview", "click", async function() {
  $(this).fadeOut(400);
  $("#view_cover").fadeOut(400);
});
$(document).delegate("#nft_send_donation", "click", async function() {
  $(this).prop("disabled", true).val("Requesting Approval...");
  $("#cover").fadeIn(400);
  $("#cover_message").html("Requesting Approval...");
  $("#nft_donation_box").hide();
  provider = wallet_provider();
  if (typeof provider == "undefined") {
    alert("You need a Solflare or Phantom wallet for this.");
  } else {
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let from_wallet = provider.publicKey.toString();
    let to_wallet = conf.cnfts;
    if (solanaWeb3.PublicKey.isOnCurve(to_wallet) == true && from_wallet != to_wallet) {
      let senderAccountPubkey = new solanaWeb3.PublicKey(from_wallet);
      let recipientAccountPubkey = new solanaWeb3.PublicKey(to_wallet);
      let mintPubkey = new solanaWeb3.PublicKey($("#nft_donation_mint").val());
      // get account
      let tokenAccountPubkey = await splToken.getAssociatedTokenAddress(
        mintPubkey,
        senderAccountPubkey,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      // get ata
      let associatedTokenAccountPubkey = await splToken.getAssociatedTokenAddress(
        mintPubkey,
        recipientAccountPubkey,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      // create ata if needed
      let createATA = false;
      await splToken.getAccount(connection, associatedTokenAccountPubkey, 'confirmed', splToken.TOKEN_PROGRAM_ID)
        .then(function(response) {
          createATA = false;
        })
        .catch(function(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          if (error.name === "TokenAccountNotFoundError") {
            createATA = true
          } else {
            return
          }
        });
      // instructions
      let transferTx = new splToken.createTransferInstruction(
        tokenAccountPubkey,
        associatedTokenAccountPubkey,
        senderAccountPubkey,
        1,
        undefined,
        splToken.TOKEN_PROGRAM_ID
      );
      // create transaction
      let tx = new solanaWeb3.Transaction();
      if (createATA === true) {
        let createATATx = new splToken.createAssociatedTokenAccountInstruction(
          senderAccountPubkey,
          associatedTokenAccountPubkey,
          recipientAccountPubkey,
          mintPubkey,
          splToken.TOKEN_PROGRAM_ID,
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID
        );
        tx.add(createATATx, transferTx);
      } else {
        tx.add(transferTx);
      }
      tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
      tx.feePayer = senderAccountPubkey;
      try {
        let signedTransaction = await provider.signTransaction(tx);
        let serializedTransaction = signedTransaction.serialize();
        let signature = await connection.sendRawTransaction(
          serializedTransaction, {
            skipPreflight: false,
            preflightCommitment: 'confirmed'
          }, );
        $("#cover_message").html("Finalizing Transaction...");
        const intervalID = setInterval(async function() {
          let tx_status = await connection.getSignatureStatuses([signature], {
            searchTransactionHistory: true,
          });
          if (tx_status.value[0].confirmationStatus == undefined) {} else if (tx_status.value[0].confirmationStatus == "finalized") {
            clearInterval(intervalID);
            //             console.log("Signature: ", signature);
            // console.log(`https://solscan.io/tx/${signature}`);
            $("#cover_message").html("");
            $("#nft_donation_box").after('<div id="nft_donation_thanks">McDegens appreciates your donation degen! 🍔</div><div id="nft_donation_sig"><a href="https://solscan.io/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="nft_donation_continue">Continue</button>');
            //             localStorage.setItem("nfts",JSON.stringify([]));          
            $(".asset").remove();
            $("#wallet_nfts").click();
          }
        }, 3000);
      } 
      catch (error) {
        $("#nft_send_donation").prop("disabled", false);
        $("#cover_message").html("");
        $("#nft_donation_box").show();
          // console.log("Error: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          // console.log("Error Logs: ", error);
      }
    }
  }
});
$(document).delegate("#nft_donation_continue", "click", async function() {
  $("#cover").fadeOut(400);
  $("#nft_donation_thanks, #nft_donation_sig, #nft_donation_continue").remove();
  $("#nft_send_donation").prop("disabled", false).val("Donate NFT");
});
$(document).delegate("#view_nfts button.ass_sell", "click", async function() {
  window.open("https://app.stache.io/home/assetsdetails?walletAddress=" + $(this).data("wallet") + "&collectibleMint=" + $(this).data("mint") + "&screenType=STASHING");
});

// cnfts
$(document).delegate("#wallet_cnfts", "click", async function() {
  $("#wallet_refresh").addClass("refresh_rotate").prop("disabled", true);
  $(".wallet_filter, .wallet_rarity").show();
  $(".loader").show();
  $("#wallet_nfts, #wallet_cnfts").removeClass("active_view");
  $(this).addClass("active_view");
  $("#view_nfts").removeClass().addClass("wallet_views animate__animated animate__fadeOutLeft");
  setTimeout(() => {
    $("#view_nfts").hide();
    $("#view_cnfts").removeClass().addClass("wallet_views animate__animated animate__fadeInRight").show();
  }, 500);
  if ($("ul[data-type='cnft']").length == 0) {
    let has_filter = $("#wallet_filters .wallet_filter").html();
    let rarity_tags = $("#wallet_filters .wallet_rarity");
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    provider = wallet_provider();
    // get all the nfts in the wallet
    const axiosInstance = axios.create({
      baseURL: conf.cluster,
    });
    let assets = await axiosInstance.post(conf.cluster, {
      jsonrpc: "2.0",
      method: "getAssetsByOwner",
      id: "rpd-op-123",
      params: {
        ownerAddress: provider.publicKey.toString(),
        page: 1,
        limit: 700
      },
    });
    assets = assets.data.result;
    // filter for cnfts and built cnfts data array
    let cnfts = [];
    let is_faceless = false;
    for (let i = 0; i < assets.items.length; i++) {
      let ass = assets.items[i];
      if (ass.compression.compressed === true) {
        if (
          typeof ass.content !== undefined &&
          typeof ass.content.files !== undefined &&
          typeof ass.content.files[0] !== undefined &&
          ass.hasOwnProperty('content') &&
          ass.content.hasOwnProperty('files') &&
          typeof ass.content.files[0] == "object" &&
          ass.content.files[0].hasOwnProperty('uri')
        ) {
          let rebuild = {};
          rebuild.mint = ass.id;
          rebuild.image = ass.content.files[0].uri;
          rebuild.name = ass.content.metadata.name;
          rebuild.attributes = ass.content.metadata.attributes;
          rebuild.collection = "Unknown";
          rebuild.publisher = "Unknown";
          rebuild.combos = [];
          rebuild.collection_key = ass.grouping[0].group_value;
          let group_detail = await group_details(ass.grouping[0].group_value,ass.content.metadata.name);
          rebuild.sort = group_detail.sort;
          rebuild.collection = group_detail.collection;
          rebuild.publisher = group_detail.publisher;
          cnfts.push(rebuild);
        }
      }
    }
    
    // sort by collection
    let cnft_final = [];
    let cnft_groups = [];
    for (let i = 0; i < cnfts.length; i++) {
      let _i = i - 1;
      if(typeof cnfts[_i] == "undefined" || cnfts[_i].collection != cnfts[i].collection){
        cnft_groups[cnfts[i].collection] = [];
      }
      cnft_groups[cnfts[i].collection].push(cnfts[i]);
    }
    
    // group by collection, sort sub arrays, and rebuild cnfts array
    let grouped = Object.keys(cnft_groups).sort().reduce( (obj, key) => { obj[key] = cnft_groups[key]; return obj;}, {} );
    for (const [key, values] of Object.entries(grouped)) {
      values.sort(function(a, b) {
        if (a.sort > b.sort) return 1;
        if (a.sort < b.sort) return -1;
        return 0;
      });
      cnft_final.push.apply(cnft_final,values);
    }
    cnfts = cnft_final;
    
    // get the combos
    for (let i = 0; i < cnfts.length; i++) {
        if(typeof cnfts[i].attributes != "undefined"){
          let tags = await get_combos(cnfts[i].attributes);
          if (tags.length > 0) {
            cnfts[i].combos = tags;
          }
        }
    }
    
    // display cnfts
    for (let i = 0; i < cnfts.length; i++) {
      let ass = cnfts[i];
      let attributes = ass.attributes;
      let rarity = "";
      let rarit = "";
      let rar = "";

      if (typeof attributes != "undefined") {
        for (let r = 0; r < attributes.length; r++) {
          let attr = attributes[r];
          if (attr.trait_type == "Rarity") {
            rarity = attr.value;
            rarit = rarity.charAt(0);
            if (rarit == "L") {
              rar = " legendary";
            } else if (rarit == "R") {
              rar = " rare";
            } else if (rarit == "C") {
              rar = " common";
            }
          }
        }
      }

      if (!$("ul[data-id='" + ass.mint + "']").length) {
        let item = '<ul data-id="' + ass.mint + '" data-type="cnft" class="asset">';
        item += '<li title="' + rarity + '" class="ass_rarity' + rar + '">' + rarit + '</li>';
        item += '<li class="ass_name">' + ass.name + '</li>';
        if (typeof ass.collection === 'undefined') {
          ass.collection = "Unknown";
        }
        item += '<li class="ass_collection">' + ass.collection + '</li>';
        item += '<li class="ass_options"><button class="ass_meta">Meta</button><button disabled class="ass_donate">Donate</button><button data-wallet="' + provider.publicKey.toString() + '" data-mint="' + ass.mint + '" class="ass_sell">Sell</button><button disabled class="ass_swap">Swap</button></li>';
        item += '<li><img src="' + ass.image + '" class="ass_img" /></li>';
        item += '<li class="clear"></li>';
        let tags = "";
        for (let t = 0; t < ass.combos.length; t++) {
          tags += '<button data-id="' + ass.combos[t] + '">' + ass.combos[t] + '</button>';
        }
        item += '<li class="ass_tags">' + tags + '</li>';
        item += '</ul>';
        $("#view_cnfts").append(item);
      }

    }
    
    // if loading proposal from remote link
    if($("ul[data-id='"+$("#create_a_id").val()+"']").length){
      $("ul[data-id='"+$("#create_a_id").val()+"']").find("button.ass_swap").prop("disabled",false).click();
    }
    else{
      $("#create_a_id").val("");
    }
    
    // applying filter or not
    if (typeof has_filter !== 'undefined' && typeof has_filter !== undefined && typeof has_filter !== null) {
      $(".ass_tags button").each(function() {
        if ($(this).html() == has_filter) {
          $(this).click();
          setTimeout(() => {
            $(".loader").hide();
            $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
          }, 500);
          // only allow txs to initialize after all images have loaded into the browser
          setTimeout(() => {
            $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
            Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
              img.onload = img.onerror = resolve;
            }))).then(() => {
              $('ul[data-type="cnft"] li.ass_options button.ass_donate').prop("disabled", false);
              $('ul[data-type="cnft"] li.ass_options button.ass_swap').prop("disabled", false);
            });
          }, 5000);
          return false;
        }
      });
    } else if (rarity_tags.length) {
      let rarity = rarity_tags.attr("class");
      rarity = rarity.replace("wallet_rarity ", "ass_rarity ");
      $(".ass_rarity").each(function() {
        let clas = $(this).attr("class");
        if (clas == rarity) {
          $(this).parent().show();
        }
      });
      setTimeout(() => {
        $(".loader").hide();
        $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
        $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
      }, 500);
      // only allow txs to initialize after all images have loaded into the browser
      setTimeout(() => {
        $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
        Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
          img.onload = img.onerror = resolve;
        }))).then(() => {
          $('ul[data-type="cnft"] li.ass_options button.ass_donate').prop("disabled", false);
          $('ul[data-type="cnft"] li.ass_options button.ass_swap').prop("disabled", false);
        });
      }, 5000);
      return false;
    } 
    else {
      setTimeout(() => {
        $("#view_cnfts ul.asset").show();
        $(".loader").hide();
        $("#wallet_cnfts span.count").html('(' + cnfts.length + ')');
        $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
        $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
      }, 500);
      // only allow txs to initialize after all images have loaded into the browser
      setTimeout(() => {

        Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
          img.onload = img.onerror = resolve;
        }))).then(() => {
          $('ul[data-type="cnft"] li.ass_options button.ass_donate').prop("disabled", false);
          $('ul[data-type="cnft"] li.ass_options button.ass_swap').prop("disabled", false);
        });
      }, 5000);
    }
    
  } else {
    setTimeout(() => {
      $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
      $(".loader").hide();
    }, 500);
  }
});
$(document).delegate("#view_cnfts button.ass_meta", "click", async function() {
  let mint = $(this).parent().parent().data("id");
  window.open(conf.cnft_explorer + mint);
});
$(document).delegate("#view_cnfts button.ass_sell", "click", async function() {
  window.open("https://app.stache.io/home/assetsdetails?walletAddress=" + $(this).data("wallet") + "&collectibleMint=" + $(this).data("mint") + "&screenType=STASHING");
});
$(document).delegate("#view_cnfts button.ass_donate", "click", async function() {
  $(".ass_donate").prop("disabled", true);
  $("#nft_send_donation").attr("id", "cnft_send_donation");
  let mint = $(this).parent().parent().data("id");
  $("#cover").fadeIn(400);
  $("#nft_donation_box").show().addClass("animate__animated animate__zoomInDown");
  let main = $("ul[data-id='" + mint + "']");
  let src = main.find(".ass_img").attr("src");
  let name = main.find(".ass_name").html();
  let collection = main.find(".ass_collection").html();
  $("#nft_donation_image").attr("src", src);
  $("#nft_donation_name").html(name);
  $("#nft_donation_collection").html(collection);
  $("#nft_donation_mint").val(mint);
});
$(document).delegate("#view_cnfts button.ass_swap", "click", async function() {
  $("#create_b_id, #sol_request, #pikl_request, #usdc_request, #swap_create").prop("disabled", true);
  provider = wallet_provider();
  if (provider.publicKey.toString() == $("#create_b_owner").val()) {
    alert("Same Owner!");
    return;
  }
  $("#mc_swap_create .mc_title").html("Fetching Asset...");
  let item = $(this).parent().parent();
  let item_id = item.data("id");
  let img_src = item.find("img.ass_img").attr("src");
  $("#create_a_id").val(item_id);
  $("#mc_swap_create img.swap_img_a").attr("src", img_src);
  $("#create_a_owner").val(provider.publicKey.toString());
  $("#create_b_id").prop("disabled", false).removeClass("id_disabled").focus();
  $("#fetch_b").prop("disabled", false);
  $("#nav_compose").click();
  $(".swap_a ").removeClass("active_swap");
  $(".swap_b").addClass("active_swap");
  if($("#scroll_wrapper").width() < 1841){
    $("#wallet_close").click();
  }
  if($(".mcprofile_open").length){
    $(".mcprofile_open").click();
  }
  let proofs_required = await required_proofs(item_id);
  $("#proofs_a").html(proofs_required+" x Proofs").show();
  max_proofs();
});
$(document).delegate("ul.asset li.ass_tags button", "click", async function() {
  const item = $(this);
  let set_tag = item.html();
  $(".wallet_filter").remove();
  $("#wallet_filters").prepend('<span class="wallet_filter">' + set_tag + '</span>');
  let all = $("ul[data-type='cnft']");
  all.hide();
  all.each(function() {
    let id = $(this).data("id");
    $(this).find(".ass_tags button").each(function() {
      if ($(this).html() == set_tag) {
        $("ul[data-id='" + id + "']").show();
      }
    });
  });
  if ($(".wallet_rarity").length) {
    let this_rare = $(".wallet_rarity").html();
    $("ul[data-type='cnft']:visible").each(function() {
      if ($(this).find(".ass_rarity").html() == this_rare) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
  $("#wallet_cnfts span.count").html("(" + $('ul[data-type="cnft"]:visible').length + ")");
});
$(document).delegate("ul.asset li.ass_rarity", "click", async function() {
  $(".wallet_rarity").remove();
  let rarity = $(this).attr("title");
  let id = $(this).parent().data("id");
  $("ul[data-type='cnft']").each(function() {
    let letter = $(this).find(".ass_rarity").attr("title");
    if (rarity != letter) {
      $(this).hide();
    }
  });
  let rar = " " + rarity.toLowerCase();
  $("#wallet_filters").append('<span class="wallet_rarity' + rar + '">' + rarity.charAt(0) + '</span>');
  $("#wallet_cnfts span.count").html("(" + $('ul[data-type="cnft"]:visible').length + ")");
});
$(document).delegate(".wallet_filter", "click", async function() {
  $(".wallet_filter").remove();
  let all = $("ul[data-type='cnft']").show();
  if ($(".wallet_rarity").length) {
    let clas = $(".wallet_rarity").attr("class");
    clas = clas.replace("wallet_rarity ", "");
    $("#view_cnfts li." + clas + ":first-of-type").click();
  }
  let showing = $("ul[data-type='cnft']:visible").length;
  $("#wallet_cnfts span").html("(" + showing + ")");
});
$(document).delegate(".wallet_rarity", "click", async function() {
  $(".wallet_rarity").remove();
  $("ul[data-type='cnft']").show();
  if ($(".wallet_filter").length) {
    let wf = $(".wallet_filter").html().trim();
    $("#view_cnfts .ass_tags button").each(function() {
      let val = $(this).data("id");
      if (wf == val) {
        $(this).click();
        return false;
      }
    });
  } else {
    let showing = $("ul[data-type='cnft']:visible").length;
    $("#wallet_cnfts span").html("(" + showing + ")");
  }
});
$(document).delegate("#cnft_send_donation", "click", async function() {
  $(this).prop("disabled", true).val("Requesting Approval...");
  $("#cover").fadeIn(400);
  $("#cover_message").html("Preparing Transaction...");
  $("#nft_donation_box").hide();
  provider = wallet_provider();
  if (typeof provider == "undefined") {
    alert("You need a Solflare or Phantom wallet for this.");
  } else {
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let from_wallet = provider.publicKey.toString();
    let to_wallet = conf.cnfts;
    if (solanaWeb3.PublicKey.isOnCurve(to_wallet) == true && from_wallet != to_wallet) {
      let senderAccountPubkey = new solanaWeb3.PublicKey(from_wallet);
      let recipientAccountPubkey = new solanaWeb3.PublicKey(to_wallet);
      let assetId = $("#nft_donation_mint").val();
      let mintPubkey = new solanaWeb3.PublicKey(assetId);
      let assetCompressionDatahash = null;
      let assetCompressionCreatorhash = null;
      let assetCompressionLeafId = null;
      try {
        let response = null;
        const axiosInstance = axios.create({
          baseURL: conf.cluster
        });
        response = await axiosInstance.post(conf.cluster, {
          jsonrpc: "2.0",
          method: "getAsset",
          id: "rpd-op-123",
          params: {
            id: assetId
          },
        });
        assetCompressionDatahash = response.data.result.compression.data_hash;
        assetCompressionCreatorhash = response.data.result.compression.creator_hash;
        assetCompressionLeafId = response.data.result.compression.leaf_id;
        // console.log("getAsset response.data.result", response.data.result);
        // console.log("assetCompressionDatahash ", assetCompressionDatahash);
        // console.log("assetCompressionCreatorhash ", assetCompressionCreatorhash);
        // console.log("assetCompressionLeafId ", assetCompressionLeafId);
        let treeId = null;
        let assetProof = null;
        let assetRoot = null;
        response = await axiosInstance.post(conf.cluster, {
          jsonrpc: "2.0",
          method: "getAssetProof",
          id: "rpd-op-123",
          params: {
            id: assetId
          },
        });
        treeId = response.data.result.tree_id;
        assetProof = response.data.result.proof;
        assetRoot = response.data.result.root;
        // console.log("getAssetProof response.data.result", response.data.result);
        // console.log("treeId ", treeId);
        // console.log("assetProof ", assetProof);
        // console.log("assetRoot ", assetRoot);
        let treeIdPubKey = new solanaWeb3.PublicKey(treeId);
        let treeAccount = await splAccountComp.ConcurrentMerkleTreeAccount.fromAccountAddress(connection, treeIdPubKey, );
        // console.log("treeAccount ", treeAccount);
        let treeAuthority = treeAccount.getAuthority();
        let canopyDepth = treeAccount.getCanopyDepth();
        // console.log("treeAuthority ", treeAuthority.toString());
        // console.log("canopyDepth ", canopyDepth);
        const proof = assetProof.slice(0, assetProof.length - (!!canopyDepth ? canopyDepth : 0))
          .map((node) => ({
            pubkey: new solanaWeb3.PublicKey(node),
            isWritable: false,
            isSigner: false,
          }));
        // console.log("proof ", proof);
        // create the NFT transfer instruction (via the Bubblegum package)
        const transferIx = mplBubble.createTransferInstruction({
            merkleTree: new solanaWeb3.PublicKey(treeId),
            treeAuthority,
            leafOwner: provider.publicKey,
            leafDelegate: provider.publicKey,
            newLeafOwner: recipientAccountPubkey,
            logWrapper: splAccountComp.SPL_NOOP_PROGRAM_ID,
            compressionProgram: splAccountComp.SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
            anchorRemainingAccounts: proof,
          }, {
            root: [...new solanaWeb3.PublicKey(assetRoot).toBytes()],
            dataHash: [...new solanaWeb3.PublicKey(assetCompressionDatahash).toBytes()],
            creatorHash: [...new solanaWeb3.PublicKey(assetCompressionCreatorhash).toBytes()],
            nonce: assetCompressionLeafId,
            index: assetCompressionLeafId,
          },
          conf.BUBBLEGUM_PROGRAM_ID,
        );
        //         console.log("transferTx ", transferIx);
        ///////////////////////////////////////////////////////////////////////////////
        let tx = new solanaWeb3.Transaction();
        tx.add(transferIx);
        tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
        tx.feePayer = provider.publicKey;
        $("#cover_message").html("Requesting Approval...");
        let signedTransaction = await provider.signTransaction(tx);
        const serializedTransaction = signedTransaction.serialize();
        const signature = await connection.sendRawTransaction(serializedTransaction, {
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        }, );
        $("#cover_message").html("Finalizing Transaction...");
        const intervalID = setInterval(async function() {
          let tx_status = await connection.getSignatureStatuses([signature], {
            searchTransactionHistory: true,
          });
          if (tx_status.value[0].confirmationStatus == undefined) {
            // console.log("Bad Status...");
          } else if (tx_status.value[0].confirmationStatus == "finalized") {
            clearInterval(intervalID);
            //             console.log("Signature: ", signature);
            // console.log(`https://solscan.io/tx/${signature}`);
            $("#cover_message").html("");
            $("#donation_box").after('<div id="donation_thanks">McDegens appreciates your donation degen! 🍔</div><div id="donation_sig"><a href="https://solscan.io/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
            $("#wallet_refresh").click();
            $("#cnft_send_donation").attr("id", "nft_send_donation");
          }
        }, 3000);
        ///////////////////////////////////////////////////////////////////////////////
      } catch (error) {
        $("#cnft_send_donation").prop("disabled", false);
        $("#cover_message").html("");
        $("#nft_donation_box").show();
        // console.log("Error: ", error);
        error = JSON.stringify(error);
        error = JSON.parse(error);
        // console.log("Error Logs: ", error);
      }
    }
  }
});

// ui tab navigation
$(document).delegate("#mcprofile_nav ul li button", "click", async function() {
  $("#mcprofile_nav ul li button").removeClass("active_mcpanel");
  $(this).addClass("active_mcpanel");
  let val = $(this).val();
  $(".mc_panel").hide();
  $("#" + val).show();
  $("#scroll_wrapper").getNiceScroll().resize();
});

// mcswap create load asset b
async function max_proofs() {
let pcount = parseInt($("#proofs_a").html())+parseInt($("#proofs_b").html());
  if(pcount>17){
    $(".proofs_").addClass("toomanyproofs");
    $("#sol_request, #pikl_request, #usdc_request, #swap_create").prop("disabled", true);
    $("#create_b_id").prop("disabled", false);
    $("#mc_swap_create .mc_title").html("17 Proofs Exceded!").addClass("blink");
  }
  else if( parseInt($("#proofs_a").html()) > 0 && parseInt($("#proofs_b").html()) > 0 ){
    $(".proofs_").removeClass("toomanyproofs");
    $("#create_b_id, #sol_request, #pikl_request, #usdc_request, #swap_create").prop("disabled", false);
    $("#mc_swap_create .mc_title").html("New Proposal").removeClass("blink");
  }
  else{
    $("#mc_swap_create .mc_title").html("New Proposal").removeClass("blink");
  }
}
async function load_asset_b() {
  let swap_b_id = $("#create_b_id").val();
  if (swap_b_id.length < 32) {
    $(".swap_img_b").attr("src","/img/img-placeholder.png");
    $("#mc_swap_create .mc_title").html("New Proposal");
    $("#create_b_owner").val("");
    $("#create_b_id").prop("disabled", false);
    $("#proofs_b").hide();
    $(".proofs_").removeClass("toomanyproofs");
    return;
  }
  const axiosInstance = axios.create({
    baseURL: conf.cluster
  });
  let response = await axiosInstance.post(conf.cluster, {
    jsonrpc: "2.0",
    method: "getAsset",
    id: "rpd-op-123",
    params: {
      id: swap_b_id
    },
  });
  if (typeof response.data.result == "undefined"){
    $("#mc_swap_create .mc_title").html("New Proposal");
    $("#create_b_id").prop("disabled", false);
    $("#proofs_b").hide();
    $("#create_b_owner").val("");
    $(".swap_img_b").attr("src","/img/img-placeholder.png");
    $(".proofs_").removeClass("toomanyproofs");
    return;
  }
  let owner = response.data.result.ownership.owner;
  if (owner == $("#create_a_owner").val()) {
    $("#mc_swap_create .mc_title").html("New Proposal");
    alert("Same Owner!");
    $("#create_b_id").prop("disabled", false).val("");
    return;
  }
  $("#create_b_owner").val(owner);
  $("img.swap_img_b").attr("src", response.data.result.content.links.image);
  $("#mc_swap_create .mc_title").html("New Proposal");
  $("#sol_request").focus();
  let proofs_required = await required_proofs(swap_b_id);
  $("#proofs_b").html(proofs_required+" x Proofs").show();
  max_proofs();
}
$(document).delegate("#fetch_b", "click", async function() {
  $("#create_b_id, #sol_request, #pikl_request, #usdc_request, #swap_create").prop("disabled", true);
  $("#mc_swap_create .mc_title").html("Fetching Asset...");
  $("#create_b_id").prop("disabled", true);
  load_asset_b();
});

// request sol amount
async function format_sol() {
  let amt = $("#sol_request").val();
  amt = amt.replace(/[^0-9.]/g, '');
  let amt_x = amt;
  if (amt == 0 || amt == "") {
    $("#sol_request").val(amt_x);
    $("#token_sol").attr("src","/img/check_default.png");
    return;
  }
  let int = amt.split(".");
  if (int.length > 1) {
    let int_a = int[0];
    let int_b = int[1];
    int_b = int_b.substring(0, 9);
    amt = int_a + "." + int_b;
  }
  $("#token_sol").attr("src","/img/check_green.png");
  $("#sol_request").val(amt);
}
$(document).on("change", "#sol_request", function() {
  format_sol();
});
$(document).on("keyup", "#sol_request", function() {
  format_sol();
});

// request pikl amount
async function format_pikl() {
  let amt = $("#pikl_request").val();
  amt = amt.replace(/[^0-9.]/g, '');
  let amt_x = amt;
  if (amt == 0 || amt == "") {
    $("#pikl_request").val(amt_x);
    $("#token_pikl").attr("src","/img/check_default.png");
    return;
  }
  let int = amt.split(".");
  if (int.length > 1) {
    let int_a = int[0];
    let int_b = int[1];
    int_b = int_b.substring(0, conf.pikl_decimals);
    amt = int_a + "." + int_b;
  }
    
  $("#usdc_request").val("");
  $("#token_usdc").attr("src","/img/check_default.png");
  $("#token_pikl").attr("src","/img/check_green.png");
  
  $("#pikl_request").val(amt);
}
$(document).on("change", "#pikl_request", function() {
  format_pikl();
});
$(document).on("keyup", "#pikl_request", function() {
  format_pikl();
});

// request usdc amount
async function format_usdc() {
  let amt = $("#usdc_request").val();
  amt = amt.replace(/[^0-9.]/g, '');
  let amt_x = amt;
  if (amt == 0 || amt == "") {
    $("#usdc_request").val(amt_x);
    $("#token_usdc").attr("src","/img/check_default.png");
    return;
  }
  let int = amt.split(".");
  if (int.length > 1) {
    let int_a = int[0];
    let int_b = int[1];
    int_b = int_b.substring(0, 6);
    amt = int_a + "." + int_b;
  }
  
  $("#pikl_request").val("");
  $("#token_pikl").attr("src","/img/check_default.png");
  $("#token_usdc").attr("src","/img/check_green.png");
  
  $("#usdc_request").val(amt);
}
$(document).on("change", "#usdc_request", function() {
  format_usdc();
});
$(document).on("keyup", "#usdc_request", function() {
  format_usdc();
});

// compose proposal
$(document).delegate("#swap_create", "click", async function() {
  if ($("#sol_request").val() == "") {
    $("#sol_request").val("0");
  }
  if ($("#pikl_request").val() == "") {
    $("#pikl_request").val("0");
  }
  if ($("#usdc_request").val() == "") {
    $("#usdc_request").val("0");
  }
  $("#pikl_request, #usdc_request, #nav_shop, #nav_view, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #create_b_id, #fetch_b, #sol_request, #swap_create, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", true);
  $(".swap_b , .swap_g").removeClass("active_swap");
  $(".swap_e").addClass("active_swap");
  $(".swap_cancel, #swap_provision").prop("disabled", false);
  $(".mcprofile_close, #wallet_refresh").hide();
  $(".fee_prov_sig .swap_val, .fee_prov_alt .swap_val, .share_sig .swap_val, .share_id .swap_val").html("");
});

// back a step
$(document).delegate("#swap_cancel", "click", async function() {
  $("#pikl_request, #usdc_request, #nav_shop, #nav_view, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #create_b_id, #fetch_b, #sol_request, #swap_create, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
  $(".swap_e").removeClass("active_swap");
  $(".swap_b").addClass("active_swap");
  $(".swap_cancel, #swap_provision").prop("disabled", true);
  $(".mcprofile_close, #wallet_refresh").show();
});

// provision proposal
async function provision_proposal() {

  provider = wallet_provider();

  if (provider.isConnected === true) {

    $(".swap_cancel, #swap_provision").prop("disabled", true);
    $("#swap_provisioning").addClass("provisioning").html("Provisioning...");
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let from_wallet = provider.publicKey.toString();
    
    let assetId = $("#create_a_id").val();
    let swapAssetId = $("#create_b_id").val();
    
    let swapSol = $("#sol_request").val();
    swapLamports = swapSol * conf.billion;
    swapLamports = parseInt(swapLamports);
    
    swapTokenMint = new solanaWeb3.PublicKey(conf.pikl);
    swapTokens = $("#pikl_request").val();
    
    let multiplier = 1;
    for (let i = 0; i < conf.pikl_decimals; i++) {
      multiplier = multiplier * 10;
    }
    swapTokens = swapTokens * multiplier;
    swapTokens = parseInt(swapTokens);
    
    usdcMint = new solanaWeb3.PublicKey(conf.usdc);
    swapUSDC = $("#usdc_request").val() * 1000000;
    swapUSDC = parseInt(swapUSDC);
    
    // console.log("assetId ", assetId);
    // console.log("swapAssetId ", swapAssetId);
    // console.log("swapLamports ", swapLamports);
    // console.log("swapTokenMint ", swapTokenMint);
    // console.log("swapTokens ", swapTokens);
    // console.log("usdcMint ", usdcMint);
    // console.log("swapUSDC ", swapUSDC);

    let heliusUrl = conf.cluster;
    let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PROGRAM_ID);
    let devTreasury = new solanaWeb3.PublicKey(conf.treasury_studio);
    let mcDegensTreasury = new solanaWeb3.PublicKey(conf.treasury);
//     let mcDegensDevTreasury = new solanaWeb3.PublicKey(conf.treasury_dev);
    let feeLamports = conf.fee;
    
    let axiosInstance = axios.create({
      baseURL: heliusUrl,
    });

    let getAsset = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {
        id: assetId
      },
    });
    // console.log("getAsset ", getAsset);
    // console.log("data_hash ", getAsset.data.result.compression.data_hash);
    // console.log("creator_hash ", getAsset.data.result.compression.creator_hash);
    // console.log("leaf_id ", getAsset.data.result.compression.leaf_id);

    let getAssetProof = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAssetProof",
      id: "rpd-op-123",
      params: {
        id: assetId
      },
    });
    // console.log("getAssetProof ", getAssetProof);
    // console.log("tree_id ", getAssetProof.data.result.tree_id);
    // console.log("proof ", getAssetProof.data.result.proof);
    // console.log("root ", getAssetProof.data.result.root);

    let treeAccount = await splAccountComp.ConcurrentMerkleTreeAccount.fromAccountAddress(
      connection, new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),
    );
    let treeAuthorityPDA = treeAccount.getAuthority();
    let canopyDepth = treeAccount.getCanopyDepth();
    // console.log("treeAuthorityPDA ", treeAuthorityPDA.toString());
    // console.log("canopyDepth ", canopyDepth);
    
    // parse the list of proof addresses into a valid AccountMeta[]
    let proof = getAssetProof.data.result.proof
      .slice(0, getAssetProof.data.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
      .map((node) => ({
        pubkey: new solanaWeb3.PublicKey(node),
        isWritable: false,
        isSigner: false,
      }));
    // console.log("proof ", proof);

    let getSwapAsset = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {
        id: swapAssetId
      },
    });
    // console.log("getSwapAsset ", getSwapAsset);
    // console.log("swap data_hash ", getSwapAsset.data.result.compression.data_hash);
    // console.log("swap creator_hash ", getSwapAsset.data.result.compression.creator_hash);
    // console.log("swap leaf_id ", getSwapAsset.data.result.compression.leaf_id);

    let getSwapAssetProof = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAssetProof",
      id: "rpd-op-123",
      params: {
        id: swapAssetId
      },
    });
    // console.log("getSwapAssetProof ", getSwapAssetProof);
    // console.log("swap tree_id ", getSwapAssetProof.data.result.tree_id);
    // console.log("swap proof ", getSwapAssetProof.data.result.proof);
    // console.log("swap root ", getSwapAssetProof.data.result.root);

    let swapTreeAccount = await splAccountComp.ConcurrentMerkleTreeAccount.fromAccountAddress(
      connection,
      new solanaWeb3.PublicKey(getSwapAssetProof.data.result.tree_id),
    );
    // console.log("swapTreeAccount ", swapTreeAccount);
    let swapCanopyDepth = swapTreeAccount.getCanopyDepth();
    // console.log("swap canopyDepth ", swapCanopyDepth);

    // parse the list of proof addresses into a valid AccountMeta[]
    let swapProof = getSwapAssetProof.data.result.proof
      .slice(0, getSwapAssetProof.data.result.proof.length - (!!swapCanopyDepth ? swapCanopyDepth : 0))
      .map((node) => ({
        pubkey: new solanaWeb3.PublicKey(node),
        isWritable: false,
        isSigner: false,
      }));
    // console.log("swapProof ", swapProof);

    let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")], cNFTSwapProgramId);
    // console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

    if (getAsset.data.result.ownership.owner == swapVaultPDA || getSwapAsset.data.result.ownership.owner == swapVaultPDA) {
      // console.log("One or both cNFTs are already in the Swap Vault");
      return;
    }

    let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"), new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()], cNFTSwapProgramId);
    // console.log("Swap State PDA: ", swapStatePDA[0].toString());

    let cNFTProgramStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-program-state")], cNFTSwapProgramId);
    // console.log("cNFT Program State PDA: ", cNFTProgramStatePDA[0].toString());

    let tempFeeAccount = new solanaWeb3.Keypair();
    // console.log("Temp Fee Account: ", tempFeeAccount.publicKey.toString());
    tempFeeAccountSaved = tempFeeAccount;

    createTempFeeAccountIx = solanaWeb3.SystemProgram.createAccount({
      programId: cNFTSwapProgramId,
      space: 0,
      lamports: feeLamports,
      fromPubkey: provider.publicKey,
      newAccountPubkey: tempFeeAccount.publicKey,
    });
    // console.log("Create Temp Fee Account Tx: ", createTempFeeAccountIx);

    swap_createATA = false;
//     swap_createUSDCATA = false;
    
    if (swapUSDC > 0) {
      swapTokenMint = usdcMint;
      swapTokens = swapUSDC;
      swapUSDC = 0;
    }
    if (swapTokens > 0) {
      let associatedTokenAccount = await splToken.getAssociatedTokenAddress(
        swapTokenMint, provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
      await splToken.getAccount(connection, associatedTokenAccount, 'confirmed', splToken.TOKEN_PROGRAM_ID)
        .then(function(response) {
          swap_createATA = false;
        })
        .catch(function(error) {
          if (error.name === "TokenAccountNotFoundError") {
            swap_createATA = true;
          }
        });
      createTokenATAIx = false;
      if (swap_createATA === true) {
        createTokenATAIx = splToken.createAssociatedTokenAccountInstruction(
          provider.publicKey,
          associatedTokenAccount,
          provider.publicKey,
          swapTokenMint,
          splToken.TOKEN_PROGRAM_ID,
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        // console.log("Do create ATA Ix: ", createTokenATAIx);
      } else {
        // console.log("Do not create ATA Ix: ");
      }
    }
    
    let totalSize = 1 + 32 + 32 + 32 + 32 + 8 + 32 + 32 + 32 + 32 + 8 + 1 + 8 + 32 + 8 + 8;
    // console.log("totalSize", totalSize);
    
    let uarray = new Uint8Array(totalSize);
    let counter = 0;
    uarray[counter++] = 0;

    let assetIdb58 = bs58.decode(assetId);
    let arr_a = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
    for (let i = 0; i < arr_a.length; i++) {
      uarray[counter++] = arr_a[i];
    }

    let rootb58 = bs58.decode(getAssetProof.data.result.root);
    let arr_b = Array.prototype.slice.call(Buffer.from(rootb58), 0);
    for (let i = 0; i < arr_b.length; i++) {
      uarray[counter++] = arr_b[i];
    }

    let datahashb58 = bs58.decode(getAsset.data.result.compression.data_hash);
    let arr_c = Array.prototype.slice.call(Buffer.from(datahashb58), 0);
    for (let i = 0; i < arr_c.length; i++) {
      uarray[counter++] = arr_c[i];
    }

    let creatorhashb58 = bs58.decode(getAsset.data.result.compression.creator_hash);
    let arr_d = Array.prototype.slice.call(Buffer.from(creatorhashb58), 0);
    for (let i = 0; i < arr_d.length; i++) {
      uarray[counter++] = arr_d[i];
    }

    let byteArray;
    let arr;

    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
      let byte = getAsset.data.result.compression.leaf_id & 0xff;
      byteArray[index] = byte;
      getAsset.data.result.compression.leaf_id = (getAsset.data.result.compression.leaf_id - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }

    let swapAssetIdb58 = bs58.decode(swapAssetId);
    arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    let swapAssetRootb58 = bs58.decode(getSwapAssetProof.data.result.root);
    arr = Array.prototype.slice.call(Buffer.from(swapAssetRootb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    let swapAssetDatahashb58 = bs58.decode(getSwapAsset.data.result.compression.data_hash);
    arr = Array.prototype.slice.call(Buffer.from(swapAssetDatahashb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    let swapAssetCreatorhashb58 = bs58.decode(getSwapAsset.data.result.compression.creator_hash);
    arr = Array.prototype.slice.call(Buffer.from(swapAssetCreatorhashb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
      let byte = getSwapAsset.data.result.compression.leaf_id & 0xff;
      byteArray[index] = byte;
      getSwapAsset.data.result.compression.leaf_id = (getSwapAsset.data.result.compression.leaf_id - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }

    uarray[counter++] = proof.length;

    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
      let byte = swapLamports & 0xff;
      byteArray[index] = byte;
      swapLamports = (swapLamports - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }

    let swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
    arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }
    
    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
      let byte = swapTokens & 0xff;
      byteArray[index] = byte;
      swapTokens = (swapTokens - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }

    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
      let byte = swapUSDC & 0xff;
      byteArray[index] = byte;
      swapUSDC = (swapUSDC - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }
    
    // console.log("Contract Data: ", uarray);

    let keys = [
      {
        pubkey: provider.publicKey,
        isSigner: true,
        isWritable: true
      }, // 0
      {
        pubkey: swapVaultPDA[0],
        isSigner: false,
        isWritable: true
      }, // 1
      {
        pubkey: swapStatePDA[0],
        isSigner: false,
        isWritable: true
      }, // 2
      {
        pubkey: treeAuthorityPDA,
        isSigner: false,
        isWritable: false
      }, // 3
      {
        pubkey: new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),
        isSigner: false,
        isWritable: true
      }, // 4
      {
        pubkey: new solanaWeb3.PublicKey(getSwapAssetProof.data.result.tree_id),
        isSigner: false,
        isWritable: false
      }, // 5
      {
        pubkey: new solanaWeb3.PublicKey(getSwapAsset.data.result.ownership.owner),
        isSigner: false,
        isWritable: false
      }, // 6
      {
        pubkey: mplBubble.PROGRAM_ID,
        isSigner: false,
        isWritable: false
      }, // 7
      {
        pubkey: splAccountComp.PROGRAM_ID,
        isSigner: false,
        isWritable: false
      }, // 8
      {
        pubkey: splAccountComp.SPL_NOOP_PROGRAM_ID,
        isSigner: false,
        isWritable: false
      }, // 9
      {
        pubkey: solanaWeb3.SystemProgram.programId,
        isSigner: false,
        isWritable: false
      }, // 10 
      {
        pubkey: cNFTProgramStatePDA[0],
        isSigner: false,
        isWritable: false
      }, // 11
      {
        pubkey: tempFeeAccount.publicKey,
        isSigner: false,
        isWritable: true
      }, // 12 
      {
        pubkey: devTreasury,
        isSigner: false,
        isWritable: true
      }, // 13 
      {
        pubkey: mcDegensTreasury,
        isSigner: false,
        isWritable: true
      }, // 14 
//       {pubkey: mcDegensDevTreasury,isSigner: false,isWritable: true},
    ];
    for (let i = 0; i < proof.length; i++) {
      keys.push(proof[i]);
    }
    // console.log("keys ", keys);

    let initializeSwapIx = new solanaWeb3.TransactionInstruction({
      programId: cNFTSwapProgramId,
      data: Buffer.from(uarray),
      keys: keys,
    });
    // console.log("Initialize Swap Ix: ", initializeSwapIx);
    initializedSwapIx = initializeSwapIx;

    let slot = await connection.getSlot();
    [createALTIx, lookupTableAddress] = solanaWeb3.AddressLookupTableProgram.createLookupTable({
      authority: provider.publicKey,
      payer: provider.publicKey,
      recentSlot: slot,
    });
    // console.log("Lookup Table Address", lookupTableAddress.toBase58(), lookupTableAddress);

    let proofPubkeys = [];
    for (let i = 0; i < proof.length; i++) {
      proofPubkeys.push(proof[i].pubkey);
    }
    // console.log("proofPubkeys ", proofPubkeys);
    
    let extendIx = solanaWeb3.AddressLookupTableProgram.extendLookupTable({
      payer: provider.publicKey,
      authority: provider.publicKey,
      lookupTable: lookupTableAddress,
      addresses: [
        cNFTSwapProgramId,
        solanaWeb3.SystemProgram.programId,
        mplBubble.PROGRAM_ID,
        splAccountComp.PROGRAM_ID,
        splAccountComp.SPL_NOOP_PROGRAM_ID,
        swapVaultPDA[0],
        devTreasury,
        mcDegensTreasury,
//         mcDegensDevTreasury,
        ...proofPubkeys,
      ],
    });
    // console.log("extendIx ", extendIx);
    
    let createALTTx = new solanaWeb3.Transaction();
    createALTTx.add(createALTIx, extendIx);
    createALTTx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
    createALTTx.feePayer = provider.publicKey;
    // console.log("Start Tx");
    $("#cover_message").html("Requesting Approval...");

    try {

      let signedTransaction = await provider.signTransaction(createALTTx);
      // console.log("Tx: ", createALTTx);
      let serializedTransaction = signedTransaction.serialize();
      $("#cover_message").html("Sending Transaction...");
      let signature = await connection.sendRawTransaction(
        serializedTransaction, {
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        },
      );
      // console.log("Signature: ", signature);
      // console.log(`https://solscan.io/tx/${signature}`);
      $(".fee_prov_sig span.swap_val").html(signature);

      $("#cover_message").html("Finalizing Transaction...");
      let createID = setInterval(async function() {
        let tx_status = await connection.getSignatureStatuses([signature], {
          searchTransactionHistory: true,
        });
        if (tx_status.value[0].confirmationStatus == undefined) {
          // console.log("Bad Status...");
        } else if (tx_status.value[0].confirmationStatus == "finalized") {
          clearInterval(createID);
          lookupTableAccount = await connection.getAddressLookupTable(lookupTableAddress).then((res) => res.value);
          if (!lookupTableAccount) {
            // console.log("Could not fetch ALT!");
          }
          lookupTableAccountSaved = lookupTableAccount;
          // console.log("ALT:");
          // console.log(lookupTableAccount);
          $(".fee_prov_alt .swap_val").html(lookupTableAccount.key.toString());
          $("#swap_provisioning").removeClass("provisioning").html("3. Provision Proposal");
          $("#cover_message").html("");
          $("#cover").fadeOut(400);
          $(".swap_e").removeClass("active_swap");
          $(".swap_f").addClass("active_swap");
          $("#swap_deploy").prop("disabled", false);
        }
      }, 3000);

    } 
    catch (error) {
      // console.log("Error: ", error);
      error = JSON.stringify(error);
      error = JSON.parse(error);
      // console.log("Error Logs: ", error);
      $("#cover_message").html("");
      $("#cover").fadeOut(400);
      $(".swap_cancel, #swap_provision").prop("disabled", false);
      $("#swap_provisioning").removeClass("provisioning").html("3. Provision Proposal");
      return;
    }
    
  } 
  else {
    return;
  }
  
}
$(document).delegate("#swap_provision", "click", provision_proposal);

// deploy proposal
async function deploy_proposal() {

  provider = wallet_provider();

  if (provider.isConnected === true) {

    $("#swap_deploy").prop("disabled", true);
    $("#swap_deploying").addClass("provisioning").html("Deploying...");
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");

    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let acct = $(".fee_prov_alt .swap_val").html();
    
    let messageV0 = null;
    
    if (swap_createATA == true) {
      messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [createTempFeeAccountIx, createTokenATAIx, initializedSwapIx],
      }).compileToV0Message([lookupTableAccountSaved]);
      // console.log("token");
    } 
    else {
      messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [createTempFeeAccountIx, initializedSwapIx],
      }).compileToV0Message([lookupTableAccountSaved]);
      // console.log("none");
    }
    // console.log("messageV0 ", messageV0);
    
    const tx = new solanaWeb3.VersionedTransaction(messageV0);
    
    // console.log("Deploy",tx);
    $("#cover_message").html("Requesting Approval...");
    
      try {

        let signedTx = await provider.signTransaction(tx);
        signedTx.sign([tempFeeAccountSaved]);
        const txId = await connection.sendTransaction(signedTx);
        // console.log("Signature: ", txId)
        // console.log(`https://solscan.io/tx/${txId}`);
        $(".share_sig span.swap_val").html(txId);

        $("#cover_message").html("Finalizing Transaction...");
        const deployID = setInterval(async function() {
          let tx_status = await connection.getSignatureStatuses([txId], {searchTransactionHistory:true,});
          if (tx_status.value[0].confirmationStatus == undefined) {
            // console.log("Bad Status...");
          } 
          else if (tx_status.value[0].confirmationStatus == "finalized") {
            clearInterval(deployID);
            $(".share_id .swap_val").html(conf.host+"/swap/"+$("#create_a_id").val()+"-"+$("#create_b_id").val());
            $("#swap_deploying").removeClass("provisioning").html("4. Deploy Proposal");
            $(".swap_f").removeClass("active_swap");
            $(".swap_g").addClass("active_swap");
            $("#nav_shop, #nav_view, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled",false);
            $(".mcprofile_close, #wallet_refresh").show();
            $("ul[data-id='"+$("#create_a_id").val()+"']").remove();
            $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
            $("#create_a_id, #sol_request, #pikl_request, #usdc_request, #create_a_owner, #create_b_owner, #create_b_id").val("");
            $(".swap_img_a, .swap_img_b").attr("src","/img/img-placeholder.png");
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
            $("#token_sol, #token_pikl, #token_usdc").attr("src", "/img/check_default.png");
          }
        }, 3000);          

      } 
      catch(error) {
        // console.log("Error: ", error);
        error = JSON.stringify(error);
        error = JSON.parse(error);
        // console.log("Error Logs: ", error);
        $("#swap_deploy").prop("disabled",false);
        $("#swap_deploying").removeClass("provisioning").html("4. Deploy Proposal - Error");
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
        $(".share_id .swap_value").html(conf.host+"/swap/"+$("#create_a_id").val()+"-"+$("#create_b_id").val());
        return;
      }   
  } 
  else {
    return;
  }
}
$(document).delegate("#swap_deploy", "click", deploy_proposal);

// provisioning swap
async function provision_swap() {
  
  provider = wallet_provider();
  
  if (provider.isConnected === true) {
    
    $("#fulfil_create").prop("disabled", true);
    $("#fulfil_step_2").addClass("provisioning").html("Provisioning...");
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", true);
    
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let from_wallet = provider.publicKey.toString();
    // console.log("Executer ", from_wallet);
    
    let assetId = $("#fulfil_a_id").val();
    let swapAssetId = $("#fulfil_b_id").val();    
    // console.log("assetId ", assetId);
    // console.log("swapAssetId ", swapAssetId);    
    
    let heliusUrl = conf.cluster;
    let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PROGRAM_ID);
    usdcMint = new solanaWeb3.PublicKey(conf.usdc);
    
    let devTreasury = new solanaWeb3.PublicKey(conf.treasury_studio);
    let mcDegensTreasury = new solanaWeb3.PublicKey(conf.treasury);
//     let mcDegensDevTreasury = new solanaWeb3.PublicKey(conf.treasury_dev);
    let feeLamports = conf.fee;
    // console.log("feeLamports ", feeLamports);
    
    let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync(
      [Buffer.from("cNFT-swap"), new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()],
      cNFTSwapProgramId
    );
    // console.log("Swap State PDA: ", swapStatePDA[0].toString());
    
    let swapState = null;
    await connection.getAccountInfo(swapStatePDA[0])
    .then(function(response) {swapState = response;})
    .catch(function(error){
      error = JSON.stringify(error);
      error = JSON.parse(error);
      // console.log("Error: ", error);
      return;
    });    
    
    swapInitializer = null;
    swapLamports = null;
    swapTokens = null;
    swapUSDC = null;
    swapTokenMint = null;    
    changeTokenAuthorityIx = null;    
        
    if (swapState != null) {
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = SWAP_STATE.decode(encodedSwapStateData);
        // console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
        // console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
        // console.log("swapState - asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.asset_id).toString());
        // console.log("swapState - merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.merkle_tree).toString());
        // console.log("swapState - root: ", new solanaWeb3.PublicKey(decodedSwapStateData.root).toString());
        // console.log("swapState - data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.data_hash).toString());
        // console.log("swapState - creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.creator_hash).toString());
        // console.log("swapState - nonce", new BN(decodedSwapStateData.nonce, 10, "le").toString());
        // console.log("swapState - swap_asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_asset_id).toString());
        // console.log("swapState - swap_merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_merkle_tree).toString());
        // console.log("swapState - swap_root: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_root).toString());
        // console.log("swapState - swap_data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_data_hash).toString());
        // console.log("swapState - swap_creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_creator_hash).toString());
        // console.log("swapState - swap_nonce", new BN(decodedSwapStateData.swap_nonce, 10, "le").toString());
        // console.log("swapState - swap_leaf_owner: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString());
        // console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
        // console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
        // console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
        // console.log("swapState - swap_usdc", new BN(decodedSwapStateData.swap_usdc, 10, "le").toString());
        swapInitializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
        swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
        swapTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint);
        swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
        swapUSDC = new BN(decodedSwapStateData.swap_usdc, 10, "le");
    } else {
        // console.log("Swap Not Initialized");    
        return;
    }    
    
    let axiosInstance = axios.create({baseURL: heliusUrl,});    
    
    let getAsset = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {id: assetId},
    });
    // console.log("data_hash ", getAsset.data.result.compression.data_hash);
    // console.log("creator_hash ", getAsset.data.result.compression.creator_hash);
    // console.log("leaf_id ", getAsset.data.result.compression.leaf_id);
    
    let getAssetProof = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAssetProof",
      id: "rpd-op-123",
      params: {id: assetId},
    });
    // console.log("tree_id ", getAssetProof.data.result.tree_id);
    // console.log("proof ", getAssetProof.data.result.proof);
    // console.log("root ", getAssetProof.data.result.root);
    
    let treeAccount = await splAccountComp.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,
    new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),);
    let treeAuthorityPDA = treeAccount.getAuthority();
    let canopyDepth = treeAccount.getCanopyDepth();
    // console.log("treeAuthorityPDA ", treeAuthorityPDA.toString());
    // console.log("canopyDepth ", canopyDepth);    
    
    // parse the list of proof addresses into a valid AccountMeta[]
    let proof = getAssetProof.data.result.proof
    .slice(0, getAssetProof.data.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
    .map((node) => ({
      pubkey: new solanaWeb3.PublicKey(node),
      isWritable: false,
      isSigner: false,
    }));
    // console.log("proof ", proof);

    let getSwapAsset = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {id: swapAssetId},
    });
    // console.log("swap data_hash ", getSwapAsset.data.result.compression.data_hash);
    // console.log("swap creator_hash ", getSwapAsset.data.result.compression.creator_hash);
    // console.log("swap leaf_id ", getSwapAsset.data.result.compression.leaf_id);
    
    let getSwapAssetProof = await axiosInstance.post(heliusUrl, {
      jsonrpc: "2.0",
      method: "getAssetProof",
      id: "rpd-op-123",
      params: {id: swapAssetId},
    });
    // console.log("swap tree_id ", getSwapAssetProof.data.result.tree_id);
    // console.log("swap proof ", getSwapAssetProof.data.result.proof);
    // console.log("swap root ", getSwapAssetProof.data.result.root);

    let swapTreeAccount = await splAccountComp.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,
    new solanaWeb3.PublicKey(getSwapAssetProof.data.result.tree_id),);
    // console.log("swapTreeAccount ", swapTreeAccount);  
    swapTreeAuthorityPDA = swapTreeAccount.getAuthority();
    let swapCanopyDepth = swapTreeAccount.getCanopyDepth();
    // console.log("swap treeAuthorityPDA ", swapTreeAuthorityPDA.toString());
    // console.log("swap canopyDepth ", swapCanopyDepth);    
    
    let swapProof = getSwapAssetProof.data.result.proof
    .slice(0, getSwapAssetProof.data.result.proof.length - (!!swapCanopyDepth ? swapCanopyDepth : 0))
    .map((node) => ({
      pubkey: new solanaWeb3.PublicKey(node),
      isWritable: false,
      isSigner: false,
    }));
    // console.log("swapProof ", swapProof);
    
    let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")],cNFTSwapProgramId);
    // console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());
    
    if (getAsset.data.result.ownership.owner == swapVaultPDA || getSwapAsset.data.result.ownership.owner == swapVaultPDA) {
      // console.log("One or both cNFTs are already in the Swap Vault");
      return;
    }    
    
    let cNFTProgramStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-program-state")],cNFTSwapProgramId);
    // console.log("cNFT Program State PDA: ", cNFTProgramStatePDA[0].toString());    
    
    let totalFee = parseInt(feeLamports) + parseInt(swapLamports);
    // console.log("totalFee ", totalFee);
    tempFeeAccount = new solanaWeb3.Keypair();
    // console.log("Temp Fee Account: ", tempFeeAccount.publicKey.toString());
    createTempFeeAccountIx = solanaWeb3.SystemProgram.createAccount({
      programId: cNFTSwapProgramId,
      space: 0,
      lamports: totalFee,
      fromPubkey: provider.publicKey,
      newAccountPubkey: tempFeeAccount.publicKey,
    });
    // console.log("Create Temp Fee Account Ix: ", createTempFeeAccountIx);
    
    //***********************************************************
    
    providerTokenATA = await splToken.getAssociatedTokenAddress(
      swapTokenMint,
      provider.publicKey,
      false,
      splToken.TOKEN_PROGRAM_ID,
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    // console.log("Provider Token ATA: ", providerTokenATA.toString());    
    
    tempTokenAccount = new solanaWeb3.Keypair();
    createTempTokenAccountIx = null;
    initTempTokenAccountIx = null;
    transferTokenIx = null;
    if (swapTokens > 0) {
    
    let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
    // console.log("Temp Token Account: ", tempTokenAccount.publicKey.toString());
    createTempTokenAccountIx = solanaWeb3.SystemProgram.createAccount({
      programId: splToken.TOKEN_PROGRAM_ID,
      space: splToken.AccountLayout.span,
      lamports: rent,
      fromPubkey: provider.publicKey,
      newAccountPubkey: tempTokenAccount.publicKey,
    });
    // console.log("Create Temp Token Account Ix: ", createTempFeeAccountIx);    
    
    initTempTokenAccountIx = splToken.createInitializeAccountInstruction(
      tempTokenAccount.publicKey,
      swapTokenMint,
      tempTokenAccount.publicKey,
      splToken.TOKEN_PROGRAM_ID
    );
    // console.log("Init Temp Token Account Ix: ", initTempTokenAccountIx)
    
    transferTokenIx = splToken.createTransferInstruction(
      providerTokenATA,
      tempTokenAccount.publicKey,
      provider.publicKey,
      parseInt(swapTokens),
      provider.publicKey,
      splToken.TOKEN_PROGRAM_ID,
    )
    // console.log("Transfer Token Ix: ", transferTokenIx);
    
    changeTokenAuthorityIx = splToken.createSetAuthorityInstruction(
      tempTokenAccount.publicKey,
      tempTokenAccount.publicKey,
      2,
      swapVaultPDA[0],
      undefined,
      undefined,
      splToken.TOKEN_PROGRAM_ID,
    );
    // console.log("Change Token Authority Ix: ", changeTokenAuthorityIx);
    
    }
    
    initializerTokenATA = await splToken.getAssociatedTokenAddress(
      swapTokenMint,
      swapInitializer,
      false,
      splToken.TOKEN_PROGRAM_ID,
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    // console.log("Initializer Token ATA: ", initializerTokenATA.toString());
    
    //***********************************************************
    
    var totalSize = 1 + 32 + 32 + 1 + 1;
    // console.log("totalSize", totalSize);

    var uarray = new Uint8Array(totalSize);
    let counter = 0;    
    uarray[counter++] = 1;
    
    let arr;
    
    let assetIdb58 = bs58.decode(assetId);
    arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
    for (let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}
    
    let swapAssetIdb58 = bs58.decode(swapAssetId);
    arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
    for (let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}
    
    uarray[counter++] = proof.length;
    uarray[counter++] = swapProof.length;
    // console.log("Contract Data: ", uarray);    
    
    let keys = [
      { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
      { pubkey:new solanaWeb3.PublicKey(swapInitializer), isSigner: false, isWritable: true }, // 1
      { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
      { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
      { pubkey: treeAuthorityPDA, isSigner: false, isWritable: false }, // 4
      { pubkey: new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id), isSigner: false, isWritable: true }, // 5
      { pubkey: swapTreeAuthorityPDA, isSigner: false, isWritable: false }, // 6
      { pubkey: new solanaWeb3.PublicKey(getSwapAssetProof.data.result.tree_id), isSigner: false, isWritable: true }, // 7
      { pubkey: mplBubble.PROGRAM_ID, isSigner: false, isWritable: false }, // 8
      { pubkey: splAccountComp.PROGRAM_ID, isSigner: false, isWritable: false }, // 9
      { pubkey: splAccountComp.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 10
      { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 11
      { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
      { pubkey: cNFTProgramStatePDA[0], isSigner: false, isWritable: false }, // 13
      { pubkey: tempFeeAccount.publicKey, isSigner: true, isWritable: true }, // 14
      { pubkey: tempTokenAccount.publicKey, isSigner: true, isWritable: true }, // 15
      { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 16
      { pubkey: devTreasury, isSigner: false, isWritable: true }, // 19
      { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 20
//       { pubkey: mcDegensDevTreasury, isSigner: false, isWritable: true },
    ];
    for (let i = 0; i < proof.length; i++) {keys.push(proof[i]);}
    for (let i = 0; i < swapProof.length; i++) {keys.push(swapProof[i]);}
    // console.log("keys ", keys);
    
    swapcNFTsIx = new solanaWeb3.TransactionInstruction({
      programId: cNFTSwapProgramId,
      data: Buffer.from(uarray),
      keys: keys,
    });
    // console.log("Swap NFTs Ix: ", swapcNFTsIx);
    
    let slot = await connection.getSlot();
    [createALTIx, lookupTableAddress] = solanaWeb3.AddressLookupTableProgram.createLookupTable({
      authority: provider.publicKey,
      payer: provider.publicKey,
      recentSlot: slot,
    });
    // console.log("Lookup Table Address", lookupTableAddress.toBase58(), lookupTableAddress);
    
    let proofPubkeys = [];
    for (let i = 0; i < proof.length; i++) {proofPubkeys.push(proof[i].pubkey);}
    // console.log("proofPubkeys ", proofPubkeys);
    
    let swapProofPubkeys = [];
    for (let i = 0; i < swapProof.length; i++) {swapProofPubkeys.push(swapProof[i].pubkey);}
    // console.log("swapProofPubkeys ", swapProofPubkeys); 
    
    extendIx = solanaWeb3.AddressLookupTableProgram.extendLookupTable({
        payer: provider.publicKey,
        authority: provider.publicKey,
        lookupTable: lookupTableAddress,
        addresses: [
          cNFTSwapProgramId,
          solanaWeb3.SystemProgram.programId,
          mplBubble.PROGRAM_ID,
          splAccountComp.PROGRAM_ID,
          splAccountComp.SPL_NOOP_PROGRAM_ID,
          swapVaultPDA[0],
          swapStatePDA[0],
          devTreasury,
//           mcDegensTreasury,
//           mcDegensDevTreasury,
          solanaWeb3.SystemProgram.programId,
          splToken.TOKEN_PROGRAM_ID,
          cNFTProgramStatePDA[0],
          ...proofPubkeys,
          ...swapProofPubkeys,
        ],
    });
    // console.log("extendIx ", extendIx);
    
    let msLookupTable = new solanaWeb3.PublicKey(conf.system_alt); // mainnet    
	  let msLookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res) => res.value);
    
    if (!msLookupTable) {
      // console.log("Could not fetch McSwap ALT!");
      return;
    }
    else{
      // console.log("msLookupTableAccount", msLookupTableAccount);
      // console.log("msLookupTableAccount.key", msLookupTableAccount.key.toString());
      // console.log("msLookupTableAccount.state.authority", msLookupTableAccount.state.authority.toString());
    }
    
    let mcswapMessageV0 = null;
    let block_hash = (await connection.getRecentBlockhash('confirmed')).blockhash;
    mcswapMessageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: block_hash,
        instructions: [createALTIx, extendIx],
    }).compileToV0Message([msLookupTableAccount]);
    // console.log("V-Message: ", mcswapMessageV0);
    
    // console.log("Start Tx");
    $("#cover_message").html("Requesting Approval...");
    
    let createALTTx = new solanaWeb3.VersionedTransaction(mcswapMessageV0);
    
    try {
      
      let signedTx = await provider.signTransaction(createALTTx);
      let signature = await connection.sendTransaction(signedTx);
      
      // console.log("Signature: ", signature);
      // // console.log(`https://solscan.io/tx/${signature}`); 
      $(".fee_fulfil_sig span.swap_val").html(signature);
      
      $("#cover_message").html("Finalizing Transaction...");
      let createAltID = setInterval(async function() {
        let tx_status = await connection.getSignatureStatuses([signature], {searchTransactionHistory: true,});
        if (tx_status.value[0].confirmationStatus == undefined) {
          // console.log("Bad Status...");
        } 
        else if (tx_status.value[0].confirmationStatus == "finalized") {
          clearInterval(createAltID);
          lookupTableAccount = await connection.getAddressLookupTable(lookupTableAddress).then((res) => res.value);
          if (!lookupTableAccount) {
            // console.log("Could not fetch ALT!");
          }
          lookupTableAccountSaved = lookupTableAccount;
          // console.log("ALT:");
          // console.log(lookupTableAccount);
          $(".fee_fulfil_alt .swap_val").html(lookupTableAccount.key.toString());
          $("#fulfil_step_2").removeClass("provisioning").html("2. Create ALT.");
          $("#cover_message").html("");
          $("#cover").fadeOut(400);
          $(".fulfil_d").removeClass("active_swap");
          $(".fulfil_e").addClass("active_swap");
          $("#swap_execute").prop("disabled", false);
        }
      }, 3000);
      
    } 
    catch(error) {
      // console.log("Error: ", error);
      error = JSON.stringify(error);
      error = JSON.parse(error);
      // console.log("Error Logs: ", error);
      $("#cover_message").html("");
      $("#cover").fadeOut(400);
      $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
      $("#fulfil_step_2").removeClass("provisioning").html("2. Create ALT.");
      $("#fulfil_create").prop("disabled",false);
    }
    
  }
  else{
    return;
  }
  
b}
$(document).delegate("#fulfil_create", "click", provision_swap);

// execute swap
async function execute_swap() {
  
  provider = wallet_provider();
  
  if (provider.isConnected === true) {
    
    $("#swap_execute").prop("disabled", true);
    $("#swap_executing").addClass("provisioning").html("Executing...");
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let acct = $(".fee_prov_alt .swap_val").html();
    
    lookupTableAccount = await connection.getAddressLookupTable(lookupTableAddress).then((res) => res.value);
    if (!lookupTableAccount) {
      // console.log("Could not fetch ALT!");
    }
    // console.log("lookupTableAddress", lookupTableAddress.toString());
    
    // console.log("swapTokens", swapTokens.toString());
    // console.log("swapUSDC", swapUSDC.toString());
    
    let messageV0 = null;
    
    if (swapTokens > 0) {
      // console.log("preview: tokens only");
      messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [
          createTempFeeAccountIx, 
          createTempTokenAccountIx, 
          initTempTokenAccountIx, 
          transferTokenIx, 
          changeTokenAuthorityIx, 
          swapcNFTsIx
        ],
      }).compileToV0Message([lookupTableAccount]);    
    } 
    else {
        // console.log("preview: no alt tokens");
        messageV0 = new solanaWeb3.TransactionMessage({
            payerKey: provider.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
            instructions: [createTempFeeAccountIx, swapcNFTsIx],
        }).compileToV0Message([lookupTableAccount]);
    }
    // console.log("messageV0 ", messageV0);
    
    let tx = new solanaWeb3.VersionedTransaction(messageV0);
    
    try {
        
        let signedTx = await provider.signTransaction(tx);
        signedTx.sign([tempFeeAccount, tempTokenAccount]);
        const txId = await connection.sendTransaction(signedTx);
        // console.log("Signature: ", txId);
        // console.log(`https://solscan.io/tx/${txId}`);
        $(".share_fulfil_sig .swap_val").html(txId);
        
        $("#cover_message").html("Finalizing Transaction...");
        const executeID = setInterval(async function() {
          let tx_status = await connection.getSignatureStatuses([txId], {searchTransactionHistory:true,});
          if (tx_status.value[0].confirmationStatus == undefined) {
            // console.log("Bad Status...");
          } 
          else if (tx_status.value[0].confirmationStatus == "finalized") {
            clearInterval(executeID);
            $("#swap_executing").removeClass("provisioning").html("3. Execute Proposal.");
            $(".fulfil_e").removeClass("active_swap");
            $(".fulfil_f").addClass("active_swap");
            $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
            $(".mcprofile_close, #wallet_refresh").show();
            $("ul[data-id='"+$("#fulfil_b_id").val()+"']").remove();
            $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
            $("#fulfil_a_id, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request, #fulfil_a_owner, #fulfil_b_owner, #fulfil_b_id").val("");
            $(".fulfil_img_a, .fulfil_img_b").attr("src","/img/img-placeholder.png");
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
            $(".proofs_").hide();
            history.pushState("", "", '/');
            $("#wallet_refresh").click();
          }
        }, 3000);
     
    } 
    catch(error) {
      // console.log("Error: ", error);
      error = JSON.stringify(error);
      error = JSON.parse(error);
      // console.log("Error Logs: ", error);
      $("#cover_message").html("");
      $("#cover").fadeOut(400);
      $("#swap_execute").prop("disabled", false);
      $("#swap_executing").removeClass("provisioning").html("3. Execute Proposal.");
      return;
    }
    
  }
  else{
    return;
  }
 
}
$(document).delegate("#swap_execute", "click", execute_swap);

// copy provisioning signature
$(document).delegate("#copy_prov_sig", "click", function() {
  let cp = copy($(".fee_prov_sig .swap_val").html())
    .then(function() {
      alert("Signature copied, but you better make sure!");
    });
});
// copy provisioning signature
$(document).delegate("#copy_prov_sig_b", "click", function() {
  let cp = copy($(".fee_prov_sig_b .swap_val").html())
    .then(function() {
      alert("Signature copied, but you better make sure!");
    });
});
// copy table id
$(document).delegate("#copy_prov_alt", "click", function() {
  let cp = copy($(".fee_prov_alt .swap_val").html())
    .then(function() {
      alert("Table ID copied, but you better make sure!");
    });
});
// copy table id
$(document).delegate(".share_sig .swap_copy", "click", function() {
  let cp = copy($(".share_sig .swap_val").html())
    .then(function() {
      alert("Signature copied, but you better make sure!");
    });
});
// copy mcswap id
$(document).delegate(".share_id .swap_copy", "click", function() {
  let cp = copy($(".share_id .swap_val").html())
    .then(function() {
      alert("McSwap ID copied, but you better make sure!");
    });
});

// copy swap alt signature
$(document).delegate("#copy_fulfil_sig", "click", function() {
  let cp = copy($(".fee_fulfil_sig .swap_val").html())
  .then(function() {
    alert("Signature copied, but you better make sure!");
  });
});
// copy table id
$(document).delegate("#copy_fulfil_alt", "click", function() {
  let cp = copy($(".fee_fulfil_alt .swap_val").html())
  .then(function() {
    alert("Table ID copied, but you better make sure!");
  });
});
// save exec signature
$(document).delegate("#save_exec_sig", "click", function() {
  let cp = copy($(".share_fulfil_sig .swap_val").html())
  .then(function() {
    alert("Signature copied, but you better make sure!");
  });
});

// expand ui image
$(document).delegate(".swap_img_a, .swap_img_b, .fulfil_img_a, .fulfil_img_b", "click", function() {
  let src = $(this).attr("src");
  $("#cover").fadeIn(400);
  setTimeout(() => {
    $("#cover").after('<img class="animate__animated animate__zoomIn" id="fullsize_img" src="' + src + '" />');
    $("#fullsize_img").fadeIn(400);
  }, 400);
});
$(document).delegate("#fullsize_img", "click", function() {
  $("#fullsize_img").removeClass("animate__zoomIn").addClass("animate__rotateOut");
  setTimeout(() => {
    $("#cover").fadeOut(400);
    $("#fullsize_img").remove();
  }, 1000);
});

// view the share id from proposal composer
$(document).delegate(".share_id .swap_val", "click", function() {
  $("#nav_view").click();
  let qlink = $(this).html();
  let pathAr = qlink.split('/swap/');
  if (typeof pathAr[1] != "undefined") {
    let ids = pathAr[1].split("-");
    let quick_link = "/swap/" + ids[0] + "-" + ids[1];
    history.pushState("", "", quick_link);
    swap_viewer();
  }
  $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
});

// reset proposal viewer
async function reset_viewer(error = false) {

  if (error == false) {
    $("#mc_swap_viewer .mc_title").html("Proposal Details");
  } else {
    $("#mc_swap_viewer .mc_title").html(error);
    setTimeout(() => {
      $("#mc_swap_viewer .mc_title").html("Proposal Details");
    }, 3000);
  }
  
  history.pushState("", "", '/');
  $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
  $(".fulfil_img_b").attr("src", "/img/img-placeholder.png");
  $("#fulfil_a_id, #fulfil_a_owner, #fulfil_b_id, #fulfil_b_owner, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request").val("");

}

// swap viewer
async function swap_viewer() {
  
  let pathArray = window.location.pathname.split('/');
  
  if (typeof pathArray[1] != "undefined" && typeof pathArray[2] != "undefined" &&
    pathArray[1] == "propose" &&
    pathArray[1] != "" &&
    pathArray[2] != ""
  ){
    $(".mcprofile_open").click();
    setTimeout(() => {
        if(typeof pathArray[3] != "undefined" && pathArray[3] != ""){
        $("#chooser_"+pathArray[3]).click();
          history.pushState("", "", '/');
        }
        else{
         $("#wallet_connect").click();
        }
      },100);
    $("#create_a_id").val(pathArray[2]);
  }
  else if (typeof pathArray[1] != "undefined" && typeof pathArray[2] != "undefined" &&
    pathArray[1] == "swap" &&
    pathArray[1] != "" &&
    pathArray[2] != ""
  ) {

    $("#mc_swap_viewer .mc_title").html("Fetching Proposal...");
    $(".fee_fulfil_sig .swap_val, .fee_fulfil_alt .swap_val, .share_fulfil_sig .swap_val").html("");
    
    let ids = pathArray[2].split("-");
    $("#fulfil_a_id").val(ids[0]);
    $("#fulfil_b_id").val(ids[1]);
    $("#nav_view").click();
    $(".mcprofile_open").show().click();
    $("#nav_view").click();
    
    provider = wallet_provider();
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PROGRAM_ID);
    const axiosInstance = axios.create({
      baseURL: conf.cluster,
    });
    
    let assetId = $("#fulfil_a_id").val();
    // console.log("assetId ", assetId);
    const getAsset = await axiosInstance.post(conf.cluster, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {
        id: assetId
      },
    });
    // console.log(getAsset);
    
    if(typeof getAsset.data.result == "undefined"){
      reset_viewer();
      return;
    }
    
    let img_a = getAsset.data.result.content.files[0].uri;
    let owner_a = getAsset.data.result.ownership.owner;
    // console.log(img_a);
    // console.log(owner_a);
    $("img.fulfil_img_a").attr("src", img_a);
    //     $("#fulfil_a_owner").val(owner_a);

    let swapAssetId = $("#fulfil_b_id").val();
    // console.log("swapAssetId ", swapAssetId);
    const getswapAsset = await axiosInstance.post(conf.cluster, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {
        id: swapAssetId
      },
    });
    // console.log(getswapAsset);
    let img_b = getswapAsset.data.result.content.files[0].uri;
    let owner_b = getswapAsset.data.result.ownership.owner;
    // console.log(img_b);
    // console.log(owner_b);
    $("img.fulfil_img_b").attr("src", img_b);
    $("#fulfil_b_owner").val(owner_b);

    let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"), new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()], cNFTSwapProgramId);
    // console.log("Swap State PDA: ", swapStatePDA[0].toString());

    let swapState = null;
    await connection.getAccountInfo(swapStatePDA[0])
    .then(function(response) {
      swapState = response;
    })
    .catch(function(error) {
      error = JSON.stringify(error);
      error = JSON.parse(error);
      // console.log("Error: ", error);
      return;
    });

    swapInitializer = null;
    swapLamports = null;
    swapTokens = null;
    swapUSDC = null;
    let splt = null;
    let balance = null;
    let formatted = null;
    let tokens = null;
    
    if (swapState != null) {
      
      const encodedSwapStateData = swapState.data;
      const decodedSwapStateData = SWAP_STATE.decode(encodedSwapStateData);
      // console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
      // console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
      // console.log("swapState - asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.asset_id).toString());
      // console.log("swapState - merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.merkle_tree).toString());
      // console.log("swapState - root: ", new solanaWeb3.PublicKey(decodedSwapStateData.root).toString());
      // console.log("swapState - data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.data_hash).toString());
      // console.log("swapState - creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.creator_hash).toString());
      // console.log("swapState - nonce", new BN(decodedSwapStateData.nonce, 10, "le").toString());
      // console.log("swapState - swap_asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_asset_id).toString());
      // console.log("swapState - swap_merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_merkle_tree).toString());
      // console.log("swapState - swap_root: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_root).toString());
      // console.log("swapState - swap_data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_data_hash).toString());
      // console.log("swapState - swap_creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_creator_hash).toString());
      // console.log("swapState - swap_nonce", new BN(decodedSwapStateData.swap_nonce, 10, "le").toString());
      // console.log("swapState - swap_leaf_owner: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString());
      // console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
      
      // console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
      // console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
      // console.log("swapState - swap_usdc", new BN(decodedSwapStateData.swap_usdc, 10, "le").toString());
      
      swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le").toString();
      swapLamports = parseInt(swapLamports);
      let sol = swapLamports / conf.billion;
      balance = parseFloat(sol).toFixed(9);
      splt = balance.split(".");
      formatted = splt[0].toLocaleString("en-US");
      formatted = formatted + "." + splt[1];
      let total_it = 0.02501000 + sol;
      $("#fulfil_sol_request").val(formatted);
      $(".fulfil_e .fee_total .swap_amt").val(total_it); 
      
      let swap_mint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString();
      let decimals = 0;
      
      if(swap_mint == conf.pikl){decimals = conf.pikl_decimals;}
      if(swap_mint == conf.usdc){decimals = 6;}
      
      let multiplier = 1;
      for (let i = 0; i < decimals; i++) {multiplier = multiplier * 10;}
      
      swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le").toString();
      swapTokens = parseInt(swapTokens);      
      tokens = swapTokens / multiplier;
      balance = parseFloat(tokens).toFixed(decimals);
      splt = balance.split(".");
      formatted = splt[0].toLocaleString("en-US");
      formatted = formatted + "." + splt[1];
      
      if(swap_mint == conf.pikl){
        $("#fulfil_pikl_request").val(formatted);
        $("#fulfil_usdc_request").val("0");
      }
      if(swap_mint == conf.usdc){
        $("#fulfil_usdc_request").val(formatted);
        $("#fulfil_pikl_request").val("0");
      }
      
      // check that the initializer matches the connected wallet and display reversal option
      let initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString();
      $("#fulfil_a_owner").val(initializer);
      
      if (typeof provider != "undefined") {
        if (initializer == provider.publicKey.toString()) {
          $(".fulfil_g").show().addClass("active_swap");
          $("#swap_reverse").prop("disabled", false);
        } else {
          $("#fulfil_g").hide().removeClass("active_swap");
          $("#swap_reverse").prop("disabled", true);
        }
        $("#scroll_wrapper").getNiceScroll().resize();
      } else {
        $(".fulfil_g").hide().removeClass("active_swap");
        $("#swap_reverse").prop("disabled", true);
        $("#scroll_wrapper").getNiceScroll().resize();
      }
      
      // check that the approving party wallet matches and enable approve option if so
      let owner = new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString()
      if (typeof provider != "undefined") {
        if (owner == provider.publicKey.toString()) {
          $(".fulfil_a ").removeClass("active_swap");
          $(".fulfil_d ").addClass("active_swap");
          $("#fulfil_create").prop("disabled", false);
          $("#mc_swap_viewer .mc_title").html("Proposal Ready!");
          setTimeout(() => {
            $("#mc_swap_viewer .mc_title").html("Proposal Details");
          }, 3000);
        } else {
          $("#mc_swap_viewer .mc_title").html("Proposal Details");
        }
      } else {
        $("#mc_swap_viewer .mc_title").html("Proposal Details");
      }
      
    } 
    else {
      reset_viewer("Invalid Proposal");
    }

  } 
  else {
    let hash = window.location.hash;
    if(hash.includes("#connect-")){
     history.pushState("", "", '/');
//      $("#wallet_connect").click();
     setTimeout(() => {
      let walet = hash.replace("#connect-","");
      $("#chooser_"+walet).click();
     },400);
    }
    reset_viewer();
  }
  
}

// swap reverse
$(document).delegate("#swap_reverse", "click", async function() {

  $(this).prop("disabled", true);
  $("#cover").fadeIn(400);
  $("#cover_message").html("Preparing Transaction...");

  provider = wallet_provider();
  let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
  let assetId = $("#fulfil_a_id").val();
  let swapAssetId = $("#fulfil_b_id").val();
  // console.log("assetId ", assetId);
  // console.log("swapAssetId ", swapAssetId);

  let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PROGRAM_ID);

  let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"), new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()], cNFTSwapProgramId);
  // console.log("Swap State PDA: ", swapStatePDA[0].toString());

  let swapState = null;
  await connection.getAccountInfo(swapStatePDA[0])
    .then(function(response) {
      swapState = response;
    })
    .catch(function(error) {
      error = JSON.stringify(error);
      error = JSON.parse(error);
      // console.log("Error: ", error);
      return;
    });

  if (swapState != null) {
    const encodedSwapStateData = swapState.data;
    const decodedSwapStateData = SWAP_STATE.decode(encodedSwapStateData);
    // console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
    // console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
    // console.log("swapState - asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.asset_id).toString());
    // console.log("swapState - merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.merkle_tree).toString());
    // console.log("swapState - root: ", new solanaWeb3.PublicKey(decodedSwapStateData.root).toString());
    // console.log("swapState - data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.data_hash).toString());
    // console.log("swapState - creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.creator_hash).toString());
    // console.log("swapState - nonce", new BN(decodedSwapStateData.nonce, 10, "le").toString());
    // console.log("swapState - swap_asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_asset_id).toString());
    // console.log("swapState - swap_merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_merkle_tree).toString());
    // console.log("swapState - swap_root: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_root).toString());
    // console.log("swapState - swap_data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_data_hash).toString());
    // console.log("swapState - swap_creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_creator_hash).toString());
    // console.log("swapState - swap_nonce", new BN(decodedSwapStateData.swap_nonce, 10, "le").toString());
    // console.log("swapState - swap_leaf_owner: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString());
    // console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
  } else {
    // console.log("Swap Not Initialized");
    return;
  }

  const axiosInstance = axios.create({
    baseURL: conf.cluster,
  });
  
  const getAsset = await axiosInstance.post(conf.cluster, {
    jsonrpc: "2.0",
    method: "getAsset",
    id: "rpd-op-123",
    params: {
      id: assetId
    },
  });
  // console.log("data_hash ", getAsset.data.result.compression.data_hash);
  // console.log("creator_hash ", getAsset.data.result.compression.creator_hash);
  // console.log("leaf_id ", getAsset.data.result.compression.leaf_id);

  const getAssetProof = await axiosInstance.post(conf.cluster, {
    jsonrpc: "2.0",
    method: "getAssetProof",
    id: "rpd-op-123",
    params: {
      id: assetId
    },
  });
  // console.log("tree_id ", getAssetProof.data.result.tree_id);
  // console.log("node_index ", getAssetProof.data.result.node_index);
  // console.log("proof ", getAssetProof.data.result.proof);
  // console.log("root ", getAssetProof.data.result.root);

  const treeAccount = await splAccountComp.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,
    new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id), );
  const treeAuthorityPDA = treeAccount.getAuthority();
  const canopyDepth = treeAccount.getCanopyDepth();
  // console.log("treeAuthorityPDA ", treeAuthorityPDA.toString());
  // console.log("canopyDepth ", canopyDepth);

  // parse the list of proof addresses into a valid AccountMeta[]
  const proof = getAssetProof.data.result.proof.slice(0, getAssetProof.data.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
    .map((node) => ({
      pubkey: new solanaWeb3.PublicKey(node),
      isWritable: false,
      isSigner: false,
    }));
  // console.log("proof ", proof);

  let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")], cNFTSwapProgramId);
  // console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

  var totalSize = 1 + 32 + 32 + 1;
  // console.log("totalSize", totalSize);

  var uarray = new Uint8Array(totalSize);
  let counter = 0;
  uarray[counter++] = 2;

  let arr = false;

  let assetIdb58 = bs58.decode(assetId);
  arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
  for (let i = 0; i < arr.length; i++) {
    uarray[counter++] = arr[i];
  }

  let swapAssetIdb58 = bs58.decode(swapAssetId);
  arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
  for (let i = 0; i < arr.length; i++) {
    uarray[counter++] = arr[i];
  }

  uarray[counter++] = proof.length;

  // console.log("Contract Data: ", uarray);

  let keys = [{
      pubkey: provider.publicKey,
      isSigner: true,
      isWritable: true
    }, // 0
    {
      pubkey: swapVaultPDA[0],
      isSigner: false,
      isWritable: true
    }, // 1
    {
      pubkey: swapStatePDA[0],
      isSigner: false,
      isWritable: true
    }, // 2
    {
      pubkey: treeAuthorityPDA,
      isSigner: false,
      isWritable: false
    }, // 3
    {
      pubkey: new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),
      isSigner: false,
      isWritable: true
    }, // 4
    {
      pubkey: mplBubble.PROGRAM_ID,
      isSigner: false,
      isWritable: false
    }, // 5
    {
      pubkey: splAccountComp.PROGRAM_ID,
      isSigner: false,
      isWritable: false
    }, // 6
    {
      pubkey: splAccountComp.SPL_NOOP_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    }, // 7
    {
      pubkey: solanaWeb3.SystemProgram.programId,
      isSigner: false,
      isWritable: false
    }, // 8
  ];
  for (let i = 0; i < proof.length; i++) {
    keys.push(proof[i]);
  }
  // console.log("keys ", keys);

  const reverseSwapIx = new solanaWeb3.TransactionInstruction({
    programId: cNFTSwapProgramId,
    data: Buffer.from(uarray),
    keys: keys,
  });
  // console.log("Reverse Swap Ix: ", reverseSwapIx);

  let tx = new solanaWeb3.Transaction();
  tx.add(reverseSwapIx);
  tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
  tx.feePayer = provider.publicKey;
  // console.log("Start Tx");
  $("#cover_message").html("Requesting Approval...");

  try {

    let signedTransaction = await provider.signTransaction(tx);
    // console.log("Tx: ", tx);
    const serializedTransaction = signedTransaction.serialize();
    $("#cover_message").html("Confirming...");
    const signature = await connection.sendRawTransaction(serializedTransaction, {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    }, );
    // console.log("Signature: ", signature);
    // console.log(`https://solscan.io/tx/${signature}`);

    $("#cover_message").html("Finalizing...");
    const reverseID = setInterval(async function() {
      let tx_status = await connection.getSignatureStatuses([signature], {
        searchTransactionHistory: true,
      });
      if (tx_status.value[0].confirmationStatus == undefined) {
        // console.log("Bad Status...");
      } else if (tx_status.value[0].confirmationStatus == "finalized") {
        clearInterval(reverseID);
        history.pushState("", "", '/');
        $(".fulfil_g").removeClass("active_swap").hide();
        setTimeout(() => {
          $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
          swap_viewer();
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
          $("#wallet_refresh").click();
        }, 3000);
      }
    }, 3000);

  } catch (error) {
    swap_viewer();
    $("#cover").fadeOut(400);
    $("#cover_message").html("");
  }

});

// after the dom is ready
$(window).on('load', function() {
  $("#social_discord").parent().html(social_1);
  $("#social_twitter").parent().html(social_2);
  $("#social_discord, #social_twitter").hide().fadeIn(400);
  $(".first").html("Flipn &amp; Dipn");
  $(".second, .third, .fourth, .fifth, .sixth, .nav").fadeIn(400);
  $("#scroll_wrapper").niceScroll({
      cursorcolor: "#000",
      cursoropacitymin: 1,
      cursoropacitymax: 1,
      cursorwidth: "7px",
      cursorborder: 0,
      cursorborderradius: "7px",
      zindex: 2,
      autohidemode: false,
      bouncescroll: false,
      horizrailenabled: false,
      railpadding: {
        top: 1,
        right: 2,
        left: 0,
        bottom: 1
      },
      railalign: "right"
    });
  const get_mcswap_balances = setInterval(function() {
    mcswap_balances();
  }, 20000);
  $("#wallet_view").hide().show().addClass("animate__animated animate__fadeIn");
  $("#donate_sol, button.mcprofile_open").fadeIn(400);
  $("#mcprofile_nav ul li").addClass("noshop");
  setTimeout(() => {swap_viewer();},400);  
  //////////////////////////////////////////////////////////////////////////
  $("#wallet_tool").html(conf.wallet_name);
  $(".custom_symbol").html(conf.pikl_symbol);
  $("#mc_swap_shop .mc_title").html(conf.shop_name);
  $("#mcprofile_nav ul li").first().find("button").click();
  $(".pikl_icon").attr("src",conf.pikl_image);
  $("#wallet_box").css({"background-image":"url("+conf.logo_wallet+")"});
  $("#center_logo").attr("src",conf.logo);
  $("#set_discord").attr("href",conf.discord);
  $("#set_twitter").attr("href",conf.twitter);
  $("#img_icon, #img_b, #img_c").attr("href",conf.logo_icon);
  $("#img_a").attr("content",conf.logo_icon);
  $("#meta_desc, #og_desc").attr("content",conf.desc);
  $("#og_title").attr("content",conf.title);
  $("#og_url").attr("content",conf.host);
  $("title").html(conf.title);
  $("#donat_to").html(conf.wallet_name);
  $("#donat_address").html(conf.sol);
  ////////////////////////////////////////////////////////////////////////// 
});
