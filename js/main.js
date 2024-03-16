$(window).on('load', async function() {
  
  var spl_tokens = [];
  var combos_ = [];
  // load token list
  let get_spl_tokens = fetch(conf.host + "/config/tokens.json?r=" + Math.random())
    .then((response) => response.json()).then((resp) => {
      return resp;
    });
  // load combos
  let _combos_ = fetch(conf.host + "/config/combos.json?r=" + Math.random())
    .then((response) => response.json()).then((resp) => {
      return resp;
    });
  spl_tokens = await get_spl_tokens;
  combos_ = await _combos_;

  conf.version = 1.7;
  conf.provider = false;
  conf.txfee = 30000; // dev note: this needs to be dynamic
  conf.billion = 1000000000;
  conf.usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  conf.vault = "HieZydxjXUxTJRRvj4ovNPWzTKgxcGo1jLsPdXCiith2";
  conf.system_alt = "6rztYc8onxK3FUku97XJrzvdZHqWavwx5xw8fB7QufCA";
  conf.treasury = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu";
  conf.treasury_studio_cnft = "2Gs1H87sQDmHS91iXaVQnhdWTGzsgo2vypAwdDRJTLqX";
  conf.treasury_studio_nft = "7aMrZsEeah19YUJ1yVzQSooBYz76qfYi8k24ar2YFWgT";
  conf.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
  conf.BUBBLEGUM_PROGRAM_ID = "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY";
  conf.MCSWAP_CNFT_PROGRAM = "6RUcK9T1hYAZGBxN82ERVDUi4vLAX4hN1zAyy3cU5jav";
  conf.MCSWAP_NFT_PROGRAM = "AyJBbGQzUQSvhivZnHMDCCk6eSLupkeBh4fvMAD8T4Xx";
  conf.MCSWAP_SPL_PROGRAM = "AAyM7XH9w7ApeSuEat8AwUW1AA7dBuj2vXv7SuUGpNUp";
  conf.spl_alt = "DnDkh579fNnBFUwLDeQWgfW6ukLMyt8DgLaVDVwecxmj";
  conf.logo = conf.host + "/img/logo-300.png"; // set centered logo image
  conf.logo_wallet = conf.host + "/img/logo-300-dim.png"; // set wallet background
  conf.logo_icon = conf.host + "/img/favicon.png"; // set icon image
  conf.max_proofs = 30; // max combined proofs for cnft swaps
  conf.sell_nft = "https://www.tensor.trade/item/"; // set path to your preferred nft explorer 
  conf.sell_cnft = "https://www.tensor.trade/item/"; // set sell link for cnfts
  conf.tool = "mcwallet";
  conf.idler = conf.idler + 1;

  const BufferLayout = require("@solana/buffer-layout");
  const BN = require("bn.js");
  const splToken = require("@solana/spl-token");
  const Metadata_ = require("@metaplex-foundation/mpl-token-metadata");
  const Metadata = Metadata_.Metadata;
  const publicKey = (property = "publicKey") => {
    return BufferLayout.blob(32, property);
  }
  const uint64 = (property = "uint64") => {
    return BufferLayout.blob(8, property);
  }
  const SWAP_CNFT_STATE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("utime"),
    BufferLayout.u8("is_swap"), 
    publicKey("initializer"),
    publicKey("delegate"),
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
    publicKey("swap_delegate"),
    uint64("swap_lamports"),
    publicKey("swap_token_mint"),
    uint64("swap_tokens"),
  ]);
  const PROGRAM_STATE_CNFT = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("fee_lamports"),
    BufferLayout.u8("dev_percentage"),
    publicKey("dev_treasury"),
    publicKey("mcdegens_treasury"),
  ]);
  const SWAP_NFT_STATE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    BufferLayout.u8("is_swap"),
    publicKey("initializer"),
    publicKey("initializer_mint"),
    publicKey("temp_mint_account"),
    publicKey("taker"),
    publicKey("swap_mint"),
    uint64("swap_lamports"),
    publicKey("swap_token_mint"),
    uint64("swap_tokens"),
  ]);
  const SWAP_SPL_STATE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("utime"),
    publicKey("initializer"),
    publicKey("token1_mint"),
    uint64("token1_amount"),
    publicKey("temp_token1_account"),
    publicKey("token2_mint"),
    uint64("token2_amount"),
    publicKey("temp_token2_account"),
    publicKey("taker"),
    publicKey("token3_mint"),
    uint64("token3_amount"),
    publicKey("token4_mint"),
    uint64("token4_amount"),
  ]);
  const PROGRAM_STATE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    publicKey("pickle_mint"),
    uint64("fee_chips"),
    BufferLayout.u8("dev_percentage"),
    publicKey("dev_treasury"),
    publicKey("mcdegens_treasury"),
  ]);
  
  let social_1 = new Image();
  let social_2 = new Image();
  let social_3 = new Image();
  social_1.src = "/img/discord.png";
  social_2.src = "/img/github.png";
  social_3.src = "/img/twitter.png";
  social_1.id = "social_discord";
  social_2.id = "social_github";
  social_3.id = "social_twitter";

  let selected = false;
  let initializeSwapIx = false;
  let initializedSwapIx = false;
  let createTempFeeAccountIx = false;
  let createTempTokenAccountIx = false;
  let createTempTokenAccountIxSaved = false;
  let initTempTokenAccountIx = false;
  let lookupTableAccount = false;
  let lookupTableAccountSaved = false;
  let tempFeeAccountSaved = false;
  let createTokenATAIx = false;
  let createTokenATA = false;
  let createTokenATASaved = false;
  let changeTokenAuthorityIx = false;
  let lookupTableAddress = false;
  let lookupTableAddressSaved = false;
  let swapTokens = false;
  let swapUSDC = false;
  let transferTokenIx = false;
  let swapcNFTsIx = false;
  let createALTIx = false;
  let tempFeeAccount = false;
  let tempTokenAccount = false;
  let swapInitializer = false;
  let initializerTokenATA = false;
  let providerTokenATA = false;
  let swapTreeAuthorityPDA = false;
  let usdcMint = false;
  let swapTokenMint = false;
  let swapLamports = false;
  let extendALTIx = false;
  var provider;
  let idleTime = 0;
  let idleInterval = false;
  
  // verifies finalized status of signature
  async function finalized(sig,max=30,int=4000){
    return await new Promise(resolve => {
      let start = 1;
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let intervalID = setInterval(async()=>{
        let tx_status = await connection.getSignatureStatuses([sig], {searchTransactionHistory: true,});
        
        console.log(start);
        console.log(sig);
        console.log(tx_status.value);
        
        if(start > 9 && tx_status.value[0] == null){
          resolve('Oh No! Transaction Dropped!');
          clearInterval(intervalID);
        }
        
        if (typeof tx_status == "undefined" || 
        typeof tx_status.value == "undefined" || 
        tx_status.value == null || 
        tx_status.value[0] == null || 
        typeof tx_status.value[0] == "undefined" || 
        typeof tx_status.value[0].confirmationStatus == "undefined"){} 
        else if(tx_status.value[0].confirmationStatus == "processed"){
          start = 1;
        }
        else if (tx_status.value[0].confirmationStatus == "finalized"){
          resolve('finalized');
          clearInterval(intervalID);
        }
        start++;
        if(start==max){
          resolve(max+' max retrys reached');
          clearInterval(intervalID);
        }
      },int);
    });  
  }
  
  // notifications
  function notify(title, body, icon) {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      //     alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      let notification = new Notification(title, {
        body: body,
        icon: icon
      });
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          let notification = new Notification(title, {
            body: body,
            icon: icon
          });
        }
      });
    }
  }
  
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

  // returns the number of proofs required for a cNFT asset
  async function required_proofs(id) {
    if (id.length < 32) {
      return;
    }
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let axiosInstance = axios.create({
      baseURL: conf.cluster
    });
    let response = await axiosInstance.post(conf.cluster, {
      jsonrpc: "2.0",
      method: "getAssetProof",
      id: "rpd-op-123",
      params: {
        id: id
      },
    });
    if(typeof response.data.result.tree_id == "undefined"){
      let axiosInstance = axios.create({
        baseURL: conf.cluster
      });
      let response = await axiosInstance.post(conf.cluster, {
        jsonrpc: "2.0",
        method: "getAssetProof",
        id: "rpd-op-123",
        params: {
          id: id
        },
      });
    }
    if(typeof response.data.result.tree_id == "undefined"){
      return false;
    }
    else{
      let ck_treeId = response.data.result.tree_id;
      let ck_Proof = response.data.result.proof;
      let ck_Root = response.data.result.root;
      let ck_treeIdPubKey = new solanaWeb3.PublicKey(ck_treeId);
      let treeAccount = await splAccountCompression_.ConcurrentMerkleTreeAccount.fromAccountAddress(connection, ck_treeIdPubKey, );
      let treeAuthority = treeAccount.getAuthority();
      return (response.data.result.proof.length - treeAccount.getCanopyDepth());
    }
  }
  
  // wallet providers
  const wallet_provider = () => {
    const isBackpackInstalled = window.backpack && window.backpack.isBackpack;
    const isSolflareInstalled = window.solflare && window.solflare.isSolflare;
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    if (isBackpackInstalled && conf.provider == "backpack") {
      return window.backpack;
    } else if (isSolflareInstalled && conf.provider == "solflare") {
      return window.solflare;
    } else if (isPhantomInstalled && conf.provider == "phantom") {
      return window.solana;
    }
  }
  
  // estimate priority fee
  async function estimate_priority(){
  provider = wallet_provider();
    if (typeof provider.isConnected != "undefined" && provider.isConnected === true) {
      let axiosInstance = axios.create({baseURL: conf.cluster});
      let prior = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getRecentPrioritizationFees",id: "rpd-op-123",params: [[provider.publicKey.toString()]],});
      let fees = prior.data.result;
      fees.sort((a, b) => b.slot - a.slot);
      let totel = 0;
      let counter = 0;
      for (var i = 0; i < fees.length; i++) {
        let item = fees[i];
        if(item.prioritizationFee > 0){
          counter++;
          totel = (totel + item.prioritizationFee);
        }
      }
      let avg = parseInt(totel/counter);
      avg = (avg * 2);
      if(avg < conf.priority){
        avg = conf.priority;
      }
      return avg;
    }
  }
    
  // reset proposal viewer
  async function reset_viewer(error = false) {
    if (error == false) {
      $("#mc_swap_viewer .mc_title").html("Contract Details");
    } else {
      $("#mc_swap_viewer .mc_title").html(error);
      setTimeout(() => {
        $("#mc_swap_viewer .mc_title").html("Contract Details");
      }, 3000);
    }
    
    history.pushState("", "", '/');
    $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
    $("#spl_img_5, #spl_img_6, #spl_img_7, #spl_img_8").attr("src", "/img/default_token.png").addClass("spl_default");
    $("#spl_owner_a, #spl_owner_b, #fulfil_a_id, #fulfil_a_owner, #fulfil_b_id, #fulfil_b_owner, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request").val("");
    $("#spl_choice_5, #spl_choice_6, #spl_choice_7, #spl_choice_8").html("•••");
    $("#spl_field_5, #spl_field_6, #spl_field_7, #spl_field_8").val("");
    $("#c_type, #d_type").val("");
    $(".swap_spl_h, .proofs_view").hide();
    $(".swap_spl_e, .swap_spl_f").removeClass("active_spl");
    $("#spl_execute").prop("disabled", true);
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
        let app_link = "https://solflare.com/ul/v1/browse/" + encodeURIComponent("https://" + window.location.hostname + window.location.pathname + "#connect-solflare") + "?ref=" + encodeURIComponent("https://" + window.location.hostname);
        $("#wallet_connect").prop("disabled", false);
        $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
        link = document.getElementById('gogo_deep');
        link.click();
        $("a#gogo_deep").remove();
        $("#chooser_cancel").click();
        $(".sol_balance").html("Connect");
      } else if (conf.provider == "phantom") {
        let app_link = "https://phantom.app/ul/browse/" + encodeURIComponent("https://" + window.location.hostname + window.location.pathname + "#connect-phantom") + "?ref=" + encodeURIComponent("https://" + window.location.hostname);
        $("#wallet_connect").prop("disabled", false);
        $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
        link = document.getElementById('gogo_deep');
        link.click();
        $("a#gogo_deep").remove();
        $("#chooser_cancel").click();
        $(".sol_balance").html("Connect");
      } else {
        $(".sol_balance").html("Connect");
        return;
      }
      /////////////////////////////////////////////////
    } else {
      if (provider.isConnected === false) {
        $("#spl_choice_1").prop("disabled", true);
        $("#cover, #wallet_chooser").fadeOut(400);
        await provider.connect()
          .then(function() {
            if (provider.isConnected !== true) {
              $(".sol_balance").addClass("connect_me").html("Connect");
              $("#wallet_connect").prop("disabled", false);
              $("#wallet_disconnect").hide().css({
                "display": "none"
              });
            } else {
              $("#smart_scroll").append('<div class="smart_loader"></div>');
              $("#spl_choice_1").prop("disabled", false);
              $(".swap_spl_a").addClass("active_spl");
              $("#wallet_connect").prop("disabled", false).hide();
              $("#wallet_disconnect").show().css({
                "display": "block"
              });
              if (conf.default == "cnft") {
                $("#wallet_cnfts").prop("disabled", false).click();
              } else if (conf.default == "nft") {
                $("#wallet_nfts").prop("disabled", false).click();
              }
              $("#nav_compose, #nav_view, .mode_switch").prop("disabled", false);
              $(".sent_received").hide();
              $(".smart_tool_title").removeClass("smart_active");
              $("#smart_tool_received").addClass("smart_active");
              $("#smart_scroll, #smart_tool_mode, .smart_tool_title, #spl_received, #smart_bottom").show();
            }
            provider.on('accountChanged', (publicKey) => {
              $("#wallet_disconnect").click();
            });
            swap_viewer();
            syncProposals();
          })
          .catch(function(err) {
            $(".sol_balance").addClass("connect_me").html("Connect");
            $("#wallet_connect").prop("disabled", false);
            $("#wallet_disconnect").hide().css({
              "display": "none"
            });
            swap_viewer();
          });
      } else if (provider.isConnected === true) {
        $("#cover, #wallet_chooser").fadeOut(400);
        $("#smart_scroll").append('<div class="smart_loader"></div>');
        $("#spl_choice_1").prop("disabled", false);
        $(".swap_spl_a").addClass("active_spl");
        $("#wallet_connect").prop("disabled", false).hide();
        $("#wallet_disconnect").show().css({
          "display": "block"
        });
        $("#wallet_cnfts").prop("disabled", false).click();
        $("#nav_compose, #nav_view, .mode_switch").prop("disabled", false);
        $(".sent_received").hide();
        $(".smart_tool_title").removeClass("smart_active");
        $("#smart_tool_received").addClass("smart_active");
        $("#smart_scroll, #smart_tool_mode, .smart_tool_title, #spl_received, #smart_bottom").show();
        provider.on('accountChanged', (publicKey) => {
          $("#wallet_disconnect").click();
        });
        swap_viewer();
        syncProposals();
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
    if (!provider) {
      //     console.log("no provider");
      return;
    }
    provider.disconnect();
    conf.provider = false;
    //   $("#mcprofile_nav ul li").first().find("button").click();
    $("#nft_donation_close").click();
    $("#smart_scroll, #smart_tool_mode, .smart_tool_title, #spl_received, #smart_bottom").hide();
    $(".asset").remove();
    $("#wallet_connect").show();
    $("#wallet_disconnect").hide().css({
      "display": "none"
    });
    $("#wallet_nfts, #wallet_cnfts").prop("disabled", true).removeClass("active_view");
    $("#wallet_nfts span, #wallet_cnfts span").html("(0)");
    $(".sol_balance").addClass("connect_me").html("Connect");
    $("#fulfil_create").prop("disabled", true);
    $(".fulfil_g").hide();
    $(".swap_img_a, .swap_img_b").attr("src", "/img/img-placeholder.png");
    $("#a_type, #b_type").val("");
    $("#create_a_id, #create_b_id, #create_a_owner, #create_b_owner").val("");
    $("#sol_request, #pikl_request, #usdc_request").val("");
    $("#fetch_b").click();
    $(".active_swap").removeClass("active_swap");
    $(".swap_a").addClass("active_swap");
    $("#token_sol, #token_pikl, #token_usdc").attr("src", "/img/check_default.png");
    $("#proofs_a, #proofs_b, #proofs_c, #proofs_d").hide();
    $("#create_b_id, #fetch_b, #fetch_c, #create_b_owner").prop("disabled", true);
    $("#spl_choice_1, #swap_execute").prop("disabled", true);
    $("#spl_owner").removeAttr("style");
    $(".fulfil_d, .fulfil_e").removeClass("active_swap");
    $("#spl_clear").click();
    $(".swap_spl_a").removeClass("active_spl");
    $("#spl_sent").html("");
    $("#review_receive_total, #review_send_total").html("");
    history.pushState("", "", "/");
    setTimeout(() => {
      $(".pikl_balance, .usdc_balance").html("");
      $("#wallet_list").getNiceScroll().resize();
      swap_viewer();
    }, 1000);
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
    } else if (conf.tool == "donate_sol") {
      provider = await wallet_provider();
      if (typeof provider == "undefined") {
        /////////////////////////////////////////////////
        if (conf.provider == "solflare") {
          let app_link = "https://solflare.com/ul/v1/browse/" + encodeURIComponent("https://" + window.location.hostname + window.location.pathname + "#connect-solflare") + "?ref=" + encodeURIComponent("https://" + window.location.hostname);
          $("#wallet_connect").prop("disabled", false);
          $("#cover").html('<a id="gogo_deep" href="' + app_link + '">test</a>');
          link = document.getElementById('gogo_deep');
          link.click();
          $("a#gogo_deep").remove();
          $("#chooser_cancel").click();
        } else if (conf.provider == "phantom") {
          let app_link = "https://phantom.app/ul/browse/" + encodeURIComponent("https://" + window.location.hostname + window.location.pathname + "#connect-phantom") + "?ref=" + encodeURIComponent("https://" + window.location.hostname);
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
              $(".swap_spl_a").addClass("active_spl");
              $("#spl_choice_1").prop("disabled", false);
              $("#wallet_connect").hide();
              $("#wallet_disconnect").show().css({
                "display": "block"
              });
              $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
              $("#wallet_chooser").hide();
              $("#cover_message").html("");
              $("#donation_box").show().addClass("animate__animated animate__zoomInDown");
              $("#donation_amount").focus();
              if (conf.default == "cnft") {
                $("#wallet_cnfts").click();
              } else if (conf.default == "nft") {
                $("#wallet_nfts").click();
              }
              conf.tool = "mcwallet";
            } else {
              $("#spl_choice_1").prop("disabled", true);
            }
          })
          .catch(function(err) {
            $("#cover_message").html("");
            //       console.log(err.message);
            conf.tool = "mcwallet";
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
  function add_commas(x) {
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
          let formatted = add_commas(ui_split[0]);
          formatted = formatted + "." + ui_split[1];
          $(".sol_balance").removeClass("connect_me").html(formatted);
        }).catch(function(){
          console.log("Failed getting USDC balance.");
        });

      let accountPublicKey;
      let mintAccount;
      let resp;

      // get spl token balance
      accountPublicKey = new solanaWeb3.PublicKey(provider.publicKey.toString());
      let get_token = $("#top_token_choice").attr("data-id");

      mintAccount = new solanaWeb3.PublicKey(get_token);
      await connection.getTokenAccountsByOwner(accountPublicKey, {mint: mintAccount}).
      then(async function(resp){
        let decimals = 9;
        for (let i = 0; i < spl_tokens.length; i++) {
          let item = spl_tokens[i];
          if(item.address == get_token){
            decimals = item.decimals;
          }
        }
        let multiplier = 1;
        let display_decimals = "";
        for (let i = 0; i < decimals; i++) {
          multiplier = multiplier * 10;
          display_decimals += "0";
        }
        if (resp.value.length === 0) {
          $(".pikl_balance").html("0."+display_decimals);
        } 
        else {
          let token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
          await connection.getTokenAccountBalance(token_acct).
          then(function(resps){
            let amount = resps.value.amount;
            amount = amount / multiplier;
            amount = parseFloat(amount).toFixed(decimals);
            let ui_split = amount.split(".");
            let formatted = add_commas(ui_split[0]);
            formatted = formatted + "." + ui_split[1];
            $(".pikl_balance").html(formatted);        
          }).catch(function(){});
        }      
      }).catch(function(){});

      // get usdc token balance
      accountPublicKey = new solanaWeb3.PublicKey(provider.publicKey.toString());
      mintAccount = new solanaWeb3.PublicKey(conf.usdc);
      await connection.getTokenAccountsByOwner(accountPublicKey, {mint: mintAccount}).
      then(async function(resp){
      if (resp.value.length === 0) {
        $(".usdc_balance").html("0.000000");
      } 
      else {
        let token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
        await connection.getTokenAccountBalance(token_acct).then(function(resps){
          let amount = resps.value.amount;
          amount = amount / 1000000;
          amount = parseFloat(amount).toFixed(6);
          let ui_split = amount.split(".");
          let formatted = add_commas(ui_split[0]);
          formatted = formatted + "." + ui_split[1];
          $(".usdc_balance").html(formatted);
        }).catch(function(){});
      }
      }).
      catch(function(){});

    }
  }

  // wallet
  async function get_pda(mint) {
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
          $("#wallet_list").getNiceScroll().resize();
          if ($("ul[data-type='nft']:visible").length > 0) {
            $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
          }
          if ($("ul[data-type='cnft']:visible").length > 0) {
            $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
          }
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
  $(document).delegate("#requests_open", "click", async function() {
    $(this).stop().animate({
        right: "-=50"
      }, 600,
      function() {
        $("#requests_box").stop().animate({
            right: "35px"
          }, 600,
          function() {
            $("#requests_close").fadeIn(600);
          });
      });
  });
  $(document).delegate("#requests_close", "click", async function() {
    $(this).hide();
    $("#requests_box").stop().animate({
        right: "-350px"
      }, 600,
      function() {
        $("#requests_open").stop().animate({
          right: "8px"
        }, 600);
      });
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
    provider = wallet_provider();
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
        let transferTx = solanaWeb3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          lamports: lamps,
          toPubkey: to,
        });
        let tx = new solanaWeb3.Transaction();
        let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
        tx.add(computePriceIx, transferTx);
        tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
        tx.feePayer = provider.publicKey;
        try {
          let signedTransaction = await provider.signTransaction(tx);
          let serializedTransaction = signedTransaction.serialize();
          let signature = await connection.sendRawTransaction(serializedTransaction,{skipPreflight:false,preflightCommitment:'confirmed'},);
          $("#cover_message").html("Finalizing Donation...");
          let final = await finalized(signature,30,4000);
          if(final != "finalized"){
            $("#cover_message").html("Sorry, Transaction Error!");
            setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#donation_box").show();},3000);
            return;
          }
          $("#cover_message").html("");
          $("#donation_box").after('<div id="donation_thanks">We appreciate your donation!</div><div id="donation_sig"><a href="https://solscan.io/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
        } 
        catch (error) {
          $("#cover_message").html("Sorry, Transaction Error!");
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#donation_box").show();},3000);          
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error Logs: ", error);
        }
      }
    }        
    $("#spl_deploy, .spl_choice, .spl_field, #spl_owner").prop("disabled", false);
    $(".swap_spl_a, .swap_spl_b").addClass("active_spl");
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
    let donate_yes = confirm("Do you want to donate SOL to " + conf.wallet_name + "?");
    if (donate_yes) {
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
  
  async function getAssetsByOwner(cluster,owner,limit,page) {
  let axiosInstance = axios.create({baseURL: cluster,});
  let assets = await axiosInstance.post(cluster, {
    jsonrpc: "2.0",
    method: "getAssetsByOwner",
    id: "rpd-op-123",
    params: {
      ownerAddress: owner,
      page: page,
      limit: limit
    },
  });
  return assets;
  }
  
  async function validateWallet(string){
    let response = false;
    let regex = /^[A-HJ-NP-Za-km-z1-9]*$/; // the "global" flag is set
    let isBase58 = regex.test(string);
    if(isBase58===true && string.length >= 32 && string.length <= 44){
      let pKey = new solanaWeb3.PublicKey(string);
      try{
        response = await solanaWeb3.PublicKey.isOnCurve(pKey);
      }
      catch(err){}
    }
    return response;
  }

  // nfts
  $(document).delegate("#wallet_nfts", "click", async function() {
  $("#wallet_refresh").addClass("refresh_rotate").prop("disabled", true);
  $(".wallet_filter, .wallet_rarity").hide();
  var nfts = [];
  var nmints = [];
  $(".loader").show();
  $("#wallet_nfts, #wallet_cnfts").removeClass("active_view");
  $(this).addClass("active_view");
  $("#view_cnfts").removeClass().addClass("wallet_views animate__animated animate__fadeOutRight");
  setTimeout(() => {
    $("#view_cnfts").hide();
    $("#view_nfts").removeClass().addClass("wallet_views animate__animated animate__fadeInLeft").show();
  }, 800);
  
  if ($("ul[data-type='nft']").length == 0) {
    
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    provider = wallet_provider();
    if (typeof provider == "undefined" || provider.isConnected != true) {
      $(".loader").hide();
      return;
    }
    let owner = provider.publicKey;
    let owner_b58 = provider.publicKey.toString();
    
    let assets = {};
    assets.total = 0;
    assets.items = [];
    // get all the nfts in the wallet (3000 max)
    let assets_a = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,1);
    assets_a = assets_a.data.result;
    assets.total = assets.total + assets_a.total;
    assets.items = [...assets.items, ...assets_a.items];
    if(assets_a.total == conf.nft_limit){
      let assets_b = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,2);
      assets_b = assets_b.data.result;
        assets.total = assets.total + assets_b.total;
        assets.items = [...assets.items, ...assets_b.items];
        if(assets_b.total == conf.nft_limit){
          let assets_c = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,3);
          assets_c = assets_c.data.result;
          assets.total = (assets.total + assets_c.total);
          assets.items = [...assets.items, ...assets_c.items];            
       }        
    }
    
    // filter for nfts and built nfts data array
    for (let i = 0; i < assets.items.length; i++) {
      let ass = assets.items[i];
      ass.pnft = false;
      if(ass.interface == "ProgrammableNFT"){ass.pnft=true;}
      let blacklist = false;
      if(typeof ass.grouping != "undefined" && typeof ass.grouping[0] != "undefined"){
        if(conf.blacklist.includes(ass.grouping[0].group_value)){
          blacklist = true;
        }
      }
      if (blacklist == false && ass.burnt != true && ass.compression.compressed == false) {
        if (
          typeof ass.content !== undefined &&
          typeof ass.content.files !== undefined &&
          typeof ass.content.files[0] !== undefined &&
          ass.hasOwnProperty('content') &&
          ass.content.hasOwnProperty('files') &&
          typeof ass.content.files[0] == "object" &&
          ass.content.files[0].hasOwnProperty('uri') && 
          typeof ass.grouping[0] != "undefined"
        ) {
          let rebuild = {};
          rebuild.mint = ass.id;
          rebuild.image = ass.content.files[0].uri;
          rebuild.name = ass.content.metadata.name;
          rebuild.attributes = ass.content.metadata.attributes;
          rebuild.combos = [];
          rebuild.collection_key = ass.grouping[0].group_value;
          rebuild.sort = 0;
          rebuild.collection = "Unknown";
          rebuild.publisher = false;
          rebuild.pnft = ass.pnft;
          if (nmints.filter(e => e.collection_key === ass.grouping[0].group_value).length == 0) {
            let obj = {}
            obj.collection_key = ass.grouping[0].group_value;
            obj.name = false;
            obj.symbol = false;
            obj.uri = false;
            nmints.push(obj);
          }
          nfts.push(rebuild);
        }
      }
    }
 
    for (let i = 0; i < nmints.length; i++) {
      let item = nmints[i];
      let res = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(await get_pda(item.collection_key))).catch(function() {});
      if (res != undefined) {
        nmints[i].name = res.data.name.replace(/\0/g, '');
        nmints[i].symbol = res.data.symbol.replace(/\0/g, '');
        nmints[i].uri = res.data.uri.replace(/\0/g, '');
      }
      for (let c = 0; c < nfts.length; c++) {
        let nft = nfts[c];
        if (typeof nft != "undefined" && nft.collection_key === item.collection_key) {
          let name = nft.name;
          let sorter = name.split("#");
          if (typeof sorter[1] != "undefined") {
            nft.sort = parseInt(sorter[1].trim());
          }
          nfts[c].collection = item;
        }
      }
    }
    
    // sort by collection
    let nft_final = [];
    let nft_groups = [];
    for (let i = 0; i < nfts.length; i++) {
      let _i = i - 1;
      if (nfts[i].collection.name === false) {
        nfts[i].collection.name = "Unknown";
      }
      if (typeof nft_groups[nfts[i].collection.name] == "undefined") {
        nft_groups[nfts[i].collection.name] = [];
      }
      let collect = nfts[i].collection.name;
      let grouping = nft_groups[collect];
      grouping.push(nfts[i]);
      nft_groups[collect] = grouping;
    }
    // group by collection, sort sub arrays, and rebuild cnfts array
    let grouped = Object.keys(nft_groups).sort().reduce((obj, key) => {
      obj[key] = nft_groups[key];
      return obj;
    }, {});
    for (const [key, values] of Object.entries(grouped)) {
      values.sort(function(a, b) {
        if (a.sort > b.sort) return 1;
        if (a.sort < b.sort) return -1;
        return 0;
      });
      nft_final.push.apply(nft_final, values);
    }
    nfts = nft_final;

    // display cnfts
    for (let i = 0; i < nfts.length; i++) {
      let ass = nfts[i];
      if (!$("ul[data-id='" + ass.mint + "']").length) {
        let item = '<ul data-id="' + ass.mint + '" data-type="nft" class="asset">';
        item += '<li class="ass_name">' + ass.name + '</li>';
        if (typeof ass.collection === 'undefined') {
          ass.collection = {};
          ass.collection.name = "Unknown";
        }      
        item += '<li class="ass_collection">' + ass.collection.name + '</li>';
        item += '<li class="ass_options"><button class="ass_meta">Meta</button><button disabled class="ass_donate">Transfer</button><button disabled data-wallet="' + provider.publicKey.toString() + '" data-mint="' + ass.mint + '" class="ass_sell">Sell</button><button disabled data-wallet="' + provider.publicKey.toString() + '" data-pnft="' + ass.pnft + '" data-mint="' + ass.mint + '" class="ass_swap">Trade</button></li>';
        item += '<li><img src="' + ass.image + '" class="ass_img" /></li>';
        item += '<li class="clear"></li>';
        item += '</ul>';
        $("#view_nfts").append(item);
      }
    } 
    
  }
  
  setTimeout(() => {
    // finish up
    $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
    $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
    $("#view_nfts ul.asset").show();
    $(".loader").hide();
    $("#wallet_list").getNiceScroll().resize();
      // only allow txs to initialize after all images have loaded into the browser
    Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
      img.onload = img.onerror = resolve;
    }))).then(() => 
    {
      $('ul[data-type="nft"] li.ass_options button.ass_donate, ul[data-type="nft"] li.ass_options button.ass_swap, ul[data-type="nft"] li.ass_options button.ass_sell').prop("disabled", false);
      $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
    });
  }, 2000);
  
  });
  $(document).delegate("#view_nfts button.ass_meta", "click", async function() {
    let mint = $(this).parent().parent().attr("data-id");
    window.open(conf.nft_explorer + mint);
  });
  $(document).delegate("#view_nfts button.ass_donate", "click", async function() {
    $(".ass_donate").prop("disabled", true);
    let mint = $(this).parent().parent().attr("data-id");
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
    provider = wallet_provider();
    if (typeof provider == "undefined") {
      alert("You need a wallet connection to do this.");
      return;
    } 
    let from_wallet = provider.publicKey.toString();
    let to_wallet = $("#nft_donation_addy").val();
    if(await validateWallet(to_wallet) == false){return;}
    if (from_wallet == to_wallet) {return;}
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    $(this).prop("disabled", true).val("Requesting Approval...");
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    $("#nft_donation_box").hide();
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
    let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
    if (createATA === true) {
      let createATATx = new splToken.createAssociatedTokenAccountInstruction(
        senderAccountPubkey,
        associatedTokenAccountPubkey,
        recipientAccountPubkey,
        mintPubkey,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      tx.add(computePriceIx, createATATx, transferTx);
    } 
    else {
      tx.add(computePriceIx, transferTx);
    }
    tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
    tx.feePayer = senderAccountPubkey;
    $("#cover_message").html("Requesting Approval...");
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
        if (typeof tx_status == "undefined" || 
        typeof tx_status.value == "undefined" || 
        tx_status.value == null || 
        tx_status.value[0] == null || 
        typeof tx_status.value[0] == "undefined" || 
        typeof tx_status.value[0].confirmationStatus == "undefined") {}  
        else if (tx_status.value[0].confirmationStatus == "finalized") {
          clearInterval(intervalID);
          $("#nft_send_donation").prop("disabled", false).val("Transfer");
          $("#cover_message").html("");
          $("#donation_box").after('<div id="donation_thanks"><strong>Asset Sent!</strong></div><div id="donation_sig"><a href="https://solana.fm/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
//           $("#nft_donation_box").after('<div id="nft_donation_thanks">Asset Sent!</div><div id="nft_donation_sig"><a href="https://solana.fm/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="nft_donation_continue">Continue</button>');
          $(".asset").remove();
          $("#wallet_nfts").click();
        }
      }, 3000);
    } 
    catch (error) {
      alert("Sorry, there was a transaction error!");
      $("#nft_send_donation").prop("disabled", false).val("Transfer");
      $("#cover_message").html("");
      $("#nft_donation_box").show();
      // console.log("Error: ", error);
      error = JSON.stringify(error);
      error = JSON.parse(error);
      console.log("Error Logs: ", error);
    }
  });
  $(document).delegate("#nft_donation_continue", "click", async function() {
    $("#cover").fadeOut(400);
    $("#nft_donation_thanks, #nft_donation_sig, #nft_donation_continue").remove();
    $("#nft_send_donation").prop("disabled", false).val("Transfer");
  });
  $(document).delegate("#view_nfts button.ass_sell", "click", async function() {
    window.open(conf.sell_nft + $(this).data("mint"));
  });
  $(document).delegate("#view_nfts button.ass_swap", "click", async function() {
    $(".ass_swap").prop("disabled", true);
    $("#mode_spl").click();
    if ($(this).attr("data-pnft") == "true") {
      alert("Sorry, you've selected a pNFT which is not currently supported by this dApp.");
      $(".ass_swap").prop("disabled", false);
      return;
      //     $("#a_type").val("pNFT");
    } else {
      $("#a_type").val("NFT");
    }
    $("#proofs_a").hide();
    $("#create_a_owner").val("");
    $(".swap_img_a").attr("src", "/img/img-placeholder.png");
    $("#create_b_id, #sol_request, #pikl_request, #usdc_request, #swap_create").prop("disabled", true);
    provider = wallet_provider();
    if (provider.publicKey.toString() == $("#create_b_owner").val()) {
      alert("Same Owner!");
      return;
    }
    $("#mc_swap_create .mc_title").html("Fetching Asset...");
    let item = $(this).parent().parent();
    let item_id = item.attr("data-id");
    let img_src = item.find("img.ass_img").attr("src");
    $("#create_a_id").val(item_id);
    $("#mc_swap_create img.swap_img_a").attr("src", img_src);
    $("#create_a_owner").val(provider.publicKey.toString());
    if ($(".mcprofile_open").length) {
      $(".mcprofile_open").click();
    }
    $("#create_b_id").prop("disabled", false).removeClass("id_disabled");
    $("#create_b_owner").prop("disabled", false);
    $("#sol_request, #pikl_request, #usdc_request").prop("disabled", false);
    $("#fetch_b, #fetch_c").prop("disabled", false);
    $("#nav_compose").click();
    $(".swap_a ").removeClass("active_swap");
    $(".swap_b").addClass("active_swap");
    $("#create_b_id").prop("disabled", false);
    $("#fetch_b").click();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
    setTimeout(() => {
      if ($("#scroll_wrapper").width() < 1841) {
        $("#wallet_close").click();
      }
    }, 1500);
    $(".ass_swap").prop("disabled", false);
    validate_details();
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
  var cnfts = [];
  var cmints = [];
  var rarity_tags = $("#wallet_filters .wallet_rarity");
  var has_filter = $("#wallet_filters .wallet_filter").html();
  if ($("ul[data-type='cnft']").length == 0) {
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    provider = wallet_provider();
    let assets = {};
    assets.total = 0;
    assets.items = [];
    // get all the cnfts in the wallet (3000 max)
    let assets_a = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,1);
    assets_a = assets_a.data.result;
    assets.total = assets.total + assets_a.total;
    assets.items = [...assets.items, ...assets_a.items];
    if(assets_a.total == conf.nft_limit){
      let assets_b = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,2);
      assets_b = assets_b.data.result;
        assets.total = assets.total + assets_b.total;
        assets.items = [...assets.items, ...assets_b.items];
        if(assets_b.total == conf.nft_limit){
          let assets_c = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,3);
          assets_c = assets_c.data.result;
          
//           console.log("assets.total", assets.total);
//           console.log("assets_c.total", assets_c.total);
          
          assets.total = (assets.total + assets_c.total);
          assets.items = [...assets.items, ...assets_c.items];          
       }        
    }
    // filter for cnfts and built cnfts data array
    for (let i = 0; i < assets.items.length; i++) {
      let ass = assets.items[i];
      let blacklist = false;
      if(typeof ass.grouping != "undefined" && typeof ass.grouping[0] != "undefined"){
        if(conf.blacklist.includes(ass.grouping[0].group_value)){
          blacklist = true;
        }
      }
      if (blacklist == false && ass.burnt != true && ass.compression.compressed === true) {
        if (
          typeof ass.content !== undefined &&
          typeof ass.content.files !== undefined &&
          typeof ass.content.files[0] !== undefined &&
          ass.hasOwnProperty('content') &&
          ass.content.hasOwnProperty('files') &&
          typeof ass.content.files[0] == "object" &&
          ass.content.files[0].hasOwnProperty('uri') && 
          typeof ass.grouping[0] != "undefined"
        ) {
          // this restricts the collection the whitelisted collections only if any are defined in settings
          let pass = true;
          let whitelist = conf.whitelist;
          if(whitelist.length > 0 && !whitelist.includes(ass.grouping[0].group_value)){pass = false;}
          if(pass != false){
            let rebuild = {};
            rebuild.mint = ass.id;
            rebuild.image = ass.content.files[0].uri;
            rebuild.name = ass.content.metadata.name;
            rebuild.attributes = ass.content.metadata.attributes;
            rebuild.combos = [];
            rebuild.collection_key = ass.grouping[0].group_value;
            rebuild.sort = 0;
            rebuild.collection = "Unknown";
            rebuild.publisher = false;
            if (cmints.filter(e => e.collection_key === ass.grouping[0].group_value).length == 0) {
              let obj = {}
              obj.collection_key = ass.grouping[0].group_value;
              obj.name = false;
              obj.symbol = false;
              obj.uri = false;
              cmints.push(obj);
            }
            cnfts.push(rebuild);
          }
        }
      }
    }
    // get collection data
    for (let i = 0; i < cmints.length; i++) {
      let item = cmints[i];
      let res = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(await get_pda(item.collection_key))).catch(function() {});
      if (res != undefined) {
        cmints[i].name = res.data.name.replace(/\0/g, '');
        cmints[i].symbol = res.data.symbol.replace(/\0/g, '');
        cmints[i].uri = res.data.uri.replace(/\0/g, '');
      }
      for (let c = 0; c < cnfts.length; c++) {
        let cnft = cnfts[c];
        if (cnft.collection_key === item.collection_key) {
          let sorter = cnft.name.split("#");
          if (typeof sorter[1] != "undefined") {
            cnft.sort = parseInt(sorter[1].trim());
          }
          cnfts[c].collection = item;
        }
      }
    }
  }
  // sort by collection
  let cnft_final = [];
  let cnft_groups = [];
  for (let i = 0; i < cnfts.length; i++) {
    let _i = i - 1;
    if (cnfts[i].collection.name === false) {
      cnfts[i].collection.name = "Unknown";
    }
    if (typeof cnft_groups[cnfts[i].collection.name] == "undefined") {
      cnft_groups[cnfts[i].collection.name] = [];
    }
    let collect = cnfts[i].collection.name;
    let grouping = cnft_groups[collect];
    grouping.push(cnfts[i]);
    cnft_groups[collect] = grouping;
  }
  // group by collection, sort sub arrays, and rebuild cnfts array
  let grouped = Object.keys(cnft_groups).sort().reduce((obj, key) => {
    obj[key] = cnft_groups[key];
    return obj;
  }, {});
  for (const [key, values] of Object.entries(grouped)) {
    values.sort(function(a, b) {
      if (a.sort > b.sort) return 1;
      if (a.sort < b.sort) return -1;
      return 0;
    });
    cnft_final.push.apply(cnft_final, values);
  }
  cnfts = cnft_final;
  // get the combos
  for (let i = 0; i < cnfts.length; i++) {
    if (typeof cnfts[i].attributes != "undefined") {
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
      item += '<li class="ass_collection">' + ass.collection.name + '</li>';
      item += '<li class="ass_options"><button class="ass_meta">Metadata</button><button disabled class="ass_donate">Transfer</button><button disabled data-wallet="' + provider.publicKey.toString() + '" data-mint="' + ass.mint + '" class="ass_sell">Market</button><button disabled class="ass_swap">Trade</button></li>';
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
          $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
          $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
          Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
            img.onload = img.onerror = resolve;
          }))).then(() => {
            $('ul[data-type="cnft"] li.ass_options button.ass_donate, ul[data-type="cnft"] li.ass_options button.ass_swap, ul[data-type="cnft"] li.ass_options button.ass_sell').prop("disabled", false);
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
        $('ul[data-type="cnft"] li.ass_options button.ass_donate, ul[data-type="cnft"] li.ass_options button.ass_swap, ul[data-type="cnft"] li.ass_options button.ass_sell').prop("disabled", false);
      });
    }, 2000);
    return false;
  } else {
    setTimeout(() => {
      $("#view_cnfts ul.asset").show();
      $(".loader").hide();
      //       $("#wallet_cnfts span.count").html('(' + cnfts.length + ')');
      $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
      $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
    }, 500);
    // only allow txs to initialize after all images have loaded into the browser
    setTimeout(() => {
      $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
      Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
        img.onload = img.onerror = resolve;
      }))).then(() => {
        $('ul[data-type="cnft"] li.ass_options button.ass_donate, ul[data-type="cnft"] li.ass_options button.ass_swap, ul[data-type="cnft"] li.ass_options button.ass_sell').prop("disabled", false);
      });
    }, 4000);
  }
  setTimeout(() => {
    $("#wallet_list").getNiceScroll().resize();
  }, 1500);
});
  $(document).delegate("#view_cnfts button.ass_swap", "click", async function() {
    $(".ass_swap").prop("disabled", true);
    $("#mode_spl").click();
    $("#a_type").val("cNFT");
    $("#proofs_a").hide();
    $("#create_a_owner").val("");
    $(".swap_img_a").attr("src", "/img/img-placeholder.png");
    $("#create_b_id, #sol_request, #pikl_request, #usdc_request, #swap_create").prop("disabled", true);
    provider = wallet_provider();
    if (provider.publicKey.toString() == $("#create_b_owner").val()) {
      alert("Same Owner!");
      return;
    }
    $("#mc_swap_create .mc_title").html("Fetching Asset...");
    let item = $(this).parent().parent();
    let item_id = item.attr("data-id");
    let img_src = item.find("img.ass_img").attr("src");
    $("#create_a_id").val(item_id);
    $("#mc_swap_create img.swap_img_a").attr("src", img_src);
    $("#create_a_owner").val(provider.publicKey.toString());
    if ($(".mcprofile_open").length) {
      $(".mcprofile_open").click();
    }
    let axiosInstance = axios.create({
      baseURL: conf.cluster
    });
    let response = await axiosInstance.post(conf.cluster, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {
        id: item_id
      },
    });
    $("#create_b_id").prop("disabled", false).removeClass("id_disabled");
    $("#create_b_owner").prop("disabled", false);
    $("#sol_request, #pikl_request, #usdc_request").prop("disabled", false);
    $("#fetch_b, #fetch_c").prop("disabled", false);
    $("#nav_compose").click();
    $(".swap_a ").removeClass("active_swap");
    $(".swap_b").addClass("active_swap");
    $("#fetch_b").click();
    let proofs_required = await required_proofs(item_id);
    if(proofs_required == false){
      alert("There was a problem loading an asset, please try again.");
    }
    else{
      $("#proofs_a").html(proofs_required + " x Proofs").show();
    }
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
    if ($("#scroll_wrapper").width() < 1841) {
      $("#wallet_close").click();
    }
    $(".ass_swap").prop("disabled", false);
    max_proofs();
  });
  $(document).delegate("#view_cnfts button.ass_meta", "click", async function() {
    let mint = $(this).parent().parent().attr("data-id");
    window.open(conf.cnft_explorer + mint);
  });
  $(document).delegate("#view_cnfts button.ass_sell", "click", async function() {
    //   window.open(conf.sell_cnft+"?walletAddress=" + $(this).data("wallet") + "&collectibleMint=" + $(this).data("mint") + "&screenType=STASHING");
    window.open(conf.sell_cnft + "/" + $(this).data("mint"));
  });
  $(document).delegate("#view_cnfts button.ass_donate", "click", async function() {
    $(".ass_donate").prop("disabled", true);
    $("#nft_send_donation").attr("id", "cnft_send_donation");
    let mint = $(this).parent().parent().attr("data-id");
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
  $(document).delegate("ul.asset li.ass_tags button", "click", async function() {
    let item = $(this);
    let set_tag = item.html();
    $(".wallet_filter").remove();
    $("#wallet_filters").prepend('<span class="wallet_filter">' + set_tag + '</span>');
    let all = $("ul[data-type='cnft']");
    all.hide();
    all.each(function() {
      let id = $(this).attr("data-id");
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
    $("#wallet_list").getNiceScroll().resize();
  });
  $(document).delegate("ul.asset li.ass_rarity", "click", async function() {
    $(".wallet_rarity").remove();
    let rarity = $(this).attr("title");
    let id = $(this).parent().attr("data-id");
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
    $("#wallet_list").getNiceScroll().resize();
  });
  $(document).delegate(".wallet_rarity", "click", async function() {
    $(".wallet_rarity").remove();
    $("ul[data-type='cnft']").show();
    if ($(".wallet_filter").length) {
      let wf = $(".wallet_filter").html().trim();
      $("#view_cnfts .ass_tags button").each(function() {
        let val = $(this).attr("data-id");
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
    provider = wallet_provider();
    if (typeof provider == "undefined") {
      alert("You need a wallet connection to do this.");
      return;
    } 
    let from_wallet = provider.publicKey.toString();
    let to_wallet = $("#nft_donation_addy").val();
    if(await validateWallet(to_wallet) == false){return;}
    if (from_wallet == to_wallet) {return;}
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    $(this).prop("disabled", true);
    let assetId = $("#nft_donation_mint").val();
    let proofs_required = await required_proofs(assetId);
    if(proofs_required == false || proofs_required > 20){
      alert("Oh no! The selected cNFT requires more than 20 proofs and we can't send it!");
      $(this).prop("disabled", false);
      return;
    }
    $(this).val("Requesting Approval...");
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    $("#nft_donation_box").hide();
    try {
      let senderAccountPubkey = new solanaWeb3.PublicKey(from_wallet);
      let recipientAccountPubkey = new solanaWeb3.PublicKey(to_wallet);
      let mintPubkey = new solanaWeb3.PublicKey(assetId);
      let assetCompressionDatahash = null;
      let assetCompressionCreatorhash = null;
      let assetCompressionLeafId = null;
      let axiosInstance = axios.create({baseURL: conf.cluster});
      let response = null;
      response = await axiosInstance.post(conf.cluster, {
        jsonrpc: "2.0",
        method: "getAsset",
        id: "rpd-op-123",
        params: {id: assetId},
      });
      assetCompressionDatahash = response.data.result.compression.data_hash;
      assetCompressionCreatorhash = response.data.result.compression.creator_hash;
      assetCompressionLeafId = response.data.result.compression.leaf_id;    
      let treeId = null;
      let assetProof = null;
      let assetRoot = null;
      response = await axiosInstance.post(conf.cluster, {
        jsonrpc: "2.0",
        method: "getAssetProof",
        id: "rpd-op-123",
        params: {id: assetId},
      });
      treeId = response.data.result.tree_id;
      assetProof = response.data.result.proof;
      assetRoot = response.data.result.root;    
      let treeIdPubKey = new solanaWeb3.PublicKey(treeId);
      let treeAccount = await splAccountCompression_.ConcurrentMerkleTreeAccount.fromAccountAddress(connection, treeIdPubKey, );
      let treeAuthority = treeAccount.getAuthority();
      let canopyDepth = treeAccount.getCanopyDepth();
      let proof = assetProof.slice(0, assetProof.length - (!!canopyDepth ? canopyDepth : 0))
      .map((node) => ({pubkey: new solanaWeb3.PublicKey(node),isWritable: false,isSigner: false,}));     
      let transferIx = mplBubblegum_.createTransferInstruction({
          merkleTree: new solanaWeb3.PublicKey(treeId),
          treeAuthority,
          leafOwner: provider.publicKey,
          leafDelegate: provider.publicKey,
          newLeafOwner: recipientAccountPubkey,
          logWrapper: splAccountCompression_.SPL_NOOP_PROGRAM_ID,
          compressionProgram: splAccountCompression_.SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
          anchorRemainingAccounts: proof,
        }, 
      {
          root: [...new solanaWeb3.PublicKey(assetRoot).toBytes()],
          dataHash: [...new solanaWeb3.PublicKey(assetCompressionDatahash).toBytes()],
          creatorHash: [...new solanaWeb3.PublicKey(assetCompressionCreatorhash).toBytes()],
          nonce: assetCompressionLeafId,
          index: assetCompressionLeafId,
        },conf.BUBBLEGUM_PROGRAM_ID,);
      ///////////////////////////////////////////////////////////////////////////////
      let tx = new solanaWeb3.Transaction();
      let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
      tx.add(computePriceIx,transferIx);
      tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
      tx.feePayer = provider.publicKey;
      $("#cover_message").html("Requesting Approval...");
      let signedTransaction = await provider.signTransaction(tx);
      let serializedTransaction = signedTransaction.serialize();
      let signature = await connection.sendRawTransaction(serializedTransaction,{skipPreflight:false,preflightCommitment:'confirmed'},);
      $("#cover_message").html("Finalizing Transaction...");
      let intervalID = setInterval(async function() {
        let tx_status = await connection.getSignatureStatuses([signature], {
          searchTransactionHistory: true,
        });
        if (typeof tx_status == "undefined" || 
        typeof tx_status.value == "undefined" || 
        tx_status.value == null || 
        tx_status.value[0] == null || 
        typeof tx_status.value[0] == "undefined" || 
        typeof tx_status.value[0].confirmationStatus == "undefined") {} 
        else if (tx_status.value[0].confirmationStatus == "finalized") {
          clearInterval(intervalID);
          $("#cover_message").html("");
          $("#donation_box").after('<div id="donation_thanks"><strong>Asset Sent!</strong></div><div id="donation_sig"><a href="https://solana.fm/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
          $("#wallet_refresh").click();
          $("#cnft_send_donation").attr("id", "nft_send_donation").prop("disabled", false).val("Transfer");
        }
      }, 3000);
      ///////////////////////////////////////////////////////////////////////////////
    }
    catch (error) {
      alert("Sorry, there was a transaction error!");
      $("#cnft_send_donation").prop("disabled", false).val("Transfer");
      $("#cover_message").html("");
      $("#nft_donation_box").show();
      error = JSON.stringify(error);
      error = JSON.parse(error);
      console.log(error);
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
  
  // validates proposal details before allowing the user to continue
  async function validate_details() {

    let pass_test = false;

    // make sure asset a is loaded
    if ($("#create_a_id").val() == "" && $("#create_a_owner").val() == "") {
      $("#swap_create, #sol_request, #pikl_request, #usdc_request").prop("disabled", true);
      $("#swap_img_b").attr("src", "/img/img-placeholder.png");
      $("#create_a_id, #create_a_owner, #create_b_id, #create_b_owner").val("");
      $("#create_b_owner, #a_type").val("");
      pass_test = false;
      return;
    }

    // check that both mints are same asset type
    if ($("#create_a_id").val() != "" && $("#create_b_id").val() != "") {
      if ($("#proofs_a").is("visible")) {
        if ($("#proofs_b").is("visible")) {
          pass_test = true;
        } else {
          $("#swap_create").prop("disabled", true);
          $("#swap_img_b").attr("src", "/img/img-placeholder.png");
          $("#create_b_id, #b_type").val("");
          pass_test = false;
          return;
        }
      }
    }

    // check that at least one asset is being requested
    if (
      $("#create_b_id").val() != "" && $("#create_b_owner").val() != "" ||
      $("#sol_request").val() != "" && $("#sol_request").val() > 0 ||
      $("#pikl_request").val() != "" && $("#pikl_request").val() > 0 ||
      $("#usdc_request").val() != "" && $("#usdc_request").val() > 0
    ) {
      pass_test = true;
    } else {
      pass_test = false;
    }

    if (
      $("#a_type").val() != $("#b_type").val() && $("#b_type").val() != "" ||
      $("#create_b_id").val() != "" && $("#b_type").val() == "" ||
      $("#create_b_owner").val() == "" ||
      $("#create_b_owner").val().length < 32 ||
      $("#create_b_owner").val().length > 44
    ) {
      pass_test = false;
    }

    if (pass_test === true) {
      $("#swap_create").prop("disabled", false);
      $("#priority_nft").val(await estimate_priority());
    } else {
      $("#swap_create").prop("disabled", true);
    }

  }
  
  // mcswap create load asset b
  async function max_proofs() {
    let pcount = parseInt($("#proofs_a").html()) + parseInt($("#proofs_b").html());
    if (pcount > conf.max_proofs) {
      $(".proofs_").addClass("toomanyproofs");
      $("#swap_create").prop("disabled", true);
      $("#create_b_id").prop("disabled", false);
      $("#mc_swap_create .mc_title").html(conf.max_proofs + " Proofs Exceded!").addClass("blink");
    } else if (parseInt($("#proofs_a").html()) > 0 && parseInt($("#proofs_b").html()) > 0) {
      $(".proofs_").removeClass("toomanyproofs");
      $("#create_b_id").prop("disabled", false);
      $("#mc_swap_create .mc_title").html("New Contract").removeClass("blink");
    } else {
      $("#mc_swap_create .mc_title").html("New Contract").removeClass("blink");
    }
    validate_details();
  }
  async function load_asset_b() {
    let swap_b_id = $("#create_b_id").val();
    if (swap_b_id.length < 32) {
      $(".swap_img_b").attr("src", "/img/img-placeholder.png");
      $("#mc_swap_create .mc_title").html("New Contract");
      $("#create_b_id, #create_b_owner").prop("disabled", false);
      $("#proofs_b").hide();
      $(".proofs_").removeClass("toomanyproofs");
      validate_details();
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
    if (typeof response.data.result == "undefined") {
      $("#mc_swap_create .mc_title").html("New Contract");
      $("#create_b_id, #create_b_owner").prop("disabled", false);
      $("#proofs_b").hide();
      $("#b_type").val("");
      $(".swap_img_b").attr("src", "/img/img-placeholder.png");
      $(".proofs_").removeClass("toomanyproofs");
      return;
    }
    if (typeof response.data.result.compression != "undefined" && response.data.result.compression.compressed === true) {
      $("#b_type").val("cNFT");
    } else if (response.data.result.content.metadata.token_standard == "ProgrammableNonFungible") {
      $("#b_type").val("pNFT");
    } else {
      $("#b_type").val("NFT");
    }
    if ($("#a_type").val() != $("#b_type").val()) {
      $("#swap_create").prop("disabled", true);
      $("#create_b_id").prop("disabled", false);
      $("#swap_img_b").attr("src", "/img/img-placeholder.png");
      $("#create_b_id").val("");
      $("#b_type").val("");
      alert("Mixmatched NFT Types Not Allowed!");
      $("#mc_swap_create .mc_title").html("New Contract");
      validate_details();
      return;
    }
    let owner = response.data.result.ownership.owner;
    if (owner == $("#create_a_owner").val()) {
      $("#mc_swap_create .mc_title").html("New Contract");
      alert("Same Owner!");
      $("#create_b_id").prop("disabled", false).val("");
      validate_details();
      return;
    }
    $("#create_b_owner").val(owner);
    $("img.swap_img_b").attr("src", response.data.result.content.links.image);
    $("#mc_swap_create .mc_title").html("New Contract");
    if ($("#b_type").val() == "cNFT") {
      let proofs_required = await required_proofs(swap_b_id);
      if(proofs_required == false){
        alert("There was a problem loading an asset, please try again.");
      }
      else{
        $("#proofs_b").html(proofs_required + " x Proofs").show();
      }      
      max_proofs();
    } else {
      $("#create_b_id, #create_b_owner").prop("disabled", false);
      validate_details();
    }

  }
  $(document).delegate("#fetch_b", "click", async function() {
    $("#proofs_b").hide();
    $("#b_type").val("");
    $("#create_b_id, #create_b_owner, #swap_create").prop("disabled", true);
    $("#mc_swap_create .mc_title").html("Fetching Asset...");
    $("#create_b_id").prop("disabled", true);
    $(".swap_img_b").attr("src", "/img/img-placeholder.png");
    load_asset_b();
  });
  
  // fetch and display bobs available assets
  function preloadImages(srcs) {
      function loadImage(src) {
          return new Promise(function(resolve, reject) {
              var img = new Image();
              img.onload = function() {
                  resolve(img);
              };
              img.onerror = img.onabort = function() {
                  reject(src);
              };
              img.src = src;
          });
      }
      var promises = [];
      for (var i = 0; i < srcs.length; i++) {
          promises.push(loadImage(srcs[i]));
      }
      return Promise.all(promises);
  }
  async function get_bobs_wallet() {
    var cnfts = [];
    var cmints = [];
    var rarity_tags = $("#wallet_filters .wallet_rarity");
    var has_filter = $("#wallet_filters .wallet_filter").html();
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let assets = {};
    assets.total = 0;
    assets.items = [];
    // get all the cnfts in the wallet (3000 max)
    let assets_a = await getAssetsByOwner(conf.cluster,$("#create_b_owner").val(),conf.nft_limit,1);
    assets_a = assets_a.data.result;
    assets.total = assets.total + assets_a.total;
    assets.items = [...assets.items, ...assets_a.items];
    if(assets_a.total == conf.nft_limit){
      let assets_b = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,2);
      assets_b = assets_b.data.result;
        assets.total = assets.total + assets_b.total;
        assets.items = [...assets.items, ...assets_b.items];
        if(assets_b.total == conf.nft_limit){
          let assets_c = await getAssetsByOwner(conf.cluster,provider.publicKey.toString(),conf.nft_limit,3);
          assets_c = assets_c.data.result;
          assets.total = (assets.total + assets_c.total);
          assets.items = [...assets.items, ...assets_c.items];          
       }        
    }
    // filter for cnfts and built cnfts data array
    for (let i = 0; i < assets.items.length; i++) {
      let ass = assets.items[i];
      let blacklist = false;
      if(typeof ass.grouping != "undefined" && typeof ass.grouping[0] != "undefined"){
        if(conf.blacklist.includes(ass.grouping[0].group_value)){
          blacklist = true;
        }
      }
      if (blacklist == false && ass.burnt != true && ass.compression.compressed === true) {
        if (
          typeof ass.content !== undefined &&
          typeof ass.content.files !== undefined &&
          typeof ass.content.files[0] !== undefined &&
          ass.hasOwnProperty('content') &&
          ass.content.hasOwnProperty('files') &&
          typeof ass.content.files[0] == "object" &&
          ass.content.files[0].hasOwnProperty('uri') && 
          typeof ass.grouping[0] != "undefined"
        ) {
          // this restricts the collection the whitelisted collections only if any are defined in settings
          let pass = true;
          let whitelist = conf.whitelist;
          if(whitelist.length > 0 && !whitelist.includes(ass.grouping[0].group_value)){pass = false;}
          if(pass != false){
            let rebuild = {};
            rebuild.mint = ass.id;
            rebuild.image = ass.content.files[0].uri;
            rebuild.name = ass.content.metadata.name;
            rebuild.attributes = ass.content.metadata.attributes;
            rebuild.combos = [];
            rebuild.collection_key = ass.grouping[0].group_value;
            rebuild.sort = 0;
            rebuild.collection = "Unknown";
            rebuild.publisher = false;
            if (cmints.filter(e => e.collection_key === ass.grouping[0].group_value).length == 0) {
              let obj = {}
              obj.collection_key = ass.grouping[0].group_value;
              obj.name = false;
              obj.symbol = false;
              obj.uri = false;
              cmints.push(obj);
            }
            cnfts.push(rebuild);
          }
        }
      }
    }
    // get collection data
    for (let i = 0; i < cmints.length; i++) {
      let item = cmints[i];
      let res = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(await get_pda(item.collection_key))).catch(function() {});
      if (res != undefined) {
        cmints[i].name = res.data.name.replace(/\0/g, '');
        cmints[i].symbol = res.data.symbol.replace(/\0/g, '');
        cmints[i].uri = res.data.uri.replace(/\0/g, '');
      }
      for (let c = 0; c < cnfts.length; c++) {
        let cnft = cnfts[c];
        if (cnft.collection_key === item.collection_key) {
          let sorter = cnft.name.split("#");
          if (typeof sorter[1] != "undefined") {
            cnft.sort = parseInt(sorter[1].trim());
          }
          cnfts[c].collection = item;
        }
      }
    }
    // sort by collection
    let cnft_final = [];
    let cnft_groups = [];
    for (let i = 0; i < cnfts.length; i++) {
      let _i = i - 1;
      if (cnfts[i].collection.name === false) {
        cnfts[i].collection.name = "Unknown";
      }
      if (typeof cnft_groups[cnfts[i].collection.name] == "undefined") {
        cnft_groups[cnfts[i].collection.name] = [];
      }
      let collect = cnfts[i].collection.name;
      let grouping = cnft_groups[collect];
      grouping.push(cnfts[i]);
      cnft_groups[collect] = grouping;
    }
    // group by collection, sort sub arrays, and rebuild cnfts array
    let grouped = Object.keys(cnft_groups).sort().reduce((obj, key) => {
      obj[key] = cnft_groups[key];
      return obj;
    }, {});
    for (const [key, values] of Object.entries(grouped)) {
      values.sort(function(a, b) {
        if (a.sort > b.sort) return 1;
        if (a.sort < b.sort) return -1;
        return 0;
      });
      cnft_final.push.apply(cnft_final, values);
    }
    cnfts = cnft_final;
    // display cnfts
    for (let i = 0; i < cnfts.length; i++) {
      let ass = cnfts[i];
      let attributes = ass.attributes;
      let rarity = "";
      let rarit = "";
      let rar = "";
      rar = "common";
//       if (typeof attributes != "undefined") {
//         for (let r = 0; r < attributes.length; r++) {
//           let attr = attributes[r];
//           if (attr.trait_type == "Rarity") {
//             rarity = attr.value;
//             rarit = rarity.charAt(0);
//             if (rarit == "L") {
//               rar = " legendary";
//             } else if (rarit == "R") {
//               rar = " rare";
//             } else if (rarit == "C") {
//               rar = " common";
//             }
//           }
//         }
//       }
        let item = '<ul data-bob_chooser="' + ass.mint + '" data-type="bob_cnft" class="bob_asset">';
//         item += '<li class="ass_collection">' + ass.collection.name + '</li>';
//         item += '<li class="ass_options"><button class="ass_meta">Metadata</button><button disabled class="ass_donate">Transfer</button><button disabled data-wallet="' + provider.publicKey.toString() + '" data-mint="' + ass.mint + '" class="ass_sell">Market</button><button disabled class="ass_swap">Trade</button></li>';
        item += '<li><img src="' + ass.image + '" class="bob_img" /></li>';
        item += '<li class="bob_name">' + ass.name + '</li>';
//         item += '<li class="clear"></li>';
//         let tags = "";
//         for (let t = 0; t < ass.combos.length; t++) {
//           tags += '<button data-id="' + ass.combos[t] + '">' + ass.combos[t] + '</button>';
//         }
//         item += '<li class="ass_tags">' + tags + '</li>';
        item += '</ul>';
        $("#bob_chooser").append(item);
    }
    setTimeout(() => {
      $("#cover_message").html("");
      $("#init_loader").hide();
      $("#bob_chooser, #bob_chooser ul").fadeIn(800);
      $("#bob_chooser").getNiceScroll().resize();
    }, 1500);
  }
  $(document).delegate(".bob_asset", "click", async function() {
    let id = $(this).attr("data-bob_chooser");
    $("#cover, #bob_chooser").fadeOut(400);
    $("#create_b_id").val(id);
    $("#fetch_c").prop("disabled", false);
    setTimeout(function(){
      $("#bob_chooser").html("");
      $("#fetch_b").click();
    },500);
  });
  $(document).delegate("#fetch_c", "click", async function() {
    let bobs_wallet = $("#create_b_owner").val();
    if(bobs_wallet.length < 32){return;}
    $("#cover").fadeIn(400);
    $("#cover_message").html("Fetching Available Assets...");
    $("#init_loader").fadeIn(400);
    $("#fetch_c").prop("disabled", true);
    get_bobs_wallet();
  });
  
  // revalidating on keypress/change
  $(document).on("change", "#create_b_id", function() {
    $(".swap_img_b").attr("src", "/img/img-placeholder.png");
    $("#proofs_b").hide();
    $("#b_type").val("");
    $("#create_b_owner").prop("disabled", false);
    validate_details();
  });
  $(document).on("keyup", "#create_b_id", function() {
    $(".swap_img_b").attr("src", "/img/img-placeholder.png");
    $("#proofs_b").hide();
    $("#b_type").val("");
    $("#create_b_owner").prop("disabled", false);
    validate_details();
  });
  $(document).on("change", "#create_b_owner", function() {
    validate_details();
  });
  $(document).on("keyup", "#create_b_owner", function() {
    validate_details();
  });

  // request sol amount
  async function format_sol() {
    let amt = $("#sol_request").val();
    amt = amt.replace(/[^0-9.]/g, '');
    let amt_x = amt;
    if (amt == 0 || amt == "") {
      $("#sol_request").val(amt_x);
      $("#token_sol").attr("src", "/img/check_default.png");
      validate_details();
      return;
    }
    let int = amt.split(".");
    if (int.length > 1) {
      let int_a = int[0];
      let int_b = int[1];
      int_b = int_b.substring(0, 9);
      amt = int_a + "." + int_b;
    }
//     if (amt > 0 && amt < 0.0009) {amt = 0.0009;}
    $("#token_sol").attr("src", "/img/check_green.png");
    $("#sol_request").val(amt);
    validate_details();
    return;
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
      $("#token_pikl").attr("src", "/img/check_default.png");
      validate_details();
      return;
    }
    let int = amt.split(".");
    if (int.length > 1) {
      let decimals = 9;
      for (let i = 0; i < spl_tokens.length; i++) {
        let item = spl_tokens[i];
        let mintaddress = $(".swap_c_pikl").attr("data-id");
        if (item.address == mintaddress) {
          decimals = item.decimals;
        }
      }

      let int_a = int[0];
      let int_b = int[1];
      int_b = int_b.substring(0, decimals);
      amt = int_a + "." + int_b;
    }
    $("#usdc_request").val("");
    $("#token_usdc").attr("src", "/img/check_default.png");
    $("#token_pikl").attr("src", "/img/check_green.png");
    $("#pikl_request").val(amt);
    validate_details();
    return;
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
      $("#token_usdc").attr("src", "/img/check_default.png");
      validate_details();
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
    $("#token_pikl").attr("src", "/img/check_default.png");
    $("#token_usdc").attr("src", "/img/check_green.png");
    $("#usdc_request").val(amt);
    validate_details();
    return;
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
    $(".mode_switch, #create_b_owner, #pikl_request, #usdc_request, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, .ass_meta, #wallet_disconnect, #wallet_refresh, #create_b_id, #fetch_b, #fetch_c, #sol_request, #swap_create, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", true);
    $(".swap_b , .swap_g").removeClass("active_swap");
    $("#donate_sol, .mcprofile_close, #wallet_refresh").hide();
    $(".fee_prov_sig .swap_val, .fee_prov_alt .swap_val, .share_sig .swap_val, .share_id .swap_val").html("");
    if ($("#a_type").val() == "cNFT") {
      $(".swap_cancel_b").prop("disabled", true);
      $(".swap_f").addClass("active_swap");
      $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
//       let alice_proofs = parseInt($("#proofs_a").html());
//       if(alice_proofs > 3){
//         $(".swap_e").addClass("active_swap");
//         $(".swap_cancel, #swap_provision").prop("disabled", false);
//         $(".swap_cancel_b").prop("disabled", true);
//       }
//       else{
//         $(".swap_f").addClass("active_swap");
//         $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
//       }

    } else if ($("#a_type").val() == "NFT") {
      $(".swap_f").addClass("active_swap");
      $("#swap_deploy").prop("disabled", false);
      $(".swap_cancel_b").prop("disabled", false);
    } else if ($("#a_type").val() == "pNFT") {
      $(".swap_f").addClass("active_swap");
      $("#swap_deploy").prop("disabled", false);
      $(".swap_cancel_b").prop("disabled", false);
    }
  });
  
  // back two steps
  $(document).delegate(".swap_cancel_b", "click", async function() {
    $(".swap_cancel_b, #swap_deploy").prop("disabled", true);
    $(".mode_switch, #pikl_request, #usdc_request, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, .ass_meta, #wallet_disconnect, #wallet_refresh, #create_b_id, #fetch_b, #fetch_c, #sol_request, #swap_create, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
    $(".swap_f").removeClass("active_swap");
    $(".swap_b").addClass("active_swap");
    $("#donate_sol, .mcprofile_close, #wallet_refresh").show();
    if ($("#b_type").val() == "") {
      $("#create_b_owner").prop("disabled", false);
    }
  });

  // back a step
  $(document).delegate("#swap_cancel", "click", async function() {
    $(".mode_switch, #pikl_request, #usdc_request, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, #wallet_disconnect, #wallet_refresh, #create_b_id, #fetch_b, #fetch_c, #sol_request, #swap_create, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
    $(".swap_e").removeClass("active_swap");
    $(".swap_b").addClass("active_swap");
    $(".swap_cancel, #swap_provision").prop("disabled", true);
    $("#donate_sol, .mcprofile_close, #wallet_refresh").show();
    if ($("#b_type").val() == "") {
      $("#create_b_owner").prop("disabled", false);
    }
  });
  
  // deploy proposal
  async function deploy_proposal() {
    
    provider = wallet_provider();
    
    if (provider.isConnected === true) {

      $(".swap_cancel_b, #swap_deploy").prop("disabled", true);
      $("#swap_deploying").addClass("provisioning").html("Deploying...");
      $("#cover").fadeIn(400);
      $("#cover_message").html("Preparing Transaction...");

      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");

      if ($("#a_type").val() == "NFT") {

        let isSwap = true;
        let mint = $("#create_a_id").val();
        let swapMint = "11111111111111111111111111111111";
        if ($("#b_type").val() == "NFT" && $("#create_b_id").val() != "") {
          swapMint = $("#create_b_id").val();
        } else {
          isSwap = false;
        }
        let taker = $("#create_b_owner").val();
        let swapLamports = $("#sol_request").val() * conf.billion;
        let swapTokenMint;
        let multiplier = 1;
        if ($("#pikl_request").val() > 0) {
          swapTokenMint = new solanaWeb3.PublicKey($(".swap_c_pikl").attr("data-id"));
          let decimals = 9;
          for (let i = 0; i < spl_tokens.length; i++) {
            let item = spl_tokens[i];
            if (item.address == $(".swap_c_pikl").attr("data-id")) {
              decimals = item.decimals;
            }
          }
          swapTokens = $("#pikl_request").val();
          //console.log("pikl request");
          for (let i = 0; i < decimals; i++) {
            multiplier = multiplier * 10;
          }
        } else if ($("#usdc_request").val() > 0) {
          swapTokenMint = new solanaWeb3.PublicKey(conf.usdc);
          swapTokens = $("#usdc_request").val();
          //console.log("usdc request");
          for (let i = 0; i < 6; i++) {
            multiplier = multiplier * 10;
          }
        } else {
          console.log("requesting none");
          swapTokenMint = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        }

        swapTokens = swapTokens * multiplier;
        swapTokens = parseInt(swapTokens);

        //console.log("mint ", mint);
        //console.log("swapMint ", swapMint);
        //console.log("taker ", taker);
        //console.log("isSwap ", isSwap);
        //console.log("swapLamports ", swapLamports);
        //console.log("swapTokenMint ", swapTokenMint);
        //console.log("swapTokens ", swapTokens);

        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        let devTreasury = new solanaWeb3.PublicKey(conf.treasury_studio_nft);
        let mcDegensTreasury = new solanaWeb3.PublicKey(conf.treasury);
        let feeLamports = conf.fee;
        //console.log("feeLamports ", feeLamports);

        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")], NFTSwapProgramId);
        //console.log("Program State PDA: ", programStatePDA[0].toString());      

        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], NFTSwapProgramId);
        //console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"), new solanaWeb3.PublicKey(mint).toBytes(), new solanaWeb3.PublicKey(swapMint).toBytes()], NFTSwapProgramId);
        //console.log("Swap State PDA: ", swapStatePDA[0].toString());

        let tempFeeAccount = new solanaWeb3.Keypair();
        //console.log("Temp Fee Account: ", tempFeeAccount.publicKey.toString());
        createTempFeeAccountIx = solanaWeb3.SystemProgram.createAccount({
          programId: NFTSwapProgramId,
          space: 0,
          lamports: feeLamports,
          fromPubkey: provider.publicKey,
          newAccountPubkey: tempFeeAccount.publicKey,
        });
        //console.log("Create Temp Fee Account Tx: ", createTempFeeAccountIx);      

        const tempMintAccount = new solanaWeb3.Keypair();
        //console.log("Temp Mint Account: ", tempMintAccount.publicKey.toString());

        let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
        let createTempMintAccountIx = solanaWeb3.SystemProgram.createAccount({
          programId: splToken.TOKEN_PROGRAM_ID,
          space: splToken.AccountLayout.span,
          lamports: rent,
          fromPubkey: provider.publicKey,
          newAccountPubkey: tempMintAccount.publicKey,
        });
        //console.log("Create Temp Mint Account Ix: ", createTempMintAccountIx);          

        let initTempMintAccountIx = splToken.createInitializeAccountInstruction(
          tempMintAccount.publicKey, new solanaWeb3.PublicKey(mint),
          tempMintAccount.publicKey, splToken.TOKEN_PROGRAM_ID);
        //console.log("Init Temp Mint Account Ix: ", initTempMintAccountIx);

        let providerMintATA = await splToken.getAssociatedTokenAddress(
          new solanaWeb3.PublicKey(mint), provider.publicKey, false,
          splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        let transferMintIx = splToken.createTransferInstruction(
          providerMintATA, tempMintAccount.publicKey, provider.publicKey,
          1, provider.publicKey, splToken.TOKEN_PROGRAM_ID, )
        //console.log("Transfer Mint Ix: ", transferMintIx);

        // ******************************************************************
        let swapMintATA = null;
        let createSwapMintATA = false;
        let createSwapMintATAIx = null;
        if (swapMint != "11111111111111111111111111111111") {
          swapMintATA = await splToken.getAssociatedTokenAddress(
            new solanaWeb3.PublicKey(swapMint), provider.publicKey, false,
            splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
          //console.log("Swap Mint ATA: ", swapMintATA.toString());
          let swapState = null;
          await connection.getAccountInfo(swapMintATA)
            .then(function(response) {
              swapState = response;
            })
            .catch(function(error) {
              error = JSON.stringify(error);
              error = JSON.parse(error);
              // console.log("Error: ", error);
              return;
            });
          if (swapState == null) {
            createSwapMintATA = true;
            createSwapMintATAIx = splToken.createAssociatedTokenAccountInstruction(
              provider.publicKey, swapMintATA, provider.publicKey, new solanaWeb3.PublicKey(swapMint),
              splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
            //console.log("Create Swap Mint ATA Ix: ", createSwapMintATAIx); 
          } else {
            createSwapMintATA = false;
          }
        } else {
          //console.log("debug", swapMint);
        }
        //console.log("swapMintATA: ", swapMintATA);          
        //console.log("createSwapMintATA: ", createSwapMintATA);          
        // ******************************************************************

        // ******************************************************************
        let swapTokenATA = null;
        let createSwapTokenATA = null;
        let createSwapTokenATAIx = null;
        swapTokenATA = await splToken.getAssociatedTokenAddress(
          swapTokenMint, provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        //console.log("Swap Token ATA: ", swapTokenATA.toString());
        let swapTokenState = null;
        await connection.getAccountInfo(swapTokenATA)
          .then(function(response) {
            swapTokenState = response;
          })
          .catch(function(error) {
            error = JSON.stringify(error);
            error = JSON.parse(error);
            return;
          });
        if (swapTokenState == null) {
          if (swapTokens > 0) {
            createSwapTokenATA = true;
            createSwapTokenATAIx = splToken.createAssociatedTokenAccountInstruction(
              provider.publicKey,
              swapTokenATA,
              provider.publicKey,
              swapTokenMint,
              splToken.TOKEN_PROGRAM_ID,
              splToken.ASSOCIATED_TOKEN_PROGRAM_ID, )
            //console.log("Create Swap Token ATA Ix: ", createSwapTokenATAIx); 
          }
        } else {
          createSwapTokenATA = false;
        }
        //console.log("swapTokenATA: ", swapTokenATA);          
        //console.log("createSwapTokenATA: ", createSwapTokenATA);
        // ******************************************************************

        // ******************************************************************
        var totalSize = 1 + 1 + 32 + 32 + 32 + 8 + 32 + 8;
        //console.log("totalSize", totalSize);
        var uarray = new Uint8Array(totalSize);
        let counter = 0;
        uarray[counter++] = 0; // 0 = nft_swap InitializeSwap instruction
        if (isSwap == true) {
          uarray[counter++] = 1;
        } else {
          uarray[counter++] = 0;
        }

        let arr;

        let mintb58 = bs58.decode(mint);
        arr = Array.prototype.slice.call(Buffer.from(mintb58), 0);
        for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
        }

        let takerb58 = bs58.decode(taker);
        arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
        for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
        }

        let swapMintb58 = bs58.decode(swapMint);
        arr = Array.prototype.slice.call(Buffer.from(swapMintb58), 0);
        for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
        }

        let byte;
        let byteArray;

        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let index = 0; index < byteArray.length; index++) {
          byte = swapLamports & 0xff;
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
          byte = swapTokens & 0xff;
          byteArray[index] = byte;
          swapTokens = (swapTokens - byte) / 256;
        }
        for (let i = 0; i < byteArray.length; i++) {
          uarray[counter++] = byteArray[i];
        }
        //console.log("Contract Data: ", uarray);

        initializeSwapIx = new solanaWeb3.TransactionInstruction({
          programId: NFTSwapProgramId,
          data: Buffer.from(uarray),
          keys: [{
              pubkey: provider.publicKey,
              isSigner: true,
              isWritable: true
            }, // 0
            {
              pubkey: programStatePDA[0],
              isSigner: false,
              isWritable: false
            }, // 1
            {
              pubkey: swapVaultPDA[0],
              isSigner: false,
              isWritable: false
            }, // 2
            {
              pubkey: swapStatePDA[0],
              isSigner: false,
              isWritable: true
            }, // 3
            {
              pubkey: tempFeeAccount.publicKey,
              isSigner: true,
              isWritable: true
            }, // 4
            {
              pubkey: tempMintAccount.publicKey,
              isSigner: true,
              isWritable: true
            }, // 5
            {
              pubkey: solanaWeb3.SystemProgram.programId,
              isSigner: false,
              isWritable: false
            }, // 6
            {
              pubkey: splToken.TOKEN_PROGRAM_ID,
              isSigner: false,
              isWritable: false
            }, // 7
            {
              pubkey: devTreasury,
              isSigner: false,
              isWritable: true
            }, // 8
            {
              pubkey: mcDegensTreasury,
              isSigner: false,
              isWritable: true
            }, // 9
          ]
        });
        //console.log("Initialize Swap Ix: ", initializeSwapIx);

        let messageV0 = null;
        
        let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
        
        if (isSwap == true) {
          if (createSwapMintATA == true && createSwapTokenATA == true) {
            //console.log("Debug: 1");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                computePriceIx,
                createTempFeeAccountIx,
                createTempMintAccountIx,
                initTempMintAccountIx,
                transferMintIx,
                createSwapMintATAIx,
                createSwapTokenATAIx,
                initializeSwapIx
              ],
            }).compileToV0Message([]);
          } else if (createSwapMintATA == true) {
            //console.log("Debug: 2");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                computePriceIx,
                createTempFeeAccountIx,
                createTempMintAccountIx,
                initTempMintAccountIx,
                transferMintIx,
                createSwapMintATAIx,
                initializeSwapIx
              ],
            }).compileToV0Message([]);
          } else if (createSwapTokenATA == true) {
            //console.log("Debug: 3");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                computePriceIx,
                createTempFeeAccountIx,
                createTempMintAccountIx,
                initTempMintAccountIx,
                transferMintIx,
                createSwapTokenATAIx,
                initializeSwapIx
              ],
            }).compileToV0Message([]);
          } else {
            //console.log("Debug: 4");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                computePriceIx,
                createTempFeeAccountIx,
                createTempMintAccountIx,
                initTempMintAccountIx,
                transferMintIx,
                initializeSwapIx
              ],
            }).compileToV0Message([]);
          }
        } else {

          //console.log("Not a Swap!");

          //console.log(createSwapTokenATA);

          if (createSwapTokenATA == true) {
            //console.log("1 - debug");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                computePriceIx,
                createTempFeeAccountIx,
                createTempMintAccountIx,
                initTempMintAccountIx,
                transferMintIx,
                createSwapTokenATAIx,
                initializeSwapIx
              ],
            }).compileToV0Message([]);
          } else {
            //console.log("2 - debug");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                computePriceIx,
                createTempFeeAccountIx,
                createTempMintAccountIx,
                initTempMintAccountIx,
                transferMintIx,
                initializeSwapIx
              ],
            }).compileToV0Message([]);
          }
        }

        //console.log("messageV0: ", messageV0);
        // ******************************************************************

        // ******************************************************************
        let initializeSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(initializeSwapTx);
          signedTx.sign([tempFeeAccount, tempMintAccount]);
          let signature = await connection.sendTransaction(signedTx);
          //console.log("Signature: ", signature);
          //console.log(`https://solscan.io/tx/${signature}?cluster=devnet`);
          $(".share_sig span.swap_val").html(signature);
          $("#cover_message").html("Finalizing Transaction...");
          let final = await finalized(signature,30,4000);
          if(final != "finalized"){          
            $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
            $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
            $("#cover_message").html(final);
            setTimeout(() => {
              $("#cover").fadeOut(400);
              $("#cover_message").html("");
              $(".share_id .swap_value").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
            }, 3000);
            return;
          }
          $(".types_").val("");
          $(".share_id .swap_val").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $(".swap_f").removeClass("active_swap");
          $(".swap_g").addClass("active_swap");
          $(".mode_switch, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
          $("#donate_sol, .mcprofile_close, #wallet_refresh").show();
          $("ul[data-id='" + $("#create_a_id").val() + "']").remove();
          $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
          $("#create_a_id, #sol_request, #pikl_request, #usdc_request, #create_a_owner, #create_b_owner, #create_b_id").val("");
          $(".swap_img_a, .swap_img_b").attr("src", "/img/img-placeholder.png");
          $("#token_sol, #token_pikl, #token_usdc").attr("src", "/img/check_default.png");
          setTimeout(() => {
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
          }, 3000);
        } 
        catch (error) {
          //console.log("Error Logs: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          //console.log("Error Logs: ", error);
          $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $("#cover_message").html("Error!<br /><br />Canceling Transaction...");
          setTimeout(() => {
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
            $(".share_id .swap_value").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
          }, 3000);
          return;
        }
        // ******************************************************************

      }

      if ($("#a_type").val() == "cNFT") {
        
        let alice_proofs = parseInt($("#proofs_a").html());
//         console.log("Checking if ALT required...");
//         console.log("Alice is sending "+alice_proofs+" proofs...");
        if(alice_proofs > 3){
//           console.log("ALT required.");
          let confirm_two = confirm("This contract requires two transactions to deploy due to its size.");
          if(confirm_two==false){return;}
        }
        else{
//           console.log("ALT not required.");
        }
        
        // these are passed
        let assetId = $("#create_a_id").val();
        let swapAssetId = "11111111111111111111111111111111";
        if($("#create_b_id").val()!="" && $("#create_b_id").val().length >= 32){
          swapAssetId = $("#create_b_id").val();
        }
        let taker = $("#create_b_owner").val();     
        let swapSol = $("#sol_request").val();
        swapLamports = swapSol * conf.billion;
        swapLamports = parseInt(swapLamports);
        
        if ($("#usdc_request").val() > 0) {
          //console.log("usdc request");
          swapTokenMint = new solanaWeb3.PublicKey(conf.usdc);
          swapTokens = $("#usdc_request").val() * 1000000;
          swapTokens = parseInt(swapTokens);
        } 
        else if ($("#pikl_request").val() > 0) {
          //console.log("token request");
          swapTokenMint = new solanaWeb3.PublicKey($(".swap_c_pikl").attr("data-id"));
          let decimals = 9;
          for (let i = 0; i < spl_tokens.length; i++) {
            let item = spl_tokens[i];
            if (item.address == $(".swap_c_pikl").attr("data-id")) {
              decimals = item.decimals;
            }
          }
          swapTokens = $("#pikl_request").val();
          let multiplier = 1;
          for (let i = 0; i < decimals; i++) {
            multiplier = multiplier * 10;
          }
          swapTokens = swapTokens * multiplier;
          swapTokens = parseInt(swapTokens);
        } 
        else {
          swapTokenMint = new solanaWeb3.PublicKey("11111111111111111111111111111111");
          swapTokens = 0;
        }        
        
//         console.log("swapSol", swapSol);
//         console.log("swapLamports", swapLamports);
//         console.log("assetId", assetId);
//         console.log("swapAssetId", swapAssetId);
//         console.log("Bob", taker);
        
        let isSwap = true;
        if (swapAssetId == "11111111111111111111111111111111"){isSwap = false;}
        
        let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-program-state")],cNFTSwapProgramId);
//         console.log("Program State PDA: ", programStatePDA[0].toString());
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]);  
        let feeLamports = null;
        let devTreasury = null;
        let mcDegensTreasury = null;  
        if (programState != null) {
          let encodedProgramStateData = programState.data;
          let decodedProgramStateData = PROGRAM_STATE_CNFT.decode(encodedProgramStateData);
//           console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
//           console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
//           console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
//           console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
//           console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
          feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le");
          devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
          mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
        } 
        else {
          $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $("#cover_message").html("Error, Program State Not Initialized!");
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
          return;
        }        
        
        let axiosInstance = axios.create({baseURL: conf.cluster,});
        
        let getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:assetId},});
//         console.log("getAsset ", getAsset);
//         console.log("data_hash ", getAsset.data.result.compression.data_hash);
//         console.log("creator_hash ", getAsset.data.result.compression.creator_hash);
//         console.log("leaf_id ", getAsset.data.result.compression.leaf_id);        
        let delegate = provider.publicKey;
        if (getAsset.data.result.ownership.delegated == true) {
//             console.log("1");
            delegate = new solanaWeb3.PublicKey(getAsset.data.result.ownership.delegate);
        }
//         console.log("delegate ", delegate.toString());
        if (getAsset.data.result.ownership.owner != provider.publicKey) {
//           console.log("Asset Not owned by provider");
          return;
        }
        
        let getAssetProof = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAssetProof",id:"rpd-op-123",params:{id:assetId},});
//         console.log("getAssetProof ", getAssetProof);
//         console.log("tree_id ", getAssetProof.data.result.tree_id);
//         console.log("proof ", getAssetProof.data.result.proof);
//         console.log("root ", getAssetProof.data.result.root);  
        
        let treeAccount = await splAccountCompression_.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),);  
        let treeAuthorityPDA = treeAccount.getAuthority();
        let canopyDepth = treeAccount.getCanopyDepth();
//         console.log("treeAuthorityPDA ", treeAuthorityPDA.toString());
//         console.log("canopyDepth ", canopyDepth);

        // parse the list of proof addresses into a valid AccountMeta[]
        let proof = getAssetProof.data.result.proof
        .slice(0, getAssetProof.data.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
        .map((node) => ({pubkey: new solanaWeb3.PublicKey(node),isWritable: false,isSigner: false,}));
//         console.log("proof ", proof);
        
        let swapAssetOwner = taker;
        let swapDelegate = taker;
        let swapDatahash = "11111111111111111111111111111111";
        let swapCreatorhash = "11111111111111111111111111111111";
        let swapLeafId = 0;
        let swapTreeId  = "11111111111111111111111111111111";
        let swapRoot  = "11111111111111111111111111111111";
        let swapProof = null;        
        
        if (isSwap == true) {
          let getSwapAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:swapAssetId},});
//           console.log("getSwapAsset ", getSwapAsset);
          
          swapAssetOwner = getSwapAsset.data.result.ownership.owner;
          if (getSwapAsset.data.result.ownership.delegated == true) {
            swapDelegate = getSwapAsset.data.result.ownership.delegate;
          }
          swapDatahash = getSwapAsset.data.result.compression.data_hash;
          swapCreatorhash = getSwapAsset.data.result.compression.creator_hash;
          swapLeafId = getSwapAsset.data.result.compression.leaf_id;
//           console.log("swap data_hash ", swapDatahash);
//           console.log("swap creator_hash ", swapCreatorhash);
//           console.log("swap leaf_id ", swapLeafId);
          
          let getSwapAssetProof = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAssetProof",id:"rpd-op-123",params:{id:swapAssetId},});
//           console.log("getSwapAssetProof ", getSwapAssetProof);

          swapTreeId =  getSwapAssetProof.data.result.tree_id;
          let swapProofTotal = getSwapAssetProof.data.result.proof;
          swapRoot = getSwapAssetProof.data.result.root;
//           console.log("swap tree_id ", swapTreeId);
//           console.log("swap proof total ", swapProofTotal);
//           console.log("swap root ", swapRoot);

          let swapTreeAccount = await splAccountCompression_.ConcurrentMerkleTreeAccount.fromAccountAddress(
          connection,new solanaWeb3.PublicKey(getSwapAssetProof.data.result.tree_id),);
//           console.log("swapTreeAccount ", swapTreeAccount);  
          const swapCanopyDepth = swapTreeAccount.getCanopyDepth();
//           console.log("swap canopyDepth ", swapCanopyDepth);

          // parse the list of proof addresses into a valid AccountMeta[]
          swapProof = getSwapAssetProof.data.result.proof
          .slice(0, getSwapAssetProof.data.result.proof.length - (!!swapCanopyDepth ? swapCanopyDepth : 0))
          .map((node) => ({
            pubkey: new solanaWeb3.PublicKey(node),
            isWritable: false,
            isSigner: false,
          }));
//           console.log("swapProof ", swapProof);
        }
        
        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")],cNFTSwapProgramId);
//         console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());
        
        if (getAsset.data.result.ownership.owner == swapVaultPDA || swapAssetOwner == swapVaultPDA) {
          $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $("#cover_message").html("Error, Asset already in the Swap Vault");
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
          return;
        }
        
        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),new solanaWeb3.PublicKey(assetId).toBytes(),new solanaWeb3.PublicKey(swapAssetId).toBytes()],cNFTSwapProgramId);
//         console.log("Swap State PDA: ", swapStatePDA[0].toString());        
        
        let tokenATA = null;
        let createTokenATA = null;
        let createTokenATAIx = null;
        
        if (swapTokens > 0) {
          tokenATA = await splToken.getAssociatedTokenAddress(
            swapTokenMint,
            provider.publicKey,
            false,
            splToken.TOKEN_PROGRAM_ID,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          );
//           console.log("Token ATA: ", tokenATA.toString());
          let response = null;
          response = await connection.getAccountInfo(tokenATA);
//           console.log("tokenATA response ", response);
          if (response == null) {
            createTokenATA = true;
            createTokenATAIx = splToken.createAssociatedTokenAccountInstruction(
            provider.publicKey,
            tokenATA,
            provider.publicKey,
            swapTokenMint,
            splToken.TOKEN_PROGRAM_ID,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
//             console.log("Create Token ATA Ix: ", createTokenATAIx);    
          }
          else {createTokenATA = false;}
        }
        
        let totalSize = 1 + 1 + 32 + 32 + 32 + 32 + 8 + 32 + 32 + 32 + 32 + 32 + 32 + 32 + 8 + 1 + 8 + 32 + 8;
//         console.log("totalSize", totalSize);        
        
        let uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 0; // 0 = cnft_swap InitializeSwap instruction        
        
        if(isSwap==true){uarray[counter++]=1;}else{uarray[counter++]=0;}        
        
        let arr;
        let byte;
        let index;
        
        let assetIdb58 = bs58.decode(assetId);
        arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
        for (let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}        
        
        let rootb58 = bs58.decode(getAssetProof.data.result.root);
        arr = Array.prototype.slice.call(Buffer.from(rootb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        let datahashb58 = bs58.decode(getAsset.data.result.compression.data_hash);
        arr = Array.prototype.slice.call(Buffer.from(datahashb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        let creatorhashb58 = bs58.decode(getAsset.data.result.compression.creator_hash);
        arr = Array.prototype.slice.call(Buffer.from(creatorhashb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (index = 0; index < byteArray.length; index ++ ) {
            byte = getAsset.data.result.compression.leaf_id & 0xff;
            byteArray [ index ] = byte;
            getAsset.data.result.compression.leaf_id = (getAsset.data.result.compression.leaf_id - byte) / 256 ;
        }
        for (let i = 0; i < byteArray.length; i++) {
            uarray[counter++] = byteArray[i];
        }
        
        /////////////////////////////////////////////////////////////////
        
        let swapAssetIdb58 = bs58.decode(swapAssetId);
        arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }
        
        let swapTreeId58 = bs58.decode(swapTreeId);
        arr = Array.prototype.slice.call(Buffer.from(swapTreeId58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        let swapAssetRootb58 = bs58.decode(swapRoot);
        arr = Array.prototype.slice.call(Buffer.from(swapAssetRootb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        let swapAssetDatahashb58 = bs58.decode(swapDatahash); 
        arr = Array.prototype.slice.call(Buffer.from(swapAssetDatahashb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        let swapAssetCreatorhashb58 = bs58.decode(swapCreatorhash); 
        arr = Array.prototype.slice.call(Buffer.from(swapAssetCreatorhashb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        let swapAssetOwnerb58 = bs58.decode(swapAssetOwner); 
        arr = Array.prototype.slice.call(Buffer.from(swapAssetOwnerb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        let swapDelegateb58 = bs58.decode(swapDelegate); 
        arr = Array.prototype.slice.call(Buffer.from(swapDelegateb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (index = 0; index < byteArray.length; index ++ ) {
          byte = swapLeafId & 0xff;
          byteArray [ index ] = byte;
          swapLeafId = (swapLeafId - byte) / 256 ;
        }
        for (let i = 0; i < byteArray.length; i++) {
          uarray[counter++] = byteArray[i];
        }

        uarray[counter++] = proof.length;
        
        /////////////////////////////////////////////////////////////////
        
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (index = 0; index < byteArray.length; index ++ ) {
            byte = swapLamports & 0xff;
            byteArray [ index ] = byte;
            swapLamports = (swapLamports - byte) / 256 ;
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
        for (index = 0; index < byteArray.length; index ++ ) {
            byte = swapTokens & 0xff;
            byteArray [ index ] = byte;
            swapTokens = (swapTokens - byte) / 256 ;
        }
        for (let i = 0; i < byteArray.length; i++) {
            uarray[counter++] = byteArray[i];
        }

//         console.log("Contract Data: ", uarray);        
        
        /////////////////////////////////////////////////////////////////
        
        let keys = [
          { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
          { pubkey: treeAuthorityPDA, isSigner: false, isWritable: false }, // 3
          { pubkey: new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id), isSigner: false, isWritable: true }, // 4
          { pubkey: delegate, isSigner: false, isWritable: true }, // 5  HERE
          { pubkey: mplBubblegum_.PROGRAM_ID, isSigner: false, isWritable: false }, // 6
          { pubkey: splAccountCompression_.PROGRAM_ID, isSigner: false, isWritable: false }, // 7
          { pubkey: splAccountCompression_.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
          { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 9
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 10  HERE  I renamed cNFTProgramStatePDA to programStatePDA :)
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 11
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 12
        ];
        for (let i = 0; i < proof.length; i++) {
          keys.push(proof[i]);
        }
//         console.log("keys ", keys);        
        
        /////////////////////////////////////////////////////////////////
        
        let initializeSwapIx = new solanaWeb3.TransactionInstruction({
          programId: cNFTSwapProgramId,
          data: Buffer.from(uarray),
          keys: keys,
        });
//         console.log("Initialize Swap Ix: ", initializeSwapIx);
        
        let msLookupTable = new solanaWeb3.PublicKey(conf.system_alt); // mainnet
        let lookupTableAccount = null;
        
        if (proof.length > 3) {
          
          let slot = await connection.getSlot();
          let [createALTIx, lookupTableAddress] =
          solanaWeb3.AddressLookupTableProgram.createLookupTable({
            authority: provider.publicKey,
            payer: provider.publicKey,
            recentSlot: slot,
          });
//           console.log("Lookup Table Address", lookupTableAddress.toBase58(), lookupTableAddress);

          let proofPubkeys = [];
          for (let i = 0; i < proof.length; i++) {
            proofPubkeys.push(proof[i].pubkey);
          }
//           console.log("proofPubkeys ", proofPubkeys);

          let extendALTIx = solanaWeb3.AddressLookupTableProgram.extendLookupTable({
            payer: provider.publicKey,
            authority: provider.publicKey,
            lookupTable: lookupTableAddress,
            addresses: [...proofPubkeys,],
          });
//           console.log("extendALTIx ", extendALTIx);
          
          let msLookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res) => res.value);
          if (!msLookupTableAccount) {
            $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
            $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
            $("#cover_message").html("Error! Could not fetch McSwap ALT!");
            setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
            return;
          }    

          let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
          let mcswapMessageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [computePriceIx, createALTIx, extendALTIx],
          }).compileToV0Message([msLookupTableAccount]);
          
          let createALTTx = new solanaWeb3.VersionedTransaction(mcswapMessageV0);
          try {
            let signedTx = await provider.signTransaction(createALTTx);
            let txId = await connection.sendTransaction(signedTx);
//             console.log("Signature: ", txId);
            let final = await finalized(txId,30,4000);
            if(final != "finalized"){
              $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
              $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
              $("#cover_message").html("Error Creating ALT!");
              setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);  
              return;
            }
          } 
          catch(error) {
            $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
            $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
            $("#cover_message").html("Sorry, Transaction Error!");
            setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);          
            console.log("Error: ", error);
            error = JSON.stringify(error);
            error = JSON.parse(error);
            console.log("Error Logs: ", error);
            return;
          }
          
          // await new Promise(_ => setTimeout(_, 10000));
          
          lookupTableAccount = await connection.getAddressLookupTable(lookupTableAddress).then((res) => res.value);
          
        } 
        else{
          lookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res) => res.value);    
        }
        
        if(!lookupTableAccount) {
          $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $("#cover_message").html("Could not fetch ALT!");
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
          return;
        }
        
        /////////////////////////////////////////////////////////////////
        
        let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
        let messageV0 = null;
        if (createTokenATA == true) {
          messageV0 = new solanaWeb3.TransactionMessage({
            payerKey: provider.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
            instructions: [computePriceIx, createTokenATAIx, initializeSwapIx],
          }).compileToV0Message([lookupTableAccount]);
//           console.log("token");
        } 
        else {
          messageV0 = new solanaWeb3.TransactionMessage({
            payerKey: provider.publicKey,
            recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
            instructions: [computePriceIx, initializeSwapIx],
          }).compileToV0Message([lookupTableAccount]);
//           console.log("none");
        }
//         console.log("messageV0 ", messageV0);
        
        /////////////////////////////////////////////////////////////////
        
        let tx = new solanaWeb3.VersionedTransaction(messageV0);
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(tx);
          let txId = await connection.sendTransaction(signedTx);
//           console.log("Signature: ", txId);
          $(".share_sig span.swap_val").html(txId);
          $("#cover_message").html("Deploying Contract...");
          let final = await finalized(txId,40,4000);
          if(final != "finalized"){
            $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
            $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
            $("#cover_message").html("Oh No! Transaction Dropped!");
            $(".share_id .swap_val").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
            setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
            return;
          }
          $("#cover_message").html("Success!");
          setTimeout(function(){
            $(".types_").val("");
            $(".share_id .swap_val").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
            $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
            $(".swap_f").removeClass("active_swap");
            $(".swap_g").addClass("active_swap");
            $(".mode_switch, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
            $("#donate_sol, .mcprofile_close, #wallet_refresh").show();
            $("ul[data-id='" + $("#create_a_id").val() + "']").remove();
            $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
            $("#create_a_id, #sol_request, #pikl_request, #usdc_request, #create_a_owner, #create_b_owner, #create_b_id").val("");
            $(".swap_img_a, .swap_img_b").attr("src", "/img/img-placeholder.png");
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
            $("#token_sol, #token_pikl, #token_usdc").attr("src", "/img/check_default.png");
            $(".proofs_").hide();
            $("#swap_deploy").css({"width": "149px"});
            $(".swap_cancel_b").show();
          },3000);          
        } 
        catch(error) {
          $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $("#cover_message").html("Sorry, Transaction Error!");
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);          
          console.log("Error: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error Logs: ", error);
          return;
        } 
        
        ///////////////////////////////////////////////////////////////// 
        
      }

    } 
    else {
      return;
    }
    
  }
  $(document).delegate("#swap_deploy", "click", deploy_proposal);
  
  // execute swap
  async function execute_swap() {
    provider = wallet_provider();
    if (provider.isConnected === true) {

      $("#swap_execute").prop("disabled", true);
      $("#swap_executing").addClass("provisioning").html("Executing...");
      $("#cover").fadeIn(400);
      $("#cover_message").html("Preparing Transaction...");

      // check balances before going any further!
      let balance_error = false;
      if ($("#fulfil_sol_request").val() > 0 && $(".sol_balance").html() <= 0 || $(".sol_balance").html() <= $("#fulfil_sol_request").val()) {
        balance_error = "Not enough SOL!";
      }
//       else if ($("#fulfil_usdc_request").val() > 0 && $(".usdc_balance").html() <= 0 || $(".usdc_balance").html() < $("#fulfil_usdc_request").val()) {
//         balance_error = "Not enough USDC!";
//       }
      if (balance_error == false) {} else {
        //console.log(balance_error);
        $("#cover_message").html("Error! " + balance_error);
        $("#swap_execute").prop("disabled", false);
        $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
        setTimeout(() => {
          $("#cover_message").html("");
          $("#cover").fadeOut(400);
        }, 3000);
        return;
      }
      
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let acct = $(".fee_prov_alt .swap_val").html();
      
      if ($("#c_type").val() == "cNFT") {
        
        // these are passed
        let assetId = $("#fulfil_a_id").val();
        let swapAssetId = $("#fulfil_b_id").val();
        if(swapAssetId==""){
          let swapAssetId = "11111111111111111111111111111111";
        }
        
//         console.log("assetId ", assetId);
//         console.log("swapAssetId ", swapAssetId);        
        
        let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);     
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-program-state")],cNFTSwapProgramId);
//         console.log("Program State PDA: ", programStatePDA[0].toString());    

        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0])
        .catch(function(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error: ", error);
          return;
        }); 
        
        let feeLamports = null;
        let devTreasury = null;
        let mcDegensTreasury = null;
        if (programState != null){
          let encodedProgramStateData = programState.data;
          let decodedProgramStateData = PROGRAM_STATE_CNFT.decode(encodedProgramStateData);
//           console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
//           console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
//           console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
//           console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
//           console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
          feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le");
          devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
          mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
        }
        else{
//           console.log("Program State Not Initialized");    
          return;
        }        
        
        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),new solanaWeb3.PublicKey(assetId).toBytes(),new solanaWeb3.PublicKey(swapAssetId).toBytes()],cNFTSwapProgramId);
//         console.log("Swap State PDA: ", swapStatePDA[0].toString());
        
        let swapState = null;
        swapState = await connection.getAccountInfo(swapStatePDA[0])
        .catch(function(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error: ", error);
          return;
        });        
        
        let isSwap = true;
        let swapInitializer = null;
        let swapLeafOwner = null;
        let swapDelegate = null;
        let swapLamports = null;
        let swapTokens = null;
        let swapTokenMint = null;        
        if(swapState != null){
          let encodedSwapStateData = swapState.data;
          let decodedSwapStateData = SWAP_CNFT_STATE.decode(encodedSwapStateData);
//           console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
//           console.log("swapState - utime: ", new BN(decodedSwapStateData.utime, 10, "le").toString());  // HERE
//           console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
//           console.log("swapState - delegate: ", new solanaWeb3.PublicKey(decodedSwapStateData.delegate).toString());  // HERE
//           console.log("swapState - is_swap: ", new BN(decodedSwapStateData.is_swap, 10, "le").toString()); 
//           console.log("swapState - asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.asset_id).toString());
//           console.log("swapState - merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.merkle_tree).toString());
//           console.log("swapState - root: ", new solanaWeb3.PublicKey(decodedSwapStateData.root).toString());
//           console.log("swapState - data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.data_hash).toString());
//           console.log("swapState - creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.creator_hash).toString());
//           console.log("swapState - nonce", new BN(decodedSwapStateData.nonce, 10, "le").toString());
//           console.log("swapState - swap_asset_id: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_asset_id).toString());
//           console.log("swapState - swap_merkle_tree: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_merkle_tree).toString());
//           console.log("swapState - swap_root: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_root).toString());
//           console.log("swapState - swap_data_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_data_hash).toString());
//           console.log("swapState - swap_creator_hash: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_creator_hash).toString());
//           console.log("swapState - swap_nonce", new BN(decodedSwapStateData.swap_nonce, 10, "le").toString());
//           console.log("swapState - swap_leaf_owner: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString());
//           console.log("swapState - swap_delegate: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_delegate).toString());
//           console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
//           console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
//           console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
          if(new BN(decodedSwapStateData.is_swap,10,"le")==0){isSwap=false;}
          swapInitializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
          swapLeafOwner = new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner);
          swapDelegate = new solanaWeb3.PublicKey(decodedSwapStateData.swap_delegate);
          swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
          swapTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint);
          swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
        } 
        else{
//           console.log("Swap Not Initialized");    
          return;
        }
        
        let axiosInstance = axios.create({baseURL:conf.cluster,});
        
        let getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:assetId},});
//         console.log("data_hash ", getAsset.data.result.compression.data_hash);
//         console.log("creator_hash ", getAsset.data.result.compression.creator_hash);
//         console.log("leaf_id ", getAsset.data.result.compression.leaf_id);        
        
        let getAssetProof = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAssetProof",id:"rpd-op-123",params:{id:assetId},});
//         console.log("tree_id ", getAssetProof.data.result.tree_id);
//         console.log("proof ", getAssetProof.data.result.proof);
//         console.log("root ", getAssetProof.data.result.root);
        
        let treeAccount = await splAccountCompression_.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),);  
        const treeAuthorityPDA = treeAccount.getAuthority();
        const canopyDepth = treeAccount.getCanopyDepth();
//         console.log("treeAuthorityPDA ", treeAuthorityPDA.toString());
//         console.log("canopyDepth ", canopyDepth);
        
        let proof = getAssetProof.data.result.proof
        .slice(0, getAssetProof.data.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
        .map((node) => ({pubkey: new solanaWeb3.PublicKey(node),isWritable: false,isSigner: false,}));
//         console.log("proof ", proof);
        
        let swapDatahash = "11111111111111111111111111111111";
        let swapCreatorhash = "11111111111111111111111111111111";
        let swapLeafId = 0;
        let swapTreeId = "11111111111111111111111111111111";
        let swapRoot = "11111111111111111111111111111111";
        let swapTreeAuthorityPDA = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        let swapProof = null;        
        
        if (isSwap == true) {
          let getSwapAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:swapAssetId},});
          swapDatahash = getSwapAsset.data.result.compression.data_hash;
          swapCreatorhash = getSwapAsset.data.result.compression.creator_hash;
          swapLeafId = getSwapAsset.data.result.compression.leaf_id;
//           console.log("swap data_hash ", swapDatahash);
//           console.log("swap creator_hash ", swapCreatorhash);
//           console.log("swap leaf_id ", swapLeafId);

          let getSwapAssetProof = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAssetProof",id:"rpd-op-123",params:{id:swapAssetId},});
          swapTreeId = getSwapAssetProof.data.result.tree_id;
          swapRoot = getSwapAssetProof.data.result.root;
//           console.log("swap proof total ", getSwapAssetProof.data.result.proof);
//           console.log("swap tree_id ", swapTreeId);
//           console.log("swap root ", swapRoot);
          
          let swapTreeAccount = await splAccountCompression_.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new solanaWeb3.PublicKey(getSwapAssetProof.data.result.tree_id),);
//           console.log("swapTreeAccount ", swapTreeAccount);  
          swapTreeAuthorityPDA = swapTreeAccount.getAuthority();
          let swapCanopyDepth = swapTreeAccount.getCanopyDepth();
//           console.log("swap treeAuthorityPDA ", swapTreeAuthorityPDA.toString());
//           console.log("swap canopyDepth ", swapCanopyDepth);
          
          swapProof = getSwapAssetProof.data.result.proof
          .slice(0, getSwapAssetProof.data.result.proof.length - (!!swapCanopyDepth ? swapCanopyDepth : 0))
          .map((node) => ({pubkey: new solanaWeb3.PublicKey(node),isWritable: false,isSigner: false,}));        
//           console.log("swapProof ", swapProof);
        }
        
        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")],cNFTSwapProgramId);
//         console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());
        if (getAsset.data.result.ownership.owner == swapVaultPDA || swapLeafOwner == swapVaultPDA) { 
//           console.log("One or both cNFTs are already in the Swap Vault");
          return;
        }            
        
        let providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
//         console.log("Provider Token ATA: ", providerTokenATA.toString());        
        
        let initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,swapInitializer,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
//         console.log("Initializer Token ATA: ", initializerTokenATA.toString());

        var totalSize = 1 + 32 + 32 + 1 + 1;
//         console.log("totalSize", totalSize);

        var uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 1; // 1 = cnft_swap SwapcNFTs instruction
        
        let arr;
        
        let assetIdb58 = bs58.decode(assetId);
        arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
        for (let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}

        let swapAssetIdb58 = bs58.decode(swapAssetId);
        arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
        for (let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}

        uarray[counter++] = proof.length;
        if (isSwap == true) {
            uarray[counter++] = swapProof.length;
        } 
        else {
            uarray[counter++] = 0;
        }

//         console.log("Contract Data: ", uarray);
        
        let keys = [
          { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
          { pubkey: new solanaWeb3.PublicKey(swapInitializer), isSigner: false, isWritable: true }, // 1
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
          { pubkey: treeAuthorityPDA, isSigner: false, isWritable: false }, // 4
          { pubkey: new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id), isSigner: false, isWritable: true }, // 5
          { pubkey: swapTreeAuthorityPDA, isSigner: false, isWritable: false }, // 6
          { pubkey: new solanaWeb3.PublicKey(swapTreeId), isSigner: false, isWritable: true }, // 7 
          { pubkey: new solanaWeb3.PublicKey(swapDelegate), isSigner: false, isWritable: true }, // 8  HERE
          { pubkey: mplBubblegum_.PROGRAM_ID, isSigner: false, isWritable: false }, // 9
          { pubkey: splAccountCompression_.PROGRAM_ID, isSigner: false, isWritable: false }, // 10
          { pubkey: splAccountCompression_.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 11
          { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 12
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 13
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 14  HERE Changed cNFTProgramStatePDA to programStatePDA :)
          { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 15  HERE Changed tempTokenAccount to providerTokenATA
          { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 16
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 17
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 18
        ];
        for (let i = 0; i < proof.length; i++) {
            keys.push(proof[i]);
        }    
        if (isSwap == true) {
            for (let i = 0; i < swapProof.length; i++) {
                keys.push(swapProof[i]);
            }
        }
//         console.log("keys ", keys);
        
        let swapcNFTsIx = new solanaWeb3.TransactionInstruction({programId:cNFTSwapProgramId,data:Buffer.from(uarray),keys:keys,});
//         console.log("Swap NFTs Ix: ", swapcNFTsIx);        
        
        let msLookupTable = new solanaWeb3.PublicKey(conf.system_alt);
        let lookupTableAccount = null;
        if (proof.length + swapProof.length > 6) {
          let slot = await connection.getSlot();
          let [createALTIx, lookupTableAddress] =
          solanaWeb3.AddressLookupTableProgram.createLookupTable({
            authority: provider.publicKey,
            payer: provider.publicKey,
            recentSlot: slot,
          });
//           console.log("Lookup Table Address", lookupTableAddress.toBase58());

          let proofPubkeys = [];
          for (let i = 0; i < proof.length; i++) {proofPubkeys.push(proof[i].pubkey);}
//           console.log("proofPubkeys ", proofPubkeys);

          let swapProofPubkeys = [];
          if (isSwap == true) {
            for (let i = 0; i < swapProof.length - 1; i++) {swapProofPubkeys.push(swapProof[i].pubkey);}
          }
//           console.log("swapProofPubkeys ", swapProofPubkeys);
          
          let extendALTIx = null;
          if (isSwap == true) {
            extendALTIx = solanaWeb3.AddressLookupTableProgram.extendLookupTable({
              payer: provider.publicKey,
              authority: provider.publicKey,
              lookupTable: lookupTableAddress,
              addresses: [...proofPubkeys,...swapProofPubkeys,],
            });
          } 
          else {
            extendALTIx = solanaWeb3.AddressLookupTableProgram.extendLookupTable({
              payer: provider.publicKey,
              authority: provider.publicKey,
              lookupTable: lookupTableAddress,
              addresses: [...proofPubkeys,],
            });
          }
//           console.log("extendALTIx ", extendALTIx);
          
          let msLookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res) => res.value);
          if (!msLookupTable) {
//             console.log("Could not fetch McSwap ALT!");
            return;
          }
          
          let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft_exec").val()),});
          let mcswapMessageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [computePriceIx, createALTIx, extendALTIx],
          }).compileToV0Message([msLookupTableAccount]);
          
          let createALTTx = new solanaWeb3.VersionedTransaction(mcswapMessageV0);
          
          try {
            let signedTx = await provider.signTransaction(createALTTx);
            let txId = await connection.sendTransaction(signedTx);
//             console.log("Signature: ", txId);
            $("#cover_message").html("Creating ALT...");
            let final = await finalized(txId,30,4000);
            if(final != "finalized"){
//               console.log("ALT Error: ", final);
              return;
            }
          } 
          catch(error) {
            console.log("Error: ", error);
            error = JSON.stringify(error);
            error = JSON.parse(error);
            console.log("Error Logs: ", error);
            return;
          }
          lookupTableAccount = await connection.getAddressLookupTable(lookupTableAddress).then((res) => res.value);
        } 
        else {
          lookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res) => res.value);
        }
        
        if (!lookupTableAccount) {
//           console.log("Could not fetch ALT!");
          return;
        }        
        
        let priority = parseInt($("#priority_nft_exec").val());
        let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:priority,});
        let computeLimitIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:250000,}); 
//         console.log("priority", priority);
//         console.log("provider", provider.publicKey.toString());
//         console.log("messageV0 ", (await connection.getRecentBlockhash('confirmed')).blockhash);
        
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [computePriceIx, computeLimitIx, swapcNFTsIx],
        }).compileToV0Message([lookupTableAccount]);
        
//         console.log("messageV0 ", messageV0);
        
        let tx = new solanaWeb3.VersionedTransaction(messageV0);
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(tx);
          let txId = await connection.sendTransaction(signedTx);
//           console.log("Signature: ", txId);
          $(".share_fulfil_sig .swap_val").html(txId);
          $("#cover_message").html("Executing Contract...");
          let final = await finalized(txId,30,4000);
          if(final != "finalized"){
            $("#cover_message").html(final);
            setTimeout(function(){
              $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
              $("#cover").fadeOut(400);
              $("#cover_message").html("");
              $("#swap_execute").prop("disabled",false);
            },3000);
            return;
          }
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          $(".fulfil_e").removeClass("active_swap");
          $(".fulfil_f").addClass("active_swap");
          $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
          $(".mcprofile_close, #wallet_refresh").show();
          $("ul[data-id='" + $("#fulfil_b_id").val() + "']").remove();
          $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
          $("#c_type, #d_type, #fulfil_a_id, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request, #fulfil_a_owner, #fulfil_b_owner, #fulfil_b_id").val("");
          $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
          $(".fee_fulfil_sig .swap_val, .fee_fulfil_alt .swap_val").html("");
          $(".proofs_, .proofs_view").html("").hide();
          history.pushState("", "", '/');
          $("#wallet_refresh").click();
        } 
        catch(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log(error);
          $("#cover_message").html("Transaction Failed!");
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_execute").prop("disabled",false);},3000);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          return;
        }        
      }
      
      if ($("#c_type").val() == "NFT") {

        // These are passed
        let mint = $("#fulfil_a_id").val();
        let swapMint = "11111111111111111111111111111111";
        if ($("#fulfil_b_id").val() != "") {
          swapMint = $("#fulfil_b_id").val();
        }
        //console.log("mint ", mint);
        //console.log("swapMint ", swapMint);

        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        let feeLamports = conf.fee;
        let devTreasury = new solanaWeb3.PublicKey(conf.treasury_studio_nft);
        let mcDegensTreasury = new solanaWeb3.PublicKey(conf.treasury);

        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")], NFTSwapProgramId);
        //console.log("Program State PDA: ", programStatePDA[0].toString());

        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], NFTSwapProgramId);
        //console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
          new solanaWeb3.PublicKey(mint).toBytes(), new solanaWeb3.PublicKey(swapMint).toBytes()
        ], NFTSwapProgramId);
        //console.log("Swap State PDA: ", swapStatePDA[0].toString());      

        let swapState = null;
        await connection.getAccountInfo(swapStatePDA[0])
          .then(function(response) {
            swapState = response;
          })
          .catch(function(error) {
            error = JSON.stringify(error);
            error = JSON.parse(error);
            //console.log("Error: ", error);
          });

        let isSwap = true;
        let initializer = null;
        let tempMintAccount = null;
        let initializer_mint = null;
        let swapLamports = null;
        let swapTokenMint = null;
        swapTokens = null;

        if (swapState != null) {
          //console.log("swapState = not null");
          let encodedSwapStateData = swapState.data;
          let decodedSwapStateData = SWAP_NFT_STATE.decode(encodedSwapStateData);
          //console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
          //console.log("swapState - is_swap: ", new BN(decodedSwapStateData.is_swap, 10, "le").toString());
          //console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
          //console.log("swapState - initializer_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint).toString());
          //console.log("swapState - temp_mint_account: ", new solanaWeb3.PublicKey(decodedSwapStateData.temp_mint_account).toString());
          //console.log("swapState - taker: ", new solanaWeb3.PublicKey(decodedSwapStateData.taker).toString());
          //console.log("swapState - swap_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_mint).toString());
          //console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
          //console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
          //console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
          if (new BN(decodedSwapStateData.is_swap, 10, "le") == 0) {
            isSwap = false
          }
          initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
          initializer_mint = new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint);
          tempMintAccount = new solanaWeb3.PublicKey(decodedSwapStateData.temp_mint_account);
          swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
          swapTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint);
          swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
        } else {
          //console.log("swapState = null");
          $("#cover_message").html("Error - Swap Not Initialized!");
          //console.log("Swap Not Initialized");
          return;
        }

        let createInitializerMintATA = null;
        let createInitializerMintATAIx = null;
        let initializerMintATA = await splToken.getAssociatedTokenAddress(initializer_mint, provider.publicKey,
          false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        //console.log("Initializer Mint ATA: ", initializerMintATA.toString());

        let response = null;
        response = await connection.getAccountInfo(initializerMintATA);
        if (response == null) {
          //console.log("response = null");
          createInitializerMintATA = true;
          createInitializerMintATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey, initializerMintATA,
            provider.publicKey, initializer_mint, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, )
          //console.log("Create Initializer Mint ATA Ix: ", createInitializerMintATAIx);
        } else {
          //console.log("response = not null");
          createInitializerMintATA = false;
        }
        //console.log("createInitializerMintATA ", createInitializerMintATA);

        const tempSwapMintAccount = new solanaWeb3.Keypair();
        //console.log("Temp Swap Mint Account: ", tempSwapMintAccount.publicKey.toString());

        let createTempSwapMintAccount = false;
        let createTempSwapMintAccountIx = null;
        let initTempSwapMintAccountIx = null;
        let transferSwapMintIx = null;
        let swapMintATA = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        if (swapMint != "11111111111111111111111111111111") {

          createTempSwapMintAccount = true;
          let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
          createTempSwapMintAccountIx = solanaWeb3.SystemProgram.createAccount({
            programId: splToken.TOKEN_PROGRAM_ID,
            space: splToken.AccountLayout.span,
            lamports: rent,
            fromPubkey: provider.publicKey,
            newAccountPubkey: tempSwapMintAccount.publicKey,
          });
          //console.log("Create Temp Swap Mint Account Ix: ", createTempSwapMintAccountIx);    

          initTempSwapMintAccountIx = splToken.createInitializeAccountInstruction(
            tempSwapMintAccount.publicKey,
            new solanaWeb3.PublicKey(swapMint),
            tempSwapMintAccount.publicKey,
            splToken.TOKEN_PROGRAM_ID
          );
          //console.log("Init Temp Swap Mint Account Ix: ", initTempSwapMintAccountIx)

          let providerSwapMintATA = await splToken.getAssociatedTokenAddress(
            new solanaWeb3.PublicKey(swapMint),
            provider.publicKey,
            false,
            splToken.TOKEN_PROGRAM_ID,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          );
          transferSwapMintIx = splToken.createTransferInstruction(
            providerSwapMintATA,
            tempSwapMintAccount.publicKey,
            provider.publicKey,
            1,
            provider.publicKey,
            splToken.TOKEN_PROGRAM_ID,
          );
          //console.log("Transfer Swap Mint Ix: ", transferSwapMintIx);

          swapMintATA = await splToken.getAssociatedTokenAddress(
            new solanaWeb3.PublicKey(swapMint),
            initializer,
            false,
            splToken.TOKEN_PROGRAM_ID,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          );
          //console.log("Swap Mint ATA: ", swapMintATA.toString()); 

        }

        let totalFee = parseInt(feeLamports) + parseInt(swapLamports);
        //console.log("totalFee ", totalFee);
        tempFeeAccount = new solanaWeb3.Keypair();
        //console.log("Temp Fee Account: ", tempFeeAccount.publicKey.toString());
        createTempFeeAccountIx = solanaWeb3.SystemProgram.createAccount({
          programId: NFTSwapProgramId,
          space: 0,
          lamports: totalFee,
          fromPubkey: provider.publicKey,
          newAccountPubkey: tempFeeAccount.publicKey,
        });
        //console.log("Create Temp Fee Account Tx: ", createTempFeeAccountIx);      

        let providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,
          provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        //console.log("Provider Token ATA: ", providerTokenATA.toString());

        const tempTokenAccount = new solanaWeb3.Keypair();
        //console.log("Temp Token Account: ", tempTokenAccount.publicKey.toString());
        createTempTokenAccount = false;
        createTempTokenAccountIx = null;
        initTempTokenAccountIx = null;
        transferTokenIx = null;
        let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
        if (swapTokens > 0) {
          createTempTokenAccount = true;
          createTempTokenAccountIx = solanaWeb3.SystemProgram.createAccount({
            programId: splToken.TOKEN_PROGRAM_ID,
            space: splToken.AccountLayout.span,
            lamports: rent,
            fromPubkey: provider.publicKey,
            newAccountPubkey: tempTokenAccount.publicKey,
          });
          //console.log("Create Temp Token Account Ix: ", createTempTokenAccountIx);    
          initTempTokenAccountIx = splToken.createInitializeAccountInstruction(tempTokenAccount.publicKey,
            swapTokenMint, tempTokenAccount.publicKey, splToken.TOKEN_PROGRAM_ID);
          //console.log("Init Temp Token Account Ix: ", initTempTokenAccountIx);
          transferTokenIx = splToken.createTransferInstruction(providerTokenATA,
            tempTokenAccount.publicKey,
            provider.publicKey,
            parseInt(swapTokens),
            provider.publicKey,
            splToken.TOKEN_PROGRAM_ID, );
          //console.log("Transfer Token Ix: ", transferTokenIx);
        }

        let initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,
          initializer, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        //console.log("Initializer Token ATA: ", initializerTokenATA.toString());

        let totalSize = 1;
        //console.log("totalSize", totalSize);
        let uarray = new Uint8Array(totalSize);
        let counter = 0;
        uarray[counter++] = 1; // 1 = nft_swap SwapNFTs instruction
        //console.log("Data: ", uarray);

        let swapNFTsIx = new solanaWeb3.TransactionInstruction({
          programId: NFTSwapProgramId,
          data: Buffer.from(uarray),
          keys: [{
              pubkey: provider.publicKey,
              isSigner: true,
              isWritable: true
            }, // 0
            {
              pubkey: initializer,
              isSigner: false,
              isWritable: true
            }, // 1
            {
              pubkey: programStatePDA[0],
              isSigner: false,
              isWritable: false
            }, // 2
            {
              pubkey: swapVaultPDA[0],
              isSigner: false,
              isWritable: false
            }, // 3
            {
              pubkey: swapStatePDA[0],
              isSigner: false,
              isWritable: true
            }, // 4
            {
              pubkey: tempMintAccount,
              isSigner: false,
              isWritable: true
            }, // 5
            {
              pubkey: initializerMintATA,
              isSigner: false,
              isWritable: true
            }, // 6
            {
              pubkey: tempSwapMintAccount.publicKey,
              isSigner: true,
              isWritable: true
            }, // 7
            {
              pubkey: swapMintATA,
              isSigner: false,
              isWritable: true
            }, // 8
            {
              pubkey: splToken.TOKEN_PROGRAM_ID,
              isSigner: false,
              isWritable: false
            }, // 9
            {
              pubkey: tempFeeAccount.publicKey,
              isSigner: true,
              isWritable: true
            }, // 10
            {
              pubkey: tempTokenAccount.publicKey,
              isSigner: true,
              isWritable: true
            }, // 11
            {
              pubkey: initializerTokenATA,
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
          ]
        });
        //console.log("Swap NFTs Ix: ", swapNFTsIx);      

        let lookupTable = new solanaWeb3.PublicKey("BT4AUPXSxvbDrzSt3LLkE3Jd5s8R3fBSxJuyicyEMYH3"); // mainnet    
        let lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
        if (!lookupTableAccount) {
          //console.log("Could not fetch ALT!");
          return;
        }
        
        let messageV0 = null;
        if (isSwap == true) {
          if (createInitializerMintATA == true && createTempTokenAccount == true) {
            //console.log("1");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createInitializerMintATAIx,
                createTempSwapMintAccountIx,
                initTempSwapMintAccountIx,
                transferSwapMintIx,
                createTempFeeAccountIx,
                createTempTokenAccountIx,
                initTempTokenAccountIx,
                transferTokenIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          } else if (createInitializerMintATA == true) {
            //console.log("2");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createInitializerMintATAIx,
                createTempSwapMintAccountIx,
                initTempSwapMintAccountIx,
                transferSwapMintIx,
                createTempFeeAccountIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          } else if (createTempTokenAccount == true) {
            //console.log("3");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createTempSwapMintAccountIx,
                initTempSwapMintAccountIx,
                transferSwapMintIx,
                createTempFeeAccountIx,
                createTempTokenAccountIx,
                initTempTokenAccountIx,
                transferTokenIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          } else {
            //console.log("4");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createTempSwapMintAccountIx,
                initTempSwapMintAccountIx,
                transferSwapMintIx,
                createTempFeeAccountIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          }
        } else {
          if (createInitializerMintATA == true && createTempTokenAccount == true) {
            //console.log("5");    
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createInitializerMintATAIx,
                createTempFeeAccountIx,
                createTempTokenAccountIx,
                initTempTokenAccountIx,
                transferTokenIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          } else if (createInitializerMintATA == true) {
            //console.log("6");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createInitializerMintATAIx,
                createTempFeeAccountIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          } else if (createTempTokenAccount == true) {
            //console.log("7");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createTempFeeAccountIx,
                createTempTokenAccountIx,
                initTempTokenAccountIx,
                transferTokenIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          } else {
            //console.log("8");
            messageV0 = new solanaWeb3.TransactionMessage({
              payerKey: provider.publicKey,
              recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
              instructions: [
                createTempFeeAccountIx,
                swapNFTsIx,
              ],
            }).compileToV0Message([lookupTableAccount]);
          }
        }
        //console.log("messageV0 ", messageV0);      
        
        let swapNFTSTx = new solanaWeb3.VersionedTransaction(messageV0);
        try {
          let signedTx = await provider.signTransaction(swapNFTSTx);
          signedTx.sign([tempSwapMintAccount, tempFeeAccount, tempTokenAccount]);
          let signature = await connection.sendTransaction(signedTx);
          //console.log("Signature: ", signature);
          //console.log(`https://solscan.io/tx/${signature}`);
          $(".share_fulfil_sig .swap_val").html(signature);
          $("#cover_message").html("Finalizing Transaction...");

          let executeID = setInterval(async function() {
            let tx_status = await connection.getSignatureStatuses([signature], {
              searchTransactionHistory: true,
            });
            if (tx_status.value[0].confirmationStatus == undefined) {
              // console.log("Bad Status...");
            } else if (tx_status.value[0].confirmationStatus == "finalized") {
              clearInterval(executeID);
              $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
              $(".fulfil_e").removeClass("active_swap");
              $(".fulfil_f").addClass("active_swap");
              $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
              $(".mcprofile_close, #wallet_refresh").show();
              $("ul[data-id='" + $("#fulfil_b_id").val() + "']").remove();
              $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
              $("#fulfil_a_id, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request, #fulfil_a_owner, #fulfil_b_owner, #fulfil_b_id").val("");
              $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
              $("#cover").fadeOut(400);
              $("#cover_message").html("");
              $(".proofs_").hide();
              history.pushState("", "", '/');
              $("#wallet_refresh").click();
            }
          }, 3000);

        } 
        catch (error) {
          //console.log("Error: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          //console.log("Error Logs: ", error);
          $("#cover_message").html("");
          $("#cover").fadeOut(400);
          $("#swap_execute").prop("disabled", false);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          return;
        }


      }
      
    } else {
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
        alert("McSwap Link copied, but you better make sure!");
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

  // expand/minimize nft image
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
    $("#mode_spl").click();
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
  
  // swap viewer
  async function swap_viewer() {
    let pathArray = window.location.pathname.split('/');
    if (typeof pathArray[1] != "undefined" && typeof pathArray[2] != "undefined" &&
      pathArray[1] == "propose" &&
      pathArray[1] != "" &&
      pathArray[2] != ""
    ) {
      $(".mcprofile_open").click();
      setTimeout(() => {
        if (typeof pathArray[3] != "undefined" && pathArray[3] != "") {
          $("#chooser_" + pathArray[3]).click();
          history.pushState("", "", '/');
        } else {
          $("#wallet_connect").click();
        }
      }, 100);
      $("#create_a_id").val(pathArray[2]);
    } else if (typeof pathArray[1] != "undefined" && typeof pathArray[2] != "undefined" &&
      pathArray[1] == "swap" &&
      pathArray[1] != "" &&
      pathArray[2] != ""
    ) {
      
      $("#mc_swap_viewer .mc_title").html("Fetching Contract...");
      $(".fee_fulfil_sig .swap_val, .fee_fulfil_alt .swap_val, .share_fulfil_sig .swap_val").html("");
      
      let ids = pathArray[2].split("-");
      try {
      
      let test_a_key = new solanaWeb3.PublicKey(ids[0]);
      let test_b_key = new solanaWeb3.PublicKey(ids[1]);
            
      $("#fulfil_a_id").val(ids[0]);
      $("#fulfil_b_id").val(ids[1]);
      $("#nav_view").click();
      $(".mcprofile_open").show().click();
      $("#mode_spl").click();
      
      provider = wallet_provider();
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let axiosInstance = axios.create({
        baseURL: conf.cluster,
      });
      
      let assetId = $("#fulfil_a_id").val();
//       console.log("assetId ", assetId);
      let getAsset = await axiosInstance.post(conf.cluster, {
        jsonrpc: "2.0",
        method: "getAsset",
        id: "rpd-op-123",
        params: {
          id: assetId
        },
      });
//       console.log(getAsset);
      
//       console.log("typeof getAsset", typeof getAsset);
//       console.log("typeof getAsset.data.result", typeof getAsset.data.result);
      
      if (typeof getAsset == "undefined" || typeof getAsset.data.result == "undefined") {
        reset_viewer();
        return;
      }
      
      let getswapAsset = null;
      let type_a = null;
      let type_b = null;
      let swapStatePDA;

      let img_a = getAsset.data.result.content.files[0].uri;
      let owner_a = getAsset.data.result.ownership.owner;
      type_a = getAsset.data.result.compression.compressed;

      // console.log(img_a);
      // console.log(owner_a);
      $("img.fulfil_img_a").attr("src", img_a);
      // $("#fulfil_a_owner").val(owner_a);

      let owner_b = false;
      let swapAssetId = $("#fulfil_b_id").val();
      if (swapAssetId != "") {
        // console.log("swapAssetId ", swapAssetId);
        getswapAsset = await axiosInstance.post(conf.cluster, {
          jsonrpc: "2.0",
          method: "getAsset",
          id: "rpd-op-123",
          params: {
            id: swapAssetId
          },
        });
        type_b = getswapAsset.data.result.compression.compressed;
        // console.log(getswapAsset);
        let img_b = getswapAsset.data.result.content.files[0].uri;
        owner_b = getswapAsset.data.result.ownership.owner;
        // console.log(img_b);
        // console.log(owner_b);
        $("img.fulfil_img_b").attr("src", img_b);
        $("#fulfil_b_owner").val(owner_b);
      }

      // check for compression
      //console.log("checking for compression");

      if (getswapAsset != null && type_b === true) {
        let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),
          new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()
        ], cNFTSwapProgramId);
        //console.log("cNFT Swap State PDA: ", swapStatePDA[0].toString());
        $("#c_type, #d_type").val("cNFT");
        if($("#c_type").val() == "cNFT"){$("#proofs_c, #proofs_d").html("Fetching...").show();}
      } else if (getswapAsset != null && type_b === false) {
        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
          new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()
        ], NFTSwapProgramId);
        //console.log("NFT Swap State PDA: ", swapStatePDA[0].toString());
        $("#c_type, #d_type").val("NFT");
      } else if (getswapAsset == null && type_a === true) {
        let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),
          new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey("11111111111111111111111111111111").toBytes()
        ], cNFTSwapProgramId);
        //console.log("cNFT Swap State PDA: ", swapStatePDA[0].toString());
        $("#c_type").val("cNFT");
      } else if (getswapAsset == null && type_a === false) {
        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
          new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey("11111111111111111111111111111111").toBytes()
        ], NFTSwapProgramId);
        //console.log("NFT Swap State PDA: ", swapStatePDA[0].toString());
        $("#c_type").val("NFT");
      }

      let swapState = null;
      await connection.getAccountInfo(swapStatePDA[0])
        .then(function(response) {
          swapState = response;
        })
        .catch(function(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          //console.log("Error: ", error);
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

        let encodedSwapStateData = swapState.data;
        let decodedSwapStateData = false;

        if (type_a === false) {
          decodedSwapStateData = SWAP_NFT_STATE.decode(encodedSwapStateData);
        } else if (type_a === true) {
          decodedSwapStateData = SWAP_CNFT_STATE.decode(encodedSwapStateData);
          if (swapAssetId == "") {
            owner_b = new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString();
            $("#fulfil_b_owner").val(owner_b);
          }
        }




        // nfts
        // console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
        // console.log("swapState - is_swap: ", new BN(decodedSwapStateData.is_swap, 10, "le").toString());
        // console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
        // console.log("swapState - initializer_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint).toString());
        // console.log("swapState - temp_mint_account: ", new solanaWeb3.PublicKey(decodedSwapStateData.temp_mint_account).toString());
        // console.log("swapState - swap_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_mint).toString());
        // console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
        //       console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
        // console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
        // console.log("swapState - taker", new solanaWeb3.PublicKey(decodedSwapStateData.taker).toString());

        // cnfts
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

        let decimals = 9;
        if (swap_mint == conf.usdc) {
          decimals = 6;
        } else {
          for (let i = 0; i < spl_tokens.length; i++) {
            let item = spl_tokens[i];
            if (item.address == swap_mint) {
              decimals = item.decimals;
            }
          }
        }

        let multiplier = 1;
        for (let i = 0; i < decimals; i++) {
          multiplier = multiplier * 10;
        }

        let pikl_zeros = "0.";
        for (let i = 0; i < decimals; i++) {
          pikl_zeros += "0";
        }

        swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le").toString();
        swapTokens = parseInt(swapTokens);
        tokens = swapTokens / multiplier;
        balance = parseFloat(tokens).toFixed(decimals);
        splt = balance.split(".");
        formatted = splt[0].toLocaleString("en-US");
        formatted = formatted + "." + splt[1];

        $("#fulfil_pikl_request").val(pikl_zeros);
        $("#fulfil_usdc_request").val("0.000000");

        if (swap_mint == conf.usdc) {
          $("#fulfil_usdc_request").val(formatted);
          $("#fulfil_pikl_request").val(pikl_zeros);
        } else {
          $("#fulfil_pikl_request").val(formatted);
          $("#fulfil_usdc_request").val("0.000000");
        }

        // check that the initializer matches the connected wallet and display reversal option
        let initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString();
        $("#fulfil_a_owner").val(initializer);
        
        let proofs_required = false;
        if($("#c_type").val() == "cNFT"){
          proofs_required = await required_proofs(ids[0]);
          if(proofs_required != false){
            $("#proofs_c").html(proofs_required + " x Proofs").show();
          }
          proofs_required = false;
          proofs_required = await required_proofs(ids[1]);
          if(proofs_required != false){
            $("#proofs_d").html(proofs_required + " x Proofs").show();
          }
        } 
        
        if (typeof provider == "undefined" || provider.isConnected === false) {
          $("#mc_swap_viewer .mc_title").html("Contract Details");
          return;
        }

        //console.log("initializer: ", initializer);
        //console.log("provider.publicKey: ", provider.publicKey.toString());

        if (initializer == provider.publicKey.toString()) {
          $(".fulfil_g").show().addClass("active_swap");
          $("#swap_reverse").prop("disabled", false);
        } else {
          $("#fulfil_g").hide().removeClass("active_swap");
          $("#swap_reverse").prop("disabled", true);
        }
        $("#scroll_wrapper").getNiceScroll().resize();

        // check that the approving party wallet matches and enable approve option if so
        let owner;
        if (type_a === false) {
          owner = new solanaWeb3.PublicKey(decodedSwapStateData.taker).toString();
        } else if (type_a === true) {
          owner = new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString();
        }

        if (typeof provider != "undefined") {
          if (owner == provider.publicKey.toString()) {
            $(".fulfil_a").removeClass("active_swap");

//             if (type_a === true) {
//               $(".fulfil_d").addClass("active_swap");
//               $("#fulfil_create").prop("disabled", false);
//             } else {
//               $(".fulfil_e").addClass("active_swap");
//               $("#swap_execute").prop("disabled", false);
//             }
            
            $(".fulfil_e").addClass("active_swap");
            $("#swap_execute").prop("disabled", false);
            
            $("#mc_swap_viewer .mc_title").html("Contract Ready!");
            setTimeout(() => {
              $("#mc_swap_viewer .mc_title").html("Contract Details");
            }, 3000);

          } else {
            $("#mc_swap_viewer .mc_title").html("Contract Details");
          }
        } else {
          $("#mc_swap_viewer .mc_title").html("Contract Details");
        }
        
      } 
      else {
        reset_viewer("Invalid Contract");
      }
      
      $("#priority_nft_exec").val(await estimate_priority());
      
      }
      catch (err) {
        reset_viewer("Invalid Contract");
        return;
      }

    } 
    else if (typeof pathArray[1] != "undefined" && typeof pathArray[2] != "undefined" &&
      pathArray[1] == "spl" &&
      pathArray[1] != "" &&
      pathArray[2] != ""
    ) {
      
      let ids = pathArray[2].split("-");
      try {
      
      let user_a_key = new solanaWeb3.PublicKey(ids[0]);
      let user_b_key = new solanaWeb3.PublicKey(ids[1]);
      
      $("#mc_swap_viewer .mc_title").html("Fetching Contract...");
      $(".share_spl_exec_sig .swap_val").html("");
      $(".swap_spl_e, .swap_spl_f").addClass("active_spl");
      $(".swap_spl_g").removeClass("active_spl");
      
      $("#spl_owner_a").val(ids[0]);
      $("#spl_owner_b").val(ids[1]);
      $("#nav_view").click();
      $(".mcprofile_open").show().click();
      $("#mode_nft").click();
      
      provider = wallet_provider();
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let axiosInstance = axios.create({
        baseURL: conf.cluster,
      });
      let SPL_SWAP_PROGRAM = new solanaWeb3.PublicKey(conf.MCSWAP_SPL_PROGRAM);
      
      let SPL_STATE_PDA = solanaWeb3.PublicKey.findProgramAddressSync(
        [Buffer.from("swap-state"), user_a_key.toBytes(), user_b_key.toBytes()], SPL_SWAP_PROGRAM);
//       console.log("Swap State PDA: ", SPL_STATE_PDA[0].toString());
      
      let swapState = null;
      await connection.getAccountInfo(SPL_STATE_PDA[0])
        .then(function(response) {
          swapState = response;
        })
        .catch(function(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error: ", error);
        });
      if (swapState != null) {

        let encodedSwapStateData = swapState.data;
        let decodedSwapStateData = SWAP_SPL_STATE.decode(encodedSwapStateData);
        let spl_initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
        let spl_token1Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token1_mint);
        let spl_token1Amount = new BN(decodedSwapStateData.token1_amount, 10, "le");
        let spl_tempToken1Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token1_account);
        let spl_token2Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token2_mint);
        let spl_token2Amount = new BN(decodedSwapStateData.token2_amount, 10, "le");
        let spl_tempToken2Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token2_account);
        let spl_taker = new solanaWeb3.PublicKey(decodedSwapStateData.taker);

        let spl_token3Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token3_mint);
        let spl_token3Amount = new BN(decodedSwapStateData.token3_amount, 10, "le");
        let spl_token4Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token4_mint);
        let spl_token4Amount = new BN(decodedSwapStateData.token4_amount, 10, "le");

        let spl_pda = null;
        let spl_metaplex = null;
        let spl_uri = null;
        let spl_img = null;
        let spl_metadata = null;
        let spl_amount = null;
        let spl_amount_ = null;
        let spl_deciamls = null;
        let spl_multiplier = null;
        let spl_data = null;
        let spl_symbol = null;

        let do_id;
        let do_ele;
        let do_decimals;
        let do_symbol;
        let do_mint;
        let do_cmc;         
        
        // spl 1
        if (spl_token1Mint.toString() == conf.usdc) {
          spl_symbol = "USDC";
          spl_img = "/img/usdc.png";
          spl_amount = spl_token1Amount.toString();
          spl_deciamls = 6;
          spl_amount_ = spl_amount;
        } else {
          spl_pda = await get_pda(spl_token1Mint.toString());
          spl_metaplex = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(spl_pda));
          spl_uri = spl_metaplex.data.uri;
          spl_metadata = await axios.get(spl_uri);
          spl_img = spl_metadata.data.image;
          spl_symbol = spl_metadata.data.symbol;
          spl_data = await connection.getAccountInfo(spl_token1Mint);
          spl_data = splToken.MintLayout.decode(spl_data.data);
          spl_amount_ = spl_token1Amount.toString();
          spl_deciamls = spl_data.decimals;
        }
        spl_multiplier = 1;
        for (let i = 0; i < spl_deciamls; i++) {
          spl_multiplier = spl_multiplier * 10;
        }
        spl_amount = spl_amount_ / spl_multiplier;
        $("#spl_img_5").attr("src", spl_img).removeClass("spl_default");
        $("#spl_choice_5").html(spl_symbol);
        $("#spl_field_5").val(spl_amount).attr("data-spl_mint", spl_token1Mint.toString()).attr("data-spl_decimals", spl_deciamls).attr("data-spl_units", spl_amount_);
        
        do_id = "spl_field_5";
        do_ele = $("#"+do_id);
        do_ele.next("input").val("•••");
        do_decimals = do_ele.attr("data-spl_decimals");
        do_symbol = do_ele.prev("button").html();
        do_mint = do_ele.attr("data-spl_mint");
        do_cmc = false;
        if(do_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
          do_cmc = 3408;
        }
        else if(do_mint == "11111111111111111111111111111111"){
          do_cmc = 5426;
        }
        else{
          for (let i = 0; i < spl_tokens.length; i++) {
            let item = spl_tokens[i];
            if(do_mint == item.address){
              do_cmc = item.cmc;
              break;
            } 
          }
        }
//         console.log("do_cmc", do_cmc);
        await review_usd_value(do_cmc, do_id, do_symbol, do_ele.val(), do_decimals);
        
        // spl 2
        if (spl_token2Mint.toString() != "11111111111111111111111111111111") {
          
          if (spl_token2Mint.toString() == conf.usdc) {
            spl_symbol = "USDC";
            spl_img = "/img/usdc.png";
            spl_amount = spl_token1Amount.toString();
            spl_deciamls = 6;
            spl_amount_ = spl_amount;
          } else {
            spl_pda = await get_pda(spl_token2Mint.toString());
            spl_metaplex = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(spl_pda));
            spl_uri = spl_metaplex.data.uri;
            spl_metadata = await axios.get(spl_uri);
            spl_img = spl_metadata.data.image;
            spl_symbol = spl_metadata.data.symbol;
            spl_data = await connection.getAccountInfo(spl_token2Mint);
            spl_data = splToken.MintLayout.decode(spl_data.data);
            spl_amount_ = spl_token2Amount.toString();
            spl_deciamls = spl_data.decimals;
          }
          spl_multiplier = 1;
          for (let i = 0; i < spl_deciamls; i++) {
            spl_multiplier = spl_multiplier * 10;
          }
          spl_amount = spl_amount_ / spl_multiplier;
          $("#spl_img_6").attr("src", spl_img).removeClass("spl_default");
          $("#spl_choice_6").html(spl_symbol);
          $("#spl_field_6").val(spl_amount).attr("data-spl_mint", spl_token1Mint.toString()).attr("data-spl_decimals", spl_deciamls).attr("data-spl_units", spl_amount_);
        
          do_id = "spl_field_6";
          do_ele = $("#"+do_id);
          do_ele.next("input").val("•••");
          do_decimals = do_ele.attr("data-spl_decimals");
          do_symbol = do_ele.prev("button").html();
          do_mint = do_ele.attr("data-spl_mint");
          do_cmc = false;
          if(do_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
            do_cmc = 3408;
          }
          else if(do_mint == "11111111111111111111111111111111"){
            do_cmc = 5426;
          }
          else{
            for (let i = 0; i < spl_tokens.length; i++) {
              let item = spl_tokens[i];
              if(do_mint == item.address){
                do_cmc = item.cmc;
                break;
              } 
            }
          }
//           console.log("do_cmc", do_cmc);
          await review_usd_value(do_cmc, do_id, do_symbol, do_ele.val(), do_decimals);
        
        }
        
        // spl 3
        if (spl_token3Mint.toString() == "11111111111111111111111111111111") {
          spl_symbol = "SOL";
          spl_img = "/img/sol.png";
          spl_amount = spl_token3Amount.toString();
          spl_deciamls = 9;
          spl_amount_ = spl_amount;
        } else if (spl_token3Mint.toString() == conf.usdc) {
          spl_symbol = "USDC";
          spl_img = "/img/usdc.png";
          spl_amount = spl_token3Amount.toString();
          spl_deciamls = 6;
          spl_amount_ = spl_amount;
        } else {
          spl_pda = await get_pda(spl_token3Mint.toString());
          spl_metaplex = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(spl_pda));
          spl_uri = spl_metaplex.data.uri;
          spl_metadata = await axios.get(spl_uri);
          spl_img = spl_metadata.data.image;
          spl_symbol = spl_metadata.data.symbol;
          spl_data = await connection.getAccountInfo(spl_token3Mint);
          spl_data = splToken.MintLayout.decode(spl_data.data);
          spl_amount_ = spl_token3Amount.toString();
          spl_deciamls = spl_data.decimals;
        }
        spl_multiplier = 1;
        for (let i = 0; i < spl_deciamls; i++) {
          spl_multiplier = spl_multiplier * 10;
        }
        spl_amount = spl_amount_ / spl_multiplier;
        $("#spl_img_7").attr("src", spl_img).removeClass("spl_default");
        $("#spl_choice_7").html(spl_symbol);
        $("#spl_field_7").val(spl_amount).attr("data-spl_mint", spl_token3Mint.toString()).attr("data-spl_decimals", spl_deciamls).attr("data-spl_units", spl_amount_);
        
        do_id = "spl_field_7";
        do_ele = $("#"+do_id);
        do_ele.next("input").val("•••");
        do_decimals = do_ele.attr("data-spl_decimals");
        do_symbol = do_ele.prev("button").html();
        do_mint = do_ele.attr("data-spl_mint");
        do_cmc = false;
        if(do_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
          do_cmc = 3408;
        }
        else if(do_mint == "11111111111111111111111111111111"){
          do_cmc = 5426;
        }
        else{
          for (let i = 0; i < spl_tokens.length; i++) {
            let item = spl_tokens[i];
            if(do_mint == item.address){
              do_cmc = item.cmc;
              break;
            } 
          }
        }
        console.log("do_cmc", do_cmc);
        await review_usd_value(do_cmc, do_id, do_symbol, do_ele.val(), do_decimals);        
        
        // spl 4
        if (spl_token4Mint.toString() != "11111111111111111111111111111111") {
          if (spl_token4Mint.toString() == conf.usdc) {
            spl_symbol = "USDC";
            spl_img = "/img/usdc.png";
            spl_amount = spl_token4Amount.toString();
            spl_deciamls = 6;
            spl_amount_ = spl_amount;
          } else {
            spl_pda = await get_pda(spl_token4Mint.toString());
            spl_metaplex = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(spl_pda));
            spl_uri = spl_metaplex.data.uri;
            spl_metadata = await axios.get(spl_uri);
            spl_img = spl_metadata.data.image;
            spl_symbol = spl_metadata.data.symbol;
            spl_data = await connection.getAccountInfo(spl_token4Mint);
            spl_data = splToken.MintLayout.decode(spl_data.data);
            spl_amount_ = spl_token4Amount.toString();
            spl_deciamls = spl_data.decimals;
          }
          spl_multiplier = 1;
          for (let i = 0; i < spl_deciamls; i++) {
            spl_multiplier = spl_multiplier * 10;
          }
          spl_amount = spl_amount_ / spl_multiplier;
          $("#spl_img_8").attr("src", spl_img).removeClass("spl_default");
          $("#spl_choice_8").html(spl_symbol);
          $("#spl_field_8").val(spl_amount).attr("data-mint", spl_token4Mint.toString()).attr("data-decimals", spl_deciamls).attr("data-spl_units", spl_amount_);
        
          do_id = "spl_field_8";
          do_ele = $("#"+do_id);
          do_ele.next("input").val("•••");
          do_decimals = do_ele.attr("data-spl_decimals");
          do_symbol = do_ele.prev("button").html();
          do_mint = do_ele.attr("data-spl_mint");
          do_cmc = false;
          if(do_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
            do_cmc = 3408;
          }
          else if(do_mint == "11111111111111111111111111111111"){
            do_cmc = 5426;
          }
          else{
            for (let i = 0; i < spl_tokens.length; i++) {
              let item = spl_tokens[i];
              if(do_mint == item.address){
                do_cmc = item.cmc;
                break;
              } 
            }
          }
          console.log("do_cmc", do_cmc);
          await review_usd_value(do_cmc, do_id, do_symbol, do_ele.val(), do_decimals);        
        
        }

        // check for wallet connection
        let allow_execute = true;
        if (typeof provider != "undefined" && provider.isConnected === true) {

          if (ids[0] == spl_initializer.toString() && ids[0] == provider.publicKey.toString()) {
            allow_execute = false;
            console.log(allow_execute);
            $(".swap_spl_h").show();
            $("#scroll_wrapper").getNiceScroll().resize();
          } else {
            $(".swap_spl_h").hide();
          }

          // check for token 1 ata for user
          let peer_ata = null;
          await splToken.getAssociatedTokenAddress(spl_token1Mint, provider.publicKey,
              false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, )
            .then(function(resp) {
              if (resp != null) {
                peer_ata = resp;
              } else {
                allow_execute = false;
                console.log(allow_execute);
              }
            }).catch(function() {
              allow_execute = false;
            });

          // verify the user is the intended executioner
          if (provider.publicKey.toString() != ids[1] || provider.publicKey.toString() != spl_taker.toString()) {
            allow_execute = false;
            console.log(allow_execute);
          }

          let ok_ata = null;
          let ok_mint = null;
          let ok_mintAccount = null;
          let resp = null;
          let token_acct = null;
          let resps = null;
          let amount = null;
          let min_tokens = null;
          let ata_resp = null;
          let min_sol = conf.txfee;
          let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);

          // verify minimum pikl gas
          ok_mint = "AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3";
          ok_mintAccount = new solanaWeb3.PublicKey(ok_mint);
          resp = await connection.getTokenAccountsByOwner(provider.publicKey, {
            mint: ok_mintAccount
          });
          token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
          resps = await connection.getTokenAccountBalance(token_acct);
          amount = resps.value.amount;
          if ($("[data-spl_mint='" + ok_mint + "']").length) {
            let tid = $("[data-spl_mint='" + ok_mint + "']").attr("id");
            if (tid != "spl_field_5") {
              min_tokens = conf.chips_fee + ($("[data-spl_mint='" + ok_mint + "']").parent().find(".spl_field").val() * conf.billion);
            } else {
              min_tokens = conf.chips_fee;
            }
          } else {
            min_tokens = conf.chips_fee;
          }
          amount = parseInt(amount);
          if (amount < min_tokens) {
            allow_execute = false;
          }
          // check token 3 balance
          ok_mint = spl_token3Mint.toString();
          ok_ata = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(ok_mint),
            provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
          ata_resp = await connection.getAccountInfo(ok_ata);
          if (ata_resp == null) {
            min_sol = min_sol + rent;
          }
          ata_resp = null;

          // check token 4 balance
          if (spl_token4Mint.toString() != "11111111111111111111111111111111") {
            ok_mint = spl_token3Mint.toString();
            ok_ata = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(ok_mint),
              provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
            ata_resp = await connection.getAccountInfo(ok_ata);
            if (ata_resp == null) {
              min_sol = min_sol + rent;
            }
          }

          $(".spl_tx_total_x .swap_amt").html((min_sol / conf.billion));

        } else {
          allow_execute = false;
          $(".swap_spl_h").hide();
          $("#spl_execute").prop("disabled", true);
        }

        $("#mc_swap_viewer .mc_title").html("Contract Details");
        
        if (allow_execute === true) {
          $("#priority_spl_exec").val(await estimate_priority());
          $("#spl_execute").prop("disabled", false);
        }

      } else {
        reset_viewer("Invalid Contract");
      }
      
      }
      catch (err) {
        reset_viewer("Invalid Contract");
      }
      
    } 
    else {
      let hash = window.location.hash;
      if (hash.includes("#connect-")) {
        history.pushState("", "", '/');
        //      $("#wallet_connect").click();
        setTimeout(() => {
          let walet = hash.replace("#connect-", "");
          $("#chooser_" + walet).click();
        }, 400);
      }
      reset_viewer();
    }
  }
  async function review_usd_value(cmc, id, symbol, token_qty, decimals) {
    let symbol_ = symbol.toLowerCase();
    if (symbol_ == "usdc") {
      let usd_format = $("#" + id).val();
      usd_format = usd_format.toString();
      let part = usd_format.split(".");
      part[0] = add_commas(part[0]);
      if (typeof part[1] == "undefined") {
        usd_format = part[0];
      } else {
        part[1] = part[1].slice(0, 6);
        usd_format = part[0] + "." + part[1];
      }
      $("#" + id).next("input").val("$" + usd_format);
      fair_totals_review();
    } 
    else {
      let amount = $("#" + id).val();
      let axiosInstance = axios.create({
        "baseURL": conf.host
      });
      let response = await axiosInstance.post("/rpc/cmc.php", {
        amount: amount,
        id: cmc,
        symbol: symbol,
      });
      if (typeof response.data.status != "undefined") {
        $("#" + id).next("input").val("Unavailable");
      } else {
        let formatted = response.data;
        formatted = formatted.toFixed(6);
        formatted = formatted.toString();
        let part = formatted.split(".");
        part[0] = add_commas(part[0]);
        if (typeof part[1] == "undefined") {
          formatted = part[0];
        } else {
          part[1] = part[1].slice(0, 6);
          formatted = part[0] + "." + part[1];
        }
        $("#" + id).next("input").val("$" + formatted);
      }
      fair_totals_review();
    }
    
  }  
  async function fair_totals_review() {
    //***************************************************
    let f_part;
    let val;
    //***************************************************
    let f_1 = $("#spl_value_5").val();
    if (f_1 == "" || f_1 == "Unavailable") {
      f_1 = "0";
    }
    f_1 = f_1.replace("$", "").replaceAll(",", "");
    f_1 = parseFloat(f_1);
    let f_2 = $("#spl_value_6").val();
    if (f_2 == "" || f_2 == "Unavailable") {
      f_2 = "0";
    }
    f_2 = f_2.replace("$", "").replaceAll(",", "");
    f_2 = parseFloat(f_2);
    val = (f_1 + f_2);
    let f_a = val.toString();
    f_part = f_a.split(".");
    f_part[0] = add_commas(f_part[0]);
    if (typeof f_part[1] == "undefined") {
      f_a = f_part[0];
    } else {
      f_part[1] = f_part[1].slice(0, 6);
      f_a = f_part[0] + "." + f_part[1];
    }
    $("#review_receive_total").html("$" + f_a);
    //***************************************************
    let f_3 = $("#spl_value_7").val();
    if (f_3 == "" || f_3 == "Unavailable") {
      f_3 = "0";
    }
    f_3 = f_3.replace("$", "").replaceAll(",", "");
    f_3 = parseFloat(f_3);
    let f_4 = $("#spl_value_8").val();
    if (f_4 == "" || f_4 == "Unavailable") {
      f_4 = "0";
    }
    f_4 = f_4.replace("$", "").replaceAll(",", "");
    f_4 = parseFloat(f_4);
    val = (f_3 + f_4);
    let f_b = val.toString();
    f_part = f_b.split(".");
    f_part[0] = add_commas(f_part[0]);
    if (typeof f_part[1] == "undefined") {
      f_b = f_part[0];
    } else {
      f_part[1] = f_part[1].slice(0, 6);
      f_b = f_part[0] + "." + f_part[1];
    }
    $("#review_send_total").html("$" + f_b);
    //***************************************************
  }        
  
  // open token choice
  $(document).delegate("#top_token_choice, .swap_c_pikl", "click", async function() {
    $("#cover, #swap_token_options, #token_options_close").fadeIn(400);
  });

  // close token choice
  $(document).delegate("#token_options_close", "click", async function() {
    $("#token_options_close").hide();
    $("#cover, #swap_token_options").fadeOut(400);
    $("#temp_sol, #temp_usdc").remove();
  });

  // swap reverse
  $(document).delegate("#swap_reverse", "click", async function() {

    $(this).prop("disabled", true);
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    provider = wallet_provider();
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let assetId = $("#fulfil_a_id").val();
    let swapAssetId = $("#fulfil_b_id").val();
    if (swapAssetId == "") {
      swapAssetId = "11111111111111111111111111111111";
    }

    if ($("#c_type").val() == "cNFT") {
      let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
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
        const decodedSwapStateData = SWAP_CNFT_STATE.decode(encodedSwapStateData);
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
      let axiosInstance = axios.create({
        baseURL: conf.cluster,
      });
      let getAsset = await axiosInstance.post(conf.cluster, {
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
      let getAssetProof = await axiosInstance.post(conf.cluster, {
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
      let treeAccount = await splAccountCompression_.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,
        new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id), );
      let treeAuthorityPDA = treeAccount.getAuthority();
      let canopyDepth = treeAccount.getCanopyDepth();
      // console.log("treeAuthorityPDA ", treeAuthorityPDA.toString());
      // console.log("canopyDepth ", canopyDepth);
      // parse the list of proof addresses into a valid AccountMeta[]
      let proof = getAssetProof.data.result.proof.slice(0, getAssetProof.data.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
        .map((node) => ({
          pubkey: new solanaWeb3.PublicKey(node),
          isWritable: false,
          isSigner: false,
        }));
      // console.log("proof ", proof);
      let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")], cNFTSwapProgramId);
      // console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());
      let totalSize = 1 + 32 + 32 + 1;
      // console.log("totalSize", totalSize);
      let uarray = new Uint8Array(totalSize);
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
          pubkey: mplBubblegum_.PROGRAM_ID,
          isSigner: false,
          isWritable: false
        }, // 5
        {
          pubkey: splAccountCompression_.PROGRAM_ID,
          isSigner: false,
          isWritable: false
        }, // 6
        {
          pubkey: splAccountCompression_.SPL_NOOP_PROGRAM_ID,
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
      let reverseSwapIx = new solanaWeb3.TransactionInstruction({
        programId: cNFTSwapProgramId,
        data: Buffer.from(uarray),
        keys: keys,
      });
      // console.log("Reverse Swap Ix: ", reverseSwapIx);
      let tx = new solanaWeb3.Transaction();
      let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
      tx.add(computePriceIx, reverseSwapIx);
      tx.recentBlockhash = (await connection.getRecentBlockhash('confirmed')).blockhash;
      tx.feePayer = provider.publicKey;
      // console.log("Start Tx");
      try {
        $("#cover_message").html("Requesting Approval...");
        let signedTransaction = await provider.signTransaction(tx);
        // console.log("Tx: ", tx);
        let serializedTransaction = signedTransaction.serialize();
        let signature = await connection.sendRawTransaction(serializedTransaction,{skipPreflight:false,preflightCommitment:'confirmed'},);
        $("#cover_message").html("Please Wait...");
        let final = await finalized(signature,30,4000);
        if(final != "finalized"){
          $("#cover_message").html(final);
          setTimeout(function(){
            $(".share_fulfil_sig .swap_val").html(signature);
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
            $("#swap_reverse").prop("disabled",false);
          },3000);
          return;
        }
        history.pushState("", "", '/');
        $("#cover_message").html("Asset Returned!");
        $(".share_fulfil_sig .swap_val").html(signature);
        $(".fulfil_g").removeClass("active_swap").hide();
        setTimeout(() => {
          $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
          $("#c_type, #d_type").val("");
          $(".proofs_view").html("").hide();
          swap_viewer();
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
          $("#wallet_refresh").click();
          $("#swap_reverse").prop("disabled", false);
        }, 3000);        
      } catch (error) {
        swap_viewer();
        $("#cover_message").html("Transaction Error!");
        setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_reverse").prop("disabled",false);},3000);
        return;
      }
    }

    if ($("#c_type").val() == "NFT") {

      let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);

      let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], NFTSwapProgramId);
      //console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

      let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync(
        [Buffer.from("swap-state"), new solanaWeb3.PublicKey(assetId).toBytes(),
          new solanaWeb3.PublicKey(swapAssetId).toBytes()
        ], NFTSwapProgramId);
      //console.log("Swap State PDA: ", swapStatePDA[0].toString());

      let swapState = null;
      await connection.getAccountInfo(swapStatePDA[0])
        .then(function(response) {
          swapState = response;
        })
        .catch(function(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          //console.log("Error: ", error);
          return;
        });

      let tempMintAccount = null;
      if (swapState != null) {
        let encodedSwapStateData = swapState.data;
        let decodedSwapStateData = SWAP_NFT_STATE.decode(encodedSwapStateData);
        //console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
        //console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
        //console.log("swapState - initializer_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint).toString());
        //console.log("swapState - temp_mint_account: ", new solanaWeb3.PublicKey(decodedSwapStateData.temp_mint_account).toString());
        //console.log("swapState - swap_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_mint).toString());
        //console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
        //console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
        //console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
        tempMintAccount = new solanaWeb3.PublicKey(decodedSwapStateData.temp_mint_account);
      } else {
        //console.log("Swap Not Initialized");    
        return;
      }

      let initializerMintATA = await splToken.getAssociatedTokenAddress(
        new solanaWeb3.PublicKey(assetId), provider.publicKey, false,
        splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );

      let totalSize = 1;
      //console.log("totalSize", totalSize);

      let uarray = new Uint8Array(totalSize);
      let counter = 0;
      uarray[counter++] = 2; // 2 = nft_swap ReverseSwap instruction
      //console.log("Data: ", uarray);

      let reverseSwapIx = new solanaWeb3.TransactionInstruction({
        programId: NFTSwapProgramId,
        data: Buffer.from(uarray),
        keys: [{
            pubkey: provider.publicKey,
            isSigner: true,
            isWritable: true
          }, // 0
          {
            pubkey: swapVaultPDA[0],
            isSigner: false,
            isWritable: false
          }, // 1
          {
            pubkey: swapStatePDA[0],
            isSigner: false,
            isWritable: true
          }, // 2
          {
            pubkey: tempMintAccount,
            isSigner: false,
            isWritable: true
          }, // 3
          {
            pubkey: initializerMintATA,
            isSigner: false,
            isWritable: true
          }, // 4
          {
            pubkey: splToken.TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false
          }, // 5
        ]
      });
      //console.log("Reverse Swap Ix: ", reverseSwapIx);
      
      let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
      
      let messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [computePriceIx, reverseSwapIx],
      }).compileToV0Message([]);
      
      let reverseSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
      //console.log("reverseSwapTx: ", reverseSwapTx);
      
      try {
        $("#cover_message").html("Requesting Approval...");
        let signedTx = await provider.signTransaction(reverseSwapTx);
        let signature = await connection.sendTransaction(signedTx);
        //console.log("Signature: ", signature)
        //console.log(`https://solscan.io/tx/${signature}`);
        let final = await finalized(signature,30,4000);
        if(final != "finalized"){
          $("#cover_message").html(final);
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_reverse").prop("disabled",false);},3000);
          return;
        }
        history.pushState("", "", '/');
        $(".fulfil_g").removeClass("active_swap").hide();
        $("#cover_message").html("Swap Complete!");
        setTimeout(() => {
          $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
          swap_viewer();
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
          $("#wallet_refresh").click();
          $("#swap_reverse").prop("disabled", false);
        }, 3000);        
      } 
      catch (error) {
        //console.log("Error: ", error);
        error = JSON.stringify(error);
        error = JSON.parse(error);
        //console.log("Error Logs: ", error);
        swap_viewer();
        $("#cover_message").html("Transaction Error!");
        setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_reverse").prop("disabled",false);},3000);
        return;
      }

    }

  });

  // mode switcher
  $(document).delegate(".mode_switch", "click", async function() {
    let id = $(this).attr("id");
    if (id == "mode_nft") {
      $("#mode_nft").hide();
      $("#mode_spl").show();
      $(".mc_panel_nft").hide();
      $(".mc_panel_spl").show();
      $("#scroll_wrapper").getNiceScroll().resize();
    } else if (id == "mode_spl") {
      if ($("#wallet_view").is(":visible")) {
        let pathArray = window.location.pathname.split('/swap/');
        if (typeof pathArray[1] == "undefined") {
          $("#wallet_view").click();
        } 
      }
      $("#mode_spl").hide();
      $("#mode_nft").show();
      $(".mc_panel_spl").hide();
      $(".mc_panel_nft").show();
      $("#scroll_wrapper").getNiceScroll().resize();
    }
  });
  
  // spl token choice
  $(document).delegate("#swap_token_list ul", "click", async function() {
    let new_choice = $(this).attr("data-id");
    let new_cmc = $(this).attr("data-cmc");
    let sym = $(this).find(".token_symbol").html();
    sym = sym.replace("(", "", new_choice);
    sym = sym.replace(")", "", new_choice);
    let img = $(this).find("li img").attr("src");
    let spl_tokens_b = spl_tokens;
    if (new_choice == "sol") {
      let obj = {};
      obj.name = "SOL";
      obj.symbol = "SOL";
      obj.address = new_choice;
      obj.img = img;
      obj.decimals = 9;
      obj.cmc = 5426;
      spl_tokens_b.push(obj);
    }
    if (new_choice == conf.usdc) {
      let obj = {};
      obj.name = "USD Coin";
      obj.symbol = "USDC";
      obj.address = new_choice;
      obj.img = img;
      obj.decimals = 6;
      obj.cmc = 3408;
      spl_tokens_b.push(obj);
    }
    if (selected === false) {
      $("#top_token_choice").attr("data-id", new_choice);
      $("#cover, #swap_token_options, #token_options_close").fadeOut(400);
      for (let i = 0; i < spl_tokens.length; i++) {
        let item = spl_tokens[i];
        if (item.address == new_choice) {
          if ($(".swap_a").hasClass("active_swap") || $(".swap_b").hasClass("active_swap")) {
            $(".swap_c_pikl .custom_symbol").html(item.symbol);
            $(".swap_c_pikl").attr("data-id", new_choice);
            if ($(".swap_c_pikl").attr("data-id") != new_choice && $("#pikl_request").val() != "") {
              $("#pikl_request").val(0);
            }
          }
          $("#top_token_choice .custom_symbol").html(item.symbol);
          $(".pikl_icon").attr("src", item.image);
          if ($(".pikl_balance").html() != "") {
            $(".pikl_balance").html("Fetching...");
            mcswap_balances();
          }
          return;
        }
      }
    } else {
      $("#" + selected).next('input').next('input').val("");
      $("#spl_deploy").prop("disabled", true);
      for (let i = 0; i < spl_tokens_b.length; i++) {
        let item = spl_tokens_b[i];
        if (item.address == new_choice) {
          $("#" + selected).attr("data-mint", new_choice);
          $("#" + selected).next('input').attr("data-cmc", item.cmc);
          $("#" + selected).next('input').attr("data-decimals", item.decimals);
          $("#" + selected).html(sym);
          $("#swap_token_options, #token_options_close").fadeOut(400);
          if (selected == "spl_choice_1") {
            $("#spl_img_1").attr("src", img).removeClass("spl_default");
            $("#spl_field_1, #spl_choice_2, #spl_choice_3").prop("disabled", false);
            $(".swap_spl_b").addClass("active_spl");
            $("#spl_field_1").val("0").focus();
          } else if (selected == "spl_choice_2") {
            $("#spl_img_2").attr("src", img).removeClass("spl_default");
            $("#spl_field_2").prop("disabled", false);
            $("#spl_field_2").val("0").focus();
          } else if (selected == "spl_choice_3") {
            $("#spl_img_3").attr("src", img).removeClass("spl_default");
            $("#spl_field_3, #spl_choice_4").prop("disabled", false);
            $("#spl_owner").prop("disabled", false);
            $(".swap_spl_c").addClass("active_spl");
            $("#spl_field_3").val("0").focus();
          } else if (selected == "spl_choice_4") {
            $("#spl_img_4").attr("src", img).removeClass("spl_default");
            $("#spl_field_4").prop("disabled", false);
            $("#spl_field_4").val("0").focus();
          }
          selected = false;
          $("#cover").fadeOut(400);
          setTimeout(() => {
            $("#temp_sol, #temp_usdc").remove();
            $("#swap_token_list ul").show();
          }, 500);
          allow_deploy();
          return;
        }
      }
    }
  });

  // open spl chooser
  function spl_tokens_used() {
    let tokens_used = [];
    $("#mc_swap_create .spl_choice").each(function() {
      if ($(this).html() != "•••") {
        tokens_used.push($(this).html());
      }
    });
    return tokens_used;
  }
  $(document).delegate(".spl_choice", "click", async function() {
    selected = $(this).attr("id");
    let temp_choices = "";
    if (selected == "spl_choice_3" || selected == "spl_choice_4") {
      console.log("is here");
      temp_choices += '<ul data-cmc="5426" id="temp_sol" data-id="sol"><li><img src="/img/sol.png"></li><li class="token_symbol">(SOL)</li><li class="token_name">SOL</li></ul>';
    }
    temp_choices += '<ul data-cmc="3408" id="temp_usdc" data-id="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"><li><img src="/img/usdc.png"></li><li class="token_symbol">(USDC)</li><li class="token_name">USD Coin</li></ul>';
    $("#swap_token_list").prepend(temp_choices);
    let spl_used = spl_tokens_used();
    $("#swap_token_list ul").each(function() {
      let symb = $(this).find(".token_symbol").html();
      symb = symb.replace("(", "").replace(")", "");
      if (spl_used.indexOf(symb) != -1) {
        $(this).hide();
      }
    });
    $("#cover, #swap_token_options, #token_options_close").fadeIn(400);
  });
  
  // format spl amount
  var delayTimer;
  async function format_spl(id, decimals) {
    let amt = $("#" + id).val();
    amt = amt.replace(/[^0-9.]/g, '');
    let amt_x = amt;
    if (amt == 0 || amt == "") {
      $("#" + id).val(amt_x);
      return;
    }
    let int = amt.split(".");
    if (int.length > 1) {
      let int_a = int[0];
      let int_b = int[1];
      int_b = int_b.substring(0, decimals);
      amt = int_a + "." + int_b;
    }
    $("#" + id).val(amt);
    return;
  }
  $(document).on("change", ".spl_field", async function() {
    $(this).next("input").val("•••");
    let id = $(this).attr("id");
    let decimals = $(this).attr("data-decimals");
    let cmc = $(this).attr("data-cmc");
    let symbol_ = $(this).prev("button").html();
    let symbol = symbol_.toLowerCase();
    format_spl($(this).attr("id"), decimals).then(async function() {
      let ele = $("#" + id);
      clearTimeout(delayTimer);
      delayTimer = setTimeout(async function() {
        if (ele.val() == "" || ele.val() <= 0) {
          ele.next("input").val("");
          fair_totals_new();
        } else {
          await get_usd_value(cmc, id, symbol_, ele.val(), decimals);
        }
      }, 1000);
      allow_deploy();
    });
  });
  $(document).on("keyup", ".spl_field", async function() {
    $(this).next("input").val("•••");
    let id = $(this).attr("id");
    let decimals = $(this).attr("data-decimals");
    let cmc = $(this).attr("data-cmc");
    let symbol_ = $(this).prev("button").html();
    let symbol = symbol_.toLowerCase();
    format_spl($(this).attr("id"), decimals).then(async function() {
      let ele = $("#" + id);
      clearTimeout(delayTimer);
      delayTimer = setTimeout(async function() {
        if (ele.val() == "" || ele.val() <= 0) {
          ele.next("input").val("");
          fair_totals_new();
        } else {
          await get_usd_value(cmc, id, symbol_, ele.val(), decimals);
        }
      }, 1000);
      allow_deploy();
    });
  });
  async function get_usd_value(cmc, id, symbol, token_qty, decimals) {
    let symbol_ = symbol.toLowerCase();
    if (symbol_ == "usdc") {
      let usd_format = $("#" + id).val();
      usd_format = usd_format.toString();
      let part = usd_format.split(".");
      part[0] = add_commas(part[0]);
      if (typeof part[1] == "undefined") {
        usd_format = part[0];
      } else {
        part[1] = part[1].slice(0, 6);
        usd_format = part[0] + "." + part[1];
      }
      $("#" + id).next("input").val("$" + usd_format);
      fair_totals_new();
    } else {
      let amount = $("#" + id).val();
      let axiosInstance = axios.create({
        "baseURL": conf.host
      });
      let response = await axiosInstance.post("/rpc/cmc.php", {
        amount: amount,
        id: cmc,
        symbol: symbol,
      });
      if (typeof response.data.status != "undefined") {
        $("#" + id).next("input").val("Unavailable");
      } else {
        let formatted = response.data;
        formatted = formatted.toFixed(6);
        formatted = formatted.toString();
        let part = formatted.split(".");
        part[0] = add_commas(part[0]);
        if (typeof part[1] == "undefined") {
          formatted = part[0];
        } else {
          part[1] = part[1].slice(0, 6);
          formatted = part[0] + "." + part[1];
        }
        $("#" + id).next("input").val("$" + formatted);
      }
      fair_totals_new();
    }
  }
  async function fair_totals_new() {
    //***************************************************
    let f_part;
    let val;
    //***************************************************
    let f_1 = $("#spl_value_1").val();
    if (f_1 == "" || f_1 == "Unavailable") {
      f_1 = "0";
    }
    f_1 = f_1.replace("$", "").replaceAll(",", "");
    f_1 = parseFloat(f_1);
    let f_2 = $("#spl_value_2").val();
    if (f_2 == "" || f_2 == "Unavailable") {
      f_2 = "0";
    }
    f_2 = f_2.replace("$", "").replaceAll(",", "");
    f_2 = parseFloat(f_2);
    val = (f_1 + f_2);
    let f_a = val.toString();
    f_part = f_a.split(".");
    f_part[0] = add_commas(f_part[0]);
    if (typeof f_part[1] == "undefined") {
      f_a = f_part[0];
    } else {
      f_part[1] = f_part[1].slice(0, 6);
      f_a = f_part[0] + "." + f_part[1];
    }
    $("#sender_total").html("$" + f_a);
    //***************************************************
    let f_3 = $("#spl_value_3").val();
    if (f_3 == "" || f_3 == "Unavailable") {
      f_3 = "0";
    }
    f_3 = f_3.replace("$", "").replaceAll(",", "");
    f_3 = parseFloat(f_3);
    let f_4 = $("#spl_value_4").val();
    if (f_4 == "" || f_4 == "Unavailable") {
      f_4 = "0";
    }
    f_4 = f_4.replace("$", "").replaceAll(",", "");
    f_4 = parseFloat(f_4);
    val = (f_3 + f_4);
    let f_b = val.toString();
    f_part = f_b.split(".");
    f_part[0] = add_commas(f_part[0]);
    if (typeof f_part[1] == "undefined") {
      f_b = f_part[0];
    } else {
      f_part[1] = f_part[1].slice(0, 6);
      f_b = f_part[0] + "." + f_part[1];
    }
    $("#receiver_total").html("$" + f_b);
    //***************************************************
  }
  
  // peer user wallet
  async function allow_deploy() {

    let fields_pass = true;
    if ($("#spl_field_1").val() <= 0) {
      fields_pass = false;
    } else if ($("#spl_choice_2").attr("data-mint") != undefined && $("#spl_field_2").val() <= 0) {
      fields_pass = false;
    } else if ($("#spl_field_3").val() <= 0) {
      fields_pass = false;
    } else if ($("#spl_choice_4").attr("data-mint") != undefined && $("#spl_field_4").val() <= 0) {
      fields_pass = false;
    } else if ($("#spl_owner").attr("data-status") != "true") {
      fields_pass = false;
    }

    if (fields_pass === true) {

      // check for connected wallet
      provider = wallet_provider();
      if (typeof provider == "undefined" || provider.isConnected !== true) {
        $("#spl_deploy").prop("disabled", true);
        return;
      }

      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let walletPublicKey = new solanaWeb3.PublicKey(provider.publicKey.toString());
      let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);

      // verify minimum pikl gas
      let ok_gas = true;
      let ok_mint = "AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3";
      let ok_mintAccount = new solanaWeb3.PublicKey(ok_mint);
      let resp = await connection.getTokenAccountsByOwner(walletPublicKey, {
        mint: ok_mintAccount
      });
      let token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
      let resps = await connection.getTokenAccountBalance(token_acct);
      let amount = resps.value.amount;
      let min_tokens;
      if ($("[data-mint='" + ok_mint + "']").length) {
        min_tokens = conf.chips_fee + ($("[data-mint='" + ok_mint + "']").parent().find(".spl_field").val() * conf.billion);
      } else {
        min_tokens = conf.chips_fee;
      }
      if (amount < min_tokens) {
        ok_gas = false;
      }
      
      // sol fees
      let min_sol = 0;
      min_sol = min_sol + 2902320; // state account

      // check for init token balances
      let ok_balance_1 = true;
      min_sol = min_sol + 2039280; // temp token acct
      if ($("[data-mint='" + $("#spl_choice_1").attr("data-mint") + "']").length) {
        let ok_mint = $("#spl_choice_1").attr("data-mint");
        let ok_mintAccount = new solanaWeb3.PublicKey(ok_mint);
        let resp = await connection.getTokenAccountsByOwner(walletPublicKey, {
          mint: ok_mintAccount
        });
        let ok_info = await connection.getParsedAccountInfo(new solanaWeb3.PublicKey(ok_mintAccount));
        if (resp.value.length == 0) {
          ok_balance_1 = false;
        } else if (resp.value.length > 0) {
          let multiplier = 1;
          for (let i = 0; i < ok_info.value.data.parsed.info.decimals; i++) {
            multiplier = multiplier * 10;
          }
          let token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
          let resps = await connection.getTokenAccountBalance(token_acct);
          let ok_balance = resps.value.amount;
          if (ok_balance < ($("#spl_field_1").val() * multiplier)) {
            ok_balance_1 = false;
          }
        }
      }
      
      // check for init token balances
      let ok_balance_2 = true;
      if ($("[data-mint='" + $("#spl_choice_2").attr("data-mint") + "']").length) {
        let ok_mint = $("#spl_choice_2").attr("data-mint");
        let ok_mintAccount = new solanaWeb3.PublicKey(ok_mint);
        let resp = await connection.getTokenAccountsByOwner(walletPublicKey, {
          mint: ok_mintAccount
        });
        let ok_info = await connection.getParsedAccountInfo(new solanaWeb3.PublicKey(ok_mintAccount));
        if (resp.value.length == 0) {
          ok_balance_2 = false;
        } else if (resp.value.length > 0) {
          let multiplier = 1;
          for (let i = 0; i < ok_info.value.data.parsed.info.decimals; i++) {
            multiplier = multiplier * 10;
          }
          let token_acct = new solanaWeb3.PublicKey(resp.value[0].pubkey.toString());
          let resps = await connection.getTokenAccountBalance(token_acct);
          let ok_balance = resps.value.amount;
          if (ok_balance < ($("#spl_field_2").val() * multiplier)) {
            ok_balance_2 = false;
          }
        }
        min_sol = min_sol + 2039280; // temp token acct
      }

      // check for token ata 1
      if ($("[data-mint='" + $("#spl_choice_3").attr("data-mint") + "']").length) {
        let walletMint = $("#spl_choice_3").attr("data-mint");
        if (walletMint != "sol") {
          walletMint = new solanaWeb3.PublicKey(walletMint);
          let token_1_ata = await splToken.getAssociatedTokenAddress(walletMint, walletPublicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
          let response = await connection.getAccountInfo(token_1_ata);
          if (response == null) {
            //console.log("debug 3");
            min_sol = min_sol + rent;
            //console.log("rent 3",rent);
          }
        }
      }
      // check for token ata 2
      if ($("[data-mint='" + $("#spl_choice_4").attr("data-mint") + "']").length) {
        let walletMint = $("#spl_choice_4").attr("data-mint");
        if (walletMint != "sol") {
          walletMint = new solanaWeb3.PublicKey(walletMint);
          let token_2_ata = await splToken.getAssociatedTokenAddress(walletMint, walletPublicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
          let response = await connection.getAccountInfo(token_2_ata);
          if (response == null) {
            console.log("debug 4");
            min_sol = min_sol + rent;
            console.log("rent 4", rent);
          }
        }
      }

      // check sol balance
      let ok_sol = true;
      let balance_sol = await connection.getBalance(provider.publicKey)
        .then(function(data) {
          if (data < (min_sol + conf.txfee)) {
            let ok_sol = false;
          }
        });

      let display_sol = 0;
      if (ok_sol === false) {
        display_sol = (min_sol / conf.billion) + "(balance exceded)";
      } else {
        display_sol = (min_sol / conf.billion);
      }

      $(".spl_tx_total .swap_amt").html(display_sol);

      if (ok_gas === false || ok_balance_1 === false || ok_balance_2 == false || ok_sol == false) {
        $("#spl_deploy").prop("disabled", true);
        return;
      } else {
        $("#priority_spl").val(await estimate_priority());
        $("#spl_deploy").prop("disabled", false);
      }

    } else {
      $("#spl_deploy").prop("disabled", true);
    }

  }
  async function valid_peer() {
    provider = wallet_provider();
    if (typeof provider != "undefined" && provider.isConnected === true && provider.publicKey.toString() != $("#spl_owner").val() && $("#spl_owner").val().length >= 32) {
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let publicKey = new solanaWeb3.PublicKey($("#spl_owner").val());
      let is_valid_peer = await solanaWeb3.PublicKey.isOnCurve(publicKey);
      if (is_valid_peer === true) {
        $("#spl_owner").attr("data-status", "true").css({
          "color": "#87a02f",
          "box-shadow": "0 0 4px 0px #87a02f"
        });
      } else {
        $("#spl_owner").attr("data-status", "false").css({
          "color": "#0987fadb",
          "box-shadow": "0 0 4px 0px #0987fadb"
        });
      }
    } else {
      $("#spl_owner").attr("data-status", "false").css({
        "color": "#0987fadb",
        "box-shadow": "0 0 4px 0px #0987fadb"
      });
    }
  }
  $(document).on("change", "#spl_owner", function() {
    valid_peer().catch(function() {
      $("#spl_owner").attr("data-status", "false").css({
        "color": "#289ab9",
        "box-shadow": "0 0 4px 0px #289ab9"
      });
    }).then(function() {
      allow_deploy();
    });
  });
  $(document).on("keyup", "#spl_owner", function() {
    valid_peer().catch(function() {
      $("#spl_owner").attr("data-status", "false").css({
        "color": "#289ab9",
        "box-shadow": "0 0 4px 0px #289ab9"
      });
    }).then(function() {
      allow_deploy();
    });
  });
  
  // clear spl form
  $(document).delegate("#spl_clear", "click", async function() {
    $("#spl_img_1, #spl_img_2, #spl_img_3, #spl_img_4").attr("src", "/img/default_token.png").addClass("spl_default");
    $("#spl_choice_1, #spl_choice_2, #spl_choice_3, #spl_choice_4").html("•••");
    $("#spl_choice_2, #spl_choice_3, #spl_choice_4").prop("disabled", true);
    $("#spl_field_1, #spl_field_2, #spl_field_3, #spl_field_4").prop("disabled", true);
    $("#spl_owner").val("").prop("disabled", true).attr("data-status", "false");
    $(".spl_tx_total .swap_amt").html("0.0");
    $("#spl_deploy").prop("disabled", true);
    $(".swap_spl_b, .swap_spl_c, .swap_spl_d").removeClass("active_spl");
    $(".spl_choice").removeAttr("data-mint");
    $("#spl_owner").prop("disabled", true);
    $("#spl_owner").attr("style", "").val("").attr("data-status", "false");
    $(".spl_value").val("");
    $("#sender_total, #receiver_total").html("");
  });

  // copy table id
  $(document).delegate(".spl_share_sig .swap_copy", "click", function() {
    let cp = copy($(".spl_share_sig .swap_val").html())
      .then(function() {
        alert("Signature copied, but you better make sure!");
      });
  });

  // copy mcswap id
  $(document).delegate(".spl_share_id .swap_copy", "click", function() {
    let cp = copy($(".spl_share_id .swap_val").html())
      .then(function() {
        alert("McSwap Link copied, but you better make sure!");
      });
  });
  
  // copy spl exec signature
  $(document).delegate(".share_spl_exec_sig .swap_copy", "click", function() {
    let cp = copy($(".share_spl_exec_sig .swap_val").html())
      .then(function() {
        alert("Signature copied, but you better make sure!");
      });
  });
  
  // view the share id from proposal composer
  $(document).delegate(".spl_share_id .swap_val", "click", function() {
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = $(this).html();
    let pathAr = qlink.split('/spl/');
    if (typeof pathAr[1] != "undefined") {
      let ids = pathAr[1].split("-");
      let quick_link = "/spl/" + ids[0] + "-" + ids[1];
      history.pushState("", "", quick_link);
      swap_viewer();
    }
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  
  // clear a spl choice
  $(document).delegate(".active_spl #spl_img_1, .active_spl #spl_img_2, .active_spl #spl_img_3, .active_spl #spl_img_4", "click", function() {
    $(this).next('input').next('input').val("");
    let id = $(this).attr("id");
    let btn = $("#" + id).parent().find(".spl_choice");
    let fld = $("#" + id).parent().find(".spl_field");
    if (btn.attr("data-mint") && btn.prop("disabled") != true) {
      $(this).attr("src", "/img/default_token.png").addClass("spl_default");
      btn.removeAttr("data-mint").html("•••");
      fld.val("");
    }
    allow_deploy();
    if (id == "spl_img_1") {
      $("#spl_value_1").val("");
      $("#spl_img_2").click();
      $("#spl_img_3").click();
      $("#spl_owner, .spl_choice, .spl_field").prop("disabled", true);
      $(".swap_spl_b, .swap_spl_c, .swap_spl_d ").removeClass("active_spl");
      $("#spl_owner").attr("style", "").val("").attr("data-status", "false");
      $("#spl_choice_1").prop("disabled", false);
    } else if (id == "spl_img_2") {
      $("#spl_value_2").val("");
      $("#spl_field_2").prop("disabled", true);
    } else if (id == "spl_img_3") {
      $("#spl_value_3").val("");
      $("#spl_img_4").click();
      $("#spl_owner").attr("style", "").val("").attr("data-status", "false");
      $("#spl_owner, #spl_field_3, #spl_field_4, #spl_choice_4").prop("disabled", true);
      $(".swap_spl_c, .swap_spl_d ").removeClass("active_spl");
    } else if (id == "spl_img_4") {
      $("#spl_value_4").val("");
      $("#spl_field_4").prop("disabled", true);
    }
    fair_totals_new();
  });
  
  // version copy click
  $(document).delegate("#vrs", "click", function() {
    let cp = copy("McSwap dApp Vrs: " + $("#vrs").html())
      .then(function() {
        let openifo = confirm("McSwap dApp Vrs: " + $("#vrs").html() + "\nClick Ok for more details.\nClick Cancel to stay.");
        if (openifo === true) {
          window.open("https://mcdegen.xyz/mcswap");
        } else {
          return;
        }
      });
  });
  
  // deploy spl button
  $(document).delegate("#spl_deploy", "click", async function() {
    $(this).prop("disabled", true);
    $("#cover").fadeIn(400);
    $("#cover_message").html("Requesting Approval...");
    $(".swap_spl_a, .swap_spl_b").removeClass("active_spl");
    $("#spl_owner, .spl_choice, .spl_field").prop("disabled", true);
    spl_deploy();
  });
  
  // deploy spl proposal
  async function spl_deploy() {

    let taker = $("#spl_owner").val();
    let multiply = 1;
    let token1Mint = null;
    let token2Mint = null;
    let token3Mint = null;
    let token4Mint = null;

    if ($("#spl_choice_1").attr("data-mint")) {
      token1Mint = $("#spl_choice_1").attr("data-mint");
    } else {
      token1Mint = "11111111111111111111111111111111";
    }
    let token1Amount = $("#spl_field_1").val();
    let token1_decimals = $("#spl_field_1").attr("data-decimals");
    token1_decimals = parseInt(token1_decimals);
    multiply = 1;
    for (let i = 0; i < token1_decimals; i++) {
      multiply = multiply * 10;
    }
    token1Amount = token1Amount * multiply;

    if ($("#spl_choice_2").attr("data-mint")) {
      token2Mint = $("#spl_choice_2").attr("data-mint");
    } else {
      token2Mint = "11111111111111111111111111111111";
    }
    let token2Amount = $("#spl_field_2").val();
    let token2_decimals = $("#spl_field_2").attr("data-decimals");
    token2_decimals = parseInt(token2_decimals);
    multiply = 1;
    for (let i = 0; i < token2_decimals; i++) {
      multiply = multiply * 10;
    }
    token2Amount = token2Amount * multiply;

    let token3Amount = 0;
    let token3_decimals = 0;
    let token4Amount = 0;
    let token4_decimals = 0;

    if ($("#spl_choice_4").attr("data-mint") == "sol") {
      token3Mint = "11111111111111111111111111111111";
      token3Amount = $("#spl_field_4").val();
      token3_decimals = 9;
      multiply = 1;
      for (let i = 0; i < token3_decimals; i++) {
        multiply = multiply * 10;
      }
      token3Amount = token3Amount * multiply;
    } else if ($("#spl_choice_3").attr("data-mint") == "sol") {
      token3Mint = "11111111111111111111111111111111";
      token3Amount = $("#spl_field_3").val();
      token3_decimals = 9;
      multiply = 1;
      for (let i = 0; i < token3_decimals; i++) {
        multiply = multiply * 10;
      }
      token3Amount = token3Amount * multiply;
    } else if ($("#spl_choice_3").attr("data-mint")) {
      token3Mint = $("#spl_choice_3").attr("data-mint");
      token3Amount = $("#spl_field_3").val();
      token3_decimals = $("#spl_field_3").attr("data-decimals");
      multiply = 1;
      for (let i = 0; i < token3_decimals; i++) {
        multiply = multiply * 10;
      }
      token3Amount = token3Amount * multiply;
    }

    if ($("#spl_choice_4").attr("data-mint") == "sol") {
      token4Mint = $("#spl_choice_3").attr("data-mint");
      token4Amount = $("#spl_field_3").val();
      token4_decimals = $("#spl_field_3").attr("data-decimals");
      multiply = 1;
      for (let i = 0; i < token4_decimals; i++) {
        multiply = multiply * 10;
      }
      token4Amount = token4Amount * multiply;
    } else if ($("#spl_choice_4").attr("data-mint")) {
      token4Mint = $("#spl_choice_4").attr("data-mint");
      token4Amount = $("#spl_field_4").val();
      token4_decimals = $("#spl_field_4").attr("data-decimals");
      multiply = 1;
      for (let i = 0; i < token4_decimals; i++) {
        multiply = multiply * 10;
      }
      token4Amount = token4Amount * multiply;
    } else {
      token4Mint = "11111111111111111111111111111111";
      token4Amount = 0;
      token4_decimals = 0;
      token4Amount = token4Amount * token4_decimals;
    }

    console.log("taker ", taker);
    console.log("token1Mint ", token1Mint);
    console.log("token1Amount", token1Amount);
    console.log("token2Mint ", token2Mint);
    console.log("token2Amount", token2Amount);
    console.log("token3Mint ", token3Mint);
    console.log("token3Amount", token3Amount);
    console.log("token4Mint ", token4Mint);
    console.log("token4Amount", token4Amount);

    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");

    let tokenSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_SPL_PROGRAM);

    let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")], tokenSwapProgramId);
    console.log("Program State PDA: ", programStatePDA[0].toString());

    let programState = null;
    await connection.getAccountInfo(programStatePDA[0])
      .then(function(response) {
        programState = response;
      })
      .catch(function(error) {
        error = JSON.stringify(error);
        error = JSON.parse(error);
        console.log("Error: ", error);
        return;
      });

    let pickleMint = null;
    let feeChips = null;
    let devTreasury = null;
    let mcDegensTreasury = null;
    let temp_rent = null;
    if (programState != null) {
      const encodedProgramStateData = programState.data;
      const decodedProgramStateData = PROGRAM_STATE.decode(encodedProgramStateData);
      console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
      console.log("programState - pickle_mint: ", new solanaWeb3.PublicKey(decodedProgramStateData.pickle_mint).toString());
      console.log("programState - fee_chips: ", new BN(decodedProgramStateData.fee_chips, 10, "le").toString());
      console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
      console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
      console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
      pickleMint = new solanaWeb3.PublicKey(decodedProgramStateData.pickle_mint);
      feeChips = new BN(decodedProgramStateData.fee_chips, 10, "le");
      devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
      mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
    } else {
      console.log("Program State Not Initialized");
      return;
    }

    let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], tokenSwapProgramId);
    console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

    let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
      provider.publicKey.toBytes(), new solanaWeb3.PublicKey(taker).toBytes()
    ], tokenSwapProgramId);
    console.log("Swap State PDA: ", swapStatePDA[0].toString());

    let providerPickleATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(pickleMint),
      provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );

    const tempToken1Account = new solanaWeb3.Keypair();
    console.log("Temp Token1 Account: ", tempToken1Account.publicKey.toString());
    temp_rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
    let createTempToken1AccountIx = solanaWeb3.SystemProgram.createAccount({
      programId: splToken.TOKEN_PROGRAM_ID,
      space: splToken.AccountLayout.span,
      lamports: temp_rent,
      fromPubkey: provider.publicKey,
      newAccountPubkey: tempToken1Account.publicKey,
    });
    console.log("Create Temp Token1 Account Ix: ", createTempToken1AccountIx);

    let initTempToken1AccountIx = splToken.createInitializeAccountInstruction(tempToken1Account.publicKey,
      new solanaWeb3.PublicKey(token1Mint), tempToken1Account.publicKey, splToken.TOKEN_PROGRAM_ID);
    console.log("Init Temp Token1 Account Ix: ", initTempToken1AccountIx);

    let providerToken1ATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(token1Mint),
      provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );

    console.log("providerToken1ATA", providerToken1ATA.toString());
    console.log("tempToken1Account.publicKey", tempToken1Account.publicKey.toString());
    console.log("provider.publicKey", provider.publicKey.toString());
    console.log("token1Amount", token1Amount);
    console.log("splToken.TOKEN_PROGRAM_ID", splToken.TOKEN_PROGRAM_ID.toString());

    let transferToken1Ix = splToken.createTransferInstruction(providerToken1ATA, tempToken1Account.publicKey,
      provider.publicKey, token1Amount, provider.publicKey, splToken.TOKEN_PROGRAM_ID, );
    console.log("Transfer Token1 Ix: ", transferToken1Ix);

    let tempToken2Account = new solanaWeb3.Keypair();
    let createTempToken2AccountIx = null;
    let initTempToken2AccountIx = null;
    let transferToken2Ix = null;

    if (token2Amount > 0) {

      console.log("Temp Token2 Account: ", tempToken2Account.publicKey.toString());
      temp_rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
      createTempToken2AccountIx = solanaWeb3.SystemProgram.createAccount({
        programId: splToken.TOKEN_PROGRAM_ID,
        space: splToken.AccountLayout.span,
        lamports: temp_rent,
        fromPubkey: provider.publicKey,
        newAccountPubkey: tempToken2Account.publicKey,
      });
      console.log("Create Temp Token2 Account Ix: ", createTempToken2AccountIx);

      initTempToken2AccountIx = splToken.createInitializeAccountInstruction(tempToken2Account.publicKey,
        new solanaWeb3.PublicKey(token2Mint), tempToken2Account.publicKey, splToken.TOKEN_PROGRAM_ID);
      console.log("Init Temp Token2 Account Ix: ", initTempToken2AccountIx);

      let providerToken2ATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(token2Mint),
        provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
      transferToken2Ix = splToken.createTransferInstruction(providerToken2ATA, tempToken2Account.publicKey,
        provider.publicKey, token2Amount, provider.publicKey, splToken.TOKEN_PROGRAM_ID, );
      console.log("Transfer Token2 Ix: ", transferToken2Ix);

    }

    let createToken3ATA = null;
    let createToken3ATAIx = null;
    let token3ATA = null;

    if (token3Mint != "11111111111111111111111111111111") {
      token3ATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(token3Mint), provider.publicKey,
        false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
      console.log("Token3 ATA: ", token3ATA.toString());
      let token3ATAresponse = await connection.getAccountInfo(token3ATA);
      if (token3ATAresponse == null) {
        createToken3ATA = true;
        createToken3ATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey, token3ATA,
          provider.publicKey, new solanaWeb3.PublicKey(token3Mint), splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        console.log("Create Token3 ATA Ix: ", createToken3ATAIx);
      } else {
        createToken3ATA = false;
        console.log("Not creating Token3 ATA Ix");
      }
    }

    let createToken4ATA = false;
    let token4ATA = null;
    let createToken4ATAIx = null;

    if (token4Amount > 0) {
      token4ATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(token4Mint), provider.publicKey, false,
        splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
      console.log("Token4 ATA: ", token4ATA.toString());
      let token4ATAresponse = await connection.getAccountInfo(token4ATA);
      if (token4ATAresponse == null) {
        createToken4ATA = true;
        createToken4ATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey, token4ATA, provider.publicKey,
          new solanaWeb3.PublicKey(token4Mint), splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        console.log("Create Token4 ATA Ix: ", createToken4ATAIx);
      } else {
        console.log("Not creating Token4 ATA Ix");
        createToken4ATA = false;
      }
    }

    let totalSize = 1 + 32 + 8 + 32 + 8 + 32 + 8;
    console.log("totalSize", totalSize);

    let uarray = new Uint8Array(totalSize);
    let counter = 0;
    uarray[counter++] = 0; // 0 = token_swap InitializeSwap instruction

    let arr;
    let byte;
    let byteArray;
    let index;

    let takerb58 = bs58.decode(taker);
    arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    let token2 = token2Amount;
    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (index = 0; index < byteArray.length; index++) {
      byte = token2 & 0xff;
      byteArray[index] = byte;
      token2 = (token2 - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }

    let token3Mintb58 = bs58.decode(token3Mint);
    arr = Array.prototype.slice.call(Buffer.from(token3Mintb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (index = 0; index < byteArray.length; index++) {
      byte = token3Amount & 0xff;
      byteArray[index] = byte;
      token3Amount = (token3Amount - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }

    let token4Mintb58 = bs58.decode(token4Mint.toString());
    arr = Array.prototype.slice.call(Buffer.from(token4Mintb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (index = 0; index < byteArray.length; index++) {
      byte = token4Amount & 0xff;
      byteArray[index] = byte;
      token4Amount = (token4Amount - byte) / 256;
    }
    for (let i = 0; i < byteArray.length; i++) {
      uarray[counter++] = byteArray[i];
    }

    console.log("Contract Data: ", uarray);

    const initializeSwapIx = new solanaWeb3.TransactionInstruction({
      programId: tokenSwapProgramId,
      data: Buffer.from(uarray),
      keys: [{
          pubkey: provider.publicKey,
          isSigner: true,
          isWritable: true
        }, // 0
        {
          pubkey: programStatePDA[0],
          isSigner: false,
          isWritable: false
        }, // 1
        {
          pubkey: swapVaultPDA[0],
          isSigner: false,
          isWritable: false
        }, // 2
        {
          pubkey: swapStatePDA[0],
          isSigner: false,
          isWritable: true
        }, // 3            
        {
          pubkey: tempToken1Account.publicKey,
          isSigner: true,
          isWritable: true
        }, // 4
        {
          pubkey: tempToken2Account.publicKey,
          isSigner: true,
          isWritable: true
        }, // 5
        {
          pubkey: providerPickleATA,
          isSigner: false,
          isWritable: true
        }, // 6  HERE
        // { pubkey: tempFeeAccount.publicKey, isSigner: true, isWritable: true }, // 6  HERE
        {
          pubkey: solanaWeb3.SystemProgram.programId,
          isSigner: false,
          isWritable: false
        }, // 7
        {
          pubkey: splToken.TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false
        }, // 8
        {
          pubkey: devTreasury,
          isSigner: false,
          isWritable: true
        }, // 9
        {
          pubkey: mcDegensTreasury,
          isSigner: false,
          isWritable: true
        }, // 10
      ]
    });
    console.log("Initialize Swap Ix: ", initializeSwapIx);

    let lookupTable = new solanaWeb3.PublicKey(conf.spl_alt); // mainnet    
    lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
    if (!lookupTableAccount) {
      console.log("Could not fetch ALT!");
      return;
    }
    
    let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_spl").val()),});
    
    let messageV0 = null;
    if (token2Amount > 0) {
      console.log("debug set 2");
      if (createToken3ATA == true && createToken4ATA) {
        console.log("1");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createTempToken2AccountIx,
            initTempToken2AccountIx,
            transferToken2Ix,
            createToken3ATAIx,
            createToken4ATAIx,
            initializeSwapIx
          ],
        }).compileToV0Message([lookupTableAccount]);
      } else if (createToken3ATA) {
        console.log("2");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createTempToken2AccountIx,
            initTempToken2AccountIx,
            transferToken2Ix,
            createToken3ATAIx,
            initializeSwapIx
          ],
        }).compileToV0Message([lookupTableAccount]);
      } else if (createToken4ATA) {
        console.log("3");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createTempToken2AccountIx,
            initTempToken2AccountIx,
            transferToken2Ix,
            createToken4ATAIx,
            initializeSwapIx
          ],
        }).compileToV0Message([lookupTableAccount]);
      } else {
        console.log("4");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createTempToken2AccountIx,
            initTempToken2AccountIx,
            transferToken2Ix,
            initializeSwapIx,
          ],
        }).compileToV0Message([lookupTableAccount]);
      }
    } 
    else {
      if (createToken3ATA == true && createToken4ATA == true) {
        console.log("5");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createToken3ATAIx,
            createToken4ATAIx,
            initializeSwapIx
          ],
        }).compileToV0Message([lookupTableAccount]);
      } else if (createToken3ATA) {
        console.log("6");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createToken3ATAIx,
            initializeSwapIx
          ],
        }).compileToV0Message([lookupTableAccount]);
      } else if (createToken4ATA) {
        console.log("7");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createToken4ATAIx,
            initializeSwapIx
          ],
        }).compileToV0Message([lookupTableAccount]);
      } else {
        console.log("8");
        messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: [
            // createTempFeeAccountIx,  // HERE
            // initTempFeeAccountIx,
            // transferPickleIx,
            computePriceIx,
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            initializeSwapIx
          ],
        }).compileToV0Message([lookupTableAccount]);
      }
    }
    
    const initializeSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
    
    try {
      let signedTx = await provider.signTransaction(initializeSwapTx);
      signedTx.sign([tempToken1Account, tempToken2Account]);
      let signature = await connection.sendTransaction(signedTx);
      console.log("Signature: ", signature);
      $(".spl_share_sig .swap_val").html(signature);
      console.log(`https://solscan.io/tx/${signature}`);
      $(".spl_share_sig .swap_val").html(signature);
      $("#cover_message").html("Finalizing Transaction...");
      let final = await finalized(signature,30,4000);
      if(final != "finalized"){
        $("#spl_deploy, .spl_choice, .spl_field, #spl_owner").prop("disabled", false);
        $(".swap_spl_a, .swap_spl_b").addClass("active_spl");
        $("#cover_message").html(final);
        setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);  
        return;
      }
      $("#cover_message").html("Transaction Complete.");
      let peer = $("#spl_owner").val();
      $("#spl_clear").click();
      $(".swap_spl_d, .swap_spl_a").addClass("active_spl");
      $(".spl_share_id .swap_val").html(conf.host + "/spl/" + provider.publicKey.toString() + "-" + peer);
      setTimeout(() => {
        $("#spl_choice_1").prop("disabled", false);
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      }, 3000);
    } 
    catch (error) {
      console.log("Error: ", error);
      error = JSON.stringify(error);
      error = JSON.parse(error);
      console.log("Error Logs: ", error);
      $("#cover_message").html("Error! Canceling Transaction...");
      $("#spl_deploy, .spl_choice, .spl_field, #spl_owner").prop("disabled", false);
      $(".swap_spl_a, .swap_spl_b").addClass("active_spl");
      setTimeout(() => {
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      }, 3000);
      return;
    }
    
  }
  
  // spl reverse
  $(document).delegate("#swap_spl_reverse", "click", async function() {

    $("#cover").fadeIn(400);
    $("#cover_message").html("Requesting Approval...");

    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    provider = await wallet_provider();

    // These are passed
    let taker = $("#spl_owner_b").val();
    console.log("taker ", taker);

    let tokenSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_SPL_PROGRAM);

    let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], tokenSwapProgramId);
    console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

    let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
      provider.publicKey.toBytes(), new solanaWeb3.PublicKey(taker).toBytes()
    ], tokenSwapProgramId);
    console.log("Swap State PDA: ", swapStatePDA[0].toString());

    let swapState = null;
    await connection.getAccountInfo(swapStatePDA[0])
      .then(function(response) {
        swapState = response;
      })
      .catch(function(error) {
        error = JSON.stringify(error);
        error = JSON.parse(error);
        console.log("Error: ", error);
        return;
      });

    let token1Mint = null;
    let tempToken1Account = null;
    let token2Mint = null;
    let tempToken2Account = null;
    if (swapState != null) {
      let encodedSwapStateData = swapState.data;
      let decodedSwapStateData = SWAP_SPL_STATE.decode(encodedSwapStateData);
      console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
      console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
      console.log("swapState - token1_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.token1_mint).toString());
      console.log("swapState - token1_amount", new BN(decodedSwapStateData.token1Amount, 10, "le").toString());
      console.log("swapState - temp_token1_account", new solanaWeb3.PublicKey(decodedSwapStateData.temp_token1_account).toString());
      console.log("swapState - token2_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.token2_mint).toString());
      console.log("swapState - token2_amount", new BN(decodedSwapStateData.token2Amount, 10, "le").toString());
      console.log("swapState - temp_token2_account", new solanaWeb3.PublicKey(decodedSwapStateData.temp_token2_account).toString());
      token1Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token1_mint);
      tempToken1Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token1_account);
      token2Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token2_mint);
      tempToken2Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token2_account);
    } else {
      console.log("Swap Not Initialized");
      return;
    }

    let token1ATA = await splToken.getAssociatedTokenAddress(token1Mint, provider.publicKey,
      false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );

    let token2ATA = await splToken.getAssociatedTokenAddress(token2Mint, provider.publicKey,
      false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );

    var totalSize = 1 + 32;
    console.log("totalSize", totalSize);

    var uarray = new Uint8Array(totalSize);
    let counter = 0;
    uarray[counter++] = 2; // 2 = token_swap ReverseSwap instruction

    let takerb58 = bs58.decode(taker);
    var arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
    for (let i = 0; i < arr.length; i++) {
      uarray[counter++] = arr[i];
    }

    console.log("Data: ", uarray);

    let reverseSwapIx = new solanaWeb3.TransactionInstruction({
      programId: tokenSwapProgramId,
      data: Buffer.from(uarray),
      keys: [{
          pubkey: provider.publicKey,
          isSigner: true,
          isWritable: true
        }, // 0
        {
          pubkey: swapVaultPDA[0],
          isSigner: false,
          isWritable: false
        }, // 1
        {
          pubkey: swapStatePDA[0],
          isSigner: false,
          isWritable: true
        }, // 2
        {
          pubkey: tempToken1Account,
          isSigner: false,
          isWritable: true
        }, // 3
        {
          pubkey: tempToken2Account,
          isSigner: false,
          isWritable: true
        }, // 4
        {
          pubkey: token1ATA,
          isSigner: false,
          isWritable: true
        }, // 5
        {
          pubkey: token2ATA,
          isSigner: false,
          isWritable: true
        }, // 6
        {
          pubkey: splToken.TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false
        }, // 7
      ]
    });
    console.log("Reverse Swap Ix: ", reverseSwapIx);
    
    let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_spl").val()),});

    let messageV0 = new solanaWeb3.TransactionMessage({
      payerKey: provider.publicKey,
      recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
      instructions: [computePriceIx, reverseSwapIx],
    }).compileToV0Message([]);
    let reverseSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
    try {
      let signedTx = await provider.signTransaction(reverseSwapTx);
      let txId = await connection.sendTransaction(signedTx);
      console.log("Signature: ", txId);
      $("#cover_message").html("Finalizing Transaction...");
      let final = await finalized(txId,30,4000);
      if(final != "finalized"){
        $("#cover_message").html(final);
        setTimeout(() => {
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
        }, 3000);
        return;
      }
      $("#cover_message").html("Contract Closed.");
      history.pushState("", "", '/');
      $("#spl_img_5, #spl_img_6, #spl_img_7, #spl_img_8").attr("src", "/img/default_token.png").addClass("spl_default");
      $("#spl_choice_5, #spl_choice_6, #spl_choice_7, #spl_choice_8").html("•••");
      $("#spl_field_5, #spl_field_6, #spl_field_7, #spl_field_8").val("");
      $("#spl_owner_a, #spl_owner_b").val("");
      $(".spl_tx_total_x .swap_amt").val(0);
      $(".swap_spl_h").hide();
      $("#scroll_wrapper").getNiceScroll().resize();
      $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
      setTimeout(() => {
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
        $("#spl_choice_1").prop("disabled", false);
      }, 3000);
    } 
    catch (error) {
      console.log("Error: ", error);
      error = JSON.stringify(error);
      error = JSON.parse(error);
      console.log("Error Logs: ", error);
      $("#cover_message").html("Transaction Error!");
      setTimeout(() => {
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      }, 3000);
      return;
    }

  });
  
  // spl execute
  $(document).delegate("#spl_execute", "click", async function() {

    $("#cover").fadeIn(400);
    $("#cover_message").html("Requesting Approval...");

    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let tokenSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_SPL_PROGRAM);

    let swapInitializer = $("#spl_owner_a").val(); // phantom hot account
    console.log("swapInitializer ", swapInitializer);

    let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")], tokenSwapProgramId);
    console.log("Program State PDA: ", programStatePDA[0].toString());

    let programState = null;
    await connection.getAccountInfo(programStatePDA[0])
      .then(function(response) {
        programState = response;
      })
      .catch(function(error) {
        error = JSON.stringify(error);
        error = JSON.parse(error);
        console.log("Error: ", error);
        return;
      });

    let pickleMint = null;
    let feeChips = null;
    let devTreasury = null;
    let mcDegensTreasury = null;
    if (programState != null) {
      let encodedProgramStateData = programState.data;
      let decodedProgramStateData = PROGRAM_STATE.decode(encodedProgramStateData);
      console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
      console.log("programState - pickle_mint: ", new solanaWeb3.PublicKey(decodedProgramStateData.pickle_mint).toString());
      console.log("programState - fee_chips: ", new BN(decodedProgramStateData.fee_chips, 10, "le").toString());
      console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
      console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
      console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
      pickleMint = new solanaWeb3.PublicKey(decodedProgramStateData.pickle_mint);
      feeChips = new BN(decodedProgramStateData.fee_chips, 10, "le");
      devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
      mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
    } else {
      console.log("Program State Not Initialized");
      return;
    }

    let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], tokenSwapProgramId);
    console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

    let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
      new solanaWeb3.PublicKey(swapInitializer).toBytes(), provider.publicKey.toBytes()
    ], tokenSwapProgramId);
    console.log("Swap State PDA: ", swapStatePDA[0].toString());

    let swapState = null;
    await connection.getAccountInfo(swapStatePDA[0])
      .then(function(response) {
        swapState = response;
      })
      .catch(function(error) {
        error = JSON.stringify(error);
        error = JSON.parse(error);
        console.log("Error: ", error);
        return;
      });

    let initializer = null;
    let token1Mint = null;
    let token1Amount = null;
    let tempToken1Account = null;
    let token2Mint = null;
    let token2Amount = null;
    let tempToken2Account = null;
    let taker = null
    let token3Mint = null;
    let token3Amount = null;
    let token4Mint = null;
    let token4Amount = null;
    if (swapState != null) {
      let encodedSwapStateData = swapState.data;
      let decodedSwapStateData = SWAP_SPL_STATE.decode(encodedSwapStateData);
      console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
      console.log("swapState - utime", new BN(decodedSwapStateData.utime, 10, "le").toString());
      console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
      console.log("swapState - token1_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.token1_mint).toString());
      console.log("swapState - token1_amount", new BN(decodedSwapStateData.token1_amount, 10, "le").toString());
      console.log("swapState - temp_token1_account", new solanaWeb3.PublicKey(decodedSwapStateData.temp_token1_account).toString());
      console.log("swapState - token2_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.token2_mint).toString());
      console.log("swapState - token2_amount", new BN(decodedSwapStateData.token2_amount, 10, "le").toString());
      console.log("swapState - temp_token2_account", new solanaWeb3.PublicKey(decodedSwapStateData.temp_token2_account).toString());
      console.log("swapState - taker: ", new solanaWeb3.PublicKey(decodedSwapStateData.taker).toString());
      console.log("swapState - token3_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.token3_mint).toString());
      console.log("swapState - token3_amount", new BN(decodedSwapStateData.token3_amount, 10, "le").toString());
      console.log("swapState - token4_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.token4_mint).toString());
      console.log("swapState - token4_amount", new BN(decodedSwapStateData.token4_amount, 10, "le").toString());
      initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
      token1Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token1_mint);
      token1Amount = new BN(decodedSwapStateData.token1_amount, 10, "le");
      tempToken1Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token1_account);
      token2Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token2_mint);
      token2Amount = new BN(decodedSwapStateData.token2_amount, 10, "le");
      tempToken2Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token2_account);
      taker = new solanaWeb3.PublicKey(decodedSwapStateData.taker);
      token3Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token3_mint);
      token3Amount = new BN(decodedSwapStateData.token3_amount, 10, "le");
      token4Mint = new solanaWeb3.PublicKey(decodedSwapStateData.token4_mint);
      token4Amount = new BN(decodedSwapStateData.token4_amount, 10, "le");
    } else {
      console.log("Swap Not Initialized");
      return;
    }

    let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);

    let providerPickleATA = await splToken.getAssociatedTokenAddress(
      new solanaWeb3.PublicKey(pickleMint),
      provider.publicKey,
      false,
      splToken.TOKEN_PROGRAM_ID,
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    let createTempToken3AccountIx = null;
    let initTempToken3AccountIx = null;
    let transferToken3Ix = null;

    let providerToken3ATA = providerPickleATA;
    if (token3Mint.toString() != "11111111111111111111111111111111") {
      providerToken3ATA = await splToken.getAssociatedTokenAddress(
        token3Mint,
        provider.publicKey,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token 3 Amount", parseInt(token3Amount.toString()));
      console.log("providerToken3ATA", providerToken3ATA);
    }

    let providerToken4ATA = providerToken3ATA;
    if (parseInt(token4Amount.toString()) > 0) {
      providerToken4ATA = await splToken.getAssociatedTokenAddress(
        token4Mint,
        provider.publicKey,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token 4 Amount", parseInt(token4Amount.toString()));
      console.log("token4Mint", token4Mint.toString());
      console.log("providerToken4ATA", providerToken4ATA);
    }

    let createToken1ATA = null;
    let createToken1ATAIx = null;
    let token1ATA = await splToken.getAssociatedTokenAddress(
      token1Mint,
      provider.publicKey,
      false,
      splToken.TOKEN_PROGRAM_ID,
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    console.log("Token1 ATA: ", token1ATA.toString());

    await connection.getAccountInfo(token1ATA)
      .then(function(response) {
        console.log("token1ATA response ", response);
        if (response == null) {
          createToken1ATA = true;
          createToken1ATAIx = splToken.createAssociatedTokenAccountInstruction(
            provider.publicKey,
            token1ATA,
            provider.publicKey,
            token1Mint,
            splToken.TOKEN_PROGRAM_ID,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          )
          console.log("Create Token1 ATA Ix: ", createToken1ATAIx);
        } else {
          createToken1ATA = false;
        }
      })
      .catch(function(error) {
        error = JSON.stringify(error);
        error = JSON.parse(error);
        console.log("Error: ", error);
        return;
      });
    console.log("createToken1ATA ", createToken1ATA);

    let token2ATA = token1ATA;
    let createToken2ATA = null;
    let createToken2ATAIx = null;
    if (token2Amount > 0) {
      token2ATA = await splToken.getAssociatedTokenAddress(
        token2Mint,
        provider.publicKey,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token2 ATA: ", token2ATA.toString());

      await connection.getAccountInfo(token2ATA)
        .then(function(response) {
          console.log("token2ATA response ", response);
          if (response == null) {
            createToken2ATA = true;
            createToken2ATAIx = splToken.createAssociatedTokenAccountInstruction(
              provider.publicKey,
              token2ATA,
              provider.publicKey,
              token2Mint,
              splToken.TOKEN_PROGRAM_ID,
              splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            )
            console.log("Create Token2 ATA Ix: ", createToken2ATAIx);
          } else {
            createToken2ATA = false;
          }
        })
        .catch(function(error) {
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error: ", error);
          return;
        });
      console.log("createToken2ATA ", createToken2ATA);
    }

    let token3ATA = initializer;
    if (token3Mint.toString() != "11111111111111111111111111111111") {
      token3ATA = await splToken.getAssociatedTokenAddress(
        token3Mint,
        initializer,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token3 ATA: ", token3ATA.toString());
    }

    let token4ATA = token3ATA;
    if (parseInt(token4Amount.toString()) > 0) {
      token4ATA = await splToken.getAssociatedTokenAddress(
        token4Mint,
        initializer,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
      console.log("Token4 ATA: ", token4ATA.toString());
    }

    let totalSize = 1;
    console.log("totalSize", totalSize);

    let uarray = new Uint8Array(totalSize);
    let counter = 0;
    uarray[counter++] = 1; // 1 = token_swap SwapNFTs instruction
    console.log("Data: ", uarray);

    let swapTokensIx = new solanaWeb3.TransactionInstruction({
      programId: tokenSwapProgramId,
      data: Buffer.from(
        uarray
      ),
      keys: [{
          pubkey: provider.publicKey,
          isSigner: true,
          isWritable: true
        }, // 0
        {
          pubkey: initializer,
          isSigner: false,
          isWritable: true
        }, // 1
        {
          pubkey: programStatePDA[0],
          isSigner: false,
          isWritable: false
        }, // 2
        {
          pubkey: swapVaultPDA[0],
          isSigner: false,
          isWritable: false
        }, // 3
        {
          pubkey: swapStatePDA[0],
          isSigner: false,
          isWritable: true
        }, // 4
        {
          pubkey: tempToken1Account,
          isSigner: false,
          isWritable: true
        }, // 5
        {
          pubkey: tempToken2Account,
          isSigner: false,
          isWritable: true
        }, // 6
        {
          pubkey: providerToken3ATA,
          isSigner: false,
          isWritable: true
        }, // 7  HERE
        {
          pubkey: providerToken4ATA,
          isSigner: false,
          isWritable: true
        }, // 8  HERE
        {
          pubkey: token1ATA,
          isSigner: false,
          isWritable: true
        }, // 9
        {
          pubkey: token2ATA,
          isSigner: false,
          isWritable: true
        }, // 10
        {
          pubkey: token3ATA,
          isSigner: false,
          isWritable: true
        }, // 11
        {
          pubkey: token4ATA,
          isSigner: false,
          isWritable: true
        }, // 12
        {
          pubkey: providerPickleATA,
          isSigner: false,
          isWritable: true
        }, // 13  HERE
        {
          pubkey: splToken.TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false
        }, // 14
        {
          pubkey: solanaWeb3.SystemProgram.programId,
          isSigner: false,
          isWritable: false
        }, // 15  HERE
        {
          pubkey: devTreasury,
          isSigner: false,
          isWritable: true
        }, // 16
        {
          pubkey: mcDegensTreasury,
          isSigner: false,
          isWritable: true
        }, // 17
      ]
    });
    console.log("Swap Tokens Ix: ", swapTokensIx);

    let lookupTable = new solanaWeb3.PublicKey(conf.spl_alt);
    let lookupTableAccount = await connection
      .getAddressLookupTable(lookupTable)
      .then((res) => res.value);
    if (!lookupTableAccount) {
      console.log("Could not fetch ALT!");
      return;
    }

    let messageV0 = null;

    let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_spl_exec").val()),});
    
    if (createToken1ATA == true && createToken2ATA) {
      console.log("1");
      messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [
          computePriceIx,
          createToken1ATAIx,
          createToken2ATAIx,
          swapTokensIx
        ],
      }).compileToV0Message([lookupTableAccount]);
    } else if (createToken1ATA) {
      console.log("2");
      messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [
          computePriceIx,
          createToken1ATAIx,
          swapTokensIx
        ],
      }).compileToV0Message([lookupTableAccount]);
    } else if (createToken2ATA) {
      console.log("3");
      messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [
          computePriceIx,
          createToken2ATAIx,
          swapTokensIx
        ],
      }).compileToV0Message([lookupTableAccount]);
    } else {
      console.log("4");
      messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: [
          computePriceIx,
          swapTokensIx
        ],
      }).compileToV0Message([lookupTableAccount]);
    }

    console.log("messageV0 ", messageV0);

    let swapTokensTx = new solanaWeb3.VersionedTransaction(messageV0);

    try {
      let signedTx = await provider.signTransaction(swapTokensTx);
      let txId = await connection.sendTransaction(signedTx);
      console.log("Signature: ", txId);
      console.log(`https://solscan.io/tx/${txId}`);
      $("#cover_message").html("Executing Contract...");
      let final = await finalized(txId,30,4000);
      if(final != "finalized"){
        $("#cover_message").html(final);
        setTimeout(() => {
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
        }, 3000);
        return;
      }
      $(".share_spl_exec_sig .swap_val").html(txId);
      $("#cover_message").html("Swap Complete.");
      history.pushState("", "", '/');
      $("#spl_img_5, #spl_img_6, #spl_img_7, #spl_img_8").attr("src", "/img/default_token.png").addClass("spl_default");
      $("#spl_choice_5, #spl_choice_6, #spl_choice_7, #spl_choice_8").html("•••");
      $("#spl_field_5, #spl_field_6, #spl_field_7, #spl_field_8").val("");
      $("#spl_owner_a, #spl_owner_b").val("");
      $(".spl_tx_total_x .swap_amt").val(0);
      $(".swap_spl_h").hide();
      $("#spl_choice_1").prop("disabled", false);
      $("#spl_execute").prop("disabled", true);
      $(".swap_spl_e, .swap_spl_f").removeClass("active_spl");
      $("#scroll_wrapper").getNiceScroll().resize();
      setTimeout(() => {
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      }, 3000);      
    } 
    catch (error) {
      console.log("Error: ", error);
      error = JSON.stringify(error);
      error = JSON.parse(error);
      console.log("Error Logs: ", error);
      $("#cover_message").html("Transaction Error!");
      setTimeout(() => {
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      }, 3000);
      return;
    }

  });
  
  // idle disconnect
  $(this).mousemove(function(e) {
    idleTime = 1;
  });
  $(this).keypress(function(e) {
    idleTime = 1;
  });
  async function idleIncrement(limit) {
    idleTime = idleTime + 1;
    if (idleTime > limit && $(".connect_me").length == 0) {
      $(".types_").val("");
//       $(".share_id .swap_val").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
      $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
      $(".swap_f").removeClass("active_swap");
      $(".swap_g").addClass("active_swap");
      $(".swap_cancel_b, #swap_deploy").prop("disabled", true);
      $(".mode_switch, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
      $("#donate_sol, .mcprofile_close, #wallet_refresh").show();
//       $("ul[data-id='" + $("#create_a_id").val() + "']").remove();
//       $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
      $("#create_a_id, #sol_request, #pikl_request, #usdc_request, #create_a_owner, #create_b_owner, #create_b_id").val("");
      $(".swap_img_a, .swap_img_b").attr("src", "/img/img-placeholder.png");
      $("#wallet_disconnect, #requests_close, .mcprofile_close, #wallet_close").click();
      console.log("user idle");
    }
  }
  idleInterval = setInterval(function() {
    idleIncrement(conf.idler)
  }, 60000);
  
  // sync proposals
  // localStorage.clear();
  async function decimal_joe(units, decimals) {
    if (units == 0) {
      return "0.00";
    } else {
      let multi = 1;
      for (let i = 0; i < decimals; i++) {
        multi = multi * 10;
      }
      let response = units / multi;
      response = parseFloat(response).toFixed(decimals);
      response.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return response;
    }
  }
  async function syncProposals() {
    provider = wallet_provider();
    if (typeof provider == "undefined") {} else if (provider.isConnected != true) {} else if (provider.isConnected == true) {
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      // sync spl proposals
      $.getJSON("/data/proposals/spl.json", async function(data) {
        let prog = "spl";
        let records = [];
        let wallet = provider.publicKey.toString();
        if (!localStorage.getItem(prog + "_skips_" + wallet)) {
          let obj = []
          localStorage.setItem(prog + "_skips_" + wallet, JSON.stringify(obj));
        }
        let local_skips = JSON.parse(localStorage.getItem(prog + "_skips_" + wallet));
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let record = {};
            let acct = data[i];
            if (!local_skips.includes(acct)) {
              record.acct = acct;
              let acct_publicKey = new solanaWeb3.PublicKey(acct);
              let acct_info = await connection.getAccountInfo(acct_publicKey)
              .catch(function(err){});
              if(typeof acct_info != "undefined"){
                let acct_parsed = SWAP_SPL_STATE.decode(acct_info.data);
                let spl_initializer = new solanaWeb3.PublicKey(acct_parsed.initializer);
                record.peer_a = spl_initializer.toString();
                let spl_taker = new solanaWeb3.PublicKey(acct_parsed.taker);
                record.peer_b = spl_taker.toString();
                let utime = new BN(acct_parsed.utime, 10, "le");
                record.utime = parseInt(utime.toString());
                record.token_1_mint = new solanaWeb3.PublicKey(acct_parsed.token1_mint).toString();
                record.token_2_mint = new solanaWeb3.PublicKey(acct_parsed.token2_mint).toString();
                record.token_3_mint = new solanaWeb3.PublicKey(acct_parsed.token3_mint).toString();
                record.token_4_mint = new solanaWeb3.PublicKey(acct_parsed.token4_mint).toString();
                //             console.log("record.token_4_mint",record.token_4_mint);
                record.token_1_amount = parseInt(new BN(acct_parsed.token1_amount, 10, "le"));
                record.token_2_amount = parseInt(new BN(acct_parsed.token2_amount, 10, "le"));
                record.token_3_amount = parseInt(new BN(acct_parsed.token3_amount, 10, "le"));
                record.token_4_amount = parseInt(new BN(acct_parsed.token4_amount, 10, "le"));
                //             console.log("record.token_4_amount",record.token_4_amount);
                //         let spl_tempToken1Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token1_account);
                //         let spl_tempToken2Account = new solanaWeb3.PublicKey(decodedSwapStateData.temp_token2_account);
                records.push(record);
              }
            }
          }
        }
        records.sort((a, b) => b.utime - a.utime);
        let sent = [];
        let received = [];
        let skips = [];
        for (let i = 0; i < records.length; i++) {
          if (wallet == records[i].peer_a) {
            sent.push(records[i]);
          } else if (wallet == records[i].peer_b) {
            received.push(records[i]);
          } else {
            skips.push(records[i].acct);
          }
        }
        if (!localStorage.getItem(prog + "_list_" + wallet)) {
          let obj = {}
          obj.sent = [];
          obj.received = [];
          localStorage.setItem(prog + "_list_" + wallet, JSON.stringify(obj));
        }
        let local_list = JSON.parse(localStorage.getItem(prog + "_list_" + wallet));
        if (local_list.sent.length > 0) {
          // backcheck sent
          for (let i = 0; i < local_list.sent.length; i++) {
            let item = local_list.sent[i].acct;
            if (!data.includes(item)) {
              local_list.sent.splice(i, 1);
            }
          }
          sent = sent.concat(local_list.sent);
        }
        if (local_list.received.length > 0) {
          // backcheck received
          for (let i = 0; i < local_list.received.length; i++) {
            let item = local_list.received[i].acct;
            if (!data.includes(item)) {
              local_list.received.splice(i, 1);
            }
          }
          received = received.concat(local_list.received);
        }
        if (skips.length > 0) {
          // backcheck skips
          for (let i = 0; i < skips.length; i++) {
            let item = skips[i];
            if (!data.includes(item)) {
              skips.splice(i, 1);
            }
          }
          localStorage.setItem(prog + "_skips_" + wallet, JSON.stringify(skips));
        }
        let obj = {}
        obj.sent = sent;
        obj.received = received;
        localStorage.setItem(prog + "_list_" + wallet, JSON.stringify(obj));
      });
      // sync spl proposals
    }
  }
  proposalInterval = setInterval(async function() {
    syncProposals();
  }, 20000);
  proposalUpdate = setInterval(async function() {
    displayProposals();
  }, 10000);
  async function displayProposals() {
    provider = wallet_provider();
    if (typeof provider == "undefined") {
      $("#spl_sent, #spl_received").html("");
    } else if (provider.isConnected != true) {
      $("#spl_sent, #spl_received").html("");
    } else if (provider.isConnected == true) {
      let do_notify = 0;
      let resize_smart = 0;

      // spl
      let wallet = provider.publicKey.toString();
      if (localStorage.getItem("spl_list_" + wallet)) {
        let list_spl = JSON.parse(localStorage.getItem("spl_list_" + wallet));
        list_spl.sent.reverse();
        list_spl.received.reverse();
        let default_img = '<img src="/img/default_token.png" class="spl_default smart_default" />';
        let img_1 = default_img;
        let img_2 = default_img;
        let img_3 = default_img;
        let img_4 = default_img;
        // sent
        for (let i = 0; i < list_spl.sent.length; i++) {
          if (!$("ul[data-spl_sent='" + list_spl.sent[i].acct + "']").length) {
            //           $("#spl_sent .syncing").remove();
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_spl.sent[i].token_1_mint) {
                list_spl.sent[i].token_1_name = tokn.name;
                list_spl.sent[i].token_1_symbol = tokn.symbol;
                list_spl.sent[i].token_1_image = tokn.image;
                list_spl.sent[i].token_1_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl.sent[i].token_1_amount, list_spl.sent[i].token_1_decimals);
                list_spl.sent[i].token_1_amt = amt;
                break;
              }
            }
            if (list_spl.sent[i].token_2_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl.sent[i].token_2_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl.sent[i].token_2_name = "USD Coin";
                  list_spl.sent[i].token_2_symbol = "USDC";
                  list_spl.sent[i].token_2_image = "/img/sol.png";
                  list_spl.sent[i].token_2_decimals = 6;
                  let amt = await decimal_joe(list_spl.sent[i].token_2_amount, list_spl.sent[i].token_2_decimals);
                  list_spl.sent[i].token_2_amt = amt;
                  break;
                }
                if (tokn.address == list_spl.sent[i].token_2_mint) {
                  list_spl.sent[i].token_2_name = tokn.name;
                  list_spl.sent[i].token_2_symbol = tokn.symbol;
                  list_spl.sent[i].token_2_image = tokn.image;
                  list_spl.sent[i].token_2_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl.sent[i].token_2_amount, list_spl.sent[i].token_2_decimals);
                  list_spl.sent[i].token_2_amt = amt;
                  break;
                }
              }
            } else {
              list_spl.sent[i].token_2_name = false;
              list_spl.sent[i].token_2_symbol = false;
              list_spl.sent[i].token_2_image = false;
              list_spl.sent[i].token_2_decimals = 0;
              let amt = await decimal_joe(list_spl.sent[i].token_2_amount, list_spl.sent[i].token_2_decimals);
              list_spl.sent[i].token_2_amt = amt;
            }
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (list_spl.sent[i].token_3_mint == "11111111111111111111111111111111") {
                list_spl.sent[i].token_3_name = "SOL";
                list_spl.sent[i].token_3_symbol = "SOL";
                list_spl.sent[i].token_3_image = "/img/sol.png";
                list_spl.sent[i].token_3_decimals = 9;
                let amt = await decimal_joe(list_spl.sent[i].token_3_amount, list_spl.sent[i].token_3_decimals);
                list_spl.sent[i].token_3_amt = amt;
                break;
              } else if (list_spl.sent[i].token_3_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                list_spl.sent[i].token_3_name = "USD Coin";
                list_spl.sent[i].token_3_symbol = "USDC";
                list_spl.sent[i].token_3_image = "/img/usdc.png";
                list_spl.sent[i].token_3_decimals = 6;
                let amt = await decimal_joe(list_spl.sent[i].token_3_amount, list_spl.sent[i].token_3_decimals);
                list_spl.sent[i].token_3_amt = amt;
                break;
              } else if (tokn.address == list_spl.sent[i].token_3_mint) {
                list_spl.sent[i].token_3_name = tokn.name;
                list_spl.sent[i].token_3_symbol = tokn.symbol;
                list_spl.sent[i].token_3_image = tokn.image;
                list_spl.sent[i].token_3_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl.sent[i].token_3_amount, list_spl.sent[i].token_3_decimals);
                list_spl.sent[i].token_3_amt = amt;
                break;
              }
            }
            if (list_spl.sent[i].token_4_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl.sent[i].token_4_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl.sent[i].token_4_name = "USD Coin";
                  list_spl.sent[i].token_4_symbol = "USDC";
                  list_spl.sent[i].token_4_image = "/img/usdc.png";
                  list_spl.sent[i].token_4_decimals = 6;
                  let amt = await decimal_joe(list_spl.sent[i].token_4_amount, list_spl.sent[i].token_4_decimals);
                  list_spl.sent[i].amt = amt;
                  break;
                } else if (tokn.address == list_spl.sent[i].token_4_mint) {
                  list_spl.sent[i].token_4_name = tokn.name;
                  list_spl.sent[i].token_4_symbol = tokn.symbol;
                  list_spl.sent[i].token_4_image = tokn.image;
                  list_spl.sent[i].token_4_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl.sent[i].token_4_amount, list_spl.sent[i].token_4_decimals);
                  list_spl.sent[i].token_4_amt = amt;
                  break;
                }
              }
            } else {
              list_spl.sent[i].token_4_name = false;
              list_spl.sent[i].token_4_symbol = false;
              list_spl.sent[i].token_4_image = false;
              list_spl.sent[i].token_4_decimals = 0;
              let amt = await decimal_joe(list_spl.sent[i].token_4_amount, list_spl.sent[i].token_4_decimals);
              list_spl.sent[i].token_4_amt = amt;
            }
            let item_date = new Date((list_spl.sent[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            if (list_spl.sent[i].token_1_amount > 0) {
              img_1 = '<a href="' + conf.cnft_explorer + list_spl.sent[i].token_1_mint + '" target="_blank"><img src="' + list_spl.sent[i].token_1_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl.sent[i].token_1_amt + '</span></span><span class="smart_symbol">' + list_spl.sent[i].token_1_symbol + '</span></div>';
            }
            if (list_spl.sent[i].token_2_amount > 0) {
              img_2 = '<a href="' + conf.cnft_explorer + list_spl.sent[i].token_2_mint + '" target="_blank"><img src="' + list_spl.sent[i].token_2_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl.sent[i].token_2_amt + '</span></span><span class="smart_symbol">' + list_spl.sent[i].token_2_symbol + '</span></div>';
            }
            if (list_spl.sent[i].token_3_amount > 0) {
              img_3 = '<a href="' + conf.cnft_explorer + list_spl.sent[i].token_3_mint + '" target="_blank"><img src="' + list_spl.sent[i].token_3_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl.sent[i].token_3_amt + '</span></span><span class="smart_symbol">' + list_spl.sent[i].token_3_symbol + '</span></div>';
            }
            if (list_spl.sent[i].token_4_amount > 0) {
              img_4 = '<a href="' + conf.cnft_explorer + list_spl.sent[i].token_4_mint + '" target="_blank"><img src="' + list_spl.sent[i].token_4_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl.sent[i].token_4_amt + '</span></span><span class="smart_symbol">' + list_spl.sent[i].token_4_symbol + '</span></div>';
            }
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_spl.sent[i].peer_a + '-' + list_spl.sent[i].peer_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left">' + img_1 + img_2 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right">' + img_3 + img_4 + '</div></li>';
            let first_10 = list_spl.sent[i].peer_b.substring(0, 10);
            let last_10 = list_spl.sent[i].peer_b.substr(list_spl.sent[i].peer_b.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_spl.sent[i].peer_b + '">' + peer + '</li>';
            $("#spl_sent").prepend('<ul class="spl_sent smart_ul" data-spl_sent="' + list_spl.sent[i].acct + '">' + smart_item + '</ul>');
            resize_smart = 1;
          }
        }
        // received
        for (let i = 0; i < list_spl.received.length; i++) {
          if (!$("ul[data-spl_received='" + list_spl.received[i].acct + "']").length) {
            //         $("#spl_received .syncing").remove();
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_spl.received[i].token_1_mint) {
                list_spl.received[i].token_1_name = tokn.name;
                list_spl.received[i].token_1_symbol = tokn.symbol;
                list_spl.received[i].token_1_image = tokn.image;
                list_spl.received[i].token_1_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl.received[i].token_1_amount, list_spl.received[i].token_1_decimals);
                list_spl.received[i].token_1_amt = amt;
                break;
              }
            }
            if (list_spl.received[i].token_2_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl.received[i].token_2_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl.received[i].token_2_name = "USD Coin";
                  list_spl.received[i].token_2_symbol = "USDC";
                  list_spl.received[i].token_2_image = "/img/sol.png";
                  list_spl.received[i].token_2_decimals = 6;
                  let amt = await decimal_joe(list_spl.received[i].token_2_amount, list_spl.received[i].token_2_decimals);
                  list_spl.received[i].token_2_amt = amt;
                  break;
                }
                if (tokn.address == list_spl.received[i].token_2_mint) {
                  list_spl.received[i].token_2_name = tokn.name;
                  list_spl.received[i].token_2_symbol = tokn.symbol;
                  list_spl.received[i].token_2_image = tokn.image;
                  list_spl.received[i].token_2_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl.received[i].token_2_amount, list_spl.received[i].token_2_decimals);
                  list_spl.received[i].token_2_amt = amt;
                  break;
                }
              }
            } else {
              list_spl.received[i].token_2_name = false;
              list_spl.received[i].token_2_symbol = false;
              list_spl.received[i].token_2_image = false;
              list_spl.received[i].token_2_decimals = 0;
              let amt = await decimal_joe(list_spl.received[i].token_2_amount, list_spl.received[i].token_2_decimals);
              list_spl.received[i].token_2_amt = amt;
            }
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (list_spl.received[i].token_3_mint == "11111111111111111111111111111111") {
                list_spl.received[i].token_3_name = "SOL";
                list_spl.received[i].token_3_symbol = "SOL";
                list_spl.received[i].token_3_image = "/img/sol.png";
                list_spl.received[i].token_3_decimals = 9;
                let amt = await decimal_joe(list_spl.received[i].token_3_amount, list_spl.received[i].token_3_decimals);
                list_spl.received[i].token_3_amt = amt;
                break;
              } else if (list_spl.received[i].token_3_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                list_spl.received[i].token_3_name = "USD Coin";
                list_spl.received[i].token_3_symbol = "USDC";
                list_spl.received[i].token_3_image = "/img/usdc.png";
                list_spl.received[i].token_3_decimals = 6;
                let amt = await decimal_joe(list_spl.received[i].token_3_amount, list_spl.received[i].token_3_decimals);
                list_spl.received[i].token_3_amt = amt;
                break;
              } else if (tokn.address == list_spl.sent[i].token_3_mint) {
                list_spl.received[i].token_3_name = tokn.name;
                list_spl.received[i].token_3_symbol = tokn.symbol;
                list_spl.received[i].token_3_image = tokn.image;
                list_spl.received[i].token_3_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl.received[i].token_3_amount, list_spl.received[i].token_3_decimals);
                list_spl.received[i].token_3_amt = amt;
                break;
              }
            }
            if (list_spl.received[i].token_4_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl.received[i].token_4_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl.received[i].token_4_name = "USD Coin";
                  list_spl.received[i].token_4_symbol = "USDC";
                  list_spl.received[i].token_4_image = "/img/usdc.png";
                  list_spl.received[i].token_4_decimals = 6;
                  let amt = await decimal_joe(list_spl.received[i].token_4_amount, list_spl.received[i].token_4_decimals);
                  list_spl.received[i].amt = amt;
                  break;
                } else if (tokn.address == list_spl.received[i].token_4_mint) {
                  list_spl.received[i].token_4_name = tokn.name;
                  list_spl.received[i].token_4_symbol = tokn.symbol;
                  list_spl.received[i].token_4_image = tokn.image;
                  list_spl.received[i].token_4_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl.received[i].token_4_amount, list_spl.received[i].token_4_decimals);
                  list_spl.received[i].token_4_amt = amt;
                  break;
                }
              }
            } else {
              list_spl.received[i].token_4_name = false;
              list_spl.received[i].token_4_symbol = false;
              list_spl.received[i].token_4_image = false;
              list_spl.received[i].token_4_decimals = 0;
              let amt = await decimal_joe(list_spl.received[i].token_4_amount, list_spl.received[i].token_4_decimals);
              list_spl.received[i].token_4_amt = amt;
            }
            let item_date = new Date((list_spl.received[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            if (list_spl.received[i].token_1_amount > 0) {
              img_1 = '<a href="' + conf.cnft_explorer + list_spl.received[i].token_1_mint + '" target="_blank"><img src="' + list_spl.received[i].token_1_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl.received[i].token_1_amt + '</span></span><span class="smart_symbol">' + list_spl.received[i].token_1_symbol + '</span></div>';
            }
            if (list_spl.received[i].token_2_amount > 0) {
              img_2 = '<a href="' + conf.cnft_explorer + list_spl.received[i].token_2_mint + '" target="_blank"><img src="' + list_spl.received[i].token_2_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl.received[i].token_2_amt + '</span></span><span class="smart_symbol">' + list_spl.received[i].token_2_symbol + '</span></div>';
            }
            if (list_spl.received[i].token_3_amount > 0) {
              img_3 = '<a href="' + conf.cnft_explorer + list_spl.received[i].token_3_mint + '" target="_blank"><img src="' + list_spl.received[i].token_3_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl.received[i].token_3_amt + '</span></span><span class="smart_symbol">' + list_spl.received[i].token_3_symbol + '</span></div>';
            }
            if (list_spl.received[i].token_4_amount > 0) {
              img_4 = '<a href="' + conf.cnft_explorer + list_spl.received[i].token_4_mint + '" target="_blank"><img src="' + list_spl.received[i].token_4_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl.received[i].token_4_amt + '</span></span><span class="smart_symbol">' + list_spl.received[i].token_4_symbol + '</span></div>';
            }
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_spl.received[i].peer_a + '-' + list_spl.received[i].peer_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left">' + img_1 + img_2 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right">' + img_3 + img_4 + '</div></li>';
            let first_10 = list_spl.received[i].peer_a.substring(0, 10);
            let last_10 = list_spl.received[i].peer_a.substr(list_spl.received[i].peer_a.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_spl.received[i].peer_a + '">' + peer + '</li>';
            $("#spl_received").prepend('<ul class="spl_received smart_ul" data-spl_received="' + list_spl.received[i].acct + '">' + smart_item + '</ul>');
            resize_smart = 1;
            do_notify++;
          }
        }
        // backcheck sent ui
        $("ul.spl_sent").each(function() {
          let ele = $(this);
          let spl_sent = ele.attr("data-spl_sent");
          let sent_ = [];
          for (let i = 0; i < list_spl.sent.length; i++) {
            sent_.push(list_spl.sent[i].acct);
          }
          if (!sent_.includes(spl_sent)) {
            ele.remove();
            resize_smart = 1;
          }
        });
        $("ul.spl_received").each(function() {
          let ele = $(this);
          let spl_received = ele.attr("data-spl_received");
          let received_ = [];
          for (let i = 0; i < list_spl.received.length; i++) {
            received_.push(list_spl.received[i].acct);
          }
          if (!received_.includes(spl_received)) {
            ele.remove();
            resize_smart = 1;
          }
        });
        // backcheck sent ui
        if (resize_smart == 1) {
          $("#smart_scroll").getNiceScroll().resize();
        }
      }
      $(".smart_loader").remove();
      // spl

      // notify
      if (do_notify > 0) {
        notify("Pending Proposals!", "You have " + do_notify + " pending trade proposals.", conf.host + "/img/favicon.png");
      }
      // notify

    }
  }
  // sync proposals
  
  $(document).delegate(".smart_tool_title", "click", async function() {
    let selected = $(this).attr("id");
    let smart_mode = $("#smart_tool_mode").html();
    $(".sent_received").hide();
    $(".smart_tool_title").removeClass("smart_active");
    if (smart_mode == "SPL") {
      if (selected == "smart_tool_received") {
        $("#spl_received").show();
      } else if (selected == "smart_tool_sent") {
        $("#spl_sent").show();
      }
    } else if (smart_mode == "NFT") {
      if (selected == "smart_tool_received") {
        $("#nft_received").show();
      } else if (selected == "smart_tool_sent") {
        $("#nft_sent").show();
      }
    } else if (smart_mode == "cNFT") {
      if (selected == "smart_tool_received") {
        $("#cnft_received").show();
      } else if (selected == "smart_tool_sent") {
        $("#cnft_sent").show();
      }
    } else if (smart_mode == "pNFT") {
      if (selected == "smart_tool_received") {
        $("#pnft_received").show();
      } else if (selected == "smart_tool_sent") {
        $("#pnft_sent").show();
      }
    }
    $(this).addClass("smart_active");
    $("#smart_scroll").getNiceScroll().resize();
  });
  
  // view received contract from smart panel
  $(document).delegate("#spl_received .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/spl/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  
  // view received contract from smart panel
  $(document).delegate("#spl_sent .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/spl/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  
  // copy peer
  $(document).delegate(".smart_peer", "click", function() {
    copy($(this).attr("data-peer"));
    alert("Copied!");
  });
  
  //////////////////////////////////////////////////////////////////////////
  $("#social_discord").parent().html(social_1);
  $("#social_github").parent().html(social_2);
  $("#social_twitter").parent().html(social_3);
  $("#social_discord, #social_github, #social_twitter").hide().fadeIn(400);
  $("#scroll_wrapper").niceScroll({
    cursorcolor: conf.scrollbar,
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
  $("#wallet_list").niceScroll({
    cursorcolor: conf.scrollbar,
    cursoropacitymin: 1,
    cursoropacitymax: 1,
    cursorwidth: "7px",
    cursorborder: 0,
    cursorborderradius: "7px",
    zindex: 5,
    autohidemode: false,
    bouncescroll: false,
    horizrailenabled: false,
    railpadding: {
      top: 1,
      right: 3,
      left: 0,
      bottom: 1
    },
    railalign: "right"
  });
  $("#smart_scroll").niceScroll({
    cursorcolor: conf.scrollbar,
    cursoropacitymin: 1,
    cursoropacitymax: 1,
    cursorwidth: "7px",
    cursorborder: 0,
    cursorborderradius: "7px",
    zindex: 5,
    autohidemode: false,
    bouncescroll: false,
    horizrailenabled: false,
    railalign: "right"
  });
  $("#swap_token_options").niceScroll({
    cursorcolor: conf.scrollbar,
    cursoropacitymin: 1,
    cursoropacitymax: 1,
    cursorwidth: "7px",
    cursorborder: 0,
    cursorborderradius: "7px",
    zindex: 12,
    autohidemode: false,
    bouncescroll: false,
    horizrailenabled: false,
    railpadding: {
      top: 7,
      right: 7,
      left: 0,
      bottom: 7
    },
    railalign: "right"
  });
  $("#bob_chooser").niceScroll({
    cursorcolor: conf.scrollbar,
    cursoropacitymin: 1,
    cursoropacitymax: 1,
    cursorwidth: "7px",
    cursorborder: 0,
    cursorborderradius: "7px",
    zindex: 11,
    autohidemode: false,
    bouncescroll: false,
    horizrailenabled: false,
    railalign: "right"
  });
  const get_mcswap_balances = setInterval(function() {
    mcswap_balances();
  }, 20000);
  $("#wallet_view").hide().show().addClass("animate__animated animate__fadeIn");
  $("#donate_sol, button.mcprofile_open").fadeIn(400);
  $("#mcprofile_nav ul li").addClass("noshop");
  for (let i = 0; i < spl_tokens.length; i++) {
    let item = spl_tokens[i];
    if (i == 0) {
      $(".fulfil_c_pikl .custom_symbol, .pikl_symbol .custom_symbol, .swap_c_pikl .custom_symbol").html(item.symbol);
      $("#top_token_choice, .swap_c_pikl, .fulfil_c_pikl").attr("data-id", item.address);
      $(".pikl_icon").attr("src", item.image);
    }
    $("#swap_token_list").append('<ul data-cmc="' + item.cmc + '" data-id="' + item.address + '"><li><img src="' + item.image + '" /></li><li class="token_symbol">(' + item.symbol + ')</li><li class="token_name">' + item.name + '</li></ul>');
  }
  setTimeout(() => {
    swap_viewer();
  }, 400);
  //////////////////////////////////////////////////////////////////////////
  if(conf.wallet_cnft_enabled == false){$("#wallet_cnfts").hide();}
  if(conf.wallet_nft_enabled == false){$("#wallet_nfts").hide();}
  //////////////////////////////////////////////////////////////////////////
  $("#wallet_tool").html(conf.wallet_name);
  $("#mcprofile_nav ul li").first().find("button").click();
  $("#wallet_box").css({
    "background-image": "url(" + conf.logo_wallet + ")"
  });
  $("#center_logo").attr("src", conf.logo);
  $("#set_discord").attr("href", conf.discord);
  $("#set_twitter").attr("href", conf.twitter);
  $("#img_icon, #img_b, #img_c").attr("href", conf.logo_icon);
  $("#img_a").attr("content", conf.logo_icon);
  $("#meta_desc, #og_desc").attr("content", conf.desc);
  $("#og_title").attr("content", conf.title);
  $("#og_url").attr("content", conf.host);
  $("title").html(conf.title);
  $("#donat_to").html(conf.wallet_name);
  $("#donat_address").html(conf.sol);
  $("#vrs").html(conf.version);
  $("#priority_spl, #priority_spl_exec").val(conf.priority);
  $("#priority_nft, #priority_nft_exec").val(conf.priority);
  setTimeout(() => {
    $("#init_cover").fadeOut(400);
    $("#init_loader").fadeOut(400);
    setTimeout(() => {
      $("#center_logo").addClass("animate__animated animate__zoomIn").show();
      setTimeout(() => {
        $("#socials").addClass("animate__animated animate__fadeInUp").show();
      }, 1000);
    }, 700);
  }, 2000);
  //////////////////////////////////////////////////////////////////////////

});