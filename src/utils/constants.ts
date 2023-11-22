export const SEARCH_QUERY = {
  PRODUCT: 'Product',
  PROVIDER: 'Provider',
  CATEGORY: 'Category',
  UNKNOWN: 'Unknown',
};

export const UPDATE_TYPE = {
  RETURN: 'return',
  CANCEL: 'cancel',
};

export const PAYMENT_METHODS = {
  JUSPAY: {
    name: 'JUSPAY',
    type: 'ON-ORDER',
  },
  COD: {
    name: 'COD',
    orderType: 'ON-FULFILLMENT',
  },
};

export const ORDER_STATUS = {
  CANCELLED: 'Cancelled',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'Completed',
};

const ONDC_URL = 'https://ondc.org/';
export const POLICY_URL = ONDC_URL;

export const FAQS = ONDC_URL;

export const ONDC_POLICY = ONDC_URL;

export const CONTACT_US = ONDC_URL;

export const PRODUCT_SORTING = {
  RATINGS_HIGH_TO_LOW: 'Rating: High To Low',
  RATINGS_LOW_TO_HIGH: 'Ratings: Low To High',
  PRICE_HIGH_TO_LOW: 'Price: High To Low',
  PRICE_LOW_TO_HIGH: 'Price: Low To High',
};

export const APPLICATION_VERSION = '1.0.5';

export const SUB_CATEGORY_CATEGORY = {
  'Fruits and Vegetables': 'Grocery',
  'Masala & Seasoning': 'Grocery',
  'Oil & Ghee': 'Grocery',
  'Gourmet & World Foods': 'Grocery',
  Foodgrains: 'Grocery',
  'Eggs, Meat & Fish': 'Grocery',
  'Cleaning & Household': 'Grocery',
  Beverages: 'Grocery',
  'Beauty & Hygiene': 'Grocery',
  'Bakery, Cakes & Dairy': 'Grocery',
  'Kitchen Accessories': 'Grocery',
  'Baby Care': 'Grocery',
  'Snacks & Branded Foods': 'Grocery',
  'Pet Care': 'Grocery',
  Stationery: 'Grocery',
  'Packaged Commodities': 'Grocery',
  'Packaged Foods': 'Grocery',
  Continental: 'Food & Beverage',
  'Middle Eastern': 'Food & Beverage',
  'North Indian': 'Food & Beverage',
  'Pan-Asian': 'Food & Beverage',
  'Regional Indian': 'Food & Beverage',
  'South Indian': 'Food & Beverage',
  'Tex-Mexican': 'Food & Beverage',
  'World Cuisines': 'Food & Beverage',
  'Healthy Food': 'Food & Beverage',
  'Fast Food': 'Food & Beverage',
  Desserts: 'Food & Beverage',
  'Bakery, Cakes & Dairy (MTO)': 'Food & Beverage',
  'Bakes & Cakes': 'Food & Beverage',
  'Beverages (MTO)': 'Food & Beverage',
  'F&B': 'Food & Beverage',
};

export const TAGS = {
  non_veg: 'Non-Veg',
  veg: 'Veg',
};

export const CATEGORIES = [
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
];

export const PRODUCT_SUBCATEGORY = {
  Grocery: [
    {
      value: 'Fruits and Vegetables',
      key: 'Fruits and Vegetables',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Fruits and Vegetables.png',
    },
    {
      value: 'Masala & Seasoning',
      key: 'Masala & Seasoning',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Masala And Seasoning.png',
    },
    {
      value: 'Oil & Ghee',
      key: 'Oil & Ghee',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Oil And Ghee.png',
    },
    {
      value: 'Gourmet & World Foods',
      key: 'Gourmet & World Foods',
      protocolKey: '@ondc/org/statutory_reqs_prepackaged_food',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Gourmet And World Foods.png',
    },
    {
      value: 'Foodgrains',
      key: 'Foodgrains',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Foodgrains.png',
    },
    {
      value: 'Eggs, Meat & Fish',
      key: 'Eggs, Meat & Fish',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Eggs, Meat And Fish.png',
    },
    {
      value: 'Cleaning & Household',
      key: 'Cleaning & Household',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Cleaning And Household.png',
    },
    {
      value: 'Beverages',
      key: 'Beverages',
      protocolKey: '@ondc/org/statutory_reqs_prepackaged_food',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Beverages.png',
    },
    {
      value: 'Beauty & Hygiene',
      key: 'Beauty & Hygiene',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Beauty And Hygiene.png',
    },
    {
      value: 'Bakery, Cakes & Dairy',
      key: 'Bakery, Cakes & Dairy',
      protocolKey: '@ondc/org/statutory_reqs_prepackaged_food',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Bakery, Cakes And Dairy.png',
    },
    {
      value: 'Kitchen Accessories',
      key: 'Kitchen Accessories',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Kitchen Accessories.png',
    },
    {
      value: 'Baby Care',
      key: 'Baby Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Baby Care.png',
    },
    {
      value: 'Snacks & Branded Foods',
      key: 'Snacks & Branded Foods',
      protocolKey: '@ondc/org/statutory_reqs_prepackaged_food',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Snacks And Branded Foods.png',
    },
    {
      value: 'Pet Care',
      key: 'Pet Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Pet Care.png',
    },
    {
      value: 'Stationery',
      key: 'Stationery',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Grocery/Stationery.png',
    },
  ],
  BPC: [
    {
      value: 'Bath & Body',
      key: 'Bath & Body',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Bath & Body.png',
    },
    {
      value: 'Feminine Care',
      key: 'Feminine Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Feminine Care.png',
    },
    {
      value: 'Fragrance',
      key: 'Fragrance',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Fragrance.png',
    },
    {
      value: 'Hair Care',
      key: 'Hair Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Hair Care.png',
    },
    {
      value: 'Make Up',
      key: 'Make Up',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Make Up.png',
    },
    {
      value: "Men's Grooming",
      key: "Men's Grooming",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Men's Grooming.png",
    },
    {
      value: 'Oral Care',
      key: 'Oral Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Oral Care.png',
    },
    {
      value: 'Skin Care',
      key: 'Skin Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Skin Care.png',
    },
    {
      value: 'Maternity Care',
      key: 'Maternity Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Maternity Care.png',
    },
    {
      value: 'Nursing & Feeding',
      key: 'Nursing & Feeding',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Nursing & Feeding.png',
    },
    {
      value: 'Sexual Wellness & Sensuality',
      key: 'Sexual Wellness & Sensuality',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Sexual Wellness & Sensuality.png',
    },
    {
      value: 'Tools & Accessories',
      key: 'Tools & Accessories',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Beauty & Personal Care/Tools & Accessories.png',
    },
  ],
  Fashion: [
    {
      value: "Men's Fashion Accessories",
      key: "Men's Fashion Accessories",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Fashion Accessories.png",
    },
    {
      value: "Men's Footwear Accessories",
      key: "Men's Footwear Accessories",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Footwear Accessories.png",
    },
    {
      value: "Men's Topwear",
      key: "Men's Topwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Topwear.png",
    },
    {
      value: "Men's Bottomwear",
      key: "Men's Bottomwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Bottomwear.png",
    },
    {
      value: "Men's Innerwear & Sleepwear",
      key: "Men's Innerwear & Sleepwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Innerwear & Sleepwear.png",
    },
    {
      value: "Men's Bags & Luggage",
      key: "Men's Bags & Luggage",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Bags & Luggage.png",
    },
    {
      value: "Men's Eyewear",
      key: "Men's Eyewear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Eyewear.png",
    },
    {
      value: "Men's Footwear",
      key: "Men's Footwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Footwear.png",
    },
    {
      value: "Men's Jewellery",
      key: "Men's Jewellery",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Men's Jewellery.png",
    },
    {
      value: "Women's Fashion Accessories",
      key: "Women's Fashion Accessories",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Fashion Accessories.png",
    },
    {
      value: "Women's Footwear Accessories",
      key: "Women's Footwear Accessories",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Footwear Accessories.png",
    },
    {
      value: "Women's Indian & Fusion Wear",
      key: "Women's Indian & Fusion Wear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Indian & Fusion Wear.png",
    },
    {
      value: "Women's Western Wear",
      key: "Women's Western Wear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Western Wear.png",
    },
    {
      value: "Women's Lingerie & Sleepwear",
      key: "Women's Lingerie & Sleepwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Lingerie & Sleepwear.png",
    },
    {
      value: "Women's Bags & Luggage",
      key: "Women's Bags & Luggage",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Bags & Luggage.png",
    },
    {
      value: "Women's Eyewear",
      key: "Women's Eyewear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Eyewear.png",
    },
    {
      value: "Women's Footwear",
      key: "Women's Footwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Footwear.png",
    },
    {
      value: "Women's Jewellery",
      key: "Women's Jewellery",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Women's Jewellery.png",
    },
    {
      value: "Boy's Clothing",
      key: "Boy's Clothing",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Boy's Clothing.png",
    },
    {
      value: "Boy's Footwear",
      key: "Boy's Footwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Boy's Footwear.png",
    },
    {
      value: "Girl's Clothing",
      key: "Girl's Clothing",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Girl's Clothing.png",
    },
    {
      value: "Girl's Footwear",
      key: "Girl's Footwear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Girl's Footwear.png",
    },
    {
      value: "Infant's Wear",
      key: "Infant's Wear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Infant's Wear.png",
    },
    {
      value: 'Infant Care & Accessories',
      key: 'Infant Care & Accessories',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Infant Care & Accessories.png',
    },
    {
      value: 'Infant Feeding & Nursing Essentials',
      key: 'Infant Feeding & Nursing Essentials',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Infant Feeding & Nursing Essentials.png',
    },
    {
      value: 'Infant Bath Accessories',
      key: 'Infant Bath Accessories',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Infant Bath Accessories.png',
    },
    {
      value: 'Infant Health & Safety',
      key: 'Infant Health & Safety',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Infant Health & Safety.png',
    },
    {
      value: 'Infant Diapers & Toilet Training',
      key: 'Infant Diapers & Toilet Training',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Infant Diapers & Toilet Training.png',
    },
    {
      value: "Kid's Towels & Wrappers",
      key: "Kid's Towels & Wrappers",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Kid's Towels & Wrappers.png",
    },
    {
      value: "Kid's Fashion Accessories",
      key: "Kid's Fashion Accessories",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Kid's Fashion Accessories.png",
    },
    {
      value: "Kid's Jewellery",
      key: "Kid's Jewellery",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Kid's Jewellery.png",
    },
    {
      value: "Kid's Eyewear",
      key: "Kid's Eyewear",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Kid's Eyewear.png",
    },
    {
      value: "Kid's Bags & Luggage",
      key: "Kid's Bags & Luggage",
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Fashion/Kid's Bags & Luggage.png",
    },
  ],
  'Home & Decor': [
    {
      value: 'Home Decor',
      key: 'Home Decor',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Home Decor.png',
    },
    {
      value: 'Home Furnishings',
      key: 'Home Furnishings',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Home Furnishings.png',
    },
    {
      value: 'Furniture',
      key: 'Furniture',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Furniture.png',
    },
    {
      value: 'Garden and Outdoor Products',
      key: 'Garden and Outdoor Products',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Garden and Outdoor Products.png',
    },
    {
      value: 'Home Improvement',
      key: 'Home Improvement',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Home Improvement.png',
    },
    {
      value: 'Cookware and Dining',
      key: 'Cookware and Dining',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Cookware and Dining.png',
    },
    {
      value: 'Storage and Organisation',
      key: 'Storage and Organisation',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Storage and Organisation.png',
    },
    {
      value: 'Home and Decor',
      key: 'Home and Decor',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Home & Decor/Home and Decor.png',
    },
  ],
  'F&B': [
    {
      value: 'Baklava',
      key: 'Baklava',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Baklava.png',
    },
    {
      value: 'Bao',
      key: 'Bao',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Bao.png',
    },
    {
      value: 'Barbecue',
      key: 'Barbecue',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Barbecue.png',
    },
    {
      value: 'Biryani',
      key: 'Biryani',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Biryani.png',
    },
    {
      value: 'Bread',
      key: 'Bread',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Bread.png',
    },
    {
      value: 'Burger',
      key: 'Burger',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Burger.png',
    },
    {
      value: 'Cakes',
      key: 'Cakes',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Cakes.png',
    },
    {
      value: 'Chaat',
      key: 'Chaat',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Chaat.png',
    },
    {
      value: 'Cheesecakes',
      key: 'Cheesecakes',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Cheesecakes.png',
    },
    {
      value: 'Chicken',
      key: 'Chicken',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Chicken.png',
    },
    {
      value: 'Chicken wings',
      key: 'Chicken wings',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Chicken wings.png',
    },
    {
      value: 'Chips',
      key: 'Chips',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Chips.png',
    },
    {
      value: 'Coffee',
      key: 'Coffee',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Coffee.png',
    },
    {
      value: 'Cookies',
      key: 'Cookies',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Cookies.png',
    },
    {
      value: 'Crepes',
      key: 'Crepes',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Crepes.png',
    },
    {
      value: 'Dal',
      key: 'Dal',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Dal.png',
    },
    {
      value: 'Desserts',
      key: 'Desserts',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Desserts.png',
    },
    {
      value: 'Dhokla',
      key: 'Dhokla',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Dhokla.png',
    },
    {
      value: 'Dosa',
      key: 'Dosa',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Dosa.png',
    },
    {
      value: 'Doughnuts',
      key: 'Doughnuts',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Doughnuts.png',
    },
    {
      value: 'Eggs',
      key: 'Eggs',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Eggs.png',
    },
    {
      value: 'Energy Drinks',
      key: 'Energy Drinks',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Energy Drinks.png',
    },
    {
      value: 'Falafel',
      key: 'Falafel',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Falafel.png',
    },
    {
      value: 'Fresh Juice',
      key: 'Fresh Juice',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Fresh Juice.png',
    },
    {
      value: 'Fries',
      key: 'Fries',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Fries.png',
    },
    {
      value: 'Ice cream',
      key: 'Ice cream',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Ice cream.png',
    },
    {
      value: 'Idli',
      key: 'Idli',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Idli.png',
    },
    {
      value: 'Kabab',
      key: 'Kabab',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Kabab.png',
    },
    {
      value: 'Kachori',
      key: 'Kachori',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Kachori.png',
    },
    {
      value: 'Kulfi',
      key: 'Kulfi',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Kulfi.png',
    },
    {
      value: 'Lassi',
      key: 'Lassi',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Lassi.png',
    },
    {
      value: 'Meal bowl',
      key: 'Meal bowl',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Meal bowl.png',
    },
    {
      value: 'Mezze',
      key: 'Mezze',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Mezze.png',
    },
    {
      value: 'Mithai',
      key: 'Mithai',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Mithai.png',
    },
    {
      value: 'Momos',
      key: 'Momos',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Momos.png',
    },
    {
      value: 'Mutton',
      key: 'Mutton',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Mutton.png',
    },
    {
      value: 'Nachos',
      key: 'Nachos',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Nachos.png',
    },
    {
      value: 'Noodles',
      key: 'Noodles',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Noodles.png',
    },
    {
      value: 'Pakodas',
      key: 'Pakodas',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Pakodas.png',
    },
    {
      value: 'Pancakes',
      key: 'Pancakes',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Pancakes.png',
    },
    {
      value: 'Paneer',
      key: 'Paneer',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Paneer.png',
    },
    {
      value: 'Pasta',
      key: 'Pasta',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Pasta.png',
    },
    {
      value: 'Pastries',
      key: 'Pastries',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Pastries.png',
    },
    {
      value: 'Pie',
      key: 'Pie',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Pie.png',
    },
    {
      value: 'Pizza',
      key: 'Pizza',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Pizza.png',
    },
    {
      value: 'Poha',
      key: 'Poha',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Poha.png',
    },
    {
      value: 'Raita',
      key: 'Raita',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Raita.png',
    },
    {
      value: 'Rice',
      key: 'Rice',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Rice.png',
    },
    {
      value: 'Rolls',
      key: 'Rolls',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Rolls.png',
    },
    {
      value: 'Roti',
      key: 'Roti',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Roti.png',
    },
    {
      value: 'Salad',
      key: 'Salad',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Salad.png',
    },
    {
      value: 'Samosa',
      key: 'Samosa',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Samosa.png',
    },
    {
      value: 'Sandwich',
      key: 'Sandwich',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Sandwich.png',
    },
    {
      value: 'Seafood',
      key: 'Seafood',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Seafood.png',
    },
    {
      value: 'Shakes & Smoothies',
      key: 'Shakes & Smoothies',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Shakes & Smoothies.png',
    },
    {
      value: 'Soft Drink',
      key: 'Soft Drink',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Soft Drink.png',
    },
    {
      value: 'Soup',
      key: 'Soup',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Soup.png',
    },
    {
      value: 'Spring Roll',
      key: 'Spring Roll',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Spring Roll.png',
    },
    {
      value: 'Sushi',
      key: 'Sushi',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Sushi.png',
    },
    {
      value: 'Tacos',
      key: 'Tacos',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Tacos.png',
    },
    {
      value: 'Tandoori',
      key: 'Tandoori',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Tandoori.png',
    },
    {
      value: 'Tart',
      key: 'Tart',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Tart.png',
    },
    {
      value: 'Tea',
      key: 'Tea',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Tea.png',
    },
    {
      value: 'Thali',
      key: 'Thali',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Thali.png',
    },
    {
      value: 'Tikka',
      key: 'Tikka',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Tikka.png',
    },
    {
      value: 'Upma',
      key: 'Upma',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Upma.png',
    },
    {
      value: 'Uttapam',
      key: 'Uttapam',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Uttapam.png',
    },
    {
      value: 'Vada',
      key: 'Vada',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Vada.png',
    },
    {
      value: 'Vegetables',
      key: 'Vegetables',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Vegetables.png',
    },
    {
      value: 'Waffle',
      key: 'Waffle',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Waffle.png',
    },
    {
      value: 'Wrap',
      key: 'Wrap',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Wrap.png',
    },
    {
      value: 'Yogurt',
      key: 'Yogurt',
      protocolKey: '@ondc/org/mandatory_reqs_veggies_fruits',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Food & Beverage/Yogurt.png',
    },
  ],
  Electronics: [
    {
      value: 'Audio',
      key: 'Audio',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Audio.png',
    },
    {
      value: 'Camera and Camcorder',
      key: 'Camera and Camcorder',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Camera and Camcorder.png',
    },
    {
      value: 'Computer Peripheral',
      key: 'Computer Peripheral',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Computer Peripheral.png',
    },
    {
      value: 'Desktop and Laptop',
      key: 'Desktop and Laptop',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Desktop and Laptop.png',
    },
    {
      value: 'Earphone',
      key: 'Earphone',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Earphone.png',
    },
    {
      value: 'Gaming',
      key: 'Gaming',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Gaming.png',
    },
    {
      value: 'Headphone',
      key: 'Headphone',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Headphone.png',
    },
    {
      value: 'Mobile Phone',
      key: 'Mobile Phone',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Mobile Phone.png',
    },
    {
      value: 'Mobile Accessories',
      key: 'Mobile Accessories',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Mobile Accessories.png',
    },
    {
      value: 'Safety Security',
      key: 'Safety Security',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Safety Security.png',
    },
    {
      value: 'Smart Watches',
      key: 'Smart Watches',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Smart Watches.png',
    },
    {
      value: 'Speaker',
      key: 'Speaker',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Speaker.png',
    },
    {
      value: 'Television',
      key: 'Television',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Television.png',
    },
    {
      value: 'Video',
      key: 'Video',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Video.png',
    },
    {
      value: 'Air Conditioning and Air Cleaners',
      key: 'Air Conditioning and Air Cleaners',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Air Conditioning and Air Cleaners.png',
    },
    {
      value: 'Health, Home and Personal Care',
      key: 'Health, Home and Personal Care',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Health, Home and Personal Care.png',
    },
    {
      value: 'Heaters',
      key: 'Heaters',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Heaters.png',
    },
    {
      value: 'Kitchen Appliances',
      key: 'Kitchen Appliances',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Kitchen Appliances.png',
    },
    {
      value: 'Lighting & Electric Fans',
      key: 'Lighting & Electric Fans',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Lighting & Electric Fans.png',
    },
    {
      value: 'Refrigerators and Freezers',
      key: 'Refrigerators and Freezers',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Refrigerators and Freezers.png',
    },
    {
      value: 'Vacuum Cleaners',
      key: 'Vacuum Cleaners',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Vacuum Cleaners.png',
    },
    {
      value: 'Washing Machines and Accessories',
      key: 'Washing Machines and Accessories',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Washing Machines and Accessories.png',
    },
    {
      value: 'Water Purifiers and Coolers',
      key: 'Water Purifiers and Coolers',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Water Purifiers and Coolers.png',
    },
    {
      value: 'Inverter & Stabilizer',
      key: 'Inverter & Stabilizer',
      protocolKey: '',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Electronics/Inverter & Stabilizer.png',
    },
  ],
  'Health & Wellness': [
    {
      key: 'Pain Relief',
      value: 'Pain Relief',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
    {
      key: 'Nutrition and Fitness Supplements',
      value: 'Nutrition and Fitness Supplements',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Nutrition and Fitness Supplements.png',
    },
    {
      key: 'Personal Care',
      value: 'Personal Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Personal Care.png',
    },
    {
      key: 'Speciality Care',
      value: 'Speciality Care',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Speciality Care.png',
    },
    {
      key: 'Covid Essentials',
      value: 'Covid Essentials',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Covid Essentials.png',
    },
    {
      key: 'Diabetes Control',
      value: 'Diabetes Control',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Diabetes Control.png',
    },
    // {key: "Healthcare Devices", value: "Healthcare Devices", protocolKey: "@ondc/org/statutory_reqs_packaged_commodities", imageUrl: Health}, image not available
    {
      key: 'Ayush',
      value: 'Ayush',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Ayush.png',
    },
  ],
  Agriculture: [
    {
      key: 'Seed',
      value: 'Seed',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
    {
      key: 'Pesticide',
      value: 'Pesticide',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
    {
      key: 'Fertilizer',
      value: 'Fertilizer',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
    {
      key: 'Organic Crop Protection',
      value: 'Organic Crop Protection',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
    {
      key: 'Organic Crop Nutrition',
      value: 'Organic Crop Nutrition',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
    {
      key: 'Tools and Machinery',
      value: 'Tools and Machinery',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
    {
      key: 'Cattle Feed',
      value: 'Cattle Feed',
      protocolKey: '@ondc/org/statutory_reqs_packaged_commodities',
      imageUrl:
        'https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/Health & Wellness/Pain Relief.png',
    },
  ],
};
