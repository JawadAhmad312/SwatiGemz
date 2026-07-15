import mongoose from "mongoose"
import Stone from "../models/stone.js";
import WomenCategory from "../models/womencategory.js";
import MenCategory from "../models/mencategory.js";
import MenRings from "../models/menrings.js";
import Necklaces from "../models/necklaces.js";
import Earrings from "../models/earring.js";
import WomenRing from "../models/womenring.js";
import StoneData from "./stone.js";
import collectionData from "./collectiondata.js";
import womencategorydata from "./womencategorydata.js";
import womenringdata from "./womenringdata.js"; 
import mencategorydata from "./mencategorydata.js";
import menringdata from "./menring.js";
import necklacesdata from "./necklacesdata.js";
import earringdata from "./earringdata.js";
import Collections from "../models/Collection.js"
import collectionsData from "./collectionsData.js";
import gemstonesData from "./gemstonesData.js";
import GemStoneData from '../models/Gemstone.js'

main().then(() => {
  console.log("Connected to DB")
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/StoneGemz');
};

//   const StoneDB = async ()=>{
//        await Stone.deleteMany({});
//        await Stone.insertMany(StoneData.data);
//     }

//  StoneDB();
//  const WomenRings = async () => {
//    await WomenRing.deleteMany({});
//    await WomenRing.insertMany(womenringdata.data);
//    console.log("Data Inserted Successfully");
//  };

//  WomenRings();
//   const CollectionData = async()=>{
//        await Collection.deleteMany({});
//         await Collection.insertMany(collectionData.data);
//   }
//  CollectionData();

    // const Womencategory =async ()=>{
    // await WomenCategory.deleteMany({});
    // await WomenCategory.insertMany(womencategorydata);
    // }
    // Womencategory();

   const Mencategory=async ()=>{
    await MenCategory.deleteMany({});
    await MenCategory.insertMany(mencategorydata);
  }
   Mencategory();
//  const insertMenRings = async ()=>{
//    await MenRings.deleteMany({});
//    await MenRings.insertMany(menringdata.data)
//  };
//  insertMenRings();
//  const Necklace = async()=>{
//   await Necklaces.deleteMany({});
//   await Necklaces.insertMany(necklacesdata.data);
//  };
//  Necklace();
//  const Earring = async()=>{
//    await Earrings.deleteMany({});
//    await Earrings.insertMany(earringdata.data
//   );
//  };
//  Earring();

// const Collection = async ()=>{
//   await Collections.deleteMany({});
//   await Collections.insertMany(collectionsData.data)
// };
// Collection();

// const insertGemstones = async () => {

//   try {

//     await GemStoneData.deleteMany({});

//     const collections =
//       await Collections.find();

//     const collectionMap = {};

//     collections.forEach((item) => {

//       collectionMap[item.slug] =
//         item._id;
//     });

//     const formattedData =
//       gemstonesData.map((item) => ({

//         name: item.name,

//         slug: item.slug,

//         gemCollection:
//           collectionMap[
//             item.collectionSlug
//           ],

//         image: item.image,

//         images: item.images,

//         productCode:
//           item.productCode,

//         weight: item.weight,

//         shape: item.shape,

//         price:
//           item.price,

//         category:
//           item.category,

//         stockquantity:
//           item.stockquantity,

//         featured:
//           item.featured,

//         shortDescription:
//           item.shortDescription,

//         description:
//           item.description,

//         metaTitle:
//           item.metaTitle,

//         metaDescription:
//           item.metaDescription,
//       }));

//     await GemStoneData.insertMany(
//       formattedData
//     );

//     console.log(
//       "Gemstones Inserted Successfully"
//     );

//   } catch (err) {

//     console.log(err);
//   }
// };




// const seedDB = async () => {

 

//   await insertGemstones();

// };

// seedDB();