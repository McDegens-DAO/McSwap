// set collection details
async function group_details(id,name) {
  let rebld = {};
  let sorter = name.split("#");
  if(typeof sorter[1]!="undefined"){rebld.sort=parseInt(sorter[1].trim());}
  if (id == "WoMbiTtXKwUtf4wosoffv45khVF8yA2mPkinGosCFQ4") {
    rebld.collection = "The Faceless";
    rebld.publisher = "Drip";
  }
  else if (id == "SoLPr7zxggXh9JUt8NGKyxLZGJmyWqgawcs9N9hmatP") {
    rebld.collection = "Binary Force";
    rebld.publisher = "Drip";
  }   
  else if (id == "DASHYFhWiCoe8PNCHZJAjmvGBBj8SLtkvW2uYV2e3FrV") {
    rebld.collection = "Dashers";
    rebld.publisher = "Drip";
  }
  else if (id == "3RtjqLoF6RMDWg2yUupgHZYqBFVVB8RjzNzXCHRQfF5R") {
    rebld.collection = "PBOT";
    rebld.publisher = "PIKL";
  } 
  else if (id == "6S4bjRhpByPRh43J6qsBuZKjhHqYy5azcFcq5kHR5vjM") {
    rebld.collection = "PIKL OG";
    rebld.publisher = "McDegens";
  } 
  else if (id == "DGPTxgKaBPJv3Ng7dc9AFDpX6E7kgUMZEgyTm3VGWPW6") {
    rebld.collection = "DegenPoet";
    rebld.publisher = "Drip";
  } 
  else if (id == "DRiP2Pn2K6fuMLKQmt5rZWyHiUZ6WK3GChEySUpHSS4x") {
    rebld.collection = "DegenPoet";
    rebld.publisher = "Drip";
  }  
  else if (id == "3zGysjVRr28as3xnWquxYEG9WSjrCjj4DiVqfULzR77S") {
    rebld.collection = "McSwap";
    rebld.publisher = "McDegens";
  } 
  else if (id == "5rBoLMjoUrEmbYJCShbgNe7xgovqnxsKXJTkz4pci4eH") {
    rebld.collection = "McDegens";
    rebld.publisher = "McDegens";
  } 
  else if (id == "Hz4SqVCfH9Um7DTKimkiP12PuumnxctvtpB9bAH9QqhV") {
    rebld.collection = "Underdog";
    rebld.publisher = "Underdog";
  }
  else {
    rebld.sort = 0;
  }
  return rebld;
}
