function badImg(iid){
  $("#swap_token_list ul[data-iid='"+iid+"']").remove();
  $("#swap_token_list").getNiceScroll().resize();
}
$(window).on('load', async function() {
  
  // localStorage.clear();
  
  var spl_tokens = [];
  let get_spl_tokens = fetch(conf.host + "/config/tokens.json?r=" + Math.random())
  .then((response) => response.json()).then((resp) => {return resp;});
  spl_tokens = await get_spl_tokens;
  spl_tokens.sort(function(a, b) {
    if (a.symbol > b.symbol) return 1;
    if (a.symbol < b.symbol) return -1;
    return 0;
  });
  
  conf.version = 1.8;
  conf.provider = false;
  conf.billion = 1000000000;
  conf.solmin = 10000000; // starting min balance to use the app 0.01 SOL
  conf.usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  conf.vault = "HieZydxjXUxTJRRvj4ovNPWzTKgxcGo1jLsPdXCiith2";
  conf.system_alt = "6rztYc8onxK3FUku97XJrzvdZHqWavwx5xw8fB7QufCA";
  conf.treasury = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu";
  conf.treasury_studio_cnft = "2Gs1H87sQDmHS91iXaVQnhdWTGzsgo2vypAwdDRJTLqX";
  conf.treasury_studio_nft = "7aMrZsEeah19YUJ1yVzQSooBYz76qfYi8k24ar2YFWgT";
  // metadata
  conf.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
  // extentions
  conf.TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  // cnft
  conf.BUBBLEGUM_PROGRAM_ID = "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY";
  // core
  conf.CORE_PROGRAM_ID = "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d";

  // pnft
  conf.SPL_ATA_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
  conf.MPL_RULES_PROGRAM_ID = "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg";
  conf.MPL_RULES_ACCT = "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9";
  // mcswap
  conf.MCSWAP_CNFT_PROGRAM = "6RUcK9T1hYAZGBxN82ERVDUi4vLAX4hN1zAyy3cU5jav";
  conf.MCSWAP_NFT_PROGRAM = "AyJBbGQzUQSvhivZnHMDCCk6eSLupkeBh4fvMAD8T4Xx";
  conf.MCSWAP_SPL_PROGRAM = "AAyM7XH9w7ApeSuEat8AwUW1AA7dBuj2vXv7SuUGpNUp";
  conf.MCSWAP_PNFT_PROGRAM = "2bY36scRMEUJHJToVGjJ2uY8PdSrRPr73siNwGbv1ZNT";
  conf.MCSWAP_CORE_PROGRAM = "EYMc51BuTRTfc5XCYqSWW92risZvMP217N2VYaTdFMHh";
  
  conf.spl_alt = "DnDkh579fNnBFUwLDeQWgfW6ukLMyt8DgLaVDVwecxmj"; // static alt for spl swaps
  conf.logo = conf.host + "/img/logo-300.png"; // set centered logo image
  conf.logo_wallet = conf.host + "/img/logo-300-dim.png"; // set wallet background
  conf.logo_icon = conf.host + "/img/favicon.png"; // set icon image
  conf.max_proofs = 18; // max combined proofs for cnft swaps
  conf.sell_nft = "https://www.tensor.trade/item/"; // set path to your preferred nft explorer 
  conf.sell_cnft = "https://www.tensor.trade/item/"; // set sell link for cnfts
  conf.tool = "mcwallet";
  conf.idler = conf.idler + 1;
  conf.extension_types = ["Uninitialized","TransferFeeConfig","TransferFeeAmount","MintCloseAuthority","ConfidentialTransferMint","ConfidentialTransferAccount","DefaultAccountState","ImmutableOwner","MemoTransfer","NonTransferable","InterestBearingConfig","CpiGuard","PermanentDelegate","NonTransferableAccount","TransferHook","TransferHookAccount","ConfidentialTransferFee","ConfidentialTransferFeeAmount","MetadataPointer","TokenMetadata","GroupPointer","TokenGroup","GroupMemberPointer","TokenGroupMember",]
  
  const BufferLayout = require("@solana/buffer-layout");
  const BN = require("bn.js");
  const Metadata_ = require("@metaplex-foundation/mpl-token-metadata");
  const Metadata = Metadata_.Metadata;
  
  const publicKey = (property = "publicKey") => {
    return BufferLayout.blob(32, property);
  }
  const uint64 = (property = "uint64") => {
    return BufferLayout.blob(8, property);
  }
  
  const PROGRAM_STATE_CNFT = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("fee_lamports"),
    BufferLayout.u8("dev_percentage"),
    publicKey("dev_treasury"),
    publicKey("mcdegens_treasury"),
  ]);
  const PROGRAM_STATE_NFT = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("fee_lamports"),
    BufferLayout.u8("dev_percentage"),
    publicKey("dev_treasury"),
    publicKey("mcdegens_treasury"),
  ]);
  const PROGRAM_STATE_SPL = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    publicKey("pickle_mint"),
    uint64("fee_chips"),
    BufferLayout.u8("dev_percentage"),
    publicKey("dev_treasury"),
    publicKey("mcdegens_treasury"),
  ]);
  const PROGRAM_STATE_PNFT = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("fee_lamports"),
    BufferLayout.u8("dev_percentage"),
    publicKey("dev_treasury"),
    publicKey("mcdegens_treasury"),
  ]);
  const PROGRAM_STATE_CORE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("fee_lamports"),
    BufferLayout.u8("dev_percentage"),
    publicKey("dev_treasury"),
    publicKey("mcdegens_treasury"),
]);
  
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
  const SWAP_NFT_STATE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("utime"),
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
  const SWAP_PNFT_STATE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("utime"),
    BufferLayout.u8("is_swap"),
    publicKey("initializer"),
    publicKey("initializer_mint"),
    publicKey("taker"),
    publicKey("swap_mint"),
    uint64("swap_lamports"),
    publicKey("swap_token_mint"),
    uint64("swap_tokens"),
  ]);
  const SWAP_CORE_STATE = BufferLayout.struct([
    BufferLayout.u8("is_initialized"),
    uint64("utime"),
    BufferLayout.u8("is_swap"),
    publicKey("initializer"),
    publicKey("initializer_asset"),
    publicKey("taker"),
    publicKey("swap_asset"),
    uint64("swap_lamports"),
    publicKey("swap_token_mint"),
    uint64("swap_tokens"),
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
  let createTempTokenAccount = false;
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
  
  const smart_modes = [ 
    {
      "standard": "SPL",
      "id": "spl"
    },
    {
      "standard": "NFT",
      "id": "nft"
    },
    {
      "standard": "cNFT",
      "id": "cnft"
    },
    {
      "standard": "pNFT",
      "id": "pnft"
    },
    {
      "standard": "CORE",
      "id": "core"
    }
  ];
  
  let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
  let SPL_FEE_PROGRAM = new solanaWeb3.PublicKey(conf.MCSWAP_SPL_PROGRAM);
  let SPL_FEE_PROGRAM_PDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")],SPL_FEE_PROGRAM);
  let SPL_FEE_PROGRAM_STATE = null;
  SPL_FEE_PROGRAM_STATE = await connection.getAccountInfo(SPL_FEE_PROGRAM_PDA[0]).catch(function(){});
  let encodedProgramStateData = SPL_FEE_PROGRAM_STATE.data;
  let decodedProgramStateData = PROGRAM_STATE_SPL.decode(encodedProgramStateData);
  conf.chips_fee = parseInt(new BN(decodedProgramStateData.fee_chips, 10, "le").toString());
  
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
    // if(typeof response.data.result.tree_id == "undefined"){
    //   let axiosInstance = axios.create({
    //     baseURL: conf.cluster
    //   });
    //   let response = await axiosInstance.post(conf.cluster, {
    //     jsonrpc: "2.0",
    //     method: "getAssetProof",
    //     id: "rpd-op-123",
    //     params: {
    //       id: id
    //     },
    //   });
    // }
    if(
      typeof response == "undefined" || 
      typeof response.data == "undefined" || 
      typeof response.data.result == "undefined" || 
      typeof response.data.result.tree_id == "undefined"
      ){
      return false;
    }
    else{
      let ck_treeId = response.data.result.tree_id;
      let ck_Proof = response.data.result.proof;
      let ck_Root = response.data.result.root;
      let ck_treeIdPubKey = new solanaWeb3.PublicKey(ck_treeId);
      let treeAccount = await splAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection, ck_treeIdPubKey, );
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
  
  ///////////////////////////////////////////////////////////////////////////////////////////
  async function getPriorityFeeEstimate(cluster,priorityLevel,instructions,tables=false) {
    let re_ix = [];
    for (let o in instructions) {re_ix.push(instructions[o]);}
    instructions = re_ix;
    let _msg = null;
    if(tables==false){
      _msg = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: instructions,
      }).compileToV0Message([]);
    }
    else{
      _msg = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: instructions,
      }).compileToV0Message([tables]);
    }
    let tx = new solanaWeb3.VersionedTransaction(_msg);
    let response = await fetch(cluster, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getPriorityFeeEstimate",
        params: [
          {
            transaction: bs58.encode(tx.serialize()), // Pass the serialized transaction in Base58
            options: { priorityLevel: priorityLevel },
          },
        ],
      }),
    });
    let data = await response.json();
    data = parseInt(data.result.priorityFeeEstimate);
    if(data < 10000){data = 10000;}
    console.log("priority fee estimate", data);
    return data;
  }
  async function getComputeLimit(opti_payer,opti_ix,opti_tables=false) {
    let opti_sim_limit = solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:1400000});
    let re_ix = [];
    for (let o in opti_ix) {re_ix.push(opti_ix[o]);}
    opti_ix = re_ix;
    opti_ix.unshift(opti_sim_limit);
    let opti_msg = null;
    if(opti_tables == false){
      opti_msg = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: opti_ix,
      }).compileToV0Message([]);
    }
    else{
      opti_msg = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: opti_ix,
      }).compileToV0Message([opti_tables]);
    }
    let opti_tx = new solanaWeb3.VersionedTransaction(opti_msg);    
    let opti_cu_res = await connection.simulateTransaction(opti_tx,{replaceRecentBlockhash:true,sigVerify:false,});
    console.log("Simulation Results: ", opti_cu_res.value);
    // if(opti_cu_res.value.err != null){
    //   return {"transaction":"error","message":"error during simulation","logs":opti_cu_res.value.logs}
    // }
    let opti_consumed = opti_cu_res.value.unitsConsumed;
    let opti_cu_limit = Math.ceil(opti_consumed * 1.2);
    console.log("opti_cu_limit", opti_cu_limit);
    return opti_cu_limit;
  }
  async function finalized(sig,max=10,int=4){
    return await new Promise(resolve => {
      let start = 1;
      let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
      let intervalID = setInterval(async()=>{
        let tx_status = null;
        tx_status = await connection.getSignatureStatuses([sig], {searchTransactionHistory: true,});
        console.log(start+": "+sig);
        if (tx_status != null && typeof tx_status.value != "undefined"){ 
          console.log(tx_status.value);
        }
        else{
          console.log("failed to get status...");
        }
        if (tx_status == null || 
        typeof tx_status.value == "undefined" || 
        tx_status.value == null || 
        tx_status.value[0] == null || 
        typeof tx_status.value[0] == "undefined" || 
        typeof tx_status.value[0].confirmationStatus == "undefined"){} 
        else if(tx_status.value[0].confirmationStatus == "processed"){
          start = 1;
        }
        else if(tx_status.value[0].confirmationStatus == "confirmed"){
          start = 1;
        }
        else if (tx_status.value[0].confirmationStatus == "finalized"){
          if(tx_status.value[0].err != null){
            resolve('program error!');
            clearInterval(intervalID);
          }
          resolve('finalized');
          clearInterval(intervalID);
        }
        start++;
        if(start == max + 1){
          resolve((max * int)+' seconds max wait reached');
          clearInterval(intervalID);
        }
      },(int * 1000));
    });  
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  
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
          .then(async function() {
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
            setTimeout(async function(){
              await syncProposals();
              // await displayProposals();
            },5000);
            $(".smart_active").click();
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
        await syncProposals();
        // await displayProposals();
        $(".smart_active").click();
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
    $("#spl_field_1, #spl_field_2, #spl_field_3, #spl_field_4").val("");
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
    $(".sent_received").html("");
    $(".collections select, #review_receive_total, #review_send_total").html("");
    $("#wallet_refresh").removeClass("refresh_rotate");
    $(".loader").hide();
    $(".mc_title").removeClass("blink");
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
      master_connect();
      setTimeout(() => {
        mcswap_balances();
      }, 1000);
  });
  
  // cancel wallet chooser
  $(document).delegate("#chooser_cancel", "click", async function() {
    $("#cover, #wallet_chooser").hide();
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
      let balance_sol = null;
      balance_sol = await connection.getBalance(provider.publicKey).catch(function(){});
      if(balance_sol != null){
        let res = parseFloat(balance_sol).toFixed(9);
        let balance = balance_sol / conf.billion;
        balance = parseFloat(balance).toFixed(9);
        let ui_split = balance.split(".");
        let formatted = add_commas(ui_split[0]);
        formatted = formatted + "." + ui_split[1];
        provider = wallet_provider();
        if (typeof provider == "undefined") {} else if (provider.isConnected != true) {} else if (provider.isConnected == true) {
          $(".sol_balance").removeClass("connect_me").html(formatted);
        }
      }
      else{
        provider = wallet_provider();
        if (typeof provider == "undefined" || provider.isConnected != true) {
          $(".sol_box .sol_balance").addClass("connect_me").html("Connect");
        }
        else{
          $(".sol_box .connect_me").removeClass("connect_me").html("");
        }
      }
      
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
      alert("You need a wallet for this.");
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
        
        let transferIx = solanaWeb3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          lamports: lamps,
          toPubkey: to,
        });
        console.log("from", from_b58);
        console.log("to", to.toString());
        console.log("transferIx", transferIx);
        console.log("lamports", lamps);
        
        let instructions = [transferIx];
        console.log("instructions", instructions);
        
        // ***
        let priority = $("#donation_priority").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:500}));
//         instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([]);
        let transferTx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***    
        
        try{
          let signedTx = await provider.signTransaction(transferTx);
          let serializedTransaction = signedTx.serialize();
          let signature = await connection.sendRawTransaction(signedTx.serialize(),{
            skipPreflight: true,
            maxRetries: 0 
          });
          $("#cover_message").html("Processing...");
          let final = await finalized(signature,10,4);
          if(final != "finalized"){
            $("#cover_message").html("Sorry, Transaction Error!");
            setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#donation_box").show();},3000);
            return;
          }
          $("#cover_message").html("");
          $("#donation_box").after('<div id="donation_thanks">We appreciate your donation!</div><div id="donation_sig"><a href="https://solana.fm/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
        }
        catch(error){
          $("#cover_message").html("Sorry, Transaction Error!");
          setTimeout(function(){$("#cover_message").html("");$("#donation_box").show();},3000);          
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
    $("#cover").fadeIn(400);
    provider = wallet_provider();
    if (typeof provider == "undefined" || provider.isConnected != true) {
      e.preventDefault();
      $("#cover_message").html("Wallet connection required.");
      setTimeout(function(){
        $("#cover").fadeOut(400);
        setTimeout(function(){$("#cover_message").html("");},500);
      },3000);
    }  else {
      $("#cover_message").html("");
      $("#donation_box").show().addClass("animate__animated animate__zoomInDown");
      $("#donation_amount").focus();
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
    var nfts = [];
    var nmints = [];
    $(".loader").show();
    $("#wallet_nfts, #wallet_cnfts").removeClass("active_view");
    $(this).addClass("active_view");
    $("#view_cnfts").removeClass().addClass("wallet_views animate__animated animate__fadeOutRight");
    setTimeout(() => {
      $("#cnft_collections").hide();
      $("#nft_collections").fadeIn(500);
      $("#view_cnfts").hide();
      $("#view_nfts").removeClass().addClass("wallet_views animate__animated animate__fadeInLeft").show();
    }, 1000);
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
        ass.core = false;
        ass.t22 = false;
        if(ass.interface == "ProgrammableNFT"){ass.pnft=true;}
        else if(ass.interface == "MplCoreAsset"){ass.core=true;}
        if(typeof ass.mint_extensions != "undefined"){
          ass.t22 = true;
        }
        else{
          ass.mint_extensions = false;
        }
        let blacklist = false;
        let whitelist = true;
        if(typeof ass.grouping != "undefined" && typeof ass.grouping[0] != "undefined"){
          if(conf.nft_blacklist.length > 0 && conf.nft_blacklist.includes(ass.grouping[0].group_value)){
            blacklist = true;
          }
          if(conf.nft_whitelist.length > 0 && !conf.nft_whitelist.includes(ass.grouping[0].group_value)){
            whitelist = false;
          }
        }
        if (whitelist == true && blacklist == false && ass.burnt != true && ass.compression.compressed == false) {
          if (
            typeof ass.content !== undefined &&
            typeof ass.content.files !== undefined &&
            typeof ass.content.files[0] !== undefined &&
            ass.hasOwnProperty('content') &&
            ass.content.hasOwnProperty('files') &&
            typeof ass.content.files[0] == "object" &&
            ass.content.files[0].hasOwnProperty('uri') 
          ) {
            if(typeof ass.grouping[0] == "undefined"){
              ass.grouping = [];
              ass.grouping[0] = {group_key: "collection", group_value: false}
            }
            if(typeof ass.content.metadata.attributes == "undefined"){
              ass.content.metadata.attributes = [];
            }
            let rebuild = {};
            
//             if(ass.id == "FREN68FYVNNwJfXSBC1eky1ZhcZBvogxWJMpakoG3kX5"){
//               console.log("F ass", ass);
//             }
            if(ass.id == "DEv5yN8ZEoBFfh9f8EgBUFtfmNioKiSVfPCqw3gn7M6o"){
//               console.log("splToken: ", splToken);
//               console.log("ass: ", ass);
              
              
//               let mint_ = new solanaWeb3.PublicKey(ass.id);
//               console.log("mint", mint_.toString());
//               let ata_ = await splToken.getAssociatedTokenAddress(mint_,owner,false,splToken.TOKEN_2022_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
//               console.log("ata", ata_.toString());
              
              
              
//               // get ata
//               let associatedTokenAccountPubkey = await splToken.getAssociatedTokenAddress(mintPubkey,
//               recipientAccountPubkey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
              
              
//               let account = new Sola  ("J1rbeY42uWz63npXcSooVn84qdVLQ9Ty2zkhKhH8D3LE");
              
//               await splToken.getAccount(connection, associatedTokenAccountPubkey, 'confirmed', splToken.TOKEN_PROGRAM_ID)
//               .then(async function(){
                
//               })
//               .catch(function(){
                
//               });

              
              
            }
            
            
            
            
            
//             if(ass.id == "4mXQTPWG7GbkuwURMXuwu2BpK1Jro9aX6DPdbXwyDJfT"){
//               console.log("R ass", ass);
//             }
//             if(ass.id == "ExGALwYMqE73dWRCrgyF3GJes2GdVZkmVxrBK5Gmuwgm"){
//               console.log("Slerf", ass);
//             }
//             if(ass.id == "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi"){
//               console.log("Core", ass);
//             }
            
            rebuild.mint = ass.id;
            rebuild.image = ass.content.files[0].uri;
            rebuild.name = ass.content.metadata.name;
            rebuild.attributes = ass.content.metadata.attributes;
            rebuild.combos = [];
            rebuild.collection_key = ass.grouping[0].group_value;
            rebuild.sort = 0;
            rebuild.collection = "Unknown";
            rebuild.pnft = ass.pnft;
            rebuild.core = ass.core;
            rebuild.t22 = ass.t22;
            rebuild.extentions = ass.mint_extentions;
            if (nmints.filter(e => e.collection_key === ass.grouping[0].group_value).length == 0) {
              let obj = {}
              obj.collection_key = ass.grouping[0].group_value;
              obj.name = false;
              obj.symbol = false;
              obj.uri = false;
              obj.core = ass.core;
              nmints.push(obj);
            }
            nfts.push(rebuild);
          }
        }
      }

      for (let i = 0; i < nmints.length; i++) {
        let item = nmints[i];
        if(item.core === true){
          if(item.collection_key != false){
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let res = await axiosInstance.post(conf.cluster,{
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: item.collection_key},
            });
            nmints[i].name = res.data.result.content.metadata.name.replace(/\0/g, '');
            nmints[i].symbol = res.data.result.content.metadata.symbol.replace(/\0/g, '');
            nmints[i].uri = res.data.result.content.json_uri.replace(/\0/g, '');
          }
        }
        else{
          let res = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(await get_pda(item.collection_key))).catch(function(){});
          if (res != undefined) {
            nmints[i].name = res.data.name.replace(/\0/g, '');
            nmints[i].symbol = res.data.symbol.replace(/\0/g, '');
            nmints[i].uri = res.data.uri.replace(/\0/g, '');
          }
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
      let group_list = [];
      for (let i = 0; i < nfts.length; i++) {
        let _i = i - 1;
        if (nfts[i].collection.name == false) {
          nfts[i].collection.name = "Unknown";
          nfts[i].collection.collection_key = false;
          nfts[i].collection.symbol = false;
          nfts[i].collection.uri = false;
          nfts[i].collection_key = false;
        }

        // if(nfts[i].core != false){ // temporary

        // }
        // else{

        if (typeof nft_groups[nfts[i].collection.name] == "undefined") {
          nft_groups[nfts[i].collection.name] = [];
        }
        if(!group_list.includes(nfts[i].collection)){
          group_list.push(nfts[i].collection);
        }
        let collect = nfts[i].collection.name;
        let grouping = nft_groups[collect];
        grouping.push(nfts[i]);
        nft_groups[collect] = grouping;

        // }

      }
      let uniq_list = new Set(group_list.map(e => JSON.stringify(e)));
      group_list = Array.from(uniq_list).map(e => JSON.parse(e));

      if(!$("#nft_collection option").length){
        group_list.sort(function(a, b) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        let options = "";
        for (let i = 0; i < group_list.length; i++) {
          if(group_list[i].collection_key==false){group_list[i].collection_key="unknown";}
          options += '<option value="'+group_list[i].collection_key+'">'+group_list[i].name+'</option>';
        }
        $("#nft_collection").html(options);
        $('#nft_collection option[value="3pAx1gCrmcVFfGdVFRFaaqDEFq7ngung3nD3Q6mzs18x"]').prop('selected', true);
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

      // display nfts
      for (let i = 0; i < nfts.length; i++) {
        let ass = nfts[i];
        if (!$("ul[data-id='" + ass.mint + "']").length) {
          if(ass.collection_key==false){ass.collection_key="unknown";}

          // if(ass.core != false){ // temporary

          // }
          // else{
          
          let item = '<ul data-collection="' + ass.collection_key + '" data-id="' + ass.mint + '" data-type="nft" class="asset">';
          if(ass.pnft != false){
            item += '<li title="Programmable NFT Standard" class="ass_standard">PNFT</li>';
          }
          else if(ass.core != false){
            item += '<li title="Core Standard" class="ass_standard">CORE</li>';
          }
          else{
            item += '<li title="Legacy Standard" class="ass_standard">NFT</li>';
          }
          
          let locked = '<li title="Transferable" class="ass_locked"><img src="/img/lock.svg" /></li>';
          if(ass.t22 != false){
            item += '<li title="Token Extentions" class="ass_t22">EXT</li>';
            let mint = new solanaWeb3.PublicKey(ass.mint);
            let mintInfo = await splToken.getMint(connection, mint, "confirmed", splToken.TOKEN_2022_PROGRAM_ID);
            let extensionTypes = splToken.getExtensionTypes(mintInfo.tlvData);
            if(extensionTypes.includes(9)){
              locked = '<li title="Non-Transferable" class="ass_locked"><img class="islocked" src="/img/lock.svg" /></li>';
            }
          }
          item += locked;
          
          item += '<li class="ass_name">' + ass.name + '</li>';
          if (typeof ass.collection === 'undefined') {
            ass.collection = {};
            ass.collection.name = "Unknown";
          }      
          item += '<li class="ass_collection">' + ass.collection.name + '</li>';
          item += '<li class="ass_options"><button disabled class="ass_meta">Details</button><button disabled class="ass_donate">Transfer</button><button disabled data-wallet="' + provider.publicKey.toString() + '" data-mint="' + ass.mint + '" class="ass_sell">Market</button><button disabled data-wallet="' + provider.publicKey.toString() + '" data-pnft="' + ass.pnft + '" data-core="' + ass.core + '" data-t22="' + ass.t22 + '" data-mint="' + ass.mint + '" class="ass_swap">OTC</button></li>';
          item += '<li><img src="' + ass.image + '" class="ass_img" /></li>';
          item += '<li class="clear"></li>';
          item += '</ul>';
          $("#view_nfts").append(item);

          // }

        }
      } 

      // apply display filter
      for (let i = 0; i < nfts.length; i++) {
        if(nfts[i].collection_key == $("#nft_collection").val()){
          $("ul[data-id='" + nfts[i].mint + "']").show();
        }
      }

    }
    setTimeout(() => {
      // finish up
      $('ul[data-type="nft"] li.ass_options button.ass_meta, ul[data-type="nft"] li.ass_options button.ass_donate, ul[data-type="nft"] li.ass_options button.ass_swap, ul[data-type="nft"] li.ass_options button.ass_sell').prop("disabled", false);
      $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
      $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
  //     $("#view_nfts ul.asset").show();
      $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
      $(".loader").hide();
      $("#wallet_list").getNiceScroll().resize();
        // only allow txs to initialize after all images have loaded into the browser
  //     Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => {
  //       img.onload = img.onerror = resolve;
  //     }))).then(() => 
  //     {});
    }, 1000);
  });
  $(document).delegate("#view_nfts button.ass_meta", "click", async function() {
    let mint = $(this).parent().parent().attr("data-id");
    window.open(conf.nft_explorer + mint);
  });
  $(document).delegate("#view_nfts button.ass_donate", "click", async function() {
    let locked = $(this).parent().parent().find("img.islocked").length;
    if(locked == 1){
      $("#cover").fadeIn(400);
      $("#cover_message").html("Non-Transferable Asset!");
      setTimeout(function(){
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      },3000);
      return;
    }
    $(".ass_donate").prop("disabled", true);
    let mint = $(this).parent().parent().attr("data-id");
    let standard = $(this).parent().parent().find(".ass_standard").html();
    $("#cover").fadeIn(400);
    $("#nft_donation_box").show().addClass("animate__animated animate__zoomInDown");
    let main = $("ul[data-id='" + mint + "']");
    let src = main.find(".ass_img").attr("src");
    let name = main.find(".ass_name").html();
    let collection = main.find(".ass_collection").html();
    $("#nft_donation_image").attr("src", src);
    $("#nft_donation_name").html(name);
    $("#nft_donation_collection").html(collection);
    $("#nft_donation_standard").html(standard);
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
      alert("Connection your wallet to do this.");
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
    $("#nft_donation_box").fadeOut(400);
    let senderAccountPubkey = provider.publicKey;
    let recipientAccountPubkey = new solanaWeb3.PublicKey(to_wallet);
    let mintPubkey = new solanaWeb3.PublicKey($("#nft_donation_mint").val());
    let standard = $("#nft_donation_standard").html();
    if(standard == "NFT"){
      // get account
      let tokenAccountPubkey = await splToken.getAssociatedTokenAddress(mintPubkey,
      senderAccountPubkey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
      // get ata
      let associatedTokenAccountPubkey = await splToken.getAssociatedTokenAddress(mintPubkey,
      recipientAccountPubkey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
      // create ata if needed
      let createATATx = null;
      let creatingATA = await splToken.getAccount(connection, associatedTokenAccountPubkey, 'confirmed', splToken.TOKEN_PROGRAM_ID).catch(function(){});
      if(creatingATA == null){
        createATATx = new splToken.createAssociatedTokenAccountInstruction(
        senderAccountPubkey,
        associatedTokenAccountPubkey,
        recipientAccountPubkey,
        mintPubkey,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
      }
      // instructions
      let transferTx = new splToken.createTransferInstruction(tokenAccountPubkey,
      associatedTokenAccountPubkey,senderAccountPubkey,1,undefined,splToken.TOKEN_PROGRAM_ID);
      let instructions = null;
      if(createATATx != null){
        instructions = [createATATx, transferTx];
        console.log("Creating ATA");
      }
      else{
        instructions = [transferTx];
        console.log("Not Creating ATA");
      }
      // ***
      let priority = $("#nft_donation_priority").val(); 
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
      let messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: instructions,
      }).compileToV0Message([]);
      let tx = new solanaWeb3.VersionedTransaction(messageV0);
      // ***
      try {
        $("#cover_message").html("Requesting Approval...");
        let signedTx = await provider.signTransaction(tx);
        let signature = await connection.sendRawTransaction(signedTx.serialize(),{
          skipPreflight: true,
          maxRetries: 0 
        });
        $("#cover_message").html("Processing...");
        let final = await finalized(signature,10,4);
        if(final != "finalized"){ 
          console.log(final);
          $("#cover_message").html(final);
          setTimeout(function(){
            $("#nft_send_donation").prop("disabled", false).val("Transfer");
            $("#cover_message").html("");
            $("#nft_donation_box").show();
          },3000);
          return;
        }
        $("#cover_message").html("");
        $("#donation_box").after('<div id="donation_thanks"><strong>Asset Transferred!</strong></div><div id="donation_sig"><a href="https://solana.fm/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
        $("#wallet_refresh").click();
        $("#nft_send_donation").prop("disabled", false).val("Transfer");
      }
      catch (error) {
        $("#cover_message").html("Error, Canceling...");
        setTimeout(function(){
          $("#nft_send_donation").prop("disabled", false).val("Transfer");
          $("#cover_message").html("");
          $("#nft_donation_box").show();
        },3000);
        error = JSON.stringify(error);
        error = JSON.parse(error);
        console.log(error);
      }
    }
    else if(standard == "PNFT"){
      

      let umi = UMI.createUmi(conf.cluster);
      console.log(umi);
      let feePayer = {
        publicKey: senderAccountPubkey,
        signTransaction: async (tx) => tx,
        signMessage: async (msg) => msg,
        signAllTransactions: async (txs) => txs,
      };
      console.log(feePayer);
      // const web3Conn = UMI.newConnection();
      // const metaplex = new Metaplex(web3Conn);
      // metaplex.use(walletAdapterIdentity({
      //     publicKey: feePayerPubKey,
      //     signTransaction: async (tx) => tx,
      // }));    

      // const nft = await metaplex.nfts().findByMint({mintAddress: mintPubkey});
      
      // const txBuilder = metaplex.nfts().builders().transfer({
      //     nftOrSft: nft,
      //     fromOwner: senderAccountPubkey,
      //     toOwner: recipientAccountPubkey,
      //     amount: token(1),
      //     authority: feePayer,
      // });
      let blockhash = (await connection.getLatestBlockhash()).toString();
      console.log("blockhash", blockhash);
      // return txBuilder.toTransaction(blockhash);





      setTimeout(function(){
        $("#nft_send_donation").prop("disabled", false).val("Transfer");
        $("#cover_message").html("");
        $("#nft_donation_box").show();
      },3000);
      // let mplProgramid = new solanaWeb3.PublicKey(conf.METADATA_PROGRAM_ID);
      // let providerMintATA = await splToken.getAssociatedTokenAddress(mintPubkey,provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
      // let providerMintATAPubKey = new solanaWeb3.PublicKey(providerMintATA);
      // let tokenRecordPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),mintPubkey.toBytes(),Buffer.from("token_record"),providerMintATAPubKey.toBytes()],mplProgramid,);
      // let args = new Uint8Array(1); args[0] = 1;
      // let _authority = provider.publicKey;
      // let _authorizationRules = new solanaWeb3.PublicKey(conf.MPL_RULES_ACCT);        
      // let _authorizationRulesProgram = new solanaWeb3.PublicKey(conf.MPL_RULES_PROGRAM_ID);
      // let _destinationOwner = new solanaWeb3.PublicKey(to_wallet);
      // let _destinationToken = await splToken.getAssociatedTokenAddress(mintPubkey,_destinationOwner,true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
      // let _destinationTokenRecord = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),mintPubkey.toBytes(),Buffer.from("token_record"),providerMintATAPubKey.toBytes()],mplProgramid,);      
      // _destinationTokenRecord = _destinationTokenRecord[0];
      // let _edition = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),mintPubkey.toBytes(),Buffer.from("edition")],mplProgramid);
      // _edition = _edition[0];
      // let _metadata = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),mintPubkey.toBytes()],mplProgramid);
      // _metadata = _metadata[0];
      // let _mint = mintPubkey;
      // let _payer = senderAccountPubkey;
      // let _splAtaProgram = new solanaWeb3.PublicKey(conf.SPL_ATA_PROGRAM_ID);
      // let _splTokenProgram = splToken.TOKEN_PROGRAM_ID;
      // let _systemProgram = solanaWeb3.SystemProgram.programId;
      // let _sysvarInstructions = solanaWeb3.SYSVAR_INSTRUCTIONS_PUBKEY;
      // let _token = providerMintATA;
      // let _tokenOwner = senderAccountPubkey;
      // let _tokenRecord = tokenRecordPDA[0];
      // let keys = [
      //   { pubkey: _authority, isSigner: true, isWritable: true },
      //   { pubkey: _authorizationRules, isSigner: false, isWritable: false },
      //   { pubkey: _authorizationRulesProgram, isSigner: false, isWritable: false },
      //   { pubkey: _destinationOwner, isSigner: false, isWritable: true },
      //   { pubkey: _destinationToken, isSigner: false, isWritable: true },
      //   { pubkey: _destinationTokenRecord, isSigner: false, isWritable: true },
      //   { pubkey: _edition, isSigner: false, isWritable: false },
      //   { pubkey: _metadata, isSigner: false, isWritable: true },
      //   { pubkey: _mint, isSigner: false, isWritable: false },
      //   { pubkey: _payer, isSigner: true, isWritable: true },
      //   { pubkey: _splAtaProgram, isSigner: false, isWritable: false },
      //   { pubkey: _splTokenProgram, isSigner: false, isWritable: false },
      //   { pubkey: _systemProgram, isSigner: false, isWritable: false },
      //   { pubkey: _sysvarInstructions, isSigner: false, isWritable: false },
      //   { pubkey: _token, isSigner: false, isWritable: true },
      //   { pubkey: _tokenOwner, isSigner: false, isWritable: true },
      //   { pubkey: _tokenRecord, isSigner: false, isWritable: true },
      // ];
      // let initTransferIx = new solanaWeb3.TransactionInstruction({programId:mplProgramid,data:Buffer.from(args),keys:keys});
      // let instructions = [];
      // instructions.push(initTransferIx);
      // console.log("instructions", instructions);
      // // ***
      // let priority = $("#nft_donation_priority").val(); 
      // instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:125000}));
      // instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
      // let messageV0 = new solanaWeb3.TransactionMessage({
      //   payerKey: provider.publicKey,
      //   recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
      //   instructions: instructions,
      // }).compileToV0Message([]);
      // let tx = new solanaWeb3.VersionedTransaction(messageV0);
      // // ***
      // try {
      //   $("#cover_message").html("Requesting Approval...");
      //   let signedTx = await provider.signTransaction(tx);
      //   let signature = await connection.sendRawTransaction(signedTx.serialize(),{
      //     skipPreflight: true,
      //     maxRetries: 0 
      //   });
      //   $("#cover_message").html("Processing...");
      //   let final = await finalized(signature,10,4);
      //   if(final != "finalized"){ 
      //     console.log(final);
      //     $("#cover_message").html(final);
      //     setTimeout(function(){
      //       $("#nft_send_donation").prop("disabled", false).val("Transfer");
      //       $("#cover_message").html("");
      //       $("#nft_donation_box").show();
      //     },3000);
      //     return;
      //   }
      //   $("#cover_message").html("");
      //   $("#donation_box").after('<div id="donation_thanks"><strong>Asset Transferred!</strong></div><div id="donation_sig"><a href="https://solana.fm/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
      //   $("#wallet_refresh").click();
      //   $("#nft_send_donation").prop("disabled", false).val("Transfer");
      // }
      // catch (error) {
      //   $("#cover_message").html("Error, Canceling...");
      //   setTimeout(function(){
      //     $("#nft_send_donation").prop("disabled", false).val("Transfer");
      //     $("#cover_message").html("");
      //     $("#nft_donation_box").show();
      //   },3000);
      //   error = JSON.stringify(error);
      //   error = JSON.parse(error);
      //   console.log(error);
      // }





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
    let locked = $(this).parent().parent().find("img.islocked").length;
    if(locked == 1){
      $("#cover").fadeIn(400);
      $("#cover_message").html("Non-Transferable Asset!");
      setTimeout(function(){
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      },3000);
      return;
    }
    $(".ass_swap").prop("disabled", true);
    $("#mode_spl").click();
    if ($(this).attr("data-pnft") == "true") {
      $("#a_type").val("pNFT");
    } 
    else if ($(this).attr("data-core") == "true") {
      $("#a_type").val("CORE");
    } 
    else {
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
    $(".swap_b").addClass("active_swap");
    $("#create_b_id").prop("disabled", false);
    $("#fetch_b").click();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
    if ($("#scroll_wrapper").width() < 1841) {
      $("#wallet_close").click();
    }
    $(".ass_swap").prop("disabled", false);
    validate_details();
  });
  $(document).on("change", "#nft_collection", async function() {
    let all = $("#view_nfts ul");
    all.hide();
    all.each(function(){
      if ($(this).attr("data-collection") == $("#nft_collection").val()) {
        $(this).show();
      } 
      else {
        $(this).hide();
      }
    });
    $("#wallet_nfts span.count").html("(" + $('ul[data-type="nft"]:visible').length + ")");
    $("#wallet_list").getNiceScroll().resize();
  });
  
  // cnfts
  $(document).delegate("#wallet_cnfts", "click", async function() {
  $("#wallet_refresh").addClass("refresh_rotate").prop("disabled", true);
//   $(".wallet_filter, .wallet_rarity").show();
  $(".loader").show();
  $("#wallet_nfts, #wallet_cnfts").removeClass("active_view");
  $(this).addClass("active_view");
  $("#view_nfts").removeClass().addClass("wallet_views animate__animated animate__fadeOutLeft");
  setTimeout(() => {
    $("#nft_collections").hide();
    $("#cnft_collections").fadeIn(500);
    $("#view_nfts").hide();
    $("#view_cnfts").removeClass().addClass("wallet_views animate__animated animate__fadeInRight").show();
  }, 1000);
  var cnfts = [];
  var cmints = [];
//   var has_filter = $("#wallet_filters .wallet_filter").html();
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
      ass.pnft = false;
      ass.core = false;
      let blacklist = false;
      let whitelist = true;
      if(typeof ass.grouping != "undefined" && typeof ass.grouping[0] != "undefined"){
        if(conf.cnft_blacklist.length > 0 && conf.cnft_blacklist.includes(ass.grouping[0].group_value)){
          blacklist = true;
        }
        if(conf.cnft_whitelist.length > 0 && !conf.cnft_whitelist.includes(ass.grouping[0].group_value)){
          whitelist = false;
        }
      }
      if (whitelist == true && blacklist == false && ass.burnt != true && ass.compression.compressed === true) {
        if (
          typeof ass.content !== undefined &&
          typeof ass.content.files !== undefined &&
          typeof ass.content.files[0] !== undefined &&
          ass.hasOwnProperty('content') &&
          ass.content.hasOwnProperty('files') &&
          typeof ass.content.files[0] == "object" &&
          ass.content.files[0].hasOwnProperty('uri')
        ) {
          if(typeof ass.grouping[0] == "undefined"){
            ass.grouping = [];
            ass.grouping[0] = {group_key: "collection", group_value: false}
          }
          // this restricts the collection the whitelisted collections only if any are defined in settings
          let pass = true;
          let whitelist = conf.cnft_whitelist;
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
            rebuild.pnft = ass.pnft;
            rebuild.core = ass.core;
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
    
//   }
  
  // sort by collection
  let cnft_final = [];
  let cnft_groups = [];
  let group_list = [];
  for (let i = 0; i < cnfts.length; i++) {
    let _i = i - 1;
    if (cnfts[i].collection.name === false) {
      cnfts[i].collection.name = "Unknown";
    }
    if (typeof cnft_groups[cnfts[i].collection.name] == "undefined") {
      cnft_groups[cnfts[i].collection.name] = [];
    }
    if(!group_list.includes(cnfts[i].collection)){
      group_list.push(cnfts[i].collection);
    }
    let collect = cnfts[i].collection.name;
    let grouping = cnft_groups[collect];
    grouping.push(cnfts[i]);
    cnft_groups[collect] = grouping;
  }
  
  if($(".sol_box span.connect_me").length){
    $("#view_cnfts, #view_nfts").html("");
    return;
  }
  
  if(!$("#cnft_collection option").length){
    group_list.sort(function(a, b) {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
    let options = "";
    for (let i = 0; i < group_list.length; i++) {
      if(group_list[i].collection_key==false){group_list[i].collection_key="unknown";}
      options += '<option value="'+group_list[i].collection_key+'">'+group_list[i].name+'</option>';
    }
    $("#cnft_collection").html(options);
    $('#cnft_collection option[value="ACy3ZVXcch8mZXUtRVqsJfa2DhFHxnUJpBb4oeN9tZsX"]').prop('selected', true);
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
//   for (let i = 0; i < cnfts.length; i++) {
//     if (typeof cnfts[i].attributes != "undefined") {
//       let tags = await get_combos(cnfts[i].attributes);
//       if (tags.length > 0) {
//         cnfts[i].combos = tags;
//       }
//     }
//   }
  
  // display cnfts
  for (let i = 0; i < cnfts.length; i++) {
    let ass = cnfts[i];
//     let attributes = ass.attributes;
//     let rarity = "";
//     let rarit = "";
//     let rar = "";
//     if (typeof attributes != "undefined") {
//       for (let r = 0; r < attributes.length; r++) {
//         let attr = attributes[r];
//         if (attr.trait_type == "Rarity") {
//           rarity = attr.value;
//           rarit = rarity.charAt(0);
//           if (rarit == "L") {
//             rar = " legendary";
//           } else if (rarit == "R") {
//             rar = " rare";
//           } else if (rarit == "C") {
//             rar = " common";
//           }
//         }
//       }
//     }
    if (!$("ul[data-id='" + ass.mint + "']").length) {
      if(ass.collection_key==false){ass.collection_key="unknown";}
      let item = '<ul data-collection="' + ass.collection_key + '" data-id="' + ass.mint + '" data-type="cnft" class="asset">';
//       item += '<li title="' + rarity + '" class="ass_rarity' + rar + '">' + rarit + '</li>';
      item += '<li class="ass_standard">CNFT</li>';
      item += '<li class="ass_name">' + ass.name + '</li>';
      item += '<li class="ass_collection">' + ass.collection.name + '</li>';
      item += '<li class="ass_options"><button disabled class="ass_meta">Details</button><button disabled class="ass_donate">Transfer</button><button disabled data-wallet="' + provider.publicKey.toString() + '" data-mint="' + ass.mint + '" class="ass_sell">Market</button><button disabled class="ass_swap">OTC</button></li>';
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
  
  }
  
  // apply display filter
  for (let i = 0; i < cnfts.length; i++) {
    if(cnfts[i].collection_key == $("#cnft_collection").val()){
      $("ul[data-id='" + cnfts[i].mint + "']").show();
    }
  }

  setTimeout(() => {
    $('ul[data-type="cnft"] li.ass_options button.ass_meta, ul[data-type="cnft"] li.ass_options button.ass_donate, ul[data-type="cnft"] li.ass_options button.ass_swap, ul[data-type="cnft"] li.ass_options button.ass_sell').prop("disabled", false);
    $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
//       $("#view_cnfts ul.asset").show();
    $(".loader").hide();
    //       $("#wallet_cnfts span.count").html('(' + cnfts.length + ')');
    $("#wallet_refresh").removeClass("refresh_rotate").prop("disabled", false);
    $("#wallet_nfts, #wallet_cnfts").prop("disabled", false);
    $("#wallet_list").getNiceScroll().resize();
  }, 1000);
  
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
    $(".swap_b").addClass("active_swap");
    $("#fetch_b").click();
    if ($("#scroll_wrapper").width() < 1841) {
      $("#wallet_close").click();
    }
    let proofs_required = await required_proofs(item_id);
    if(proofs_required == false){
      alert("There was a problem loading an asset, please try again.");
    }
    else{
      $("#proofs_a").html(proofs_required + " x Proofs").show();
      // console.log("proofs_required", parseInt(proofs_required));
      // console.log("conf.max_proofs (1)", conf.max_proofs);
      if(parseInt(proofs_required) > conf.max_proofs){
        $("#proofs_a").addClass("toomanyproofs");
        $("#mc_swap_create .mc_title").html(conf.max_proofs + " Proofs Exceded!").addClass("blink");
        $("#view_cnfts .ass_swap").prop("disabled",false);
        $("#create_b_owner").prop("disabled",false);
        setTimeout(function(){
          $("#mc_swap_create .mc_title").removeClass("blink").html("New Contract");
        },3000);
        return;
      }
    }
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
    $(".ass_swap").prop("disabled", false);
    await max_proofs();
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
    let standard = $(this).parent().parent().find(".ass_standard").html();
    $("#cover").fadeIn(400);
    $("#nft_donation_box").show().addClass("animate__animated animate__zoomInDown");
    let main = $("ul[data-id='" + mint + "']");
    let src = main.find(".ass_img").attr("src");
    let name = main.find(".ass_name").html();
    let collection = main.find(".ass_collection").html();
    $("#nft_donation_image").attr("src", src);
    $("#nft_donation_name").html(name);
    $("#nft_donation_collection").html(collection);
    $("#nft_donation_standard").html(standard);
    $("#nft_donation_mint").val(mint);
  });
  $(document).delegate("#cnft_send_donation", "click", async function() {
    provider = wallet_provider();
    if (typeof provider == "undefined") {
      alert("You need a wallet connection to do this.");
      return;
    } 
    let from_wallet = provider.publicKey.toString();
    let to_wallet = $("#nft_donation_addy").val();
    if(await validateWallet(to_wallet) == false){
      alert("Invalid wallet address!");
      return;
    }
    if (from_wallet == to_wallet) {
      alert("Sender = Receiver conflict!");
      return;
    }
    $(this).prop("disabled", true);
    $("#nft_donation_box").fadeOut(400);
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let assetId = $("#nft_donation_mint").val();
    let proofs_required = await required_proofs(assetId);
    if(proofs_required == false || proofs_required > 17){
      alert("Oh no! The selected cNFT requires more than 17 proofs and we can't send it!");
      $("#cnft_send_donation").prop("disabled", false).val("Transfer");
      $("#cover_message").html("");
      $("#nft_donation_box").show();
      return;
    }
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
    console.log("assetCompressionDatahash", assetCompressionDatahash);
    console.log("assetCompressionCreatorhash", assetCompressionCreatorhash);
    console.log("assetCompressionLeafId", assetCompressionLeafId);
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
    console.log("treeId", treeId);
    assetProof = response.data.result.proof;
    console.log("assetProof", assetProof);
    assetRoot = response.data.result.root;
    console.log("assetRoot", assetRoot);
    let treeIdPubKey = new solanaWeb3.PublicKey(treeId);
    let treeAccount = await splAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection, treeIdPubKey, );
    let treeAuthority = treeAccount.getAuthority();
    console.log("treeAuthority", treeAuthority);
    let canopyDepth = treeAccount.getCanopyDepth();
    console.log("canopyDepth", canopyDepth);
    let proof = assetProof.slice(0, assetProof.length - (!!canopyDepth ? canopyDepth : 0))
    .map((node) => ({pubkey: new solanaWeb3.PublicKey(node),isWritable: false,isSigner: false,}));
    console.log("proof", proof);
    let merkleTree = new solanaWeb3.PublicKey(treeId);
    let compressionProgram = splAccountCompression.SPL_ACCOUNT_COMPRESSION_PROGRAM_ID;
    let logWrapper = splAccountCompression.SPL_NOOP_PROGRAM_ID;
    let leafOwner = provider.publicKey;
    let leafDelegate = provider.publicKey;
    let newLeafOwner = recipientAccountPubkey;
    let anchorRemainingAccounts = proof;
    let root = [...new solanaWeb3.PublicKey(assetRoot).toBytes()];
    let dataHash = [...new solanaWeb3.PublicKey(assetCompressionDatahash).toBytes()];
    let creatorHash = [...new solanaWeb3.PublicKey(assetCompressionCreatorhash).toBytes()];
    const transferInstruction = mplBubblegum.createTransferInstruction(
    {
      merkleTree: merkleTree,
      treeAuthority,
      leafOwner,
      leafDelegate,
      newLeafOwner,
      logWrapper: logWrapper,
      compressionProgram: compressionProgram,
      anchorRemainingAccounts: anchorRemainingAccounts,
    },
    {
      root: root,
      dataHash: dataHash,
      creatorHash: creatorHash,
      nonce: assetCompressionLeafId,
      index: assetCompressionLeafId,
    },
    mplBubblegum.PROGRAM_ID);
    
    let instructions = [transferInstruction];
    
    // ***
    let priority = $("#nft_donation_priority").val(); 
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
    let messageV0 = new solanaWeb3.TransactionMessage({
      payerKey: provider.publicKey,
      recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
      instructions: instructions,
    }).compileToV0Message([]);
    let tx = new solanaWeb3.VersionedTransaction(messageV0);
    // ***
    
    try {
      $("#cover_message").html("Requesting Approval...");
      let signedTx = await provider.signTransaction(tx);
      let signature = await connection.sendRawTransaction(signedTx.serialize(),{
        skipPreflight: true,
        maxRetries: 0 
      });
      $("#cover_message").html("Processing...");
      let final = await finalized(signature,10,4);
      if(final != "finalized"){ 
        $("#cover_message").html(final);
        setTimeout(function(){
          $("#cnft_send_donation").prop("disabled", false).val("Transfer");
          $("#cover_message").html("");
          $("#nft_donation_box").show();
        },3000);
        return;
      }
      $("#cover_message").html("");
      $("#donation_box").after('<div id="donation_thanks"><strong>Asset Transferred!</strong></div><div id="donation_sig"><a href="https://solana.fm/tx/' + signature + '" target="blank_">View Transaction</a></div><button id="donation_continue">Continue</button>');
      $("#wallet_refresh").click();
      $("#cnft_send_donation").attr("id", "nft_send_donation").prop("disabled", false).val("Transfer");
    }
    catch (error) {
      $("#cover_message").html("Error, Canceling...");
      setTimeout(function(){
        $("#cnft_send_donation").prop("disabled", false).val("Transfer");
        $("#cover_message").html("");
        $("#nft_donation_box").show();
      },3000);
//       error = JSON.stringify(error);
//       error = JSON.parse(error);
//       console.log(error);
    }
  });
  $(document).on("change", "#cnft_collection", async function() {
    let all = $("#view_cnfts ul");
    all.hide();
    all.each(function(){
      if ($(this).attr("data-collection") == $("#cnft_collection").val()) {
        $(this).show();
      } 
      else {
        $(this).hide();
      }
    });
    $("#wallet_cnfts span.count").html("(" + $('ul[data-type="cnft"]:visible').length + ")");
    $("#wallet_list").getNiceScroll().resize();
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
          $(".swap_img_b").attr("src", "/img/img-placeholder.png");
          $("#create_b_id, #b_type").val("");
          pass_test = false;
          return;
        }
      }
    }

    // check for max proofs
    if( parseInt($("#proofs_a").html()) + parseInt($("#proofs_b").html()) > conf.max_proofs){
      $("#swap_create").prop("disabled", true);
      $(".swap_img_b").attr("src", "/img/img-placeholder.png");
      $("#create_b_id, #b_type").val("");
      if(parseInt($("#proofs_a").html()) <= conf.max_proofs){
        setTimeout(function(){
          $(".mc_title").removeClass("blink").html("New Contract");
          $("#proofs_a").removeClass("toomanyproofs");
        },4000);
      }
      $("#proofs_b").removeClass("toomanyproofs").hide().html("");
      pass_test = false;
      return;
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
    } else {
      $("#swap_create").prop("disabled", true);
    }

  }
  
  // mcswap create load asset b
  async function max_proofs() {
    // console.log("proofs_a", $("#proofs_a").html());
    let ass_a = parseInt($("#proofs_a").html());
    let ass_b = parseInt($("#proofs_b").html());
    if (ass_a > conf.max_proofs || ass_b > conf.max_proofs || (ass_a + ass_b) > conf.max_proofs) {
      $(".proofs_").addClass("toomanyproofs");
      $("#swap_create").prop("disabled", true);
      $("#create_b_id").prop("disabled", false);
      $("#create_b_owner").prop("disabled",false);
      $("#mc_swap_create .mc_title").html(conf.max_proofs + " Proofs Exceded!").addClass("blink");
      setTimeout(function(){
        $("#mc_swap_create .mc_title").removeClass("blink").html("New Contract");
      },3000);
    } 
    else{
    // else if (parseInt($("#proofs_a").html()) > 0 && parseInt($("#proofs_b").html()) > 0) {
      $(".proofs_").removeClass("toomanyproofs");
      $("#create_b_id").prop("disabled", false);
      $("#mc_swap_create .mc_title").html("New Contract").removeClass("blink");
    } 
    // else {
    //   $("#mc_swap_create .mc_title").html("New Contract").removeClass("blink");
    // }
    validate_details();
  }
  async function load_asset_b() {
    let swap_b_id = $("#create_b_id").val();
    if (swap_b_id.length < 32) {
    $(".swap_img_b").attr("src", "/img/img-placeholder.png");
    $("#mc_swap_create .mc_title").html("New Contract");
      $("#create_b_id, #create_b_owner").prop("disabled", false);
      $("#proofs_b").hide().html("");
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

    if (response.data.result.burnt===true || typeof response.data.result == "undefined") {
      $("#mc_swap_create .mc_title").html("New Contract");
      $("#create_b_id, #create_b_owner").prop("disabled", false);
      $("#proofs_b").hide().html("");;
      $("#b_type").val("");
      $(".swap_img_b").attr("src", "/img/img-placeholder.png");
      $(".proofs_").removeClass("toomanyproofs");
      return;
    }

    if (typeof response.data.result.compression != "undefined" && response.data.result.compression.compressed === true) {
      $("#b_type").val("cNFT");
    } else if (response.data.result.interface == "ProgrammableNFT") {
      $("#b_type").val("pNFT");
    } else if (response.data.result.interface == "MplCoreAsset") {
      $("#b_type").val("CORE");
    } else {
      $("#b_type").val("NFT");
    }

    if ($("#a_type").val() != $("#b_type").val()) {
      $("#swap_create").prop("disabled", true);
      $("#create_b_id").prop("disabled", false);
      $("#swap_img_b").attr("src", "/img/img-placeholder.png");
      $("#create_b_id").val("");
      $("#b_type").val("");
      $("#mc_swap_create .mc_title").html("New Contract");
      $("#create_b_owner").prop("disabled", false);
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
    $("#proofs_b").hide().html("");
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
  async function get_bobs_wallet(standard="cNFT") {
    
    var nfts = [];
    var cmints = [];
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let assets = {};
    assets.total = 0;
    assets.items = [];
    
    // get all the nfts in the wallet (3000 max)
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

    // filter for cnfts/nft/pnft/core and build data arrays
    for (let i = 0; i < assets.items.length; i++) {
      let ass = assets.items[i];
      
      ass.pnft = false;
      ass.core = false;
      if(ass.interface == "ProgrammableNFT"){ass.pnft=true;}
      else if(ass.interface == "MplCoreAsset"){ass.core=true;}
      
      if(typeof ass.grouping[0] == "undefined"){
        ass.grouping = [];
        ass.grouping[0] = {group_key: "collection", group_value: false}
      }

      let blacklist = false;
      if(standard == "cNFT" && conf.cnft_blacklist.includes(ass.grouping[0].group_value)){
        blacklist = true;
      }
      else if(standard == "NFT" && conf.nft_blacklist.includes(ass.grouping[0].group_value) || 
      standard == "pNFT" && conf.nft_blacklist.includes(ass.grouping[0].group_value) || 
      standard == "CORE" && conf.nft_blacklist.includes(ass.grouping[0].group_value)){
        blacklist = true;
      }

      if (blacklist == false && ass.burnt != true) {
        
        if (
          typeof ass.content !== undefined &&
          typeof ass.content.files !== undefined &&
          typeof ass.content.files[0] !== undefined &&
          ass.hasOwnProperty('content') &&
          ass.content.hasOwnProperty('files') &&
          typeof ass.content.files[0] == "object" &&
          ass.content.files[0].hasOwnProperty('uri')
        ) {

          let pass = false;
          let whitelist = [];
          let rebuild = {};

          if(standard == "cNFT"){whitelist = conf.cnft_whitelist;}
          else if(standard == "NFT"){whitelist = conf.nft_whitelist;}
          else if(standard == "pNFT"){whitelist = conf.nft_whitelist;}
          else if(standard == "CORE"){whitelist = conf.nft_whitelist;}

          if(standard == "pNFT" && ass.interface == "ProgrammableNFT"){
            pass = true;
          }else if(standard == "pNFT"){pass = false;}
          // console.log("pass b: ", pass);

          if (standard == "CORE" && ass.interface == "MplCoreAsset") { 
            pass = true; 
          }else if(standard == "CORE"){pass = false;}
          // console.log("pass c: ", pass);

          if (standard == "cNFT" && ass.compression.compressed === true) { 
            pass = true; 
          }else if(standard == "cNFT"){pass = false;}
          // console.log("pass d: ", pass);

          if(standard == "NFT" && ass.interface == "V1_NFT" && ass.compression.compressed != true){ 
            pass = true; 
          }
          
          if(whitelist.length > 0 && !whitelist.includes(ass.grouping[0].group_value)){
            pass = false;
          } 

          if(pass === true){
            rebuild.mint = ass.id;
            rebuild.image = ass.content.files[0].uri;
            rebuild.name = ass.content.metadata.name;
            rebuild.attributes = ass.content.metadata.attributes;
            rebuild.combos = [];
            rebuild.collection_key = ass.grouping[0].group_value;
            rebuild.sort = 0;
            rebuild.collection = "Unknown";
            rebuild.pnft = ass.pnft;
            rebuild.core = ass.core;
            if (cmints.filter(e => e.collection_key === ass.grouping[0].group_value).length == 0) {
              let obj = {}
              obj.collection_key = ass.grouping[0].group_value;
              obj.name = false;
              obj.symbol = false;
              obj.uri = false;
              obj.core = ass.core;
              cmints.push(obj);
            }
            nfts.push(rebuild);
          }
          
        }
        
      }

    }
    
    // get collection data
    for (let i = 0; i < cmints.length; i++) {
      let item = cmints[i];
      if(item.core === true){
          if(item.collection_key != false){
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let res = await axiosInstance.post(conf.cluster,{
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: item.collection_key},
            });
            cmints[i].name = res.data.result.content.metadata.name.replace(/\0/g, '');
            cmints[i].symbol = res.data.result.content.metadata.symbol.replace(/\0/g, '');
            cmints[i].uri = res.data.result.content.json_uri.replace(/\0/g, '');
          }
      }
      else{
        let res = await Metadata.fromAccountAddress(connection, new solanaWeb3.PublicKey(await get_pda(item.collection_key))).catch(function() {});
        if (res != undefined) {
          cmints[i].name = res.data.name.replace(/\0/g, '');
          cmints[i].symbol = res.data.symbol.replace(/\0/g, '');
          cmints[i].uri = res.data.uri.replace(/\0/g, '');
        }
      }
      for (let c = 0; c < nfts.length; c++) {
          let cnft = nfts[c];
          if (cnft.collection_key === item.collection_key) {
            let sorter = cnft.name.split("#");
            if (typeof sorter[1] != "undefined") {
              cnft.sort = parseInt(sorter[1].trim());
            }
            nfts[c].collection = item;
          }
        }
    }
    
    // sort by collection
    let nft_final = [];
    let nft_groups = [];
    let group_list = [];
    
    for (let i = 0; i < nfts.length; i++) {
      let _i = i - 1;
      if (nfts[i].collection.name == false) {
        nfts[i].collection.name = "Unknown";
        nfts[i].collection.collection_key = false;
        nfts[i].collection.symbol = false;
        nfts[i].collection.uri = false;
        nfts[i].collection_key = false;
      }
      if (typeof nft_groups[nfts[i].collection.name] == "undefined") {
        nft_groups[nfts[i].collection.name] = [];
      }
      if(!group_list.includes(nfts[i].collection)){
        group_list.push(nfts[i].collection);
      }
      let collect = nfts[i].collection.name;
      let grouping = nft_groups[collect];
      grouping.push(nfts[i]);
      nft_groups[collect] = grouping;
    }
    let uniq_list = new Set(group_list.map(e => JSON.stringify(e)));
    group_list = Array.from(uniq_list).map(e => JSON.parse(e));
    
    if(!$("#bob_chooser_collections option").length){
      group_list.sort(function(a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      let options = "";
//       options += '<option value="test">test</option>';
      for (let i = 0; i < group_list.length; i++) {

        if(group_list[i].collection_key==false){group_list[i].collection_key="unknown";}
        options += '<option value="'+group_list[i].collection_key+'">'+group_list[i].name+'</option>';
      }
      $("#bob_chooser_collections").html(options);
      $('#bob_chooser_collections option[value="3pAx1gCrmcVFfGdVFRFaaqDEFq7ngung3nD3Q6mzs18x"]').prop('selected', true);
    }
    
    // group by collection, sort sub arrays, and rebuild nfts array
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
    
    // display nfts
    for (let i = 0; i < nfts.length; i++) {
      let ass = nfts[i];
      if(ass.collection_key==false){ass.collection_key="unknown";}
      let item = '<ul data-bob_collection="' + ass.collection_key + '" data-bob_chooser="' + ass.mint + '" data-type="bob_cnft" class="bob_asset">';
        item += '<li><img src="' + ass.image + '" class="bob_img" /></li>';
        item += '<li class="bob_name">' + ass.name + '</li>';
        item += '</ul>';
        $("#bob_chooser_list").append(item);
    }
    
    let all = $("#bob_chooser_list ul");
    all.hide();
    all.each(function(){
      if ($(this).attr("data-bob_collection") == $("#bob_chooser_collections").val()) {
        $(this).show();
      } 
      else {
        $(this).hide();
      }
    });
    
    setTimeout(() => {
      if($("#bob_chooser_list .bob_asset").length){
        $("#init_loader").hide();
        $("#bob_chooser").fadeIn(800);
        $("#cover_message").html("");
      }
      else{
        $("#cover_message").html("No supported assets were found.");
        setTimeout(() => {
          $("#init_loader").fadeOut(400);
          $("#cover").fadeOut(400);
          $("#bob_chooser, #bob_chooser_list ul").hide();
          $("#fetch_c").prop("disabled", false);
          setTimeout(() => {
            $("#cover_message").html("");
          },1500);
        },2500);
      }
      $("#bob_chooser_list").getNiceScroll().resize();
    }, 1500);
    
  }
  $(document).on("change", "#bob_chooser_collections", async function() {
    let all = $("#bob_chooser_list ul");
    all.hide();
    all.each(function(){
      if ($(this).attr("data-bob_collection") == $("#bob_chooser_collections").val()) {
        $(this).show();
      } 
      else {
        $(this).hide();
      }
    });
    $("#bob_chooser_list").getNiceScroll().resize();
  });
  $(document).delegate("#bob_cancel", "click", async function() {
    $("#fetch_c").prop("disabled",false);
    $("#cover, #bob_chooser").fadeOut(400);
    setTimeout(() => { 
      $("#bob_chooser_list").html("");
      $("#bob_chooser_collections").html("");
    },500);
  });
  $(document).delegate(".bob_asset", "click", async function() {
    let id = $(this).attr("data-bob_chooser");
    $("#cover, #bob_chooser").fadeOut(400);
    $("#create_b_id").val(id);
    $("#fetch_c").prop("disabled", false);
    setTimeout(function(){
      $("#bob_chooser_collections").html("");
      $("#bob_chooser_list").html("");
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
    let filter_type = $("#a_type").val();
    console.log("filter_type: ", filter_type);
    get_bobs_wallet(filter_type);
  });
  
  // revalidating on keypress/change
  $(document).on("change", "#create_b_id", async function() {
    $(".swap_img_b").attr("src", "/img/img-placeholder.png");
    $("#proofs_b").hide();
    $("#b_type").val("");
    $("#create_b_owner").prop("disabled", false);
    await max_proofs();
    validate_details();
  });
  $(document).on("keyup", "#create_b_id", async function() {
    $(".swap_img_b").attr("src", "/img/img-placeholder.png");
    $("#proofs_b").hide().html("");
    $("#b_type").val("");
    $("#create_b_owner").prop("disabled", false);
    await max_proofs();
    validate_details();
  });
  $(document).on("change", "#create_b_owner", async function() {
    await max_proofs();
    validate_details();
  });
  $(document).on("keyup", "#create_b_owner", async function() {
    await max_proofs();
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
    $(".swap_a, .swap_b , .swap_g").removeClass("active_swap");
    $("#donate_sol, .mcprofile_close, #wallet_refresh").hide();
    $(".fee_prov_sig .swap_val, .fee_prov_alt .swap_val, .share_sig .swap_val, .share_id .swap_val").html("");
    if ($("#a_type").val() == "cNFT") {
      $(".swap_cancel_b").prop("disabled", true);
      $(".swap_f").addClass("active_swap");
      $("#create_b_owner, .swap_cancel_b, #swap_deploy").prop("disabled", false);
    } else if ($("#a_type").val() == "NFT") {
      $(".swap_f").addClass("active_swap");
      $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
    } else if ($("#a_type").val() == "pNFT") {
      $(".swap_f").addClass("active_swap");
      $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
    } else if ($("#a_type").val() == "CORE") {
      $(".swap_f").addClass("active_swap");
      $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
    }
  });
  
  // back two steps
  $(document).delegate(".swap_cancel_b", "click", async function() {
    $(".swap_cancel_b, #swap_deploy").prop("disabled", true);
    $(".mode_switch, #pikl_request, #usdc_request, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, .ass_meta, #wallet_disconnect, #wallet_refresh, #create_b_id, #fetch_b, #fetch_c, #sol_request, #swap_create, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
    $(".swap_f").removeClass("active_swap");
    $(".swap_a, .swap_b").addClass("active_swap");
    $("#donate_sol, .mcprofile_close, #wallet_refresh").show();
    $("#create_b_owner").prop("disabled", false);
  });

  // back a step
  $(document).delegate("#swap_cancel", "click", async function() {
    $(".mode_switch, #pikl_request, #usdc_request, #nav_shop, #nav_view, .ass_donate, .ass_swap, .ass_sell, #wallet_disconnect, #wallet_refresh, #create_b_id, #fetch_b, #fetch_c, #sol_request, #swap_create, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
    $(".swap_e").removeClass("active_swap");
    $(".swap_a, .swap_b").addClass("active_swap");
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
        } 
        else {
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
          for (let i = 0; i < decimals; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else if ($("#usdc_request").val() > 0) {
          swapTokenMint = new solanaWeb3.PublicKey(conf.usdc);
          swapTokens = $("#usdc_request").val();
          for (let i = 0; i < 6; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else {
          console.log("requesting no tokens");
          swapTokenMint = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        }
        
        swapTokens = swapTokens * multiplier;
        swapTokens = parseInt(swapTokens);
        
        console.log("mint ", mint);
        console.log("swapMint ", swapMint);
        console.log("taker ", taker);
        console.log("isSwap ", isSwap);
        console.log("swapLamports ", swapLamports);
        console.log("swapTokenMint ", swapTokenMint.toString());
        console.log("swapTokens ", swapTokens);
        
        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")],NFTSwapProgramId);
        console.log("Program State PDA: ", programStatePDA[0].toString());        
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(){});
        
        let devTreasury = null;
        let mcDegensTreasury = null;
        let encodedProgramStateData = programState.data;
        let decodedProgramStateData = PROGRAM_STATE_NFT.decode(encodedProgramStateData);
        console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
        console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
        console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
        console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
        console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
        let usageFee = parseInt(new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
        devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
        mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);

        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],NFTSwapProgramId);
        console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());        
        
        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"), new solanaWeb3.PublicKey(mint).toBytes(), new solanaWeb3.PublicKey(swapMint).toBytes()],NFTSwapProgramId);
        console.log("Swap State PDA: ", swapStatePDA[0].toString());        
        
        let axiosInstance = null;
        let getAsset = null;
        let SPL_PROGRAM = null;
        
        // swapVaultATA
        SPL_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        axiosInstance = axios.create({baseURL:conf.cluster});
        getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:mint},}); 
        if(typeof getAsset.data.result.mint_extensions != "undefined"){
          SPL_PROGRAM = splToken.TOKEN_2022_PROGRAM_ID;
          console.log("Using Token 2022");
          console.log(SPL_PROGRAM.toString());
        }
        else{
          console.log("Using SPL Token");
          console.log(SPL_PROGRAM.toString());
        }
        let swapVaultATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(mint),
        swapVaultPDA[0],true,SPL_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);        
        console.log("swapVaultATA: ", swapVaultATA.toString());
        let createSwapVaultATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey,swapVaultATA,
        swapVaultPDA[0],new solanaWeb3.PublicKey(mint),SPL_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Create Swap Vault ATA Ix: ", createSwapVaultATAIx); 
        // swapVaultATA

        // providerMintATA
        let providerMintATA = await splToken.getAssociatedTokenAddress(
          new solanaWeb3.PublicKey(mint),
          provider.publicKey,
          false,
          SPL_PROGRAM,
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        console.log("providerMintATA Program: "+SPL_PROGRAM.toString());
        console.log("providerMintATA: ", providerMintATA.toString());
        // providerMintATA

        // swapMintATA
        SPL_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        if(swapMint != "11111111111111111111111111111111"){
        axiosInstance = axios.create({baseURL:conf.cluster});
        getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:swapMint},}); 
        console.log(swapMint);
          if(typeof getAsset.data.result.mint_extensions != "undefined"){
            SPL_PROGRAM = splToken.TOKEN_2022_PROGRAM_ID;
            console.log("Using Token 2022 ATA");
            console.log(SPL_PROGRAM.toString());
          }
          else{
            console.log("Using SPL Token");
            console.log(SPL_PROGRAM.toString());
          }
        }
        let createSwapMintATA = false;
        let swapMintATA = null;
        let createSwapMintATAIx = null;        
        if (swapMint != "11111111111111111111111111111111") {
          swapMintATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(swapMint),
          provider.publicKey,false,SPL_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          console.log("Swap Mint ATA: ", swapMintATA.toString());
          let response_a = null;
          response_a = await connection.getAccountInfo(swapMintATA).catch(function(){});
          if (response_a == null) {
            createSwapMintATA = true;
            createSwapMintATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey,swapMintATA,
            provider.publicKey,new solanaWeb3.PublicKey(swapMint),SPL_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            console.log("Create Swap Mint ATA Ix: ", createSwapMintATAIx); 
          }
        }
        // swapMintATA

        let createSwapTokenATA = false; 
        let swapTokenATA = null;
        let createSwapTokenATAIx = null;
        
        if(swapTokenMint.toString() != "11111111111111111111111111111111"){
          swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,provider.publicKey,
          false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          console.log("Swap Token ATA: ", swapTokenATA.toString());    
          let response_b = null;
          response_b = await connection.getAccountInfo(swapTokenATA).catch(function(error) {});
          console.log("response_b: ", response_b);    
          if (response_b == null) {
            createSwapTokenATA = true;
            createSwapTokenATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey,swapTokenATA,provider.publicKey,
            swapTokenMint,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            console.log("Create Swap Token ATA Ix: ", createSwapTokenATAIx); 
          }
        }
        
        let totalSize = 1 + 1 + 32 + 32 + 32 + 8 + 32 + 8;
        console.log("totalSize", totalSize);
        
        let uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 0; // 0 = nft_swap InitializeSwap instruction

        if (isSwap == true) {
            uarray[counter++] = 1;
        } 
        else {
            uarray[counter++] = 0;
        }
        
        let mintb58 = bs58.decode(mint);
        let arr = Array.prototype.slice.call(Buffer.from(mintb58), 0);
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
        let index;
        
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for ( index = 0; index < byteArray.length; index ++ ) {
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
        for ( index = 0; index < byteArray.length; index ++ ) {
            byte = swapTokens & 0xff;
            byteArray [ index ] = byte;
            swapTokens = (swapTokens - byte) / 256 ;
        }
        for (let i = 0; i < byteArray.length; i++) {
            uarray[counter++] = byteArray[i];
        }

        console.log("Contract Data: ", uarray);
        
        let initializeSwapIx = new solanaWeb3.TransactionInstruction({
          programId: NFTSwapProgramId,
          data: Buffer.from(uarray),
          keys: [
            { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
            { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
            { pubkey: swapVaultATA, isSigner: false, isWritable: true }, // 2
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
            { pubkey: providerMintATA, isSigner: false, isWritable: true }, // 4
            { pubkey: new solanaWeb3.PublicKey(mint), isSigner: false, isWritable: true }, // 5  HERE
            { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 6
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 7
            { pubkey: new solanaWeb3.PublicKey(conf.TOKEN_2022_PROGRAM_ID), isSigner: false, isWritable: false }, // 8  HERE
            { pubkey: devTreasury, isSigner: false, isWritable: true }, // 9
            { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 10
          ]
        });
        console.log("Initialize Swap Ix: ", initializeSwapIx);
        
        let static_lookupTable = new solanaWeb3.PublicKey("BT4AUPXSxvbDrzSt3LLkE3Jd5s8R3fBSxJuyicyEMYH3"); // mainnet    
        let static_lookupTableAccount = await connection.getAddressLookupTable(static_lookupTable).then((res) => res.value);
        
        let instructions = null;
        if (isSwap == true) {
          if (createSwapMintATA == true && createSwapTokenATA == true) {
            console.log("debug 1");
            instructions = [
              createSwapVaultATAIx,
              createSwapMintATAIx,
              createSwapTokenATAIx,
              initializeSwapIx
            ];
          } 
          else if (createSwapMintATA == true) {
            console.log("debug 2");
            instructions = [
              createSwapVaultATAIx,
              createSwapMintATAIx,
              initializeSwapIx
            ];
          }
          else if (createSwapTokenATA == true) {
            console.log("debug 3");
            instructions = [
              createSwapVaultATAIx,
              createSwapTokenATAIx,
              initializeSwapIx
            ];
          } 
          else {
            console.log("debug 4");
            instructions = [
              createSwapVaultATAIx,
              initializeSwapIx
            ];
          }
        } 
        else {
          if (createSwapTokenATA == true) {
            console.log("debug 5");
            instructions = [
              createSwapVaultATAIx,
              createSwapTokenATAIx,
              initializeSwapIx
            ];
          }
          else {
            console.log("debug 6");
            instructions = [
              createSwapVaultATAIx,
              initializeSwapIx
            ];
          }
        }
        
        // ***
        let priority = $("#priority_nft").val(); 
        
//         let units = await getComputeLimit(provider.publicKey,instructions,static_lookupTableAccount);
        let units = 85000;
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:units}));
        let feeEstimate = await getPriorityFeeEstimate(conf.cluster,priority,instructions,static_lookupTableAccount);
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:feeEstimate}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([static_lookupTableAccount]);
        let initializeSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***        
        
        // make sure the user has enough SOL
        let sol_balance = $(".sol_balance").html();
        sol_balance = sol_balance * 1000000000;
        sol_balance = parseInt(sol_balance);
        let sol_needed = usageFee + feeEstimate + 2000000;
        console.log("sol needed: ", sol_needed);
        console.log("sol balance: ", sol_balance);
        if(sol_needed > sol_balance){
          $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $("#cover_message").html("Not enough SOL!");
          setTimeout(() => {
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
          }, 3000);
          return;
        }
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(initializeSwapTx);
          let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
            skipPreflight: true,
            maxRetries: 0 
          });
          console.log("Signature: ", signature);
          $(".share_sig span.swap_val").html(signature);
          $("#cover_message").html("Processing...");
          let final = await finalized(signature,10,4);
          if(final != "finalized"){  
            $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
            $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
            $("#cover_message").html(final);
            setTimeout(() => {
              $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
              $("#cover").fadeOut(400);
              $("#cover_message").html("");
              $(".share_id .swap_value").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
            }, 3000);
            return;
          }
          $("#cover_message").html("Complete!");
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

      }
      
      else if ($("#a_type").val() == "cNFT") {
        
        let alice_proofs = parseInt($("#proofs_a").html());
//         console.log("Checking if ALT required...");
//         console.log("Alice is sending "+alice_proofs+" proofs...");
//         if(alice_proofs > 8){
// //           console.log("ALT required.");
//           let confirm_two = confirm("This contract requires two transactions to deploy due to its size.");
//           if(confirm_two==false){return;}
//         }
//         else{
// //           console.log("ALT not required.");
//         }
        
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
          for (let i = 0; i < decimals; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else if ($("#usdc_request").val() > 0) {
          swapTokenMint = new solanaWeb3.PublicKey(conf.usdc);
          swapTokens = $("#usdc_request").val();
          for (let i = 0; i < 6; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else {
          console.log("requesting no tokens");
          swapTokenMint = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        }        
        
//         if ($("#usdc_request").val() > 0) {
//           console.log("usdc request");
//           swapTokenMint = new solanaWeb3.PublicKey(conf.usdc);
//           swapTokens = $("#usdc_request").val() * 1000000;
//           swapTokens = parseInt(swapTokens);
//         } 
//         else if ($("#pikl_request").val() > 0) {
//           //console.log("token request");
//           swapTokenMint = new solanaWeb3.PublicKey($(".swap_c_pikl").attr("data-id"));
//           let decimals = 9;
//           for (let i = 0; i < spl_tokens.length; i++) {
//             let item = spl_tokens[i];
//             if (item.address == $(".swap_c_pikl").attr("data-id")) {
//               decimals = item.decimals;
//             }
//           }
//           swapTokens = $("#pikl_request").val();
//           let multiplier = 1;
//           for (let i = 0; i < decimals; i++) {
//             multiplier = multiplier * 10;
//           }
//           swapTokens = swapTokens * multiplier;
//           swapTokens = parseInt(swapTokens);
//         } 
//         else {
//           swapTokenMint = new solanaWeb3.PublicKey("11111111111111111111111111111111");
//           swapTokens = 0;
//         }        
        
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
        
        let treeAccount = await splAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),);  
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

          let swapTreeAccount = await splAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(
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
          { pubkey: mplBubblegum.PROGRAM_ID, isSigner: false, isWritable: false }, // 6
          { pubkey: splAccountCompression.PROGRAM_ID, isSigner: false, isWritable: false }, // 7
          { pubkey: splAccountCompression.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
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
        
//         if (proof.length > 8) {
          
//           let slot = await connection.getSlot();
//           let [createALTIx, lookupTableAddress] =
//           solanaWeb3.AddressLookupTableProgram.createLookupTable({
//             authority: provider.publicKey,
//             payer: provider.publicKey,
//             recentSlot: slot,
//           });
// //           console.log("Lookup Table Address", lookupTableAddress.toBase58(), lookupTableAddress);

//           let proofPubkeys = [];
//           for (let i = 0; i < proof.length; i++) {
//             proofPubkeys.push(proof[i].pubkey);
//           }
// //           console.log("proofPubkeys ", proofPubkeys);

//           let extendALTIx = solanaWeb3.AddressLookupTableProgram.extendLookupTable({
//             payer: provider.publicKey,
//             authority: provider.publicKey,
//             lookupTable: lookupTableAddress,
//             addresses: [...proofPubkeys,],
//           });
// //           console.log("extendALTIx ", extendALTIx);
          
//           let msLookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res) => res.value);
//           if (!msLookupTableAccount) {
//             $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
//             $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
//             $("#cover_message").html("Error! Could not fetch McSwap ALT!");
//             setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
//             return;
//           }    

//           let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft").val()),});
//           let mcswapMessageV0 = new solanaWeb3.TransactionMessage({
//               payerKey: provider.publicKey,
//               recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
//               instructions: [computePriceIx, createALTIx, extendALTIx],
//           }).compileToV0Message([msLookupTableAccount]);
          
//           let createALTTx = new solanaWeb3.VersionedTransaction(mcswapMessageV0);
//           try {
//             let signedTx = await provider.signTransaction(createALTTx);
// //             let txId = await connection.sendTransaction(signedTx);
//             let txId = await connection.sendRawTransaction(signedTx.serialize(),{     
//               skipPreflight: true,
//               maxRetries: 0 
//             });
// //             console.log("Signature: ", txId);
//             let final = await finalized(txId,10,4);
//             if(final != "finalized"){
//               $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
//               $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
//               $("#cover_message").html("Error Creating ALT!");
//               setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);  
//               return;
//             }
//           } 
//           catch(error) {
//             $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
//             $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
//             $("#cover_message").html("Sorry, Transaction Error!");
//             setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);          
//             console.log("Error: ", error);
//             error = JSON.stringify(error);
//             error = JSON.parse(error);
//             console.log("Error Logs: ", error);
//             return;
//           }
          
//           // await new Promise(_ => setTimeout(_, 10000));
          
//           lookupTableAccount = await connection.getAddressLookupTable(lookupTableAddress).then((res) => res.value);
          
//         } 
//         else{
          lookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res) => res.value);    
        // }
        
        if(!lookupTableAccount) {
          $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
          $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
          $("#cover_message").html("Could not fetch ALT!");
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
          return;
        }
        
        let instructions = null;
        if (createTokenATA == true) {
          instructions = [createTokenATAIx, initializeSwapIx];
        } 
        else {
          instructions = [initializeSwapIx];
        }
       
        // ***
        let priority = $("#priority_nft").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions,lookupTableAccount)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions,lookupTableAccount)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([lookupTableAccount]);
        let tx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(tx);
//           let txId = await connection.sendTransaction(signedTx);
          let txId = await connection.sendRawTransaction(signedTx.serialize(),{     
            skipPreflight: true,
            maxRetries: 0 
          });
          //           console.log("Signature: ", txId);
          $(".share_sig span.swap_val").html(txId);
          $("#cover_message").html("Deploying Contract...");
          let final = await finalized(txId,10,4);
          if(final != "finalized"){
            $(".swap_cancel_b, #swap_deploy").prop("disabled", false);
            $("#swap_deploying").removeClass("provisioning").html("3. Deploy");
            $("#cover_message").html("Oh No! Something Happened!");
            $(".share_id .swap_val").html(conf.host + "/swap/" + $("#create_a_id").val() + "-" + $("#create_b_id").val());
            setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");},3000);
            return;
          }
          $("#cover_message").html("Complete!");
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
        
      }
      
      else if ($("#a_type").val() == "pNFT") {
        
        let isSwap = true;
        let mint = $("#create_a_id").val();
        let swapMint = "11111111111111111111111111111111";
        
        if ($("#b_type").val() == "pNFT" && $("#create_b_id").val() != "") {
          swapMint = $("#create_b_id").val();
        } 
        else {
          isSwap = false;
        }
        let taker = $("#create_b_owner").val();
        let swapLamports = $("#sol_request").val() * conf.billion;
        let swapTokenMint = null;
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
          for (let i = 0; i < decimals; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else if ($("#usdc_request").val() > 0) {
          swapTokenMint = new solanaWeb3.PublicKey(conf.usdc);
          swapTokens = $("#usdc_request").val();
          for (let i = 0; i < 6; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else {
          console.log("requesting no tokens");
          swapTokenMint = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        }
        
        swapTokens = swapTokens * multiplier;
        swapTokens = parseInt(swapTokens);
        console.log("swapTokens", swapTokens);
        
        let pNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PNFT_PROGRAM);
        let splATAProgramId = new solanaWeb3.PublicKey(conf.SPL_ATA_PROGRAM_ID);
        let mplAuthRulesProgramId = new solanaWeb3.PublicKey(conf.MPL_RULES_PROGRAM_ID);
        let mplAuthRulesAccount = new solanaWeb3.PublicKey(conf.MPL_RULES_ACCT);        
        let mplProgramid = new solanaWeb3.PublicKey(conf.METADATA_PROGRAM_ID);
        
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")],pNFTSwapProgramId);
        console.log("Program State PDA: ", programStatePDA[0].toString());
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]);
        let devTreasury = null;
        let mcDegensTreasury = null;
        if (programState != null) {
            let encodedProgramStateData = programState.data;
            let decodedProgramStateData = PROGRAM_STATE_PNFT.decode(encodedProgramStateData);
            console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
            console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
            console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
            console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
            console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
            devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
            mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
        }
        
        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],pNFTSwapProgramId);
        console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());
        
        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"), 
        new solanaWeb3.PublicKey(mint).toBytes(), new solanaWeb3.PublicKey(swapMint).toBytes()], pNFTSwapProgramId);
        console.log("Swap State PDA: ", swapStatePDA[0].toString());     
        
        let providerMintATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(mint),
        provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("providerMintATA ", providerMintATA.toString());
        
        let tokenMetadataPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), 
        mplProgramid.toBytes(), new solanaWeb3.PublicKey(mint).toBytes()], mplProgramid);
        console.log("Token Metadata PDA: ", tokenMetadataPDA[0].toString());
        
        let tokenMasterEditionPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), 
        mplProgramid.toBytes(), new solanaWeb3.PublicKey(mint).toBytes(), Buffer.from("edition")], mplProgramid);
        console.log("Token Master Edition PDA: ", tokenMasterEditionPDA[0].toString());        
        
        let tokenDestinationATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(mint),swapVaultPDA[0],
        true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("tokenDestinationATA ", tokenDestinationATA.toString());        
        
        let tokenRecordPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), mplProgramid.toBytes(),
        new solanaWeb3.PublicKey(mint).toBytes(),Buffer.from("token_record"),new solanaWeb3.PublicKey(providerMintATA).toBytes()],mplProgramid,);
        console.log("Token Record PDA ", tokenRecordPDA[0].toString());        
        
        let tokenRecordDesinationPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), mplProgramid.toBytes(),
        new solanaWeb3.PublicKey(mint).toBytes(), Buffer.from("token_record"),new solanaWeb3.PublicKey(tokenDestinationATA).toBytes()],mplProgramid,);
        console.log("Token Record Destination PDA ", tokenRecordDesinationPDA[0].toString());
        
        let createSwapMintATA = false;
        let createSwapMintATAIx = null;        
        let swapMintATA = null;
        let takerMintInfo = null;        
        if (swapMint != "11111111111111111111111111111111") {
          swapMintATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(swapMint),
          provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          console.log("Taker Mint ATA: ", swapMintATA.toString());
          let takerMintInfo = await connection.getAccountInfo(swapMintATA).catch(function(){});
          if (takerMintInfo == null) {
            createSwapMintATA = true;
            createSwapMintATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey,swapMintATA,
            provider.publicKey,new solanaWeb3.PublicKey(swapMint),splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,)
            console.log("Create Taker Mint ATA Ix: ", createSwapMintATAIx); 
          } 
          else {
            createSwapMintATA = false;
          }
        }        
        console.log("createSwapMintATA: ", createSwapMintATA); 
        
        let createSwapTokenATA = false;
        let createSwapTokenATAIx = null;
        let swapTokenATA = null;
        let swapTokenInfo = null;
        if(swapTokenMint != "11111111111111111111111111111111"){
          swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,provider.publicKey,false,
          splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          console.log("Swap Token ATA: ", swapTokenATA.toString());         
          swapTokenInfo = await connection.getAccountInfo(swapTokenATA).catch(function(){});        
          if (swapTokenInfo == null) {
            createSwapTokenATA = true;
            createSwapTokenATAIx = splToken.createAssociatedTokenAccountInstruction(provider.publicKey,swapTokenATA,
            provider.publicKey,swapTokenMint,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            console.log("createSwapTokenATAIx: ", createSwapTokenATAIx);
          }
          else {
            createSwapTokenATA = false;
          }
        }
        console.log("createSwapTokenATA: ", createSwapTokenATA); 
        
        let totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8;
        console.log("totalSize", totalSize);

        let uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 0;
        
        if (isSwap == true) {
            uarray[counter++] = 1;
        } 
        else {
            uarray[counter++] = 0;
        }
        
        let arr;
        let byteArray;
        
        let takerb58 = bs58.decode(taker);
        arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
        for (let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}

        let takerMintb58 = bs58.decode(swapMint);
        arr = Array.prototype.slice.call(Buffer.from(takerMintb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }

        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for ( var index = 0; index < byteArray.length; index ++ ) {
            let byte = swapLamports & 0xff;
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
        for ( let index = 0; index < byteArray.length; index ++ ) {
            let byte = swapTokens & 0xff;
            byteArray [ index ] = byte;
            swapTokens = (swapTokens - byte) / 256 ;
        }
        for (let i = 0; i < byteArray.length; i++) {
            uarray[counter++] = byteArray[i];
        }
        
        console.log("Contract Data: ", uarray);
        
        let initializeSwapIx = new solanaWeb3.TransactionInstruction({
          programId: pNFTSwapProgramId,
          data: Buffer.from(uarray),
          keys: [
            { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
            { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
            { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
            { pubkey: providerMintATA, isSigner: false, isWritable: true }, // 4
            { pubkey: new solanaWeb3.PublicKey(mint), isSigner: false, isWritable: false }, // 5
            { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 6
            { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 7
            { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 8
            { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 9
            { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 10
            { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 11
            { pubkey: solanaWeb3.SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 12
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 13
            { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 14
            { pubkey: mplProgramid, isSigner: false, isWritable: false }, // 15
            { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 16
            { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 17
            { pubkey: devTreasury, isSigner: false, isWritable: true }, // 18
            { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 19
          ]
        });
        console.log("Initialize Swap Ix: ", initializeSwapIx);        
        
        let instructions = null;
        if (createSwapMintATA === true && createSwapTokenATA === true) {
          console.log("instructions 1");
          instructions = [createSwapMintATAIx, createSwapTokenATAIx, initializeSwapIx];
        } 
        else if (createSwapMintATA === true) {
          console.log("instructions 2");
          instructions = [createSwapMintATAIx, initializeSwapIx];
        } 
        else if ( createSwapTokenATA === true) {
          console.log("instructions 3");
          instructions = [createSwapTokenATAIx, initializeSwapIx];
        } 
        else {
          console.log("instructions 4");
          instructions = [initializeSwapIx];
        }
        
        // ***
        let priority = $("#priority_nft").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([]);
        let tx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***        
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(tx);
          let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
            skipPreflight: true,
            maxRetries: 0 
          });
          console.log("Signature: ", signature);
          $(".share_sig span.swap_val").html(signature);
          $("#cover_message").html("Processing...");
          let final = await finalized(signature,10,4);
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
          $("#cover_message").html("Complete!");
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
//           error = JSON.stringify(error);
//           error = JSON.parse(error);
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
        
      }

      else if ($("#a_type").val() == "CORE") {

        let isSwap = true;
        let asset = $("#create_a_id").val();
        let swapAsset = "11111111111111111111111111111111";
        let taker = $("#create_b_owner").val();
        let swapLamports = $("#sol_request").val() * conf.billion;
        let swapTokenMint;

        if ($("#b_type").val() == "CORE" && $("#create_b_id").val() != "") {
          swapAsset = $("#create_b_id").val();
        } 
        else {
          isSwap = false;
        }

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
          for (let i = 0; i < decimals; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else if ($("#usdc_request").val() > 0) {
          swapTokenMint = new solanaWeb3.PublicKey(conf.usdc);
          swapTokens = $("#usdc_request").val();
          for (let i = 0; i < 6; i++) {
            multiplier = multiplier * 10;
          }
        } 
        else {
          console.log("requesting no tokens");
          swapTokenMint = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        }
        
        swapTokens = swapTokens * multiplier;
        swapTokens = parseInt(swapTokens);
        
        let coreNftSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CORE_PROGRAM);
        let mplCoreProgramId = new solanaWeb3.PublicKey(conf.CORE_PROGRAM_ID);
        
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")],coreNftSwapProgramId);
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error){});

        let devTreasury = null;
        let mcDegensTreasury = null;
        if (programState != null) {
          let encodedProgramStateData = programState.data;
          let decodedProgramStateData = PROGRAM_STATE_CORE.decode(encodedProgramStateData);
          console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
          console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
          console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
          console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
          console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
          devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
          mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
        }

        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],coreNftSwapProgramId);
        console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"), new solanaWeb3.PublicKey(asset).toBytes(), new solanaWeb3.PublicKey(swapAsset).toBytes()],coreNftSwapProgramId);
        console.log("Swap State PDA: ", swapStatePDA[0].toString());

        let axiosInstance = axios.create({baseURL: conf.cluster,});
        let getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:asset},});      
        let assetCollection = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        if(typeof getAsset.data.result.grouping != "undefined" && typeof getAsset.data.result.grouping[0] != "undefined" && typeof getAsset.data.result.grouping[0].group_value != "undefined"){
          assetCollection = getAsset.data.result.grouping[0].group_value;
        }

        let createSwapTokenATA = null; 
        let createSwapTokenATAIx = null;

        if(swapTokens > 0){
          let swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          console.log("Swap Token ATA: ", swapTokenATA.toString());    
          let tokenAccount = null;
          tokenAccount = await connection.getAccountInfo(swapTokenATA).catch(function(){});
          if (tokenAccount == null) {
            createSwapTokenATA = true;
            createSwapTokenATAIx = splToken.createAssociatedTokenAccountInstruction(
                provider.publicKey,
                swapTokenATA,
                provider.publicKey,
                swapTokenMint,
                splToken.TOKEN_PROGRAM_ID,
                splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
            )
            console.log("Create Swap Token ATA Ix: ", createSwapTokenATAIx); 
          } 
          else {
            createSwapMintATA = false;
          }
        }

        var totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8;
        console.log("totalSize", totalSize);

        var uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 0;

        if (isSwap == true) {
          uarray[counter++] = 1;
        } 
        else {
          uarray[counter++] = 0;
        }

        let takerb58 = bs58.decode(taker);
        var arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }
            
        let swapAssetb58 = bs58.decode(swapAsset);
        var arr = Array.prototype.slice.call(Buffer.from(swapAssetb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }
    
        var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for ( var index = 0; index < byteArray.length; index ++ ) {
            var byte = swapLamports & 0xff;
            byteArray [ index ] = byte;
            swapLamports = (swapLamports - byte) / 256 ;
        }
        for (let i = 0; i < byteArray.length; i++) {
            uarray[counter++] = byteArray[i];
        }
    
        let swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
        var arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58), 0);
        for (let i = 0; i < arr.length; i++) {
            uarray[counter++] = arr[i];
        }
    
        var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for ( var index = 0; index < byteArray.length; index ++ ) {
            var byte = swapTokens & 0xff;
            byteArray [ index ] = byte;
            swapTokens = (swapTokens - byte) / 256 ;
        }
        for (let i = 0; i < byteArray.length; i++) {
            uarray[counter++] = byteArray[i];
        }
    
        console.log("Contract Data: ", uarray);

        let keys = [
          { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
          { pubkey: new solanaWeb3.PublicKey(asset), isSigner: false, isWritable: true }, // 4
          { pubkey: new solanaWeb3.PublicKey(assetCollection), isSigner: false, isWritable: true }, // 5
          { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 6
          { pubkey: mplCoreProgramId, isSigner: false, isWritable: false }, // 7
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 8
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 9
        ];
        const initializeSwapIx = new solanaWeb3.TransactionInstruction({programId:coreNftSwapProgramId,data:Buffer.from(uarray),keys:keys});
        console.log("Initialize Swap Ix: ", initializeSwapIx);

        let instructions;
        if (createSwapTokenATA == true) {
          instructions = [createSwapTokenATAIx,initializeSwapIx];
        } 
        else {
          instructions = [initializeSwapIx];
        }

        // ***
        let priority = $("#priority_nft").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([]);
        let tx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***        
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(tx);
          let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
            skipPreflight: true,
            maxRetries: 0 
          });
          console.log("Signature: ", signature);
          $(".share_sig span.swap_val").html(signature);
          $("#cover_message").html("Processing...");
          let final = await finalized(signature,10,4);
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
          $("#cover_message").html("Complete!");
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

      let balance_error = false;
      if ($("#fulfil_sol_request").val() > 0 && $(".sol_balance").html() <= 0 || $(".sol_balance").html() <= $("#fulfil_sol_request").val()) {
        balance_error = "Not enough SOL!";
      }

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
        
        let assetId = $("#fulfil_a_id").val();
        let swapAssetId = $("#fulfil_b_id").val();
        if(swapAssetId==""){
          let swapAssetId = "11111111111111111111111111111111";
        }     
        
        let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);     
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-program-state")],cNFTSwapProgramId);

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
        let getAssetProof = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAssetProof",id:"rpd-op-123",params:{id:assetId},});
        let treeAccount = await splAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new solanaWeb3.PublicKey(getAssetProof.data.result.tree_id),);  
        const treeAuthorityPDA = treeAccount.getAuthority();
        const canopyDepth = treeAccount.getCanopyDepth();
        
        let proof = getAssetProof.data.result.proof
        .slice(0, getAssetProof.data.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
        .map((node) => ({pubkey: new solanaWeb3.PublicKey(node),isWritable: false,isSigner: false,}));
        
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
          
          let swapTreeAccount = await splAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new solanaWeb3.PublicKey(getSwapAssetProof.data.result.tree_id),);
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
        if (getAsset.data.result.ownership.owner == swapVaultPDA || swapLeafOwner == swapVaultPDA) { 
//           console.log("One or both cNFTs are already in the Swap Vault");
          return;
        }            
        let providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        let initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,swapInitializer,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        var totalSize = 1 + 32 + 32 + 1 + 1;

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
          { pubkey: mplBubblegum.PROGRAM_ID, isSigner: false, isWritable: false }, // 9
          { pubkey: splAccountCompression.PROGRAM_ID, isSigner: false, isWritable: false }, // 10
          { pubkey: splAccountCompression.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 11
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
        
        let swapcNFTsIx = new solanaWeb3.TransactionInstruction({programId:cNFTSwapProgramId,data:Buffer.from(uarray),keys:keys,});
        
        let msLookupTable = new solanaWeb3.PublicKey(conf.system_alt);
        let lookupTableAccount = null;
        
        if (proof.length + swapProof.length > conf.max_proofs) {
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
          
//           let computePriceIx = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: parseInt($("#priority_nft_exec").val()),});
//           let mcswapMessageV0 = new solanaWeb3.TransactionMessage({
//               payerKey: provider.publicKey,
//               recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
//               instructions: [computePriceIx, createALTIx, extendALTIx],
//           }).compileToV0Message([msLookupTableAccount]);
          
          let createALTTx = new solanaWeb3.VersionedTransaction(mcswapMessageV0);
          
          try {
            let signedTx = await provider.signTransaction(createALTTx);
//             let txId = await connection.sendTransaction(signedTx);
            let txId = await connection.sendRawTransaction(signedTx.serialize(),{     
              skipPreflight: true,
              maxRetries: 0 
            });
//             console.log("Signature: ", txId);
            $("#cover_message").html("Creating ALT...");
            let final = await finalized(txId,10,4);
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
        
        // *****************************************************************************
        let instructions = [swapcNFTsIx];
        
        // ***
        let priority = $("#priority_nft_exec").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions,lookupTableAccount)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions,lookupTableAccount)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([lookupTableAccount]);
        let tx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***         
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(tx);
          let txId = await connection.sendRawTransaction(signedTx.serialize(),{     
              skipPreflight: true,
              maxRetries: 0 
            });
          $(".share_fulfil_sig .swap_val").html(txId);
          $("#cover_message").html("Executing Contract...");
          let final = await finalized(txId,10,4);
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
          $("#cover_message").html("Success!...");
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          $(".fulfil_e").removeClass("active_swap");
          $(".fulfil_f").addClass("active_swap");
          $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
          $(".mcprofile_close, #wallet_refresh").show();
          $("ul[data-id='" + $("#fulfil_b_id").val() + "']").remove();
          $("#wallet_cnfts span.count").html('(' + $("ul[data-type='cnft']:visible").length + ')');
          $("#c_type, #d_type, #fulfil_a_id, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request, #fulfil_a_owner, #fulfil_b_owner, #fulfil_b_id").val("");
          $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
          $(".fee_fulfil_sig .swap_val, .fee_fulfil_alt .swap_val").html("");
          $(".proofs_, .proofs_view").html("").hide();
          history.pushState("", "", '/');
          $("#cnft_collection").html("");
          $(".types_").val("");
          $("#wallet_refresh").click();
          setTimeout(function(){
            $("#smart_tool_reload").click();
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
          },3000);          
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

        let mint = $("#fulfil_a_id").val();
        let swapMint = "11111111111111111111111111111111";
        if ($("#fulfil_b_id").val() != "") {
          swapMint = $("#fulfil_b_id").val();
        }

        // SPL_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        // axiosInstance = axios.create({baseURL:conf.cluster});
        // getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:mint},}); 
        // if(typeof getAsset.data.result.mint_extensions != "undefined"){
        //   SPL_PROGRAM = splToken.TOKEN_2022_PROGRAM_ID;
        //   console.log("Using Token 2022");
        //   console.log(SPL_PROGRAM.toString());
        // }
        // else{
        //   console.log("Using SPL Token");
        //   console.log(SPL_PROGRAM.toString());
        // }

        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")], NFTSwapProgramId);
        
        let feeLamports = null;
        let mcDegensTreasury = null;   
        let devTreasury = null;
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error) {});        
        if(programState != null){
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = PROGRAM_STATE_NFT.decode(encodedProgramStateData);
            console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
            console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
            console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
            console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
            console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
            mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
            devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
            feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le").toString();
        }        
        else{
          $("#cover_message").html("Program Error!");
          $("#swap_execute").prop("disabled", false);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          setTimeout(() => {
            $("#cover_message").html("");
            $("#cover").fadeOut(400);
          }, 3000);
          return;
        }
        
        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], NFTSwapProgramId);
        
        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"), new solanaWeb3.PublicKey(mint).toBytes(), new solanaWeb3.PublicKey(swapMint).toBytes()], NFTSwapProgramId);
        
        let swapState = null;
        swapState = await connection.getAccountInfo(swapStatePDA[0])
        .catch(function(error) {
          $("#cover_message").html("Program Error!");
          $("#swap_execute").prop("disabled", false);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          setTimeout(() => {
            $("#cover_message").html("");
            $("#cover").fadeOut(400);
          }, 3000);
          return;
        });
        
        let isSwap = true;
        let initializer = null;
        let tempMintAccount = null;
        let initializerMint = null;
        let swapLamports = null;
        let swapTokenMint = null;
        let swapTokens = null;

        if (swapState != null) {
          let encodedSwapStateData = swapState.data;
          let decodedSwapStateData = SWAP_NFT_STATE.decode(encodedSwapStateData);
          console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
          console.log("swapState - utime", new BN(decodedSwapStateData.utime, 10, "le").toString());  // HERE
          console.log("swapState - is_swap: ", new BN(decodedSwapStateData.is_swap, 10, "le").toString());
          console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
          console.log("swapState - initializer_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint).toString());
          console.log("swapState - temp_mint_account: ", new solanaWeb3.PublicKey(decodedSwapStateData.temp_mint_account).toString());
          console.log("swapState - taker: ", new solanaWeb3.PublicKey(decodedSwapStateData.taker).toString());
          console.log("swapState - swap_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_mint).toString());
          console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
          console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
          console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
          if (new BN(decodedSwapStateData.is_swap, 10, "le") == 0) {
              isSwap = false
          }
          initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
          initializerMint = new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint);
          tempMintAccount = new solanaWeb3.PublicKey(decodedSwapStateData.temp_mint_account);
          swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
          swapTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint);
          swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
        }
        else {
          $("#cover_message").html("Contract does not exist!");
          $("#swap_execute").prop("disabled", false);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          setTimeout(() => {
            $("#cover_message").html("");
            $("#cover").fadeOut(400);
          }, 3000);
          return;
        }
        
        let SPL_PROGRAM = null;
        let axiosInstance = null;

        SPL_PROGRAM_2 = null;
        SPL_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        axiosInstance = axios.create({baseURL:conf.cluster});
        getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:initializerMint.toString()},}); 
        if(typeof getAsset.data.result.mint_extensions != "undefined"){
          SPL_PROGRAM = splToken.TOKEN_2022_PROGRAM_ID;
          console.log("Using Token 2022");
          console.log(SPL_PROGRAM.toString());
        }
        else{
          console.log("Using SPL Token");
          console.log(SPL_PROGRAM.toString());
        }
        let createInitializerMintATA = null;
        let createInitializerMintATAIx = null;
        let initializerMintATA = await splToken.getAssociatedTokenAddress(
        initializerMint,
        provider.publicKey,
        false,
        SPL_PROGRAM,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Initializer Mint ATA: ", initializerMintATA.toString());        
        let ataACCT = null;
        SPL_PROGRAM_2 = SPL_PROGRAM;
        ataACCT = await connection.getAccountInfo(initializerMintATA)
        .catch(function(error){});
        if (ataACCT == null) {
          createInitializerMintATA = true;
          createInitializerMintATAIx = splToken.createAssociatedTokenAccountInstruction(
          provider.publicKey,
          initializerMintATA,
          provider.publicKey,
          initializerMint,
          SPL_PROGRAM,
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        }
        else {
          createInitializerMintATA = false;
        }
        console.log("createInitializerMintATA: "+createInitializerMintATA);
        
        let providerSwapMintATA = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        let initializerSwapMintATA = new solanaWeb3.PublicKey("11111111111111111111111111111111");

        if (swapMint != "11111111111111111111111111111111") {  
          SPL_PROGRAM = splToken.TOKEN_PROGRAM_ID;
          axiosInstance = axios.create({baseURL:conf.cluster});
          getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:swapMint},}); 
          if(typeof getAsset.data.result.mint_extensions != "undefined"){
            SPL_PROGRAM = splToken.TOKEN_2022_PROGRAM_ID;
            console.log("Using Token 2022");
            console.log(SPL_PROGRAM.toString());
          }
          else{
            console.log("Using SPL Token");
            console.log(SPL_PROGRAM.toString());
          }
          providerSwapMintATA = await splToken.getAssociatedTokenAddress(
          new solanaWeb3.PublicKey(swapMint),provider.publicKey,false,
          SPL_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);          
          initializerSwapMintATA = await splToken.getAssociatedTokenAddress(
          new solanaWeb3.PublicKey(swapMint),initializer,false,
          SPL_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          console.log("Initializer Swap Mint ATA: ", initializerSwapMintATA.toString());
        }
        
        let providerMintATA = await splToken.getAssociatedTokenAddress(
        initializerMint,provider.publicKey,false,
        SPL_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);        

        let providerTokenATA = await splToken.getAssociatedTokenAddress(
        swapTokenMint,provider.publicKey,false,
        splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        
        let initializerTokenATA = await splToken.getAssociatedTokenAddress(
        swapTokenMint,initializer,false,
        splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        
        let totalSize = 1;
        console.log("totalSize", totalSize);
        
        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 1;
        console.log("Data: ", uarray);        
        
        let keys = [
          { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
          { pubkey: initializer, isSigner: false, isWritable: true }, // 1
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 4
          { pubkey: tempMintAccount, isSigner: false, isWritable: true }, // 5
          { pubkey: providerMintATA, isSigner: false, isWritable: true }, // 6
          { pubkey: new solanaWeb3.PublicKey(mint), isSigner: false, isWritable: true }, // 7  HERE
          { pubkey: providerSwapMintATA, isSigner: false, isWritable: true }, // 8
          { pubkey: initializerSwapMintATA, isSigner: false, isWritable: true }, // 9
          { pubkey: new solanaWeb3.PublicKey(swapMint), isSigner: false, isWritable: true }, // 10  HERE
          { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 11
          { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 12
          { pubkey: swapTokenMint, isSigner: false, isWritable: true }, // 13  HERE
          { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 14
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 15
          { pubkey: new solanaWeb3.PublicKey(conf.TOKEN_2022_PROGRAM_ID), isSigner: false, isWritable: false }, // 16  HERE
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 17
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 18
        ];
        console.log("keys: ", keys);

        let swapNFTsIx = new solanaWeb3.TransactionInstruction({
          programId: NFTSwapProgramId,
          data: Buffer.from(uarray),        
          keys: keys
        });
        console.log("Swap NFTs Ix: ", swapNFTsIx);
        
        let lookupTable = new solanaWeb3.PublicKey("BT4AUPXSxvbDrzSt3LLkE3Jd5s8R3fBSxJuyicyEMYH3"); // mainnet    
        let lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
        
        let instructions = null;
        if (createInitializerMintATA == true) {
          console.log("2");
          instructions = [createInitializerMintATAIx,swapNFTsIx,];
        } 
        else {
          console.log("4");
          instructions = [swapNFTsIx,];
        }
        console.log("instructions: ", instructions);

        // ***
        let priority = $("#priority_nft_exec").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions,lookupTableAccount)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions,lookupTableAccount)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([lookupTableAccount]);
        let swapNFTSTx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(swapNFTSTx);
          let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
            skipPreflight: true,
            maxRetries: 0 
          });
          $(".share_fulfil_sig .swap_val").html(signature);
          $("#cover_message").html("Processing...");
          let final = await finalized(signature,10,4);
          if(final != "finalized"){
            $("#cover_message").html(final);
            setTimeout(function(){
              $("#cover_message").html("");
              $("#cover").fadeOut(400);
              $("#swap_execute").prop("disabled", false);
              $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
            },3000);
            return;
          }
          $("#cover_message").html("Success!");
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          $(".fulfil_e").removeClass("active_swap");
          $(".fulfil_f").addClass("active_swap");
          $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
          $(".mcprofile_close, #wallet_refresh").show();
          $("ul[data-id='" + $("#fulfil_b_id").val() + "']").remove();
          $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
          $("#fulfil_a_id, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request, #fulfil_a_owner, #fulfil_b_owner, #fulfil_b_id").val("");
          $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
          $(".proofs_").hide();
          history.pushState("", "", '/');
          $(".types_").val("");
          $("#nft_collection").html("");
          $("#wallet_refresh").click();
          setTimeout(function(){
            $("#smart_tool_reload").click();
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
          },3000);
        } 
        catch (error) {
          console.log("Error: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error Logs: ", error);
          $("#cover_message").html("");
          $("#cover").fadeOut(400);
          $("#swap_execute").prop("disabled", false);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          return;
        }
        
      }
      
      if ($("#c_type").val() == "pNFT") {
        
        let mint = $("#fulfil_a_id").val();
        let takerMint = "11111111111111111111111111111111";
        if ($("#fulfil_b_id").val() != "") {
          takerMint = $("#fulfil_b_id").val();
        }

        let pNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PNFT_PROGRAM);
        let splATAProgramId = new solanaWeb3.PublicKey(conf.SPL_ATA_PROGRAM_ID);
        let mplAuthRulesProgramId = new solanaWeb3.PublicKey(conf.MPL_RULES_PROGRAM_ID);
        let mplAuthRulesAccount = new solanaWeb3.PublicKey(conf.MPL_RULES_ACCT);
        let mplProgramid = new solanaWeb3.PublicKey(conf.METADATA_PROGRAM_ID);

        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")],pNFTSwapProgramId);
        console.log("Program State PDA: ", programStatePDA[0].toString());
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error){});        

        let devTreasury = null;
        let mcDegensTreasury = null;
        if (programState != null) {
          const encodedProgramStateData = programState.data;
          const decodedProgramStateData = PROGRAM_STATE_PNFT.decode(encodedProgramStateData);
          console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
          console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
          console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
          console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
          console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
          devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
          mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
        }
        else {
          console.log("Program State Not Initialized");    
          return;
        }        
        
        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],pNFTSwapProgramId);
        console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());        
        
        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new solanaWeb3.PublicKey(mint).toBytes(),new solanaWeb3.PublicKey(takerMint).toBytes()],pNFTSwapProgramId);
        console.log("Swap State PDA: ", swapStatePDA[0].toString());        
        
        let swapState = null;
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});        
        
        let initializer = null;
        let initializerTokenMint = null
        let takerTokenMint = null;
        let swapTokenMint = null;
        if (swapState != null) {
          let encodedSwapStateData = swapState.data;
          let decodedSwapStateData = SWAP_PNFT_STATE.decode(encodedSwapStateData);
          console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
          console.log("swapState - utime", new BN(decodedSwapStateData.utime, 10, "le").toString());
          console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
          console.log("swapState - initializer_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint).toString());
          console.log("swapState - swap_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_mint).toString());
          console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
          console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
          console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
          initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
          initializerTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint);
          takerTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_mint);
          swapTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint);
        } 
        else {
          console.log("Swap Not Initialized");    
          return;
        }        
        
        let vaultTokenMintATA = await splToken.getAssociatedTokenAddress(initializerTokenMint,swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Vault Token Mint ATA ", vaultTokenMintATA.toString());        
        
        let tokenMetadataPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), mplProgramid.toBytes(), initializerTokenMint.toBytes()],mplProgramid);
        console.log("Token Metadata PDA ", tokenMetadataPDA[0].toString());   
        
        let tokenMasterEditionPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(),Buffer.from("edition")],mplProgramid);
        console.log("Token Master Edition PDA ", tokenMasterEditionPDA[0].toString());        
        
        let tokenDestinationATA = await splToken.getAssociatedTokenAddress(initializerTokenMint,
        provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Token Destination ATA ", tokenDestinationATA.toString());        
        
        let createTokenDestinationATA = null;
        let createTokenDestinationATAIx = null;
        let DestinationResponse = null;
        DestinationResponse = await connection.getAccountInfo(tokenDestinationATA)
        if(DestinationResponse == null){
          createTokenDestinationATA = true;
          createTokenDestinationATAIx = splToken.createAssociatedTokenAccountInstruction(
          provider.publicKey,
          tokenDestinationATA,
          provider.publicKey,
          initializerTokenMint,
          splToken.TOKEN_PROGRAM_ID,
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          console.log("Create Token Destination ATA Ix: ", createTokenDestinationATAIx);
        }
        else{
          createTokenDestinationATA = false;
        }
        
        let tokenRecordPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), 
        mplProgramid.toBytes(),initializerTokenMint.toBytes(), 
        Buffer.from("token_record"),vaultTokenMintATA.toBytes()],mplProgramid,);
        console.log("Token Record PDA ", tokenRecordPDA[0].toString());        
        
        let tokenRecordDesinationPDA = solanaWeb3.PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(), 
        Buffer.from("token_record"),tokenDestinationATA.toBytes()],mplProgramid,);
        console.log("Token Record Destination PDA ", tokenRecordDesinationPDA[0].toString());        
        
        let takerTokenMintATA = await splToken.getAssociatedTokenAddress(
        takerTokenMint,provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Taker Token Mint ATA ", takerTokenMintATA.toString());        
        
        let takerTokenMetadataPDA = solanaWeb3.PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), mplProgramid.toBytes(), takerTokenMint.toBytes()],mplProgramid);
        console.log("Taker Token Metadata PDA: ", takerTokenMetadataPDA[0].toString());        
        
        let takerTokenMasterEditionPDA = solanaWeb3.PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),Buffer.from("edition")],mplProgramid);
        console.log("Taker Token Master Edition PDA: ", takerTokenMasterEditionPDA[0].toString());        
        
        let takerTokenDestinationATA = await splToken.getAssociatedTokenAddress(takerTokenMint,
        initializer,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Taker Token Destination ATA ", takerTokenDestinationATA.toString());        
        
        let takerTokenRecordPDA = solanaWeb3.PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),
        Buffer.from("token_record"),takerTokenMintATA.toBytes()],mplProgramid,);
        console.log("Taker Token Record PDA ", takerTokenRecordPDA[0].toString());
        
        let takerTokenRecordDesinationPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),
        takerTokenMint.toBytes(),Buffer.from("token_record"),takerTokenDestinationATA.toBytes()],mplProgramid,);
        console.log("Taker Token Record Destination PDA ", tokenRecordDesinationPDA[0].toString());        
        
        let swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,
        provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Swap Token ATA: ", swapTokenATA.toString());        
        
        let initializerSwapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,
        initializer,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        console.log("Initializer Swap Token ATA: ", initializerSwapTokenATA.toString());
        
        let totalSize = 1;
        console.log("totalSize", totalSize);

        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 1; // 1 = nft_swap SwapNFTs instruction
        console.log("Data: ", uarray);        
        
        let swapPNFTsIx = new solanaWeb3.TransactionInstruction({
            programId: pNFTSwapProgramId,data: Buffer.from(uarray),
            keys: [
              { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
              { pubkey: initializer, isSigner: false, isWritable: true }, // 1
              { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
              { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 3
              { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
              { pubkey: vaultTokenMintATA, isSigner: false, isWritable: true }, // 5
              { pubkey: initializerTokenMint, isSigner: false, isWritable: false }, // 6
              { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 7
              { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 8
              { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 9
              { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 10
              { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 11
              { pubkey: takerTokenMintATA, isSigner: false, isWritable: true }, // 12
              { pubkey: takerTokenMint, isSigner: false, isWritable: false }, // 13
              { pubkey: takerTokenMetadataPDA[0], isSigner: false, isWritable: true }, // 14
              { pubkey: takerTokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 15
              { pubkey: takerTokenDestinationATA, isSigner: false, isWritable: true }, // 16
              { pubkey: takerTokenRecordPDA[0], isSigner: false, isWritable: true }, // 17
              { pubkey: takerTokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 18
              { pubkey: swapTokenATA, isSigner: false, isWritable: true }, // 19
              { pubkey: initializerSwapTokenATA, isSigner: false, isWritable: true }, // 20            
              { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 21
              { pubkey: solanaWeb3.SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 22
              { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 23
              { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 25
              { pubkey: mplProgramid, isSigner: false, isWritable: false }, // 25
              { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 26
              { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 27
              { pubkey: devTreasury, isSigner: false, isWritable: true }, // 28
              { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 29
            ]
        });
        console.log("Swap pNFTs Ix: ", swapPNFTsIx);
        
        let instructions = null;
        if (createTokenDestinationATA == true) {
          instructions = [createTokenDestinationATAIx,swapPNFTsIx];
        } 
        else {
          instructions = [swapPNFTsIx];
        }
        
        // ***
        let priority = $("#priority_nft_exec").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([]);
        let swapPNFTsTx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***        
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(swapPNFTsTx);
          let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
            skipPreflight: true,
            maxRetries: 0 
          });
          console.log("signature: ", signature);
          $(".share_fulfil_sig .swap_val").html(signature);
          $("#cover_message").html("Processing...");
          let final = await finalized(signature,10,4);
          if(final != "finalized"){
            $("#cover_message").html(final);
            setTimeout(function(){
              $("#cover_message").html("");
              $("#cover").fadeOut(400);
              $("#swap_execute").prop("disabled", false);
              $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
            },3000);
            return;
          }
          $("#cover_message").html("Success!");
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          $(".fulfil_e").removeClass("active_swap");
          $(".fulfil_f").addClass("active_swap");
          $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
          $(".mcprofile_close, #wallet_refresh").show();
          $("ul[data-id='" + $("#fulfil_b_id").val() + "']").remove();
          $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
          $("#fulfil_a_id, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request, #fulfil_a_owner, #fulfil_b_owner, #fulfil_b_id").val("");
          $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
          $(".proofs_").hide();
          history.pushState("", "", '/');
          $("#nft_collection").html("");
          $(".types_").val("");
          $("#wallet_refresh").click();
          setTimeout(function(){
            $("#smart_tool_reload").click();
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
          },3000);
        } 
        catch (error) {
          console.log("Error: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error Logs: ", error);
          $("#cover_message").html("");
          $("#cover").fadeOut(400);
          $("#swap_execute").prop("disabled", false);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          return;
        }        
        
      }

      if ($("#c_type").val() == "CORE") {

       
        // core
        let coreNftSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CORE_PROGRAM);
        let mplCoreProgramId = new solanaWeb3.PublicKey(conf.CORE_PROGRAM_ID);  
        let asset = $("#fulfil_a_id").val();
        let swapAsset = "11111111111111111111111111111111";
        if ($("#fulfil_b_id").val() != ""){swapAsset = $("#fulfil_b_id").val();}
        let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")],coreNftSwapProgramId);
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(){});
        let devTreasury = null;
        let mcDegensTreasury = null;
        if (programState != null) {
          let encodedProgramStateData = programState.data;
          let decodedProgramStateData = PROGRAM_STATE_CORE.decode(encodedProgramStateData);
          console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
          console.log("programState - fee_lamports: ", new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
          console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
          console.log("programState - dev_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury).toString());
          console.log("programState - mcdegens_treasury: ", new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
          devTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.dev_treasury);
          mcDegensTreasury = new solanaWeb3.PublicKey(decodedProgramStateData.mcdegens_treasury);
        }
        let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],coreNftSwapProgramId);
        let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new solanaWeb3.PublicKey(asset).toBytes(),new solanaWeb3.PublicKey(swapAsset).toBytes()],coreNftSwapProgramId);        
        let swapState = null;
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
        let isSwap = true;
        let initializer = null;
        let initializerAsset = null;
        let swapLamports = null;
        let swapTokenMint = null;
        let swapTokens = null;
        if (swapState != null) {
          let encodedSwapStateData = swapState.data;
          let decodedSwapStateData = SWAP_CORE_STATE.decode(encodedSwapStateData);
          console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
          console.log("swapState - utime", new BN(decodedSwapStateData.utime, 10, "le").toString());
          console.log("swapState - is_swap: ", new BN(decodedSwapStateData.is_swap, 10, "le").toString());
          console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
          console.log("swapState - initializer_asset: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer_asset).toString());
          console.log("swapState - taker: ", new solanaWeb3.PublicKey(decodedSwapStateData.taker).toString());
          console.log("swapState - swap_asset: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_asset).toString());
          console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
          console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
          console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());
          if(new BN(decodedSwapStateData.is_swap, 10, "le") == 0){isSwap = false;}
          initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer);
          initializerAsset = new solanaWeb3.PublicKey(decodedSwapStateData.initializer_asset);
          swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
          swapTokenMint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint);
          swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
        } 
        else {
          console.log("Swap Not Initialized");    
          return;
        }
        let getAsset;
        let axiosInstance = axios.create({baseURL: conf.cluster,});
        getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:asset},});
        let assetCollection = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        if(typeof getAsset.data.result.grouping != "undefined" && typeof getAsset.data.result.grouping[0] != "undefined" && typeof getAsset.data.result.grouping[0].group_value != "undefined"){
          assetCollection = getAsset.data.result.grouping[0].group_value;
        }
        getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:swapAsset},});
        let swapAssetCollection = new solanaWeb3.PublicKey("11111111111111111111111111111111");
        if(typeof getAsset.data.result.grouping != "undefined" && typeof getAsset.data.result.grouping[0] != "undefined" && typeof getAsset.data.result.grouping[0].group_value != "undefined"){
          swapAssetCollection = getAsset.data.result.grouping[0].group_value;
        }
        let providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        let initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        let totalSize = 1;
        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 1;
        let keys = [
          { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
          { pubkey: initializer, isSigner: false, isWritable: true }, // 1
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 3
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
          { pubkey: new solanaWeb3.PublicKey(asset), isSigner: false, isWritable: true }, // 5
          { pubkey: new solanaWeb3.PublicKey(assetCollection), isSigner: false, isWritable: true }, // 6
          { pubkey: new solanaWeb3.PublicKey(swapAsset), isSigner: false, isWritable: true }, // 7
          { pubkey: new solanaWeb3.PublicKey(swapAssetCollection), isSigner: false, isWritable: true }, // 8
          { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 9
          { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 10
          { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 11
          { pubkey: mplCoreProgramId, isSigner: false, isWritable: false }, // 12
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 13
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 14
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 15
        ];
        let swapNFTsIx = new solanaWeb3.TransactionInstruction({programId:coreNftSwapProgramId,data:Buffer.from(uarray),keys:keys});
        let instructions = [swapNFTsIx];
        
        // ***
        let priority = $("#priority_nft_exec").val(); 
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions,false)}));
        instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions,false)}));
        let messageV0 = new solanaWeb3.TransactionMessage({
          payerKey: provider.publicKey,
          recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
          instructions: instructions,
        }).compileToV0Message([]);
        let swapNFTSTx = new solanaWeb3.VersionedTransaction(messageV0);
        // ***
        
        try {
          $("#cover_message").html("Requesting Approval...");
          let signedTx = await provider.signTransaction(swapNFTSTx);
          let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
            skipPreflight: true,
            maxRetries: 0 
          });
          $(".share_fulfil_sig .swap_val").html(signature);
          $("#cover_message").html("Processing...");
          let final = await finalized(signature,10,4);
          if(final != "finalized"){
            $("#cover_message").html(final);
            setTimeout(function(){
              $("#smart_tool_reload").click();
              $("#cover_message").html("");
              $("#cover").fadeOut(400);
              $("#swap_execute").prop("disabled", false);
              $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
            },3000);
            return;
          }
          $("#cover_message").html("Success!");
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          $(".fulfil_e").removeClass("active_swap");
          $(".fulfil_f").addClass("active_swap");
          $("#nav_shop, #nav_compose, .ass_donate, .ass_swap, #wallet_disconnect, #wallet_refresh, #wallet_nfts, #wallet_cnfts, .mcprofile_close").prop("disabled", false);
          $(".mcprofile_close, #wallet_refresh").show();
          $("ul[data-id='" + $("#fulfil_b_id").val() + "']").remove();
          $("#wallet_nfts span.count").html('(' + $("ul[data-type='nft']:visible").length + ')');
          $("#fulfil_a_id, #fulfil_sol_request, #fulfil_pikl_request, #fulfil_usdc_request, #fulfil_a_owner, #fulfil_b_owner, #fulfil_b_id").val("");
          $(".fulfil_img_a, .fulfil_img_b").attr("src", "/img/img-placeholder.png");
          $(".proofs_").hide();
          history.pushState("", "", '/');
          $(".types_").val("");
          $("#nft_collection").html("");
          $("#wallet_refresh").click();
          setTimeout(function(){
            $("#cover").fadeOut(400);
            $("#cover_message").html("");
          },3000);
        } 
        catch (error) {
          console.log("Error: ", error);
          error = JSON.stringify(error);
          error = JSON.parse(error);
          console.log("Error Logs: ", error);
          $("#cover_message").html("");
          $("#cover").fadeOut(400);
          $("#swap_execute").prop("disabled", false);
          $("#swap_executing").removeClass("provisioning").html("2. Execute Contract");
          return;
        }

      }
      
    } 
    else {
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
    $("#fullsize_img").removeClass("animate__zoomIn").addClass("animate__zoomOut");
    setTimeout(() => {
      $("#cover").fadeOut(400);
      $("#fullsize_img").remove();
    }, 800);
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
//       try {
      
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
      let getAsset = await axiosInstance.post(conf.cluster, {
        jsonrpc: "2.0",
        method: "getAsset",
        id: "rpd-op-123",
        params: {
          id: assetId
        },
      });
      
      if (typeof getAsset == "undefined" || typeof getAsset.data.result == "undefined") {
        reset_viewer();
        return;
      }
      
      let getswapAsset = null;
      let swapStatePDA = null;
      
      let is_pnft = false;
      if(getAsset.data.result.interface == "ProgrammableNFT"){
        is_pnft = true;
      }
      
      let is_cnft = false;
      let img_a = getAsset.data.result.content.files[0].uri;
      let owner_a = getAsset.data.result.ownership.owner;
      is_cnft = getAsset.data.result.compression.compressed;
      
      let is_core = false;
      if(getAsset.data.result.interface == "MplCoreAsset"){
        is_core = true;
      }

      let is_nft = false;
      if(is_pnft == false && is_cnft == false && is_core == false){
        is_nft = true;
      }

      $("img.fulfil_img_a").attr("src", img_a);
      
      let owner_b = false;
      let swapAssetId = $("#fulfil_b_id").val();
      if (swapAssetId != "") {
        getswapAsset = await axiosInstance.post(conf.cluster, {
          jsonrpc: "2.0",
          method: "getAsset",
          id: "rpd-op-123",
          params: {
            id: swapAssetId
          },
        });
        let img_b = getswapAsset.data.result.content.files[0].uri;
        owner_b = getswapAsset.data.result.ownership.owner;
        $("img.fulfil_img_b").attr("src", img_b);
        $("#fulfil_b_owner").val(owner_b);
      }
      
      let swapState = null;
      if (getswapAsset != null && is_pnft === true) {
        let pNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PNFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
        new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()], pNFTSwapProgramId);
        $("#c_type, #d_type").val("pNFT");
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){});
      }
      else if (getswapAsset != null && is_nft === true) {
        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
        new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()], NFTSwapProgramId);
        $("#c_type, #d_type").val("NFT");
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){});
      } 
      else if (getswapAsset != null && is_core === true) {
        let CORESwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CORE_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
        new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()], CORESwapProgramId);
        $("#c_type, #d_type").val("CORE");
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){});
      } 
      else if (getswapAsset != null && is_cnft === true) {
        let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),
        new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapAssetId).toBytes()], cNFTSwapProgramId);
        $("#c_type, #d_type").val("cNFT");
        $("#proofs_c, #proofs_d").html("Fetching...").show();
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){});
      }
      else if (getswapAsset == null && is_pnft === true) {
        let pNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PNFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
          new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey("11111111111111111111111111111111").toBytes()
        ], pNFTSwapProgramId);
        $("#c_type").val("pNFT");
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){});
      }
      else if (getswapAsset == null && is_nft === true) {
        let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
        new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey("11111111111111111111111111111111").toBytes()
        ], NFTSwapProgramId);
        $("#c_type").val("NFT");
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){});
      }
      else if (getswapAsset == null && is_cnft === true) {
        let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
        swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),
        new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey("11111111111111111111111111111111").toBytes()
        ], cNFTSwapProgramId);
        $("#c_type").val("cNFT");
        $("#proofs_c").html("Fetching...").show();
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){});
      } 
            
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

        if (is_pnft === true) {
          decodedSwapStateData = SWAP_PNFT_STATE.decode(encodedSwapStateData);
        }
        else if (is_nft === true) {
          decodedSwapStateData = SWAP_NFT_STATE.decode(encodedSwapStateData);
        }
        else if (is_cnft === true) {
          decodedSwapStateData = SWAP_CNFT_STATE.decode(encodedSwapStateData);
          if (swapAssetId == "") {
            owner_b = new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString();
            $("#fulfil_b_owner").val(owner_b);
          }
        }
        else if (is_core === true) {
          decodedSwapStateData = SWAP_CORE_STATE.decode(encodedSwapStateData);
        }
        
        swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le").toString();
        swapLamports = parseInt(swapLamports);
        let sol = swapLamports / conf.billion;
        balance = parseFloat(sol).toFixed(9);
        splt = balance.split(".");
        formatted = splt[0].toLocaleString("en-US");
        formatted = formatted + "." + splt[1];
        $("#fulfil_sol_request").val(formatted);

        let swap_mint = new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString();
        let decimals = 9;
        if (swap_mint == conf.usdc) {
          decimals = 6;
        } 
        else {
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
        } 
        else {
          for (let i = 0; i < spl_tokens.length; i++) {
            let item = spl_tokens[i];
            if (item.address == swap_mint) {
              $(".fulfil_c_pikl .custom_symbol").html(item.symbol);
              break;
            }
          }
          $(".fulfil_c_pikl").attr("data-id", swap_mint);
          $("#fulfil_pikl_request").val(formatted);
          $("#fulfil_usdc_request").val("0.000000");
        }
        
        // check that the initializer matches the connected wallet and display reversal option
        let initializer = new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString();
        $("#fulfil_a_owner").val(initializer);
        
        let proofs_required = false;
        if (is_cnft === true) {
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

        if (initializer == provider.publicKey.toString()) {
          $(".fulfil_g").show().addClass("active_swap");
          $("#swap_reverse").prop("disabled", false);
          $("#swap_execute").prop("disabled", true);
        } 
        else {
          $("#fulfil_g").hide().removeClass("active_swap");
          $("#swap_reverse").prop("disabled", true);
        }
        $("#scroll_wrapper").getNiceScroll().resize();
        
        // check that the approving party wallet matches and enable approve option if so
        let owner;
        if (is_pnft === true || is_nft === true || is_core === true) {
          owner = new solanaWeb3.PublicKey(decodedSwapStateData.taker).toString();
        }
        else if (is_cnft === true) {
          owner = new solanaWeb3.PublicKey(decodedSwapStateData.swap_leaf_owner).toString();
        }

        if (owner == provider.publicKey.toString()) {
          $(".fulfil_e").addClass("active_swap");
          $("#swap_execute").prop("disabled", false);
          $("#mc_swap_viewer .mc_title").html("Contract Ready!");
          setTimeout(() => {
            $("#mc_swap_viewer .mc_title").html("Contract Details");
          }, 3000);
        }
        else {
          $("#mc_swap_viewer .mc_title").html("Contract Details");
        }

      } 
      else {
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
//         console.log("do_cmc", do_cmc);
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
//                 console.log(allow_execute);
              }
            }).catch(function() {
              allow_execute = false;
            });

          // verify the user is the intended executioner
          if (provider.publicKey.toString() != ids[1] || provider.publicKey.toString() != spl_taker.toString()) {
            allow_execute = false;
//             console.log(allow_execute);
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
          let min_sol = conf.solmin;
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
//           $("#priority_spl_exec").val(await estimate_priority());
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
    if(!$("#swap_deploy").prop("disabled")){return;}
    $("#cover, #swap_token_options, #token_options_close").fadeIn(400);
    setTimeout(function(){
      $("#swap_token_list").getNiceScroll().resize();
    },500);
  });

  // close token choice
  $(document).delegate("#token_options_close", "click", async function() {
    $("#token_options_close").hide();
    $("#cover, #swap_token_options").fadeOut(400);
    $("#temp_sol, #temp_usdc").remove();
    setTimeout(function(){
      $("#swap_token_list ul").show();
      $("#swap_token_filter").val("");
    },500)
  });

  // swap reverse
  $(document).delegate("#swap_reverse", "click", async function() {

    $(this).prop("disabled", true);
    $("#cover").fadeIn(400);
    $("#cover_message").html("Preparing Transaction...");
    
    provider = wallet_provider();
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    let assetId = $("#fulfil_a_id").val();
    let swapMint = $("#fulfil_b_id").val();
    if (swapMint == "") {
      swapMint = "11111111111111111111111111111111";
    }

    if ($("#c_type").val() == "cNFT") {
      let cNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
      let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"), new solanaWeb3.PublicKey(assetId).toBytes(), new solanaWeb3.PublicKey(swapMint).toBytes()], cNFTSwapProgramId);
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
      let treeAccount = await splAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,
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
      let swapAssetIdb58 = bs58.decode(swapMint);
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
          pubkey: mplBubblegum.PROGRAM_ID,
          isSigner: false,
          isWritable: false
        }, // 5
        {
          pubkey: splAccountCompression.PROGRAM_ID,
          isSigner: false,
          isWritable: false
        }, // 6
        {
          pubkey: splAccountCompression.SPL_NOOP_PROGRAM_ID,
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
      
      let instructions = [reverseSwapIx];
      
      // ***
      let priority = $("#priority_nft_exec").val(); 
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
      let messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: instructions,
      }).compileToV0Message([]);
      let reverseSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
      // ***
      
      try {
        $("#cover_message").html("Requesting Approval...");
        let signedTx = await provider.signTransaction(reverseSwapTx);
        let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
          skipPreflight: true,
          maxRetries: 0 
        });
        $("#cover_message").html("Processing...");
        let final = await finalized(signature,10,4);
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
        $("#cover_message").html("Contract Closed!");
        $(".share_fulfil_sig .swap_val").html(signature);
        $(".fulfil_g").removeClass("active_swap").hide();
        $("#wallet_refresh").click();
        setTimeout(() => {
          $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
          $("#c_type, #d_type").val("");
          $(".proofs_view").html("").hide();
          swap_viewer();
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
          $("#smart_tool_reload").click();
          $("#swap_reverse").prop("disabled", false);
        }, 3000);        
      } 
      catch (error) {
        swap_viewer();
        $("#cover_message").html("Transaction Error!");
        setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_reverse").prop("disabled",false);},3000);
        return;
      }
      
    }
    
    else if ($("#c_type").val() == "NFT") {

      let NFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);

      let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], NFTSwapProgramId);
      //console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

      let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"), new solanaWeb3.PublicKey(assetId).toBytes(),
          new solanaWeb3.PublicKey(swapMint).toBytes()
        ], NFTSwapProgramId);
      //console.log("Swap State PDA: ", swapStatePDA[0].toString());
      
      let swapState = null;
      swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error) {});
      
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
        keys: [
          { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 1
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
          { pubkey: tempMintAccount, isSigner: false, isWritable: true }, // 3
          { pubkey: initializerMintATA, isSigner: false, isWritable: true }, // 4
          { pubkey: new solanaWeb3.PublicKey(mint), isSigner: false, isWritable: true }, // 6  HERE
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 7
          { pubkey: new solanaWeb3.PublicKey(conf.TOKEN_2022_PROGRAM_ID), isSigner: false, isWritable: false }, // 8  HERE
        ]
      });
      console.log("Reverse Swap Ix: ", reverseSwapIx);
      
      let instructions = [reverseSwapIx];
      
      // ***
      let priority = $("#priority_nft_exec").val(); 
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
      let messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: instructions,
      }).compileToV0Message([]);
      let reverseSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
      // ***
      
      try {
        $("#cover_message").html("Requesting Approval...");
        let signedTx = await provider.signTransaction(reverseSwapTx);
        let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
          skipPreflight: true,
          maxRetries: 0 
        });
        //console.log("Signature: ", signature);
        //console.log(`https://solscan.io/tx/${signature}`);
        $("#cover_message").html("Processing...");
        let final = await finalized(signature,10,4);
        if(final != "finalized"){
          $("#cover_message").html(final);
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_reverse").prop("disabled",false);},3000);
          return;
        }
        history.pushState("", "", '/');
        $(".fulfil_g").removeClass("active_swap").hide();
        $("#cover_message").html("Contract Closed!");
        $("#wallet_refresh").click();
        setTimeout(() => {
          $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
          swap_viewer();
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
          $("#smart_tool_reload").click();
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
    
    else if ($("#c_type").val() == "pNFT") {
      
      let mint = assetId;
      let pNFTSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PNFT_PROGRAM);
      let splATAProgramId = new solanaWeb3.PublicKey(conf.SPL_ATA_PROGRAM_ID);
      let mplAuthRulesProgramId = new solanaWeb3.PublicKey(conf.MPL_RULES_PROGRAM_ID);
      let mplAuthRulesAccount = new solanaWeb3.PublicKey(conf.MPL_RULES_ACCT);
      let mplProgramid = new solanaWeb3.PublicKey(conf.METADATA_PROGRAM_ID);
      
      let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],pNFTSwapProgramId);
      console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());
      
      let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"), 
      new solanaWeb3.PublicKey(mint).toBytes(),new solanaWeb3.PublicKey(swapMint).toBytes()],pNFTSwapProgramId);
      console.log("Swap State PDA: ", swapStatePDA[0].toString());      
      
      let swapState = null;
      swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error) {});      
      
      if (swapState != null) {
        let encodedSwapStateData = swapState.data;
        let decodedSwapStateData = SWAP_PNFT_STATE.decode(encodedSwapStateData);
        console.log("swapState - is_initialized: ", decodedSwapStateData.is_initialized);
        console.log("swapState - initializer: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer).toString());
        console.log("swapState - initializer_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.initializer_mint).toString());
        console.log("swapState - swap_mint: ", new solanaWeb3.PublicKey(decodedSwapStateData.swap_mint).toString());
        console.log("swapState - swap_lamports", new BN(decodedSwapStateData.swap_lamports, 10, "le").toString());
        console.log("swapState - swap_token_mint", new solanaWeb3.PublicKey(decodedSwapStateData.swap_token_mint).toString());
        console.log("swapState - swap_tokens", new BN(decodedSwapStateData.swap_tokens, 10, "le").toString());        
      } 
      else {
        console.log("Swap Not Initialized");    
        return;
      }      
      
      let vaultMintATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(mint),
      swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
      console.log("Vault Mint ATA ", vaultMintATA.toString());
      
      let tokenMetadataPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"),
      mplProgramid.toBytes(), new solanaWeb3.PublicKey(mint).toBytes()], mplProgramid);
      console.log("Token Metadata PDA: ", tokenMetadataPDA[0].toString());      
      
      let tokenMasterEditionPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), 
      mplProgramid.toBytes(), new solanaWeb3.PublicKey(mint).toBytes(), Buffer.from("edition")],mplProgramid);
      console.log("Token Master Edition PDA: ", tokenMasterEditionPDA[0].toString());      
      
      let tokenDestinationATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(mint),
      provider.publicKey,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
      console.log("Token Destination ATA ", tokenDestinationATA);  
      
      let tokenRecordPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), 
      new solanaWeb3.PublicKey(mplProgramid).toBytes(), new solanaWeb3.PublicKey(mint).toBytes(), 
      Buffer.from("token_record"), new solanaWeb3.PublicKey(vaultMintATA).toBytes()], mplProgramid,);
      console.log("Token Record PDA ", tokenRecordPDA[0].toString());      
      
      let tokenRecordDesinationPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("metadata"), 
      new solanaWeb3.PublicKey(mplProgramid).toBytes(),new solanaWeb3.PublicKey(mint).toBytes(), 
      Buffer.from("token_record"),new solanaWeb3.PublicKey(tokenDestinationATA).toBytes()], mplProgramid,);
      console.log("Token Record Destination PDA ", tokenRecordDesinationPDA[0].toString());      
      
      let totalSize = 1 + 32;
      console.log("totalSize", totalSize);
      
      let uarray = new Uint8Array(totalSize);    
      let counter = 0;    
      uarray[counter++] = 2; // 2 = nft_swap ReverseSwap instruction
      
      let swapMintb58 = bs58.decode(swapMint);
      var arr = Array.prototype.slice.call(Buffer.from(swapMintb58), 0);
      for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
      }
      
      console.log("Data: ", uarray);
      
      let reverseSwapIx = new solanaWeb3.TransactionInstruction({
        programId: pNFTSwapProgramId,
        data: Buffer.from(
            uarray
        ),
        keys: [
            { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
            { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
            { pubkey: vaultMintATA, isSigner: false, isWritable: true }, // 3
            { pubkey: new solanaWeb3.PublicKey(mint), isSigner: false, isWritable: false }, // 4
            { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 5
            { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 6
            { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 7
            { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 8
            { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 9
            { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 10
            { pubkey: solanaWeb3.SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 11
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
            { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 13
            { pubkey: new solanaWeb3.PublicKey(mplProgramid), isSigner: false, isWritable: false }, // 14
            { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 15
            { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 16
        ]
    });
      console.log("Reverse Swap Ix: ", reverseSwapIx);
      
      // *****************************************************************************
      let instructions = [reverseSwapIx];
      
      // ***
      let priority = $("#priority_nft_exec").val(); 
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
      let messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: instructions,
      }).compileToV0Message([]);
      let reverseSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
      // ***
      
      try {
      $("#cover_message").html("Requesting Approval...");
      let signedTx = await provider.signTransaction(reverseSwapTx);
      let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
        skipPreflight: true,
        maxRetries: 0 
      });
      //console.log("Signature: ", signature);
      //console.log(`https://solscan.io/tx/${signature}`);
      $("#cover_message").html("Processing...");
      let final = await finalized(signature,10,4);
      if(final != "finalized"){
        $("#cover_message").html(final);
        setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_reverse").prop("disabled",false);},3000);
        return;
      }
      history.pushState("", "", '/');
      $(".fulfil_g").removeClass("active_swap").hide();
      $("#cover_message").html("Contract Closed!");
      $("#wallet_refresh").click();
      setTimeout(() => {
        $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
        swap_viewer();
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
        $("#smart_tool_reload").click();
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
    
    else if ($("#c_type").val() == "CORE") {
      
      let asset = assetId;
      let swapAsset = swapMint;
      let coreNftSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CORE_PROGRAM);
      let mplCoreProgramId = new solanaWeb3.PublicKey(conf.CORE_PROGRAM_ID);
      let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],coreNftSwapProgramId);
      let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new solanaWeb3.PublicKey(asset).toBytes(),new solanaWeb3.PublicKey(swapAsset).toBytes()],coreNftSwapProgramId);
      let axiosInstance = axios.create({baseURL: conf.cluster,});
      let getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:asset},}); 
      let assetCollection = new solanaWeb3.PublicKey("11111111111111111111111111111111");
      if(typeof getAsset.data.result.grouping != "undefined" && typeof getAsset.data.result.grouping[0] != "undefined" && typeof getAsset.data.result.grouping[0].group_value != "undefined"){
        assetCollection = getAsset.data.result.grouping[0].group_value;
      }
      let totalSize = 1 + 32;
      let uarray = new Uint8Array(totalSize);    
      let counter = 0;    
      uarray[counter++] = 2;
      let swapAssetb58 = bs58.decode(swapAsset);
      let arr = Array.prototype.slice.call(Buffer.from(swapAssetb58), 0);
      for(let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}
      let keys = [
        { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
        { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
        { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
        { pubkey: new solanaWeb3.PublicKey(asset), isSigner: false, isWritable: true }, // 3
        { pubkey: new solanaWeb3.PublicKey(assetCollection), isSigner: false, isWritable: true }, // 4
        { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 5
        { pubkey: mplCoreProgramId, isSigner: false, isWritable: false }, // 6
      ];
      let reverseSwapIx = new solanaWeb3.TransactionInstruction({programId:coreNftSwapProgramId,data:Buffer.from(uarray),keys:keys});
      let instructions = [reverseSwapIx];
      // ***
      let priority = $("#priority_nft_exec").val(); 
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
      instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
      let messageV0 = new solanaWeb3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
        instructions: instructions,
      }).compileToV0Message([]);
      let reverseSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
      // ***
      try {
        $("#cover_message").html("Requesting Approval...");
        let signedTx = await provider.signTransaction(reverseSwapTx);
        let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
          skipPreflight: true,
          maxRetries: 0 
        });
        $("#cover_message").html("Processing...");
        let final = await finalized(signature,10,4);
        if(final != "finalized"){
          $("#cover_message").html(final);
          setTimeout(function(){$("#cover").fadeOut(400);$("#cover_message").html("");$("#swap_reverse").prop("disabled",false);},3000);
          return;
        }
        history.pushState("", "", '/');
        $(".fulfil_g").removeClass("active_swap").hide();
        $("#cover_message").html("Contract Closed!");
        $("#wallet_refresh").click();
        setTimeout(() => {
          $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
          swap_viewer();
          $("#cover").fadeOut(400);
          $("#cover_message").html("");
          $("#smart_tool_reload").click();
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
//       if ($("#wallet_view").is(":visible")) {
//         let pathArray = window.location.pathname.split('/swap/');
//         if (typeof pathArray[1] == "undefined") {
//           $("#wallet_view").click();
//         } 
//       }
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
    let token_image = $(this).find(".token_image").attr("src");
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
      setTimeout(function(){
        $("#swap_token_list ul").show();
        $("#swap_token_filter").val("");
      },500)
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
          $(".pikl_icon").attr("src", token_image);
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
            $("#spl_field_1").focus();
          } else if (selected == "spl_choice_2") {
            $("#spl_img_2").attr("src", img).removeClass("spl_default");
            $("#spl_field_2").prop("disabled", false);
            $("#spl_field_2").focus();
          } else if (selected == "spl_choice_3") {
            $("#spl_img_3").attr("src", img).removeClass("spl_default");
            $("#spl_field_3, #spl_choice_4").prop("disabled", false);
            $("#spl_owner").prop("disabled", false);
            $(".swap_spl_c").addClass("active_spl");
            $("#spl_field_3").focus();
          } else if (selected == "spl_choice_4") {
            $("#spl_img_4").attr("src", img).removeClass("spl_default");
            $("#spl_field_4").prop("disabled", false);
            $("#spl_field_4").focus();
          }
          selected = false;
          $("#cover").fadeOut(400);
          setTimeout(() => {
            $("#temp_sol, #temp_usdc").remove();
            $("#swap_token_list ul").show();
            $("#swap_token_filter").val("");
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
      temp_choices += '<ul data-cmc="5426" id="temp_sol" data-id="sol"><li><img class="token_image" src="/img/sol.png"></li><li class="token_symbol">(SOL)</li><li class="token_name">SOL</li></ul>';
    }
    temp_choices += '<ul data-cmc="3408" id="temp_usdc" data-id="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"><li><img class="token_image" src="/img/usdc.png"></li><li class="token_symbol">(USDC)</li><li class="token_name">USD Coin</li></ul>';
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
      
      if(typeof resp.value[0] != "undefined"){
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
      }
      else{
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
            // console.log("debug 4");
            min_sol = min_sol + rent;
            // console.log("rent 4", rent);
          }
        }
      }

      // check sol balance
      let ok_sol = true;
      let balance_sol = await connection.getBalance(provider.publicKey)
        .then(function(data) {
          if (data < (min_sol + conf.solmin)) {
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
//         $("#priority_spl").val(await estimate_priority());
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
          "color": "#fffa9c"
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
    let cp = copy("McSwap OTC : " + $("#vrs").html())
      .then(function() {
        let openifo = confirm("McSwap OTC : " + $("#vrs").html() + "\nClick Ok for more details.\nClick Cancel to stay here.");
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

    let is_22_1 = false;
    let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
    if(token1Amount > 0){
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token1Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 1 is using Token 2022");
        console.log(SPL_PROGRAM_1.toString());
        is_22_1 = true;
      }
      else{
        console.log("Token 1 is using SPL Token");
        console.log(SPL_PROGRAM_1.toString());
      }
    }
    let is_22_2 = false;
    let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
    if(token2Amount > 0){
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token2Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 2 is using Token 2022");
        console.log(SPL_PROGRAM_2.toString());
        is_22_2 = true;
      }
      else{
        console.log("Token 2 is using SPL Token");
        console.log(SPL_PROGRAM_2.toString());
      }
    }
    let is_22_3 = false;
    let SPL_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
    console.log("TOKEN 3 MINT", token3Mint);
    if(token3Amount > 0){ 
      if(token3Mint == "11111111111111111111111111111111"){
        console.log("Token 3 is SOL");
      }
      else{
        axiosInstance = axios.create({baseURL:conf.cluster});
        getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token3Mint},}); 
        if(typeof getAsset.data.result.mint_extensions != "undefined"){
          SPL_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
          console.log("Token 3 is using Token 2022");
          console.log(SPL_PROGRAM_3.toString());
          is_22_3 = true;
        }
        else{
          console.log("Token 3 is using SPL Token");
          console.log(SPL_PROGRAM_3.toString());
        }
      }
    }
    let is_22_4 = false;
    let SPL_PROGRAM_4 = splToken.TOKEN_PROGRAM_ID;
    if(token4Amount > 0){ 
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token4Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_4 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 4 is using Token 2022");
        console.log(SPL_PROGRAM_4.toString());
        is_22_4 = true;
      }
      else{
        console.log("Token 4 is using SPL Token");
        console.log(SPL_PROGRAM_4.toString());
      }
    }

    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");

    let tokenSwapProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_SPL_PROGRAM);

    let programStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("program-state")], tokenSwapProgramId);
    console.log("Program State PDA: ", programStatePDA[0].toString());

    let programState = null;
    programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error){});

    let pickleMint = null;
    let feeChips = null;
    let devTreasury = null;
    let mcDegensTreasury = null;
    let temp_rent = null;
    if (programState != null) {
      const encodedProgramStateData = programState.data;
      const decodedProgramStateData = PROGRAM_STATE_SPL.decode(encodedProgramStateData);
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
    } 
    else {
      console.log("Program State Not Initialized");
      return;
    }

    let swapVaultPDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], tokenSwapProgramId);
    console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());

    let swapStatePDA = solanaWeb3.PublicKey.findProgramAddressSync([Buffer.from("swap-state"),
    provider.publicKey.toBytes(), new solanaWeb3.PublicKey(taker).toBytes()
    ], tokenSwapProgramId);
    console.log("Swap State PDA: ", swapStatePDA[0].toString());
    
    let swapState = null;
    swapState = await connection.getAccountInfo(new solanaWeb3.PublicKey(swapStatePDA[0]));
    console.log("swapState: ", swapState);
    
    if(swapState != null){
      console.log("Error: ", "A pending contract for these two parties already exist!");
      $("#cover_message").html("A pending contract for these two parties already exist!");
      $("#spl_deploy, .spl_choice, .spl_field, #spl_owner").prop("disabled", false);
      $(".swap_spl_a, .swap_spl_b").addClass("active_spl");
      setTimeout(() => {
        $("#cover").fadeOut(400);
        $("#cover_message").html("");
      }, 3000);
      return;
    }
    
    let providerPickleATA = await splToken.getAssociatedTokenAddress(new solanaWeb3.PublicKey(pickleMint),provider.publicKey, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );

    // token 1 ***************************************************************************
    let extensionTypes_1 = [];
    let tempToken1Account = new solanaWeb3.Keypair();
    let createTempToken1AccountIx = null;
    let initTempToken1AccountIx = null;
    let transferToken1Ix = null;
    let transferFeeBasisPoints_1 = null;
    if (token1Amount > 0) {

      let providerToken1ATA = await splToken.getAssociatedTokenAddress(
        new solanaWeb3.PublicKey(token1Mint),
        provider.publicKey, 
        false, 
        SPL_PROGRAM_1, 
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );

      let accountInfo = await connection.getAccountInfo(providerToken1ATA);
      console.log("Temp Token1 Account: ", tempToken1Account.publicKey.toString());
      let space;
      if(is_22_1===true){space=accountInfo.space;}else{space=splToken.AccountLayout.span;}
      temp_rent=await connection.getMinimumBalanceForRentExemption(space);
      createTempToken1AccountIx = solanaWeb3.SystemProgram.createAccount({
        programId: SPL_PROGRAM_1,
        space: space,
        lamports: temp_rent,
        fromPubkey: provider.publicKey,
        newAccountPubkey: tempToken1Account.publicKey,
      });
      console.log("Create Temp Token1 Account Ix: ", createTempToken1AccountIx);

      initTempToken1AccountIx = splToken.createInitializeAccountInstruction(
        tempToken1Account.publicKey,
        new solanaWeb3.PublicKey(token1Mint), 
        tempToken1Account.publicKey, 
        SPL_PROGRAM_1
      );
      console.log("Init Temp Token1 Account Ix: ", initTempToken1AccountIx);

      let mintAccountInfo_1 = await splToken.getMint(connection, new solanaWeb3.PublicKey(token1Mint), "confirmed", SPL_PROGRAM_1);
      if(is_22_1===true){
        console.log("mintAccountInfo_1 ", mintAccountInfo_1);
        extensionTypes_1 = splToken.getExtensionTypes(mintAccountInfo_1.tlvData);
        console.log("extensionTypes_1", extensionTypes_1);
        if(extensionTypes_1.includes(1)){
          let extensionTransferFeeConfig = splToken.getExtensionData(splToken.ExtensionType.TransferFeeConfig, mintAccountInfo_1.tlvData);    
          let data_1 = splToken.TransferFeeConfigLayout.decode(extensionTransferFeeConfig);
          transferFeeBasisPoints_1 = data_1.newerTransferFee.transferFeeBasisPoints;
          console.log("transferFeeBasisPoints_1", transferFeeBasisPoints_1);
        }
      }

      transferToken1Ix = splToken.createTransferCheckedInstruction(
        providerToken1ATA,
        new solanaWeb3.PublicKey(token1Mint),
        tempToken1Account.publicKey,
        provider.publicKey,
        token1Amount,
        mintAccountInfo_1.decimals,
        provider.publicKey,
        SPL_PROGRAM_1,
      );
      console.log("Transfer Token1 Ix: ", transferToken1Ix);

    }
    // token 1 ***************************************************************************

    // token 2 ***************************************************************************
    let extensionTypes_2 = [];
    let tempToken2Account = new solanaWeb3.Keypair();
    let createTempToken2AccountIx = null;
    let initTempToken2AccountIx = null;
    let transferToken2Ix = null;
    let transferFeeBasisPoints_2 = null;
    if (token2Amount > 0) {

      let providerToken2ATA = await splToken.getAssociatedTokenAddress(
        new solanaWeb3.PublicKey(token2Mint),
        provider.publicKey, 
        false, 
        SPL_PROGRAM_2, 
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      let accountInfo = await connection.getAccountInfo(providerToken2ATA);
      console.log("Temp Token2 Account: ", tempToken2Account.publicKey.toString());
      let space;
      if(is_22_2===true){space=accountInfo.space;}else{space=splToken.AccountLayout.span;}
      temp_rent=await connection.getMinimumBalanceForRentExemption(space);
      createTempToken2AccountIx = solanaWeb3.SystemProgram.createAccount({
        programId: SPL_PROGRAM_2,
        space: space,
        lamports: temp_rent,
        fromPubkey: provider.publicKey,
        newAccountPubkey: tempToken2Account.publicKey,
      });
      console.log("Create Temp Token2 Account Ix: ", createTempToken2AccountIx);

      initTempToken2AccountIx = splToken.createInitializeAccountInstruction(
        tempToken2Account.publicKey,
        new solanaWeb3.PublicKey(token2Mint), 
        tempToken2Account.publicKey, 
        SPL_PROGRAM_2
      );
      console.log("Init Temp Token2 Account Ix: ", initTempToken2AccountIx);

      let mintAccountInfo_2 = await splToken.getMint(connection, new solanaWeb3.PublicKey(token2Mint), "confirmed", SPL_PROGRAM_2);
      if(is_22_2===true){
        console.log("mintAccountInfo_2 ", mintAccountInfo_2);
        extensionTypes_2 = splToken.getExtensionTypes(mintAccountInfo_2.tlvData);
        console.log("extensionTypes_2", extensionTypes_2);
        if(extensionTypes_2.includes(1)){
          let extensionTransferFeeConfig = splToken.getExtensionData(splToken.ExtensionType.TransferFeeConfig, mintAccountInfo_2.tlvData);    
          let data_2 = splToken.TransferFeeConfigLayout.decode(extensionTransferFeeConfig);
          transferFeeBasisPoints_2 = data_2.newerTransferFee.transferFeeBasisPoints;
          console.log("transferFeeBasisPoints_2", transferFeeBasisPoints_2);
        }
      }

      transferToken2Ix = splToken.createTransferCheckedInstruction(
        providerToken2ATA,
        new solanaWeb3.PublicKey(token2Mint),
        tempToken2Account.publicKey,
        provider.publicKey,
        token2Amount,
        mintAccountInfo_2.decimals,
        provider.publicKey,
        SPL_PROGRAM_2,
      );
      console.log("Transfer Token2 Ix: ", transferToken2Ix);

    }
    // token 2 ***************************************************************************

    // token 3 ***************************************************************************
    let createToken3ATA = null;
    let createToken3ATAIx = null;
    let token3ATA = null;
    if (token3Mint != "11111111111111111111111111111111") {

      token3ATA = await splToken.getAssociatedTokenAddress(
        new solanaWeb3.PublicKey(token3Mint),
        provider.publicKey, 
        false, 
        SPL_PROGRAM_3, 
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      console.log("Token3 ATA: ", token3ATA.toString());

      let accountInfo = await connection.getAccountInfo(token3ATA);
      if (accountInfo == null) {
        createToken3ATA = true;
        createToken3ATAIx = splToken.createAssociatedTokenAccountInstruction(
          provider.publicKey, 
          token3ATA,
          provider.publicKey, 
          new solanaWeb3.PublicKey(token3Mint), 
          SPL_PROGRAM_3, 
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log("Create Token3 ATA Ix: ", createToken3ATAIx);
      } else {
        createToken3ATA = false;
        console.log("Not creating Token3 ATA Ix");
      }
      
    }
    // token 3 ***************************************************************************

    // token 4 ***************************************************************************
    let createToken4ATA = false;
    let createToken4ATAIx = null;
    let token4ATA = null;
    if (token4Amount > 0) {

      token4ATA = await splToken.getAssociatedTokenAddress(
        new solanaWeb3.PublicKey(token4Mint),
        provider.publicKey, 
        false, 
        SPL_PROGRAM_4, 
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      console.log("Token4 ATA: ", token4ATA.toString());

      let accountInfo = await connection.getAccountInfo(token4ATA);
      if (accountInfo == null) {
        createToken4ATA = true;
        createToken4ATAIx = splToken.createAssociatedTokenAccountInstruction(
          provider.publicKey, 
          token4ATA,
          provider.publicKey, 
          new solanaWeb3.PublicKey(token4Mint), 
          SPL_PROGRAM_4, 
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log("Create Token4 ATA Ix: ", createToken4ATAIx);
      } else {
        createToken4ATA = false;
        console.log("Not creating Token4 ATA Ix");
      }

    }
    // token 4 ***************************************************************************

    // data ***************************************************************************
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

    byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    let token2;
    if(extensionTypes_2.includes(1)){
      token2 = token2Amount - (token2Amount * (transferFeeBasisPoints_2 / 100 / 100));
      console.log("token2LessFee ", Math.trunc(token2));
      for ( index = 0; index < byteArray.length; index ++ ) {
        byte = token2 & 0xff;
        byteArray [ index ] = byte;
        token2 = (token2 - byte) / 256 ;
      }
    }
    else{
      token2 = token2Amount;
      console.log("token2 ", Math.trunc(token2));
      for (index = 0; index < byteArray.length; index++) {
        byte = token2 & 0xff;
        byteArray[index] = byte;
        token2 = (token2 - byte) / 256;
      }
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
    // data ***************************************************************************

    // init ix ***************************************************************************
    let keys = [
      { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
      { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
      { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 2
      { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
      { pubkey: new solanaWeb3.PublicKey(token1Mint), isSigner: false, isWritable: true }, // 4       
      { pubkey: tempToken1Account.publicKey, isSigner: true, isWritable: true }, // 5
      { pubkey: new solanaWeb3.PublicKey(token2Mint), isSigner: false, isWritable: true }, // 6  
      { pubkey: tempToken2Account.publicKey, isSigner: true, isWritable: true }, // 7
      { pubkey: providerPickleATA, isSigner: false, isWritable: true }, // 8
      { pubkey: solanaWeb3.SystemProgram.programId, isSigner: false, isWritable: false }, // 9
      { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 10
      { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 11
      { pubkey: devTreasury, isSigner: false, isWritable: true }, // 12
      { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 13
    ];
    let initializeSwapIx = new solanaWeb3.TransactionInstruction({
      programId: tokenSwapProgramId,
      data: Buffer.from(uarray),
      keys: keys
    });
    console.log("Initialize Swap Ix: ", initializeSwapIx);
    // init ix ***************************************************************************

    // lookup table **********************************************************************
    let lookupTable = new solanaWeb3.PublicKey(conf.spl_alt); // mainnet    
    lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
    if (!lookupTableAccount) {
      console.log("Could not fetch ALT!");
      return;
    }
    // lookup table **********************************************************************

    // instructions array ****************************************************************
    let instructions = null;
    if (token2Amount > 0) {
      console.log("debug set 2");
      if (createToken3ATA == true && createToken4ATA) {
        console.log("1");
        instructions = [
          createTempToken1AccountIx,
          initTempToken1AccountIx,
          transferToken1Ix,
          createTempToken2AccountIx,
          initTempToken2AccountIx,
          transferToken2Ix,
          createToken3ATAIx,
          createToken4ATAIx,
          initializeSwapIx
         ]
      } 
      else if (createToken3ATA) {
        console.log("2");
          instructions = [
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createTempToken2AccountIx,
            initTempToken2AccountIx,
            transferToken2Ix,
            createToken3ATAIx,
            initializeSwapIx
          ]
      } 
      else if (createToken4ATA) {
        console.log("3");
          instructions = [
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createTempToken2AccountIx,
            initTempToken2AccountIx,
            transferToken2Ix,
            createToken4ATAIx,
            initializeSwapIx
          ]
      } 
      else {
        console.log("4");
          instructions = [
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createTempToken2AccountIx,
            initTempToken2AccountIx,
            transferToken2Ix,
            initializeSwapIx,
          ]
      }
    } 
    else {
      if (createToken3ATA == true && createToken4ATA == true) {
        console.log("5");
          instructions = [
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createToken3ATAIx,
            createToken4ATAIx,
            initializeSwapIx
          ]
      } 
      else if (createToken3ATA) {
        console.log("6");
          instructions = [
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createToken3ATAIx,
            initializeSwapIx
          ]
      } 
      else if (createToken4ATA) {
        console.log("7");
          instructions = [
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            createToken4ATAIx,
            initializeSwapIx
          ]
      } 
      else {
        console.log("8");
          instructions = [
            createTempToken1AccountIx,
            initTempToken1AccountIx,
            transferToken1Ix,
            initializeSwapIx
          ]
      }
    }
    // instructions array ****************************************************************

    // build tx **************************************************************************
    let priority = $("#priority_spl").val(); 
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions,lookupTableAccount)}));
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions,lookupTableAccount)}));
    let messageV0 = new solanaWeb3.TransactionMessage({
      payerKey: provider.publicKey,
      recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
      instructions: instructions,
    }).compileToV0Message([lookupTableAccount]);
    let initializeSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
    // build tx **************************************************************************
    
    // do it *****************************************************************************
    try {
      let signedTx = await provider.signTransaction(initializeSwapTx);
      signedTx.sign([tempToken1Account, tempToken2Account]);
      let signature = await connection.sendRawTransaction(signedTx.serialize(),{     
        skipPreflight: true,
        maxRetries: 0 
      });
      console.log("Signature: ", signature);
      $(".spl_share_sig .swap_val").html(signature);
      console.log(`https://solscan.io/tx/${signature}`);
      $(".spl_share_sig .swap_val").html(signature);
      $("#cover_message").html("Processing...");
      let final = await finalized(signature,10,4);
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
    // do it *****************************************************************************

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

    let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
    if(token1Amount > 0){
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token1Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 1 is using Token 2022");
        console.log(SPL_PROGRAM_1.toString());
      }
      else{
        console.log("Token 1 is using SPL Token");
        console.log(SPL_PROGRAM_1.toString());
      }
    }
    let token1ATA = await splToken.getAssociatedTokenAddress(
      token1Mint, 
      provider.publicKey,
      false, 
      SPL_PROGRAM_1, 
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID
    );


    let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
    if(token1Amount > 0){
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token2Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 2 is using Token 2022");
        console.log(SPL_PROGRAM_2.toString());
      }
      else{
        console.log("Token 2 is using SPL Token");
        console.log(SPL_PROGRAM_2.toString());
      }
    }    
    let token2ATA = await splToken.getAssociatedTokenAddress(
      token2Mint, 
      provider.publicKey,
      false, 
      SPL_PROGRAM_2, 
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID
    );

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


    let keys = [
      { pubkey: provider.publicKey, isSigner: true, isWritable: true }, // 0
      { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 1
      { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
      { pubkey: token1Mint, isSigner: false, isWritable: false }, // 3
      { pubkey: tempToken1Account, isSigner: false, isWritable: true }, // 4
      { pubkey: token2Mint, isSigner: false, isWritable: false }, // 5
      { pubkey: tempToken2Account, isSigner: false, isWritable: true }, // 6
      { pubkey: token1ATA, isSigner: false, isWritable: true }, // 7
      { pubkey: token2ATA, isSigner: false, isWritable: true }, // 8
      { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9
      { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 10
    ];
    let reverseSwapIx = new solanaWeb3.TransactionInstruction({
      programId: tokenSwapProgramId,
      data: Buffer.from(uarray),
      keys: keys
    });
    console.log("Reverse Swap Ix: ", reverseSwapIx);
    
    let instructions = [reverseSwapIx]
    
    // ***
    let priority = $("#priority_spl_exec").val(); 
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions)}));
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions)}));
    let messageV0 = new solanaWeb3.TransactionMessage({
      payerKey: provider.publicKey,
      recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
      instructions: instructions,
    }).compileToV0Message([]);
    let reverseSwapTx = new solanaWeb3.VersionedTransaction(messageV0);
    // ***
    
    try {
      let signedTx = await provider.signTransaction(reverseSwapTx);
      let txId = await connection.sendRawTransaction(signedTx.serialize(),{     
        skipPreflight: true,
        maxRetries: 0 
      });
      console.log("Signature: ", txId);
      $("#cover_message").html("Processing...");
      let final = await finalized(txId,10,4);
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
      let decodedProgramStateData = PROGRAM_STATE_SPL.decode(encodedProgramStateData);
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

    // token 3 **************************************************************
    let SPL_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
    if(token3Amount > 0){
      if(token3Mint == "11111111111111111111111111111111"){
        console.log("Token 3 is SOL");
      }
      else{
        axiosInstance = axios.create({baseURL:conf.cluster});
        getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token3Mint},}); 
        if(typeof getAsset.data.result.mint_extensions != "undefined"){
          SPL_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
          console.log("Token 3 is using Token 2022");
          console.log(SPL_PROGRAM_3.toString());
        }
        else{
          console.log("Token 3 is using SPL Token");
          console.log(SPL_PROGRAM_3.toString());
        }
      }
    }
    let providerToken3ATA = providerPickleATA;
    if (token3Mint.toString() != "11111111111111111111111111111111") {
      providerToken3ATA = await splToken.getAssociatedTokenAddress(
        token3Mint,
        provider.publicKey,
        false,
        SPL_PROGRAM_3,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token 3 Amount", parseInt(token3Amount.toString()));
      console.log("providerToken3ATA", providerToken3ATA);
    }
    // token 3 **************************************************************

    // token 4 **************************************************************
    let SPL_PROGRAM_4 = splToken.TOKEN_PROGRAM_ID;
    if(token4Amount > 0){
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token4Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_4 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 4 is using Token 2022");
        console.log(SPL_PROGRAM_4.toString());
      }
      else{
        console.log("Token 4 is using SPL Token");
        console.log(SPL_PROGRAM_4.toString());
      }
    }
    let providerToken4ATA = providerToken3ATA;
    if (parseInt(token4Amount.toString()) > 0) {
      providerToken4ATA = await splToken.getAssociatedTokenAddress(
        token4Mint,
        provider.publicKey,
        false,
        SPL_PROGRAM_4,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token 4 Amount", parseInt(token4Amount.toString()));
      console.log("token4Mint", token4Mint.toString());
      console.log("providerToken4ATA", providerToken4ATA);
    }
    // token 4 **************************************************************

    // token 1 **************************************************************
    let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
    if(token1Amount > 0){
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token1Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 1 is using Token 2022");
        console.log(SPL_PROGRAM_1.toString());
      }
      else{
        console.log("Token 1 is using SPL Token");
        console.log(SPL_PROGRAM_1.toString());
      }
    }
    let createToken1ATA = null;
    let createToken1ATAIx = null;
    let token1ATA = await splToken.getAssociatedTokenAddress(
      token1Mint,
      provider.publicKey,
      false,
      SPL_PROGRAM_1,
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
    );
    console.log("Token1 ATA: ", token1ATA.toString());
    let account_1 = null;
    account_1 = await connection.getAccountInfo(token1ATA).catch(function(error){});
    if (account_1 == null) {
      createToken1ATA = true;
      createToken1ATAIx = splToken.createAssociatedTokenAccountInstruction(
        provider.publicKey,
        token1ATA,
        provider.publicKey,
        token1Mint,
        SPL_PROGRAM_1,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      )
      console.log("Create Token1 ATA Ix: ", createToken1ATAIx);
    }
    else{
      createToken1ATA = false;
    }
    console.log("createToken1ATA ", createToken1ATA);
    // token 1 **************************************************************

    // token 2 **************************************************************
    let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
    if(token2Amount > 0){
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token2Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 2 is using Token 2022");
        console.log(SPL_PROGRAM_2.toString());
      }
      else{
        console.log("Token 2 is using SPL Token");
        console.log(SPL_PROGRAM_2.toString());
      }
    }
    let token2ATA = token1ATA;
    let createToken2ATA = null;
    let createToken2ATAIx = null;
    if (token2Amount > 0) {
      token2ATA = await splToken.getAssociatedTokenAddress(
        token2Mint,
        provider.publicKey,
        false,
        SPL_PROGRAM_2,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token2 ATA: ", token2ATA.toString());
      let account_2 = null;
      account_2 = await connection.getAccountInfo(token2ATA).catch(function(){});
      if(account_2 == null){
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
      }
      else{
        createToken2ATA = false;
      }
    }
    console.log("createToken2ATA ", createToken2ATA);
    // token 2 **************************************************************

    // token 3 **************************************************************
    let token3ATA = initializer;
    if (token3Mint.toString() != "11111111111111111111111111111111") {
      let SPL_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token3Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 3 is using Token 2022");
        console.log(SPL_PROGRAM_3.toString());
      }
      else{
        console.log("Token 3 is using SPL Token");
        console.log(SPL_PROGRAM_3.toString());
      }
      token3ATA = await splToken.getAssociatedTokenAddress(
        token3Mint,
        initializer,
        false,
        SPL_PROGRAM_3,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      console.log("Token3 ATA: ", token3ATA.toString());
    }
    // token 3 **************************************************************

    // token 4 **************************************************************
    let token4ATA = token3ATA;
    if (parseInt(token4Amount.toString()) > 0) {
      let SPL_PROGRAM_4 = splToken.TOKEN_PROGRAM_ID;
      axiosInstance = axios.create({baseURL:conf.cluster});
      getAsset = await axiosInstance.post(conf.cluster,{jsonrpc:"2.0",method:"getAsset",id:"rpd-op-123",params:{id:token4Mint},}); 
      if(typeof getAsset.data.result.mint_extensions != "undefined"){
        SPL_PROGRAM_4 = splToken.TOKEN_2022_PROGRAM_ID;
        console.log("Token 4 is using Token 2022");
        console.log(SPL_PROGRAM_4.toString());
      }
      else{
        console.log("Token 4 is using SPL Token");
        console.log(SPL_PROGRAM_4.toString());
      }
      token4ATA = await splToken.getAssociatedTokenAddress(
        token4Mint,
        initializer,
        false,
        SPL_PROGRAM_4,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
      console.log("Token4 ATA: ", token4ATA.toString());
    }
    // token 4 **************************************************************

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
    let lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
    if (!lookupTableAccount) {
      console.log("Could not fetch ALT!");
      return;
    }
    
    let messageV0 = null;
    let instructions = [];
    
    if (createToken1ATA == true && createToken2ATA) {
      console.log("1");
      instructions = [createToken1ATAIx, createToken2ATAIx, swapTokensIx];
    } 
    else if (createToken1ATA) {
      console.log("2");
      instructions = [createToken1ATAIx,swapTokensIx];
    } 
    else if (createToken2ATA) {
      console.log("3");
      instructions = [createToken2ATAIx,swapTokensIx];
    } 
    else {
      console.log("4");
      instructions = [swapTokensIx];
    }
    
    // ***
    let priority = $("#priority_spl_exec").val(); 
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitLimit({units:await getComputeLimit(provider.publicKey,instructions,lookupTableAccount)}));
    instructions.unshift(solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:await getPriorityFeeEstimate(conf.cluster,priority,instructions,lookupTableAccount)}));
    messageV0 = new solanaWeb3.TransactionMessage({
      payerKey: provider.publicKey,
      recentBlockhash: (await connection.getRecentBlockhash('confirmed')).blockhash,
      instructions: instructions,
    }).compileToV0Message([lookupTableAccount]);
    let swapTokensTx = new solanaWeb3.VersionedTransaction(messageV0);
    // ***
    
    try {
      let signedTx = await provider.signTransaction(swapTokensTx);
//       let txId = await connection.sendTransaction(signedTx);
      let txId = await connection.sendRawTransaction(signedTx.serialize(),{     
        skipPreflight: true,
        maxRetries: 0 
      });
      console.log("Signature: ", txId);
      console.log(`https://solscan.io/tx/${txId}`);
      $("#cover_message").html("Executing Contract...");
      let final = await finalized(txId,10,4);
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
//   localStorage.clear();
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
  async function syncProposals(mode=false){
    
    provider = wallet_provider();
    if (typeof provider == "undefined") {} 
    else if (provider.isConnected != true) {} else if (provider.isConnected == true) {
    let connection = new solanaWeb3.Connection(conf.cluster, "confirmed");
    
    let SPL_ProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_SPL_PROGRAM);
    let CNFT_ProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CNFT_PROGRAM);
    let NFT_ProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_NFT_PROGRAM);
    let PNFT_ProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_PNFT_PROGRAM);
    let CORE_ProgramId = new solanaWeb3.PublicKey(conf.MCSWAP_CORE_PROGRAM);
    
      (async()=>{

        let wallet = provider.publicKey.toString();      
        let SPL_SENT = [];
        let SPL_RECEIVED = [];
        let NFT_SENT = [];
        let NFT_RECEIVED = [];
        let CNFT_SENT = [];
        let CNFT_RECEIVED = [];
        let PNFT_SENT = [];
        let PNFT_RECEIVED = [];
        let CORE_SENT = [];
        let CORE_RECEIVED = [];
        let accounts = null;
        let obj = [];

        // ***********************************************************************
        // get active spl contracts for the connected wallet
        if(mode==false || mode=="spl"){
        accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:297,},{memcmp:{offset:9,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_SPL_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              let initializer = new solanaWeb3.PublicKey(decodedData.initializer);
              record.peer_a = initializer.toString();
              let taker = new solanaWeb3.PublicKey(decodedData.taker);
              record.peer_b = taker.toString();
              let utime = new BN(decodedData.utime, 10, "le");
              record.utime = parseInt(utime.toString());
              record.token_1_mint = new solanaWeb3.PublicKey(decodedData.token1_mint).toString();
              record.token_2_mint = new solanaWeb3.PublicKey(decodedData.token2_mint).toString();
              record.token_3_mint = new solanaWeb3.PublicKey(decodedData.token3_mint).toString();
              record.token_4_mint = new solanaWeb3.PublicKey(decodedData.token4_mint).toString();
              record.token_1_amount = parseInt(new BN(decodedData.token1_amount, 10, "le"));
              record.token_2_amount = parseInt(new BN(decodedData.token2_amount, 10, "le"));
              record.token_3_amount = parseInt(new BN(decodedData.token3_amount, 10, "le"));
              record.token_4_amount = parseInt(new BN(decodedData.token4_amount, 10, "le"));
              SPL_SENT.push(record);          
            }
            if(i == (accounts.length - 1)){
              displayProposals("spl_sent",SPL_SENT);
            }
          });
        }
        // get active spl contracts received to the connected wallet
        accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:297,},{memcmp:{offset:185,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_SPL_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              let initializer = new solanaWeb3.PublicKey(decodedData.initializer);
              record.peer_a = initializer.toString();
              let taker = new solanaWeb3.PublicKey(decodedData.taker);
              record.peer_b = taker.toString();
              let utime = new BN(decodedData.utime, 10, "le");
              record.utime = parseInt(utime.toString());
              record.token_1_mint = new solanaWeb3.PublicKey(decodedData.token1_mint).toString();
              record.token_2_mint = new solanaWeb3.PublicKey(decodedData.token2_mint).toString();
              record.token_3_mint = new solanaWeb3.PublicKey(decodedData.token3_mint).toString();
              record.token_4_mint = new solanaWeb3.PublicKey(decodedData.token4_mint).toString();
              record.token_1_amount = parseInt(new BN(decodedData.token1_amount, 10, "le"));
              record.token_2_amount = parseInt(new BN(decodedData.token2_amount, 10, "le"));
              record.token_3_amount = parseInt(new BN(decodedData.token3_amount, 10, "le"));
              record.token_4_amount = parseInt(new BN(decodedData.token4_amount, 10, "le"));
              SPL_RECEIVED.push(record);          
            }
            if(i == (accounts.length - 1)){
              displayProposals("spl_received",SPL_RECEIVED);
            }        
          });
        }}
        // ***********************************************************************    
        
        // ***********************************************************************
        // get active cnft contracts for the connected wallet
        if(mode==false || mode=="cnft"){
        accounts = await connection.getParsedProgramAccounts(CNFT_ProgramId,{filters:[{dataSize:522,},{memcmp:{offset:10,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_CNFT_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              let initializer = new solanaWeb3.PublicKey(decodedData.initializer);
              record.peer_a = initializer.toString();
              let taker = new solanaWeb3.PublicKey(decodedData.swap_leaf_owner);
              record.peer_b = taker.toString();
              let utime = new BN(decodedData.utime, 10, "le");
              record.utime = parseInt(utime.toString());
              record.asset_a = new solanaWeb3.PublicKey(decodedData.asset_id).toString();
              record.asset_b = new solanaWeb3.PublicKey(decodedData.swap_asset_id).toString();
              if(record.asset_b == "11111111111111111111111111111111"){record.asset_b = "";}
              record.swap_sol_mint = "11111111111111111111111111111111";
              record.swap_sol_amount = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
              record.swap_tokens_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
              record.swap_tokens_amount = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
              CNFT_SENT.push(record);
            }
            if(i == (accounts.length - 1)){
              CNFT_SENT.sort((a, b) => b.utime - a.utime);
              displayProposals("cnft_sent",CNFT_SENT);
            }
          });
        }
        // get active cnft contracts received to the connected wallet
        accounts = await connection.getParsedProgramAccounts(CNFT_ProgramId,{filters:[{dataSize:522,},{memcmp:{offset:410,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){        
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_CNFT_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              let initializer = new solanaWeb3.PublicKey(decodedData.initializer);
              record.peer_a = initializer.toString();
              let taker = new solanaWeb3.PublicKey(decodedData.swap_leaf_owner);
              record.peer_b = taker.toString();
              let utime = new BN(decodedData.utime, 10, "le");
              record.utime = parseInt(utime.toString());
              record.asset_a = new solanaWeb3.PublicKey(decodedData.asset_id).toString();
              record.asset_b = new solanaWeb3.PublicKey(decodedData.swap_asset_id).toString();
              if(record.asset_b == "11111111111111111111111111111111"){record.asset_b = ""}
              record.swap_sol_mint = "11111111111111111111111111111111";
              record.swap_sol_amount = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
              record.swap_tokens_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
              record.swap_tokens_amount = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
              CNFT_RECEIVED.push(record);         
            }
            if(i == (accounts.length - 1)){
              displayProposals("cnft_received",CNFT_RECEIVED);
            }
          });
        }}
        // ***********************************************************************      

        // ***********************************************************************
        // get active nft contracts for the connected wallet
        if(mode==false || mode=="nft"){
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:218,},{memcmp:{offset:10,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_NFT_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              let initializer = new solanaWeb3.PublicKey(decodedData.initializer).toString();
              let initializer_mint = new solanaWeb3.PublicKey(decodedData.initializer_mint).toString();
              let taker = new solanaWeb3.PublicKey(decodedData.taker).toString();
              let is_swap = new solanaWeb3.PublicKey(decodedData.is_swap).toString();
              let temp_mint_account = new solanaWeb3.PublicKey(decodedData.temp_mint_account).toString();
              let swap_mint = new solanaWeb3.PublicKey(decodedData.swap_mint).toString();
              let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
              let swap_token_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
              let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
              let utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
              record.utime = utime;
              record.peer_a = initializer;
              record.peer_b = taker;
              record.asset_a = initializer_mint;
              record.asset_b = swap_mint;
              record.swap_sol_mint = "11111111111111111111111111111111";
              record.swap_sol_amount = swap_lamports;
              record.swap_tokens_mint = swap_token_mint;
              record.swap_tokens_amount = swap_tokens;
              record.is_swap = is_swap;
              NFT_SENT.push(record);
            }
            if(i == (accounts.length - 1)){
              displayProposals("nft_sent",NFT_SENT);
            }
          });
        }
        // get active nft contracts received to the connected wallet
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:218,},{memcmp:{offset:106,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_NFT_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              let initializer = new solanaWeb3.PublicKey(decodedData.initializer).toString();
              let initializer_mint = new solanaWeb3.PublicKey(decodedData.initializer_mint).toString();
              let taker = new solanaWeb3.PublicKey(decodedData.taker).toString();
              let is_swap = new solanaWeb3.PublicKey(decodedData.is_swap).toString();
              let temp_mint_account = new solanaWeb3.PublicKey(decodedData.temp_mint_account).toString();
              let swap_mint = new solanaWeb3.PublicKey(decodedData.swap_mint).toString();
              let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
              let swap_token_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
              let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
              let utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
              record.utime = utime;
              record.peer_a = initializer;
              record.peer_b = taker;
              record.asset_a = initializer_mint;
              record.asset_b = swap_mint;
              record.swap_sol_mint = "11111111111111111111111111111111";
              record.swap_sol_amount = swap_lamports;
              record.swap_tokens_mint = swap_token_mint;
              record.swap_tokens_amount = swap_tokens;
              record.is_swap = is_swap;
              NFT_RECEIVED.push(record);
            }
            if(i == (accounts.length - 1)){
              displayProposals("nft_received",NFT_RECEIVED);
            }
          });
        }}
        // ***********************************************************************
        
        // ***********************************************************************
        // get active pnft contracts for the connected wallet
        if(mode==false || mode=="pnft"){
        accounts = await connection.getParsedProgramAccounts(PNFT_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:10,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_PNFT_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              record.utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
              record.peer_a = new solanaWeb3.PublicKey(decodedData.initializer).toString();
              record.asset_a = new solanaWeb3.PublicKey(decodedData.initializer_mint).toString();
              record.peer_b = new solanaWeb3.PublicKey(decodedData.taker).toString();
              record.is_swap = new solanaWeb3.PublicKey(decodedData.is_swap).toString();
              record.asset_b = new solanaWeb3.PublicKey(decodedData.swap_mint).toString();
              record.swap_sol_amount = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
              record.swap_tokens_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
              record.swap_tokens_amount = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
              record.swap_sol_mint = "11111111111111111111111111111111";
              PNFT_SENT.push(record);
            }
            if(i == (accounts.length - 1)){
              displayProposals("pnft_sent",PNFT_SENT);
            }
          });
        }
        // get active pnft contracts received to the connected wallet
        accounts = await connection.getParsedProgramAccounts(PNFT_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:74,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){
          accounts.forEach(async(account, i) => {
            let resultStatePDA = account.pubkey;
            let resultState = null;
            let record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              let decodedData = SWAP_PNFT_STATE.decode(resultState.data);
              let acct = account.pubkey.toString();
              record.acct = acct;
              record.utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
              record.peer_a = new solanaWeb3.PublicKey(decodedData.initializer).toString();
              record.asset_a = new solanaWeb3.PublicKey(decodedData.initializer_mint).toString();
              record.peer_b = new solanaWeb3.PublicKey(decodedData.taker).toString();
              record.is_swap = new solanaWeb3.PublicKey(decodedData.is_swap).toString();
              record.asset_b = new solanaWeb3.PublicKey(decodedData.swap_mint).toString();
              record.swap_sol_amount = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
              record.swap_tokens_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
              record.swap_tokens_amount = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
              record.swap_sol_mint = "11111111111111111111111111111111";
              PNFT_RECEIVED.push(record);
            }
            if(i == (accounts.length - 1)){
              displayProposals("pnft_received",PNFT_RECEIVED);
            }
          });
        }}
        // ***********************************************************************

         // ***********************************************************************
        // get active core contracts for the connected wallet
        if(mode==false || mode=="core"){
          accounts = await connection.getParsedProgramAccounts(CORE_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:10,bytes:wallet,},},],}).catch(function(){});
          if(accounts != null){
            accounts.forEach(async(account, i) => {
              let resultStatePDA = account.pubkey;
              let resultState = null;
              let record = {};
              resultState = await connection.getAccountInfo(resultStatePDA);
              if(resultState != null){
                let decodedData = SWAP_CORE_STATE.decode(resultState.data);
                let acct = account.pubkey.toString();
                record.acct = acct;
                record.utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.peer_a = new solanaWeb3.PublicKey(decodedData.initializer).toString();
                record.asset_a = new solanaWeb3.PublicKey(decodedData.initializer_asset).toString();
                record.peer_b = new solanaWeb3.PublicKey(decodedData.taker).toString();
                record.is_swap = new solanaWeb3.PublicKey(decodedData.is_swap).toString();
                record.asset_b = new solanaWeb3.PublicKey(decodedData.swap_asset).toString();
                record.swap_sol_amount = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                record.swap_tokens_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
                record.swap_tokens_amount = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                record.swap_sol_mint = "11111111111111111111111111111111";
                CORE_SENT.push(record);
              }
              if(i == (accounts.length - 1)){
                displayProposals("core_sent",CORE_SENT);
              }
            });
          }
          // get active core contracts for the connected wallet
          accounts = await connection.getParsedProgramAccounts(CORE_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:74,bytes:wallet,},},],}).catch(function(){});
          if(accounts != null){
            accounts.forEach(async(account, i) => {
              let resultStatePDA = account.pubkey;
              let resultState = null;
              let record = {};
              resultState = await connection.getAccountInfo(resultStatePDA);
              if(resultState != null){
                let decodedData = SWAP_CORE_STATE.decode(resultState.data);
                let acct = account.pubkey.toString();
                record.acct = acct;
                record.utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.peer_a = new solanaWeb3.PublicKey(decodedData.initializer).toString();
                record.asset_a = new solanaWeb3.PublicKey(decodedData.initializer_asset).toString();
                record.peer_b = new solanaWeb3.PublicKey(decodedData.taker).toString();
                record.is_swap = new solanaWeb3.PublicKey(decodedData.is_swap).toString();
                record.asset_b = new solanaWeb3.PublicKey(decodedData.swap_asset).toString();
                record.swap_sol_amount = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                record.swap_tokens_mint = new solanaWeb3.PublicKey(decodedData.swap_token_mint).toString();
                record.swap_tokens_amount = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                record.swap_sol_mint = "11111111111111111111111111111111";
                CORE_RECEIVED.push(record);
              }
              if(i == (accounts.length - 1)){
                displayProposals("core_received",CORE_RECEIVED);
              }
            });
        }}
        // ***********************************************************************

      })();

    }

  }
  let proposalInterval = setInterval(async function() {
    syncProposals();
  }, 20000);
  
  async function displayProposals(type,data) {
    provider = wallet_provider();
    if (typeof provider == "undefined") {
      $("#spl_sent, #spl_received").html("");
    } else if (provider.isConnected != true) {
      $("#spl_sent, #spl_received").html("");
    } else if (provider.isConnected == true) {
      let do_notify = 0;
      let resize_smart = 0;
      let wallet = provider.publicKey.toString();

      // spl sent
      if(type=="spl_sent"){
        let list_spl = data;
        list_spl.sort((a, b) => a.utime - b.utime);
        let default_img = '<img src="/img/default_token.png" class="spl_default smart_default" />';
        let img_1 = default_img;
        let img_2 = default_img;
        let img_3 = default_img;
        let img_4 = default_img;
        for (let i = 0; i < list_spl.length; i++) {
          if (!$("ul[data-spl_sent='" + list_spl[i].acct + "']").length) {
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_spl[i].token_1_mint) {
                list_spl[i].token_1_name = tokn.name;
                list_spl[i].token_1_symbol = tokn.symbol;
                if(typeof tokn.img == "undefined" || tokn.img == undefined){ tokn.img = tokn.image; }
                list_spl[i].token_1_image = tokn.img;
                list_spl[i].token_1_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl[i].token_1_amount, list_spl[i].token_1_decimals);
                list_spl[i].token_1_amt = amt;
                break;
              }
            }
            if (list_spl[i].token_2_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl[i].token_2_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl[i].token_2_name = "USD Coin";
                  list_spl[i].token_2_symbol = "USDC";
                  list_spl[i].token_2_image = "/img/sol.png";
                  list_spl[i].token_2_decimals = 6;
                  let amt = await decimal_joe(list_spl[i].token_2_amount, list_spl[i].token_2_decimals);
                  list_spl[i].token_2_amt = amt;
                  break;
                }
                if (tokn.address == list_spl[i].token_2_mint) {
                  list_spl[i].token_2_name = tokn.name;
                  list_spl[i].token_2_symbol = tokn.symbol;
                  if(typeof tokn.img == "undefined" || tokn.img == undefined){ tokn.img = tokn.image; }
                  list_spl[i].token_2_image = tokn.img;
                  list_spl[i].token_2_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl[i].token_2_amount, list_spl[i].token_2_decimals);
                  list_spl[i].token_2_amt = amt;
                  break;
                }
              }
            } else {
              list_spl[i].token_2_name = false;
              list_spl[i].token_2_symbol = false;
              list_spl[i].token_2_image = false;
              list_spl[i].token_2_decimals = 0;
              let amt = await decimal_joe(list_spl[i].token_2_amount, list_spl[i].token_2_decimals);
              list_spl[i].token_2_amt = amt;
            }
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (list_spl[i].token_3_mint == "11111111111111111111111111111111") {
                list_spl[i].token_3_name = "SOL";
                list_spl[i].token_3_symbol = "SOL";
                list_spl[i].token_3_image = "/img/sol.png";
                list_spl[i].token_3_decimals = 9;
                let amt = await decimal_joe(list_spl[i].token_3_amount, list_spl[i].token_3_decimals);
                list_spl[i].token_3_amt = amt;
                break;
              } else if (list_spl[i].token_3_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                list_spl[i].token_3_name = "USD Coin";
                list_spl[i].token_3_symbol = "USDC";
                list_spl[i].token_3_image = "/img/usdc.png";
                list_spl[i].token_3_decimals = 6;
                let amt = await decimal_joe(list_spl[i].token_3_amount, list_spl[i].token_3_decimals);
                list_spl[i].token_3_amt = amt;
                break;
              } else if (tokn.address == list_spl[i].token_3_mint) {
                list_spl[i].token_3_name = tokn.name;
                list_spl[i].token_3_symbol = tokn.symbol;
                if(typeof tokn.img == "undefined" || tokn.img == undefined){ tokn.img = tokn.image; }
                list_spl[i].token_3_image = tokn.img;
                list_spl[i].token_3_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl[i].token_3_amount, list_spl[i].token_3_decimals);
                list_spl[i].token_3_amt = amt;
                break;
              }
            }
            if (list_spl[i].token_4_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl[i].token_4_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl[i].token_4_name = "USD Coin";
                  list_spl[i].token_4_symbol = "USDC";
                  list_spl[i].token_4_image = "/img/usdc.png";
                  list_spl[i].token_4_decimals = 6;
                  let amt = await decimal_joe(list_spl[i].token_4_amount, list_spl[i].token_4_decimals);
                  list_spl[i].amt = amt;
                  break;
                } else if (tokn.address == list_spl[i].token_4_mint) {
                  list_spl[i].token_4_name = tokn.name;
                  list_spl[i].token_4_symbol = tokn.symbol;
                  if(typeof tokn.img == "undefined" || tokn.img == undefined){ tokn.img = tokn.image; }
                  list_spl[i].token_4_image = tokn.img;
                  list_spl[i].token_4_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl[i].token_4_amount, list_spl[i].token_4_decimals);
                  list_spl[i].token_4_amt = amt;
                  break;
                }
              }
            } 
            else {
              list_spl[i].token_4_name = false;
              list_spl[i].token_4_symbol = false;
              list_spl[i].token_4_image = false;
              list_spl[i].token_4_decimals = 0;
              let amt = await decimal_joe(list_spl[i].token_4_amount, list_spl[i].token_4_decimals);
              list_spl[i].token_4_amt = amt;
            }
            let item_date = new Date((list_spl[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            if (list_spl[i].token_1_amount > 0) {
              img_1 = '<a href="' + conf.cnft_explorer + list_spl[i].token_1_mint + '" target="_blank"><img src="' + list_spl[i].token_1_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl[i].token_1_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_1_symbol + '</span></div>';
            }
            if (list_spl[i].token_2_amount > 0) {
              img_2 = '<a href="' + conf.cnft_explorer + list_spl[i].token_2_mint + '" target="_blank"><img src="' + list_spl[i].token_2_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl[i].token_2_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_2_symbol + '</span></div>';
            }
            if (list_spl[i].token_3_amount > 0) {
              img_3 = '<a href="' + conf.cnft_explorer + list_spl[i].token_3_mint + '" target="_blank"><img src="' + list_spl[i].token_3_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl[i].token_3_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_3_symbol + '</span></div>';
            }
            if (list_spl[i].token_4_amount > 0) {
              img_4 = '<a href="' + conf.cnft_explorer + list_spl[i].token_4_mint + '" target="_blank"><img src="' + list_spl[i].token_4_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl[i].token_4_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_4_symbol + '</span></div>';
            }
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_spl[i].peer_a + '-' + list_spl[i].peer_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left">' + img_1 + img_2 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right">' + img_3 + img_4 + '</div></li>';
            let first_10 = list_spl[i].peer_b.substring(0, 10);
            let last_10 = list_spl[i].peer_b.substr(list_spl[i].peer_b.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_spl[i].peer_b + '">' + peer + '</li>';
            if(!$("[data-spl_sent='"+list_spl[i].acct+"']").length){
              $("#spl_sent").prepend('<ul class="spl_sent smart_ul" data-spl_sent="' + list_spl[i].acct + '">' + smart_item + '</ul>');
            }
            resize_smart = 1;
          }
        }
      }
      // spl received
      if(type=="spl_received"){
        let list_spl = data;
        list_spl.sort((a, b) => a.utime - b.utime);
        list_spl = list_spl.reverse();
        let default_img = '<img src="/img/default_token.png" class="spl_default smart_default" />';
        let img_1 = default_img;
        let img_2 = default_img;
        let img_3 = default_img;
        let img_4 = default_img;
        for (let i = 0; i < list_spl.length; i++) {
          if (!$("ul[data-spl_received='" + list_spl[i].acct + "']").length) {
            
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_spl[i].token_1_mint) {
                list_spl[i].token_1_name = tokn.name;
                list_spl[i].token_1_symbol = tokn.symbol;
                list_spl[i].token_1_image = tokn.img;
                list_spl[i].token_1_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl[i].token_1_amount, list_spl[i].token_1_decimals);
                list_spl[i].token_1_amt = amt;
                break;
              }
            }
            
            if (list_spl[i].token_2_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl[i].token_2_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl[i].token_2_name = "USD Coin";
                  list_spl[i].token_2_symbol = "USDC";
                  list_spl[i].token_2_image = "/img/sol.png";
                  list_spl[i].token_2_decimals = 6;
                  let amt = await decimal_joe(list_spl[i].token_2_amount, list_spl[i].token_2_decimals);
                  list_spl[i].token_2_amt = amt;
                  break;
                }
                if (tokn.address == list_spl[i].token_2_mint) {
                  list_spl[i].token_2_name = tokn.name;
                  list_spl[i].token_2_symbol = tokn.symbol;
                  list_spl[i].token_2_image = tokn.img;
                  list_spl[i].token_2_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl[i].token_2_amount, list_spl[i].token_2_decimals);
                  list_spl[i].token_2_amt = amt;
                  break;
                }
              }
            } 
            else {
              list_spl[i].token_2_name = false;
              list_spl[i].token_2_symbol = false;
              list_spl[i].token_2_image = false;
              list_spl[i].token_2_decimals = 0;
              let amt = await decimal_joe(list_spl[i].token_2_amount, list_spl[i].token_2_decimals);
              list_spl[i].token_2_amt = amt;
            }

            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (list_spl[i].token_3_mint == "11111111111111111111111111111111") {
                list_spl[i].token_3_name = "SOL";
                list_spl[i].token_3_symbol = "SOL";
                list_spl[i].token_3_image = "/img/sol.png";
                list_spl[i].token_3_decimals = 9;
                let amt = await decimal_joe(list_spl[i].token_3_amount, list_spl[i].token_3_decimals);
                list_spl[i].token_3_amt = amt;
                break;
              } else if (list_spl[i].token_3_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                list_spl[i].token_3_name = "USD Coin";
                list_spl[i].token_3_symbol = "USDC";
                list_spl[i].token_3_image = "/img/usdc.png";
                list_spl[i].token_3_decimals = 6;
                let amt = await decimal_joe(list_spl[i].token_3_amount, list_spl[i].token_3_decimals);
                list_spl[i].token_3_amt = amt;
                break;
              } else if (tokn.address == list_spl[i].token_3_mint) {
                list_spl[i].token_3_name = tokn.name;
                list_spl[i].token_3_symbol = tokn.symbol;
                list_spl[i].token_3_image = tokn.img;
                list_spl[i].token_3_decimals = tokn.decimals;
                let amt = await decimal_joe(list_spl[i].token_3_amount, list_spl[i].token_3_decimals);
                list_spl[i].token_3_amt = amt;
                break;
              }
            }
            
            if (list_spl[i].token_4_amount > 0) {
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (list_spl[i].token_4_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
                  list_spl[i].token_4_name = "USD Coin";
                  list_spl[i].token_4_symbol = "USDC";
                  list_spl[i].token_4_image = "/img/usdc.png";
                  list_spl[i].token_4_decimals = 6;
                  let amt = await decimal_joe(list_spl[i].token_4_amount, list_spl[i].token_4_decimals);
                  list_spl[i].amt = amt;
                  break;
                } else if (tokn.address == list_spl[i].token_4_mint) {
                  list_spl[i].token_4_name = tokn.name;
                  list_spl[i].token_4_symbol = tokn.symbol;
                  list_spl[i].token_4_image = tokn.img;
                  list_spl[i].token_4_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_spl[i].token_4_amount, list_spl[i].token_4_decimals);
                  list_spl[i].token_4_amt = amt;
                  break;
                }
              }
            } 
            else {
              list_spl[i].token_4_name = false;
              list_spl[i].token_4_symbol = false;
              list_spl[i].token_4_image = false;
              list_spl[i].token_4_decimals = 0;
              let amt = await decimal_joe(list_spl[i].token_4_amount, list_spl[i].token_4_decimals);
              list_spl[i].token_4_amt = amt;
            }
            
            let item_date = new Date((list_spl[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            
            let changes = '';
            if (list_spl[i].token_3_amount > 0) {
              img_3 = '<a href="' + conf.cnft_explorer + list_spl[i].token_3_mint + '" target="_blank"><img src="' + list_spl[i].token_3_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl[i].token_3_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_3_symbol + '</span></div>';
            }
            if (list_spl[i].token_4_amount > 0) {
              img_4 = '<a href="' + conf.cnft_explorer + list_spl[i].token_4_mint + '" target="_blank"><img src="' + list_spl[i].token_4_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_spl[i].token_4_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_4_symbol + '</span></div>';
            }
            if (list_spl[i].token_1_amount > 0) {
              img_1 = '<a href="' + conf.cnft_explorer + list_spl[i].token_1_mint + '" target="_blank"><img src="' + list_spl[i].token_1_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl[i].token_1_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_1_symbol + '</span></div>';
            }
            if (list_spl[i].token_2_amount > 0) {
              img_2 = '<a href="' + conf.cnft_explorer + list_spl[i].token_2_mint + '" target="_blank"><img src="' + list_spl[i].token_2_image + '" class="smart_default" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_spl[i].token_2_amt + '</span></span><span class="smart_symbol">' + list_spl[i].token_2_symbol + '</span></div>';
            }
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_spl[i].peer_a + '-' + list_spl[i].peer_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left">' + img_3 + img_4 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right">' + img_1 + img_2 + '</div></li>';
            let first_10 = list_spl[i].peer_a.substring(0, 10);
            let last_10 = list_spl[i].peer_a.substr(list_spl[i].peer_b.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_spl[i].peer_b + '">' + peer + '</li>';
            if(!$("[data-spl_received='"+list_spl[i].acct+"']").length){
              $("#spl_received").prepend('<ul class="spl_received smart_ul" data-spl_received="' + list_spl[i].acct + '">' + smart_item + '</ul>');
            }
          }
        } 
      }
      
      // cnft sent
      if(type=="cnft_sent"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-cnft_sent='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            if(list_[i].swap_tokens_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
              list_[i].swap_tokens_name = "USDC";
              list_[i].swap_tokens_symbol = "USDC";
              list_[i].swap_tokens_image = "/img/usdc.png";
              list_[i].swap_tokens_decimals = 6;
              let amt = await decimal_joe(list_[i].swap_tokens_amount, list_[i].swap_tokens_decimals);
              list_[i].swap_tokens_amount = amt;
            }
            else{
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                  list_[i].swap_tokens_name = tokn.name;
                  list_[i].swap_tokens_symbol = tokn.symbol;
                  list_[i].swap_tokens_image = tokn.img;
                  list_[i].swap_tokens_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                  list_[i].swap_tokens_amount = amt;
                  break;
                }
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_tokens_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
//             
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            
            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+list_[i].asset_b_data.content.links.image+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
//               token_img_2 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left_asset">'+ nft_img_1 +'</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div></li>';
            let first_10 = list_[i].peer_b.substring(0, 10);
            let last_10 = list_[i].peer_b.substr(list_[i].peer_b.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-cnft_sent='"+list_[i].acct+"']").length){
              $("#cnft_sent").prepend('<ul class="cnft_sent smart_ul" data-cnft_sent="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      // cnft received
      if(type=="cnft_received"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        list_spl = list_.reverse();
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-cnft_received='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                list_[i].swap_tokens_name = tokn.name;
                list_[i].swap_tokens_symbol = tokn.symbol;
                list_[i].swap_tokens_image = tokn.img;
                list_[i].swap_tokens_decimals = tokn.decimals;
                let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                list_[i].swap_tokens_amount = amt;
                break;
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_sol_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;

            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+list_[i].asset_b_data.content.links.image+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
//               token_img_2 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_left_asset">'+ nft_img_1 +'</div></li>';
            let first_10 = list_[i].peer_a.substring(0, 10);
            let last_10 = list_[i].peer_a.substr(list_[i].peer_a.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-cnft_received='"+list_[i].acct+"']").length){
              $("#cnft_received").prepend('<ul class="cnft_received smart_ul" data-cnft_received="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      
      // nft sent
      if(type=="nft_sent"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-nft_sent='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            if(list_[i].swap_tokens_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
              list_[i].swap_tokens_name = "USDC";
              list_[i].swap_tokens_symbol = "USDC";
              list_[i].swap_tokens_image = "/img/usdc.png";
              list_[i].swap_tokens_decimals = 6;
              let amt = await decimal_joe(list_[i].swap_tokens_amount, list_[i].swap_tokens_decimals);
              list_[i].swap_tokens_amount = amt;
            }
            else{
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                  list_[i].swap_tokens_name = tokn.name;
                  list_[i].swap_tokens_symbol = tokn.symbol;
                  list_[i].swap_tokens_image = tokn.img;
                  list_[i].swap_tokens_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                  list_[i].swap_tokens_amount = amt;
                  break;
                }
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_tokens_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
             
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            
            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              let img = list_[i].asset_b_data.content.links.image;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+img+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left_asset">'+ nft_img_1 +'</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div></li>';
            let first_10 = list_[i].peer_b.substring(0, 10);
            let last_10 = list_[i].peer_b.substr(list_[i].peer_b.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-nft_sent='"+list_[i].acct+"']").length){
              $("#nft_sent").prepend('<ul class="nft_sent smart_ul" data-nft_sent="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      // nft received
      if(type=="nft_received"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        list_spl = list_.reverse();
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-nft_received='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                list_[i].swap_tokens_name = tokn.name;
                list_[i].swap_tokens_symbol = tokn.symbol;
                list_[i].swap_tokens_image = tokn.img;
                list_[i].swap_tokens_decimals = tokn.decimals;
                let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                list_[i].swap_tokens_amount = amt;
                break;
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_sol_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;

            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+list_[i].asset_b_data.content.links.image+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
//               token_img_2 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_left_asset">'+ nft_img_1 +'</div></li>';
            let first_10 = list_[i].peer_a.substring(0, 10);
            let last_10 = list_[i].peer_a.substr(list_[i].peer_a.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-nft_received='"+list_[i].acct+"']").length){
              $("#nft_received").prepend('<ul class="nft_received smart_ul" data-nft_received="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      
      // pnft sent
      if(type=="pnft_sent"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-pnft_sent='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            if(list_[i].swap_tokens_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
              list_[i].swap_tokens_name = "USDC";
              list_[i].swap_tokens_symbol = "USDC";
              list_[i].swap_tokens_image = "/img/usdc.png";
              list_[i].swap_tokens_decimals = 6;
              let amt = await decimal_joe(list_[i].swap_tokens_amount, list_[i].swap_tokens_decimals);
              list_[i].swap_tokens_amount = amt;
            }
            else{
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                  list_[i].swap_tokens_name = tokn.name;
                  list_[i].swap_tokens_symbol = tokn.symbol;
                  list_[i].swap_tokens_image = tokn.img;
                  list_[i].swap_tokens_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                  list_[i].swap_tokens_amount = amt;
                  break;
                }
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_tokens_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
             
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            
            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              let img = list_[i].asset_b_data.content.links.image;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+img+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left_asset">'+ nft_img_1 +'</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div></li>';
            let first_10 = list_[i].peer_b.substring(0, 10);
            let last_10 = list_[i].peer_b.substr(list_[i].peer_b.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-pnft_sent='"+list_[i].acct+"']").length){
              $("#pnft_sent").prepend('<ul class="pnft_sent smart_ul" data-pnft_sent="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      // pnft received
      if(type=="pnft_received"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        list_spl = list_.reverse();
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-pnft_received='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                list_[i].swap_tokens_name = tokn.name;
                list_[i].swap_tokens_symbol = tokn.symbol;
                list_[i].swap_tokens_image = tokn.img;
                list_[i].swap_tokens_decimals = tokn.decimals;
                let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                list_[i].swap_tokens_amount = amt;
                break;
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_sol_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;

            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+list_[i].asset_b_data.content.links.image+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
//               token_img_2 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_left_asset">'+ nft_img_1 +'</div></li>';
            let first_10 = list_[i].peer_a.substring(0, 10);
            let last_10 = list_[i].peer_a.substr(list_[i].peer_a.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-pnft_received='"+list_[i].acct+"']").length){
              $("#pnft_received").prepend('<ul class="pnft_received smart_ul" data-pnft_received="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      
      // core sent
      if(type=="core_sent"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-core_sent='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            if(list_[i].swap_tokens_mint == "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"){
              list_[i].swap_tokens_name = "USDC";
              list_[i].swap_tokens_symbol = "USDC";
              list_[i].swap_tokens_image = "/img/usdc.png";
              list_[i].swap_tokens_decimals = 6;
              let amt = await decimal_joe(list_[i].swap_tokens_amount, list_[i].swap_tokens_decimals);
              list_[i].swap_tokens_amount = amt;
            }
            else{
              for (let t = 0; t < spl_tokens.length; t++) {
                let tokn = spl_tokens[t];
                if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                  list_[i].swap_tokens_name = tokn.name;
                  list_[i].swap_tokens_symbol = tokn.symbol;
                  list_[i].swap_tokens_image = tokn.img;
                  list_[i].swap_tokens_decimals = tokn.decimals;
                  let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                  list_[i].swap_tokens_amount = amt;
                  break;
                }
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_tokens_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
             
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            
            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              let img = list_[i].asset_b_data.content.links.image;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+img+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_left_asset">'+ nft_img_1 +'</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div></li>';
            let first_10 = list_[i].peer_b.substring(0, 10);
            let last_10 = list_[i].peer_b.substr(list_[i].peer_b.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-core_sent='"+list_[i].acct+"']").length){
              $("#core_sent").prepend('<ul class="core_sent smart_ul" data-core_sent="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      // core received
      if(type=="core_received"){
        let list_ = data;
        list_.sort((a, b) => a.utime - b.utime);
        list_spl = list_.reverse();
        let token_img_1 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let token_img_2 = '<img src="/img/default_token.png" class="spl_default smart_default_nft" />';
        let nft_img_1 = '<img src="/img/img-placeholder.png" class="smart_default_1" />';
        let nft_img_2 = '<img src="/img/img-placeholder.png" class="smart_default_nft" />';
        for (let i = 0; i < list_.length; i++) {
          if (!$("ul[data-core_received='" + list_[i].acct + "']").length) {
            
            list_[i].swap_tokens_name = false;
            list_[i].swap_tokens_symbol = false;
            list_[i].swap_tokens_image = false;
            list_[i].swap_tokens_decimals = 0;
            
            for (let t = 0; t < spl_tokens.length; t++) {
              let tokn = spl_tokens[t];
              if (tokn.address == list_[i].swap_tokens_mint && list_[i].swap_tokens_mint != "11111111111111111111111111111111") {
                list_[i].swap_tokens_name = tokn.name;
                list_[i].swap_tokens_symbol = tokn.symbol;
                list_[i].swap_tokens_image = tokn.img;
                list_[i].swap_tokens_decimals = tokn.decimals;
                let amt = await decimal_joe(list_[i].swap_tokens_amount, tokn.decimals);
                list_[i].swap_tokens_amount = amt;
                break;
              }
            }
            
            if(list_[i].swap_sol_amount > 0){
              let amt = await decimal_joe(list_[i].swap_sol_amount, 9);
              list_[i].swap_sol_amount = amt;
            }
            
            let item_date = new Date((list_[i].utime * 1000));
            item_date = item_date.toLocaleDateString('en-US') + " " + item_date.toLocaleTimeString('en-US');
            let changes = '';
            
            // get asset 1 data
            let axiosInstance = axios.create({baseURL: conf.cluster});
            let response = false;

            if (list_[i].asset_b != "" && list_[i].asset_b != "11111111111111111111111111111111") {
              response = await axiosInstance.post(conf.cluster, {
                jsonrpc: "2.0",
                method: "getAsset",
                id: "rpd-op-123",
                params: {id: list_[i].asset_b},
              });
              list_[i].asset_b_data = response.data.result;
              nft_img_2 = '<a href="' + conf.cnft_explorer + list_[i].asset_b +'" target="_blank"><img src="'+list_[i].asset_b_data.content.links.image+'" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].asset_b_data.content.metadata.name + '</span></span></div>';
            }
            else{
              list_[i].asset_b = "";
            }
            
            if (list_[i].swap_sol_amount > 0) {
              token_img_1 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_sol_amount + '</span></span><span class="smart_symbol">SOL</span></div>';
            }            
            
            if (list_[i].swap_tokens_amount > 0) {
//               token_img_2 = '<a href="' + conf.cnft_explorer + '11111111111111111111111111111111" target="_blank"><img src="/img/sol.png" class="smart_default_nft" /></a>';
              token_img_2 = '<a href="' + conf.cnft_explorer + list_[i].swap_tokens_mint + '" target="_blank"><img src="' + list_[i].swap_tokens_image + '" class="smart_default_nft" /></a>';
              changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">-</span><span class="smart_value smart_down">' + list_[i].swap_tokens_amount + '</span></span><span class="smart_symbol">' + list_[i].swap_tokens_symbol + '</span></div>';
            }
            
            response = await axiosInstance.post(conf.cluster, {
              jsonrpc: "2.0",
              method: "getAsset",
              id: "rpd-op-123",
              params: {id: list_[i].asset_a},
            });
            list_[i].asset_a_data = response.data.result;
            changes += '<div class="smart_row"><span class="smart_change"><span class="smart_direction">+</span><span class="smart_value smart_up">' + list_[i].asset_a_data.content.metadata.name + '</span></span></div>';
            nft_img_1 = '<a href="' + conf.cnft_explorer + list_[i].asset_a +'" target="_blank"><img src="'+list_[i].asset_a_data.content.links.image+'" class="smart_default_1" /></a>';
            
            let smart_item = '<li class="smart_row_time">' + item_date + '</li>';
            smart_item += '<li class="smart_row_box" data-link="' + list_[i].asset_a + '-' + list_[i].asset_b + '">' + changes + '</li>';
            smart_item += '<li><div class="smart_right_asset">' + nft_img_2 + token_img_1 + token_img_2 + '</div><img src="/img/swap.svg" class="smart_icon"><div class="smart_left_asset">'+ nft_img_1 +'</div></li>';
            let first_10 = list_[i].peer_a.substring(0, 10);
            let last_10 = list_[i].peer_a.substr(list_[i].peer_a.length - 10);
            let peer = first_10 + "..." + last_10;
            smart_item += '<li class="smart_peer" data-peer="' + list_[i].peer_a + '">' + peer + '</li>';
            if(!$("[data-core_received='"+list_[i].acct+"']").length){
              $("#core_received").prepend('<ul class="core_received smart_ul" data-core_received="' + list_[i].acct + '">' + smart_item + '</ul>');
            }
          }
        }
      }
      
      // resize
      $("#smart_scroll").getNiceScroll().resize();
      
      // notify
      if (do_notify > 0) {
        notify("Pending Proposals!", "You have " + do_notify + " pending trade proposals.", conf.host + "/img/favicon.png");
      }
      // notify
      
      $(".smart_loader").remove();
      
    }
  }
  
  $(document).delegate("._smart_mode_", "click", async function() {
    let id = $(this).attr("id");
    let smart_mode_key = $("#smart_tool_mode").attr("data-key");
    if(id == "next_smart_mode"){
      if(smart_mode_key == (smart_modes.length - 1)){smart_mode_key = 0;}
      else{
        smart_mode_key++;
      }
    }
    else if(id == "prev_smart_mode"){
      if(smart_mode_key == 0){smart_mode_key = (smart_modes.length - 1);}
      else{
        smart_mode_key--;
      }
    }
    let smart_mode = smart_modes[smart_mode_key];
    $("#smart_tool_mode").attr("data-key", smart_mode_key);
    $("#smart_tool_mode").attr("data-mode", smart_mode.id);
    $("#smart_tool_mode").html(smart_mode.standard);
    $(".smart_active").click();
  });
  
  $(document).delegate(".smart_tool_title", "click", async function() {
    let selected = $(this).attr("id");
    let smart_mode = $("#smart_tool_mode").attr("data-mode");
    if (selected == "smart_tool_reload") {
      $("#smart_tool_reload img").addClass("smart_rotate");
      let _mode_ = $("#smart_tool_mode").attr("data-mode");
      $("#"+_mode_+"_sent ul, #"+_mode_+"_received ul").remove();
      $("#smart_scroll").append('<div class="smart_loader"></div>');
      await syncProposals($("#smart_tool_mode").attr("data-mode")).then(function(){
        setTimeout(function(){
          $(".smart_loader").remove();
          $("#smart_tool_reload img").removeClass("smart_rotate");
        },1000);
      });
    }
    else{
      $(".sent_received").hide();
      $(".smart_tool_title").removeClass("smart_active");
      if (selected == "smart_tool_received") {
        $("#"+smart_mode+"_received").show();
        $(this).addClass("smart_active");
      } 
      else if (selected == "smart_tool_sent") {
        $("#"+smart_mode+"_sent").show();
        $(this).addClass("smart_active");
      }
    }
    $("#smart_scroll").getNiceScroll().resize();
  });
  
  // view received spl contracts from smart panel
  $(document).delegate("#spl_received .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/spl/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  // view received spl contracts from smart panel
  $(document).delegate("#spl_sent .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/spl/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  
  // view sent cnft contracts from smart panel
  $(document).delegate("#cnft_sent .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  }); 
  // view received cnft contracts from smart panel
  $(document).delegate("#cnft_received .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  
  // view sent nft contracts from smart panel
  $(document).delegate("#nft_sent .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  }); 
  // view received nft contracts from smart panel
  $(document).delegate("#nft_received .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  
  // view sent nft contracts from smart panel
  $(document).delegate("#pnft_sent .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  }); 
  // view received nft contracts from smart panel
  $(document).delegate("#pnft_received .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });

  // view sent core contracts from smart panel
  $(document).delegate("#core_sent .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  }); 
  // view received core contracts from smart panel
  $(document).delegate("#core_received .smart_row_box", "click", function() {
    reset_viewer();
    $("#mode_nft").click();
    $("#nav_view").click();
    let qlink = conf.host + "/swap/" + $(this).attr("data-link");
    history.pushState("", "", qlink);
    swap_viewer();
    $("#scroll_wrapper").getNiceScroll(0).doScrollTop(0, 1000);
  });
  
  // copy peer
  $(document).delegate(".smart_peer", "click", function() {
    copy($(this).attr("data-peer"));
    alert("Copied!");
  });

  // filter token list
  $(document).on("keyup", "#swap_token_filter", function() {
    let query = $(this).val();
    query = query.trim();
    if(query=="" || query==" "){
      $("#swap_token_list ul").show();
    }
    else{
      $("#swap_token_list ul").each(function(){
        let symbol_ = $(this).find(".token_symbol").html();
        symbol_ = symbol_.trim()
        symbol_ = symbol_.toLowerCase();
        let query_ = query.toLowerCase();
        let matches = symbol_.match(query_);
        if(matches==null){$(this).hide();}
        else{$(this).show();}
      });
    }
    $("#swap_token_list").getNiceScroll().resize();
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
  $("#swap_token_list").niceScroll({
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
  $("#bob_chooser_list").niceScroll({
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
  for (let k = 0; k < spl_tokens.length; k++) {
    let item = spl_tokens[k];
    if(typeof item.img != "undefined" && item.img != false){
      $("#swap_token_list").append('<ul data-iid="'+k+'" data-cmc="' + item.cmc + '" data-id="' + item.address + '"><li><img class="token_image" src="'+item.img+'" onerror="badImg('+k+')" /></li><li class="token_symbol">(' + item.symbol + ')</li><li class="token_name">' + item.name + '</li></ul>');
    }
  }
  $("#swap_token_list ul[data-id='AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3']").click();
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
  $("select.tx_priority, select.donation_priority, select.nft_donation_priority").val(conf.default_priority);
  setTimeout(() => {
    $("#init_cover").fadeOut(400);
    $("#init_loader").fadeOut(400);
    setTimeout(() => {

      alert("McSwap OTC is currently being tested. Production Launch Soon!");

      $("#center_logo").addClass("animate__animated animate__zoomIn").show();
//       setTimeout(() => {
//         $("#socials").addClass("animate__animated animate__fadeInUp").show();
//       }, 1000);
    }, 700);
  }, 2000);
  ////////////////////////////////////////////////////////////////////////// 

});