// combo tags for wallet filters
const combos_ = [
  {
    "name": "McDegen",
    "traits": [{
      "Headwear": "McDegens"
    }, {
      "Outfits": "McDegens"
    }]
  },
  {
    "name": "McDegen Trainee",
    "traits": [{
      "Headwear": "McDegens"
    }, {
      "Outfits": "Hawain Shirt"
    }]
  },
  {
    "name": "McDegen CEO",
    "traits": [{
      "Headwear": "McDegens"
    }, {
      "Outfits": "Red Suit"
    }]
  },
  {
    "name": "Admirals",
    "traits": [{
      "Headwear": "Admiral"
    }, {
      "Outfits": "Admiral"
    }]
  },
  {
    "name": "Tequila Cartel",
    "traits": [{
      "Headwear": "Sombrero"
    }, {
      "Outfits": "Poncho"
    }]
  },
  {
    "name": "Soulless",
    "traits": [{
      "Hoods": "Undead"
    }, {
      "Masks": "Skull"
    }]
  },
  {
    "name": "Minifig",
    "traits": [{
      "Hoods": "Gold"
    }, {
      "Masks": "Gold"
    }]
  },
  {
    "name": "Mafia",
    "traits": [{
      "Headwear": "Fedora"
    }, {
      "Outfits": ["Blue Suir", "Red Suit"]
    }]
  },
  {
    "name": "NYPD",
    "traits": [{
      "Headwear": "Blue Cap"
    }, {
      "Outfits": "Police"
    }]
  },
  {
    "name": "Prison Gang",
    "traits": [{
      "Headwear": "Fedora"
    }, {
      "Outfits": "Prisoner"
    }]
  },
  {
    "name": "Tomb Raider",
    "traits": [{
      "Headwear": "Howdy"
    }, {
      "Outfits": "Explorer"
    }]
  },
  {
    "name": "Mummy King",
    "traits": [{
      "Headwear": "Crown"
    }, {
      "Outfits": "Mummy"
    }]
  },
  {
    "name": "Last Crusade",
    "traits": [{
      "Headwear": "Arrow"
    }, {
      "Outfits": "Explorer"
    }]
  },
  {
    "name": "Military",
    "traits": [{
      "Headwear": "Military"
    }, {
      "Outfits": "Military"
    }]
  },
  {
    "name": "Gangs of New York",
    "traits": [{
      "Headwear": ["Top Hat", "Fedora"]
    }, {
      "Outfits": "Overalls"
    }]
  },
  {
    "name": "Gentleman",
    "traits": [{
      "Headwear": "Top Hat"
    }, {
      "Outfits": ["Blue Suir", "Red Suit"]
    }]
  },
  {
    "name": "Vendetta",
    "traits": [{
      "Headwear": "Pirate"
    }, {
      "Masks": "Hacker"
    }]
  },
  {
    "name": "Men in Black",
    "traits": [{
      "Headwear": "UFO"
    }, {
      "Outfits": ["Blue Suir", "Red Suit"]
    }]
  },
  {
    "name": "Everyday Hero",
    "traits": [{
      "Headwear": "Blue Cap"
    }, {
      "Outfits": "Superhero"
    }]
  },
  {
    "name": "Cowboy",
    "traits": [{
      "Headwear": "Howdy"
    }, {
      "Outfits": "Overalls"
    }]
  },
  {
    "name": "Farmer",
    "traits": [{
      "Headwear": ["Sun Hat", "Sombrero"]
    }, {
      "Outfits": "Overalls"
    }]
  },
  {
    "name": "Pioneer",
    "traits": [{
      "Headwear": "Arrow"
    }, {
      "Outfits": "Overalls"
    }]
  },
  {
    "name": "Bandito",
    "traits": [{
      "Headwear": "Sombrero"
    }, {
      "Outfits": "Military"
    }]
  },
  {
    "name": "Roughneck",
    "traits": [{
      "Headwear": "Admiral"
    }, {
      "Outfits": "Overalls"
    }]
  },
  {
    "name": "Swash Buckler",
    "traits": [{
      "Headwear": "Pirate"
    }, {
      "Outfits": "Mummy"
    }]
  },
  {
    "name": "Prince",
    "traits": [{
      "Headwear": "Crown"
    }, {
      "Outfits": "Admiral"
    }]
  },
  {
    "name": "King",
    "traits": [{
      "Headwear": "Crown"
    }, {
      "Outfits": "McDegens"
    }]
  },
  {
    "name": "Hawaiian King",
    "traits": [{
      "Headwear": "Crown"
    }, {
      "Outfits": "Hawain Shirt"
    }]
  },
  {
    "name": "Tourist",
    "traits": [{
      "Headwear": "Sun Hat"
    }, {
      "Outfits": "Hawain Shirt"
    }]
  },
  {
    "name": "Fiesta",
    "traits": [{
      "Headwear": "Sombrero"
    }, {
      "Outfits": "Hawain Shirt"
    }]
  },
  {
    "name": "Only Possible On Solana",
    "traits": [{
      "Headwear": "Big Brain Cap"
    }, {
      "Backgrounds": "Solana Gradient"
    }]
  },
  {
    "name": "Protagonist",
    "traits": [{
      "Headwear": "Protagonist Headband"
    }, {
      "Outfits": "Protagonist"
    }]
  },
  {
    "name": "Monster Hunter",
    "traits": [{
      "Headwear": "Monster Hunter Cap"
    }, {
      "Outfits": "Monster Hunter"
    }]
  },
  {
    "name": "Zombie",
    "traits": [{
      "Hoods": "Undead"
    }, {
      "Masks": "Green"
    }]
  },
  {
    "name": "Monke",
    "traits": [{
      "Hoods": "Black"
    }, {
      "Masks": "Wood"
    }]
  },
  {
    "name": "Ape",
    "traits": [{
      "Hoods": "Black"
    }, {
      "Masks": "Skull"
    }]
  },
  {
    "name": "Boogle",
    "traits": [{
      "Hoods": "Black"
    }, {
      "Masks": "White"
    }]
  },
  {
    "name": "Mountie",
    "traits": [{
      "Headwear": "Howdy"
    }, {
      "Outfits": "McDegens"
    }]
  },
  {
    "name": "Wombo Combo",
    "traits": [{
      "Headwear": "Fedora"
    }, {
      "Outfits": "Hawain Shirt"
    }]
  },
  {
    "name": "Hacker",
    "traits": [{
      "Headwear": "Top Hat"
    }, {
      "Masks": "Hacker"
    }, {
      "Outfits": ["Blue Suir", "Red Suit"]
    }]
  },
  {
    "name": "Calvin",
    "traits": [{
        "Headwear": "McDegens"
      },
      {
        "Outfits": "McDegens"
      },
      {
        "Masks": "Clown"
      }
    ]
  },
  {
    "name": "Tokers",
    "traits": [{
        "Headwear": "McDegens"
      },
      {
        "Outfits": "McDegens"
      },
      {
        "Hoods": "Blue"
      }
    ]
  }
];