const earrings = [
  {
    name: "Black Agate Stud Earrings – Classic Silver",
    price: 8500,
    currency: "PKR",
    image: "https://lavarijewelers.com/wp-content/uploads/2023/01/51076-earrings-fashion-jewelry-yellow-sterling-silver-51076-2.jpg",
    images: [
      "https://lavarijewelers.com/wp-content/uploads/2023/01/51076-earrings-fashion-jewelry-yellow-sterling-silver-51076-2.jpg"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Elegant black agate stud earrings set in 925 silver, perfect for everyday wear.",
    metal: "925 Silver",
    stockquantity: 15,
    soldOut: false,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Blue Topaz Stud Earrings – Minimal Cut",
    price: 12500,
    currency: "PKR",
    image: "https://www.luojewelry.com/cdn/shop/files/0632-LT-NO-PT95.jpg?v=1750146624&width=1000",
    images: [
      "https://www.luojewelry.com/cdn/shop/files/0632-LT-NO-PT95.jpg?v=1750146624&width=1000"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Minimalist blue topaz stud earrings crafted in 925 silver, offering a clean and elegant everyday look.",
    metal: "925 Silver",
    stockquantity: 12,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Swiss Blue Topaz Drop Earrings",
    price: 18500,
    currency: "PKR",
    image: "https://www.kingstreetdesign.com/wp-content/uploads/2021/11/KSJ603-1.jpg",
    images: [
      "https://www.kingstreetdesign.com/wp-content/uploads/2021/11/KSJ603-1.jpg"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Elegant Swiss blue topaz drop earrings crafted in 925 silver, offering a refined and graceful look.",
    metal: "925 Silver",
    stockquantity: 10,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Red Aqeeq Oval Drop Earrings",
    price: 16500,
    currency: "PKR",
    image: "https://d16aymak0y9zsb.cloudfront.net/Tesoro/product/600x600/07122023/239_1701948123_6571aadbce2d7_33115_1-1133253374333-346280082133.jpg",
    images: [
      "https://d16aymak0y9zsb.cloudfront.net/Tesoro/product/600x600/07122023/239_1701948123_6571aadbce2d7_33115_1-1133253374333-346280082133.jpg"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Beautiful red Aqeeq oval drop earrings crafted in 925 silver, offering a traditional and elegant appearance.",
    metal: "925 Silver",
    stockquantity: 14,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Green Aqeeq Traditional Earrings",
    price: 17500,
    currency: "PKR",
    image: "https://cdn.shopify.com/s/files/1/0279/6931/files/E2501GOM.jpg?v=1743115596",
    images: [
      "https://cdn.shopify.com/s/files/1/0279/6931/files/E2501GOM.jpg?v=1743115596"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Traditional green Aqeeq earrings crafted in 925 silver with a classic dangle design.",
    metal: "925 Silver",
    stockquantity: 10,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Moissanite Solitaire Stud Earrings",
    price: 22500,
    currency: "PKR",
    image: "https://www.zanvari.com/cdn/shop/files/Zanvari221_1_copy_2.jpg?v=1721476840&width=1080",
    images: [
      "https://www.zanvari.com/cdn/shop/files/Zanvari221_1_copy_2.jpg?v=1721476840&width=1080"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Elegant moissanite solitaire stud earrings crafted in 925 silver, offering a brilliant and timeless sparkle.",
    metal: "925 Silver",
    stockquantity: 8,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Moissanite Halo Drop Earrings – Luxury",
    price: 34500,
    currency: "PKR",
    image: "https://jianlondon.co.uk/prodimages/Large/e67121.jpg",
    images: [
      "https://jianlondon.co.uk/prodimages/Large/e67121.jpg"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Luxury moissanite halo drop earrings crafted in 925 silver, offering a brilliant and elegant statement look.",
    metal: "925 Silver",
    stockquantity: 6,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "White Zircon Stud Earrings – Minimal",
    price: 9500,
    currency: "PKR",
    image: "https://www.mysticflavia.com/cdn/shop/products/ZIRCON-SILVER_RING_EAR_31_2048x.jpg?v=1626045227",
    images: [
      "https://www.mysticflavia.com/cdn/shop/products/ZIRCON-SILVER_RING_EAR_31_2048x.jpg?v=1626045227"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Minimal white zircon stud earrings crafted in 925 silver, perfect for everyday elegance.",
    metal: "925 Silver",
    stockquantity: 20,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Zircon Hoop Earrings – Modern Style",
    price: 13500,
    currency: "PKR",
    image: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/Y03777s.jpg?im=Resize,width=750",
    images: [
      "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/Y03777s.jpg?im=Resize,width=750"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Modern zircon hoop earrings designed in 925 silver, offering a stylish and contemporary look.",
    metal: "925 Silver",
    stockquantity: 11,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Pearl Drop Earrings – Elegant Look",
    price: 14500,
    currency: "PKR",
    image: "https://cdn.shopify.com/s/files/1/0565/5763/3587/files/unnamed_f848566a-ad57-4928-bf8f-88244accca12_480x480.png?v=1698250574",
    images: [
      "https://cdn.shopify.com/s/files/1/0565/5763/3587/files/unnamed_f848566a-ad57-4928-bf8f-88244accca12_480x480.png?v=1698250574"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Elegant pearl drop earrings crafted in 925 silver, offering a timeless and graceful look.",
    metal: "925 Silver",
    stockquantity: 9,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Hoop Earrings – Plain Silver Finish",
    price: 6500,
    currency: "PKR",
    image: "https://m.media-amazon.com/images/I/411IQ4eDpaL._AC_UY1000_.jpg",
    images: [
      "https://m.media-amazon.com/images/I/411IQ4eDpaL._AC_UY1000_.jpg"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Simple and elegant plain silver hoop earrings crafted in 925 silver, perfect for everyday wear.",
    metal: "925 Silver",
    stockquantity: 25,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Dangle Earrings – Black Agate Stone",
    price: 15500,
    currency: "PKR",
    image: "https://images.shaneco.com/is/image/ShaneCo/earrings/570/Black-Agate-and-Sterling-Silver-Dangle-Earrings_41072036_M.jpg&&wid=999&hei=999&fmt=png-alpha",
    images: [
      "https://images.shaneco.com/is/image/ShaneCo/earrings/570/Black-Agate-and-Sterling-Silver-Dangle-Earrings_41072036_M.jpg&&wid=999&hei=999&fmt=png-alpha"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Stylish black agate dangle earrings crafted in 925 silver, perfect for a bold and elegant look.",
    metal: "925 Silver",
    stockquantity: 10,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
  {
    name: "Luxury Party Earrings – Moissanite Edition",
    price: 48500,
    currency: "PKR",
    image: "https://drippy.amsterdam/cdn/shop/files/moissanite-halo-earrings-381085.jpg?crop=center&height=1200&v=1753687274&width=1200",
    images: [
      "https://drippy.amsterdam/cdn/shop/files/moissanite-halo-earrings-381085.jpg?crop=center&height=1200&v=1753687274&width=1200"
    ],
    stoneWeight: "6 carat",
    category: "Earrings",
    description: "Luxury moissanite chandelier earrings designed for special occasions, offering a glamorous and sparkling finish.",
    metal: "925 Silver",
    stockquantity: 4,
    availability: "Available on Order in 5-7 Days",
    isActive: true
  },
];

export default earrings;