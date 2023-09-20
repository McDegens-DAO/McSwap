// set group details
async function group_details(id,name) {
  let rebld = {};
  let sorter = name.split("#");
  rebld.reset = 0;
  if (id == "WoMbiTtXKwUtf4wosoffv45khVF8yA2mPkinGosCFQ4") {
  if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}
    rebld.collection = "The Faceless";
    rebld.publisher = "Drip";
  }
  else if (id == "SoLPr7zxggXh9JUt8NGKyxLZGJmyWqgawcs9N9hmatP") {
  if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}
    rebld.collection = "Binary Force";
    rebld.publisher = "Drip";
  }   
  else if (id == "DASHYFhWiCoe8PNCHZJAjmvGBBj8SLtkvW2uYV2e3FrV") {
  if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}
    rebld.collection = "Dashers";
    rebld.publisher = "Drip";
  }
  else if (id == "3RtjqLoF6RMDWg2yUupgHZYqBFVVB8RjzNzXCHRQfF5R") {
  if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}
    rebld.collection = "PBOT";
    rebld.publisher = "PIKL";
  } 
  else if (id == "6S4bjRhpByPRh43J6qsBuZKjhHqYy5azcFcq5kHR5vjM") {
  if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}else{rebld.sort=1000004;}
    rebld.collection = "PIKL OG";
    rebld.publisher = "McDegens";
  } 
  else if (id == "DGPTxgKaBPJv3Ng7dc9AFDpX6E7kgUMZEgyTm3VGWPW6") {
    if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}else{rebld.sort=1000005;}
    rebld.collection = "DegenPoet";
    rebld.publisher = "Drip";
  } 
  else if (id == "DRiP2Pn2K6fuMLKQmt5rZWyHiUZ6WK3GChEySUpHSS4x") {
    if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}else{rebld.sort=1000006;}
    rebld.collection = "DegenPoet";
    rebld.publisher = "Drip";
  }  
  else if (id == "3zGysjVRr28as3xnWquxYEG9WSjrCjj4DiVqfULzR77S") {
    if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}else{rebld.sort=1000007;}
    rebld.collection = "McSwap";
    rebld.publisher = "McDegens";
  } 
  else if (id == "5rBoLMjoUrEmbYJCShbgNe7xgovqnxsKXJTkz4pci4eH") {
    if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}else{rebld.sort=1000008;}
    rebld.collection = "McDegens";
    rebld.publisher = "McDegens";
  } 
  else if (id == "Hz4SqVCfH9Um7DTKimkiP12PuumnxctvtpB9bAH9QqhV") {
    if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}else{rebld.sort=1000009;}
    rebld.collection = "Underdog";
    rebld.publisher = "Underdog";
  }
  else {
    rebld.sort = 1000010;
  }
  return rebld;
}