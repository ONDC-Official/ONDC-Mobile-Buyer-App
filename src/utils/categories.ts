export const CATEGORIES: any = [
  {
    id: '1',
    name: 'Fashion',
    shortName: 'Fashion',
    Icon: require('../assets/categories/fashion.png'),
    routeName: 'Fashion',
    domain: 'ONDC:RET12',
  },
  {
    id: '2',
    name: 'Grocery',
    shortName: 'Grocery',
    Icon: require('../assets/categories/grocery.png'),
    routeName: 'Grocery',
    domain: 'ONDC:RET10',
  },
  {
    id: '3',
    name: 'Electronics',
    shortName: 'Electronics',
    Icon: require('../assets/categories/electronis.png'),
    routeName: 'Electronics',
    domain: 'ONDC:RET14',
  },
  {
    id: '4',
    name: 'Food & Beverage',
    shortName: 'F&B',
    Icon: require('../assets/categories/food_beverage.png'),
    routeName: 'F&B',
    domain: 'ONDC:RET11',
  },
  {
    id: '5',
    name: 'Home & Decor',
    shortName: 'Home & Decor',
    Icon: require('../assets/categories/home_decor.png'),
    routeName: 'Home & Decor',
    domain: 'ONDC:RET16',
  },
  {
    id: '6',
    name: 'Health & Wellness',
    shortName: 'Health & Wellness',
    Icon: require('../assets/categories/health_wellness.png'),
    routeName: 'Health & Wellness',
    domain: 'ONDC:RET18',
  },
  {
    id: '7',
    name: 'Beauty & Personal Care',
    shortName: 'BPC',
    Icon: require('../assets/categories/beauty_personal_care.png'),
    routeName: 'BPC',
    domain: 'ONDC:RET13',
  },
  {
    id: '8',
    name: 'Agriculture',
    shortName: 'Agriculture',
    Icon: require('../assets/categories/agriculture.png'),
    routeName: 'Agriculture',
    domain: 'ONDC:AGR10',
  },
  {
    id: '9',
    name: 'Appliances',
    shortName: 'Appliances',
    Icon: require('../assets/categories/appliances.png'),
    routeName: 'Appliances',
    domain: 'ONDC:RET15',
  },
];

export const PRODUCT_SUBCATEGORY: any = {
  Grocery: [
    {
      key: 'Fruits and Vegetables',
      imageUrl: require('../assets/subCategories/grocery/FruitsVegetables.png'),
    },
    {
      key: 'Masala & Seasoning',
      imageUrl: require('../assets/subCategories/grocery/MasalaSeasoning.png'),
    },
    {
      key: 'Oil & Ghee',
      imageUrl: require('../assets/subCategories/grocery/OilGhee.png'),
    },
    {
      key: 'Eggs, Meat & Fish',
      imageUrl: require('../assets/subCategories/grocery/EggsMeatFish.png'),
    },
    {
      key: 'Cleaning & Household',
      imageUrl: require('../assets/subCategories/grocery/CleaningHousehold.png'),
    },
    {
      key: 'Bakery, Cakes & Dairy',
      imageUrl: require('../assets/subCategories/grocery/BakeryCakesDairy.png'),
    },
    {
      key: 'Pet Care',
      imageUrl: require('../assets/subCategories/grocery/PetCare.png'),
    },
    {
      key: 'Dairy and Cheese',
      imageUrl: require('../assets/subCategories/grocery/DairyCheese.png'),
    },
    {
      key: 'Snacks, Dry Fruits, Nuts',
      imageUrl: require('../assets/subCategories/grocery/SnacksDryFruitsNuts.png'),
    },
    {
      key: 'Pasta, Soup and Noodles',
      imageUrl: require('../assets/subCategories/grocery/PastaSoupandNoodles.png'),
    },
    {
      key: 'Cereals and Breakfast',
      imageUrl: require('../assets/subCategories/grocery/CerealsandBreakfast.png'),
    },
    {
      key: 'Sauces, Spreads and Dips',
      imageUrl: require('../assets/subCategories/grocery/SaucesSpreadsandDips.png'),
    },
    {
      key: 'Chocolates and Biscuits',
      imageUrl: require('../assets/categories/grocery.png'),
    },
    {
      key: 'Cooking and Baking Needs',
      imageUrl: require('../assets/categories/grocery.png'),
    },
    {
      key: 'Tinned and Processed Food',
      imageUrl: require('../assets/subCategories/grocery/TinnedandProcessedFood.png'),
    },
    {
      key: 'Atta, Flours and Sooji',
      imageUrl: require('../assets/subCategories/grocery/AttaFloursandSooji.png'),
    },
    {
      key: 'Rice and Rice Products',
      imageUrl: require('../assets/subCategories/grocery/RiceandRiceProducts.png'),
    },
    {
      key: 'Dals and Pulses',
      imageUrl: require('../assets/subCategories/grocery/DalsandPulses.png'),
    },
    {
      key: 'Salt, Sugar and Jaggery',
      imageUrl: require('../assets/subCategories/grocery/SaltSugarandJaggery.png'),
    },
    {
      key: 'Energy and Soft Drinks',
      imageUrl: require('../assets/subCategories/grocery/EnergyandSoftDrinks.png'),
    },
    {
      key: 'Water',
      imageUrl: require('../assets/subCategories/grocery/Water.png'),
    },
    {
      key: 'Tea and Coffee',
      imageUrl: require('../assets/subCategories/grocery/TeaandCoffee.png'),
    },
    {
      key: 'Fruit Juices and Fruit Drinks',
      imageUrl: require('../assets/subCategories/grocery/FruitJuicesandFruitDrinks.png'),
    },
    {
      key: 'Snacks and Namkeen',
      imageUrl: require('../assets/subCategories/grocery/SnacksandNamkeen.png'),
    },
    {
      key: 'Ready to Cook and Eat',
      imageUrl: require('../assets/subCategories/grocery/ReadytoCookandEat.png'),
    },
    {
      key: 'Pickles and Chutney',
      imageUrl: require('../assets/subCategories/grocery/PicklesandChutney.png'),
    },
    {
      key: 'Indian Sweets',
      imageUrl: require('../assets/subCategories/grocery/IndianSweets.png'),
    },
    {
      key: 'Frozen Vegetables',
      imageUrl: require('../assets/subCategories/grocery/FrozenVegetables.png'),
    },
    {
      key: 'Frozen Snacks',
      imageUrl: require('../assets/categories/grocery.png'),
    },
    {
      key: 'Gift Voucher',
      imageUrl: require('../assets/subCategories/grocery/GiftVoucher.png'),
    },
  ],
  Appliances: [
    {
      key: 'Air Purifier',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Dehumidifier',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Humidifier',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Air Cleaner Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Air Conditioner',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Air Conditioner Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Air Cooler',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Trimmer',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Shaver',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Epilator',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Hair Straightener',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Hair Dryer',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Hair Curler',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Hair Crimper',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Electric Brush',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Electric Iron',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Electric Sewing Machine',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Heater',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Heater Cables',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Air Heater',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Coffee Maker',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Beverage Maker',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Roti Maker',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Induction Cooktop',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Sandwich Maker',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Electric Cooker',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Electric Kettle',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Microwave Oven',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'OTG',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Toaster',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Electric Air Fryer',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Cooking Appliance Accessories ',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Coffee Grinder',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Food Processor',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Pasta Maker',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Food Processor Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Blender',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Juicer',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Mixer Grinder',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Wet Grinder',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Dishwasher',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Dishwasher Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Electric Chimney',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Kitchen Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Freezer',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Refrigerator',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Refrigerator Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Vacuum Cleaner',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Vacuum Cleaner Parts and Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Washing Machine',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Washing Machine Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Purifier',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Cooler',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Dispenser',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Purifier Service Kit',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Purifier Filter',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Purifier Candle',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Purifier Pipe',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Purifier Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Water Cooler Accessories',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Inverter',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Inverter Batteries',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Battery tray',
      imageUrl: require('../assets/categories/appliances.png'),
    },
    {
      key: 'Voltage Stabilizer',
      imageUrl: require('../assets/categories/appliances.png'),
    },
  ],
  BPC: [
    {
      key: 'Fragrance',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/Fragrance.png'),
    },
    {
      key: 'Bath Soaps and Gels',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/BathSoapsandGels.png'),
    },
    {
      key: 'Hair Oils, Care, and Styling',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/HairOilsCareandStyling.png'),
    },
    {
      key: 'Shampoos and Conditioners',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/ShampoosandConditioners.png'),
    },
    {
      key: 'Shaving and Grooming',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/ShavingandGrooming.png'),
    },
    {
      key: 'Beard Care and Tools',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/BeardCareandTools.png'),
    },
    {
      key: 'Grooming Tools and Accessories',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/GroomingToolsandAccessories.png'),
    },
    {
      key: 'Makeup - Nail Care',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupNailCare.png'),
    },
    {
      key: 'Makeup - Eyes',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupEyes.png'),
    },
    {
      key: 'Makeup - Face',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupFace.png'),
    },
    {
      key: 'Makeup - Lips',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupLips.png'),
    },
    {
      key: 'Makeup - Body',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupBody.png'),
    },
    {
      key: 'Makeup - Remover',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupRemover.png'),
    },
    {
      key: 'Makeup - Sets and Kits',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupSetsandKits.png'),
    },
    {
      key: 'Makeup - Tools and Brushes',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupToolsandBrushes.png'),
    },
    {
      key: 'Makeup - Kits and Combos',
      imageUrl: require('../assets/subCategories/beautyPersonalCare/MakeupKitsandCombos.png'),
    },
    {
      key: 'Skin Care - Face Cleansers',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Skin Care - Hand and Feet',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Body Care - Cleansers',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Body Care - Moisturizers',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Body Care - Loofah and Other Tools',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Body Care - Bath Salt and Additives',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Hair Care - Shampoo, Oils, Conditioners',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Skin Care - Lotions, Moisturisers, and Creams',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Skin Care - Oils and Serums',
      imageUrl: require('../assets/categories/beauty_personal_care.png'),
    },
    {
      key: 'Gift Voucher',
      imageUrl: require('../assets/subCategories/grocery/GiftVoucher.png'),
    },
  ],
  Fashion: [
    {
      key: 'Shirts',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'T Shirts',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sweatshirts',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Kurtas & Kurta Sets',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Jackets & Coats',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sweaters',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Suits',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sherwanis',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Track Shirts',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Track Suits',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Unstitched Fabrics',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Dresses',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Tops',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Trousers',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Capris',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Coordinates',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Playsuits',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Jumpsuits',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Shrugs & Blouses',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Blazers & Waistcoats',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Tights, Leggings & Jeggings',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Track Pants',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Jeans',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Shorts',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Joggers',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Dhotis & Dhoti Pants',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Churidars',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Salwars',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Dungarees & Jumpsuits',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Skirts',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Clothing Sets',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Belts',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Caps & Hats',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Kurtis, Tunics',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sarees',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Ethnic Wear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Palazzos',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Dress Materials',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Lehenga Cholis',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Dupattas & Shawls',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Burqas & Hijabs',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Blouses',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Blouse Pieces',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Briefs',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Boxers',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Vests',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Robes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Night Suits',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Thermal Wear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Swim Bottoms',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Swimwear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Bra',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Shapewear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sleepwear & Loungewear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Camisoles',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Lingerie Sets & Accessories',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Bath Robes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Towels',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Pyjamas',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Party Wear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Innerwear & Sleepwear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Nightwear & Loungewear',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Watches',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Gloves',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Socks',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Stockings',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Laces',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Soles & Charms',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Shoe Racks & Organisers',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Shoe Care - Accessories',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Flip-Flops & Flats',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sandals & Floaters',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Backpacks',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Handbags',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Trolley, Luggage & Suitcases',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Formal Shoes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Casual Shoes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sports Shoes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Outdoor Shoes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Work & Safety Shoes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Ethnic Shoes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Boots',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Heels',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Contact Lenses',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Eye Glasses',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Eye Glass Frames',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Sunglasses',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Contact Lens Cases',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Contact Lens Solutions',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Contact Lens Tweezers',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Eyeglasses Pouches & Cases',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Microfiber Wipes',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Eyewear Slings',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Bracelets',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Chains',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Mangalsutra',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Anklets',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Bangles & Bracelets',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Necklaces',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Earrings',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Jewellery Sets',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Nosepins & Noserings',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Pendants',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Rings',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Toe Rings',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Gold Coins',
      imageUrl: require('../assets/categories/fashion.png'),
    },
    {
      key: 'Brooch',
      imageUrl: require('../assets/categories/fashion.png'),
    },
  ],
  'Home & Decor': [
    {
      key: 'Home Decor',
      imageUrl: require('../assets/subCategories/homeDecor/HomeDecor.png'),
    },
    {
      key: 'Furniture',
      imageUrl: require('../assets/subCategories/homeDecor/Furniture.png'),
    },
    {
      key: 'Home Furnishing - Bedding and Linen',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Cleaning Supplies',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Electricals',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Bathroom and Kitchen fixtures',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Garden & Outdoor',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Sports and Fitness Equipment',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Cookware',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Serveware',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Kitchen Storage and Containers',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Kitchen Tools',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Closet/Laundry/Shoe Organization',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Toys and Games',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Stationery',
      imageUrl: require('../assets/categories/home_decor.png'),
    },
    {
      key: 'Gift Voucher',
      imageUrl: require('../assets/subCategories/grocery/GiftVoucher.png'),
    },
  ],
  'F&B': [],
  Electronics: [
    {
      key: 'Mobile Phone',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Smart Watch',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Headset',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Laptop',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Desktop',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Tablet',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Keyboard',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Monitor',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Mouse',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Power Bank',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Earphone',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'True Wireless Stereo (TWS)',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Adapter',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Cable',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Extension Cord',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Audio Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Home Audio',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Microphone',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Speaker',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Vehicle Audio',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Camcorder',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Camera',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Camera Bag',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Batteries',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Charger',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Camera Lens',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Photo Printer',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Tripod',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Camera Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'UPS',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Networking Device',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Printer',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Printer Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Storage Drive',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Pen Drive',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Memory Card',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Computer Component',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Cooling Pad',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Docking Station',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Keyboard Guard',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Laptop Skin',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Laptop Stand',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Mousepad',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Laptop Bag',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Screen Protector',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Computer Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Computer Software',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Ebook Reader',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Tablet Accessories ',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Gaming Controller',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Gaming Chair',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Gaming Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Gaming Console',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Video Games',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Mobile Cover',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Mobile Mount',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Mobile Screen Guard',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Selfie Stick',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Mobile Skin Sticker',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Biometrics',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Home Alarm',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Home Automation',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Smart Switch',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Smart Lighting',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Home Safe',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Intercom',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Sensor',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Smart TV',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Standard TV',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'TV Mount',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Remote',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Streaming Device',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'TV Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Virtual Reality Headset',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: '3D Glasses',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: '3D Modulator',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Projector',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Projector Screen',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Projector Mount',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Projector Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'TV Part',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'TV Remote',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Set Top Box',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'TV Stand',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Video Player',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Digital Photo Frame',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Home Theatre Projector',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Video Player Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Smart Band',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Smart Glasses',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Watch Strap Band',
      imageUrl: require('../assets/categories/electronis.png'),
    },
    {
      key: 'Wearable Accessories',
      imageUrl: require('../assets/categories/electronis.png'),
    },
  ],
  'Health & Wellness': [
    {
      key: 'Pain Relief',
      imageUrl: require('../assets/subCategories/healthWellness/PainRelief.png'),
    },
    {
      key: 'Nutrition and Fitness Supplements',
      imageUrl: require('../assets/subCategories/healthWellness/NutritionFitnessSupplements.png'),
    },
    {
      key: 'Speciality Care',
      imageUrl: require('../assets/subCategories/healthWellness/SpecialityCare.png'),
    },
    {
      key: 'Covid Essentials',
      imageUrl: require('../assets/subCategories/healthWellness/CovidEssentials.png'),
    },
    {
      key: 'Diabetes Control',
      imageUrl: require('../assets/subCategories/healthWellness/DiabetesControl.png'),
    },
    {
      key: 'Healthcare & Fitness Devices',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Ayurvedic',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Homeopathy',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Unani and Siddha',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Elder Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Baby Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Orthopaedic Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Mobility Aids',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Medicated Hair Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Medicated Skin Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Speciality Face Cleansers',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Gastric Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'ENT Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Eye Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Cold and Cough',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Sexual Wellness',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Feminine Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Maternity Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Nursing and Feeding',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Hand Wash',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Sanitizers',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Baby Care - Wipes and Buds',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Baby Care - Rash Creams',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Baby Care - Diapers and Accessories',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Health and Safety',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Oral Care',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Contraceptives',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Breathe Easy',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Health Foods and Drinks',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Wound Care and Dressings',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Surgicals',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Mental Wellness',
      imageUrl: require('../assets/categories/health_wellness.png'),
    },
    {
      key: 'Gift Voucher',
      imageUrl: require('../assets/subCategories/grocery/GiftVoucher.png'),
    },
  ],
  Agriculture: [
    {
      key: 'Seed',
      imageUrl: require('../assets/subCategories/agriculture/Seeds.png'),
    },
    {
      key: 'Pesticide',
      imageUrl: require('../assets/subCategories/agriculture/Pesticide.png'),
    },
    {
      key: 'Fertilizer',
      imageUrl: require('../assets/subCategories/agriculture/Fertilizer.png'),
    },
    {
      key: 'Organic Crop Protection',
      imageUrl: require('../assets/subCategories/agriculture/OrganicCropProtection.png'),
    },
    {
      key: 'Organic Crop Nutrition',
      imageUrl: require('../assets/subCategories/agriculture/OrganicCropNutrition.png'),
    },
    {
      key: 'Tools and Machinery',
      imageUrl: require('../assets/subCategories/agriculture/ToolsandMachinery.png'),
    },
    {
      key: 'Cattle Feed',
      imageUrl: require('../assets/subCategories/agriculture/CattleFeed.png'),
    },
  ],
};
