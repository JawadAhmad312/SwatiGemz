import { Link } from 'react-router-dom';
import './Home.css';
import Card from '../Card/Card';
import Stone from '../Card/Stone.jsx'
import gemVideo from "/public/images/gemstone.mp4";
import Womencategory from '../Womencategory/Womencategory';
import Mencategory from '../Mencategory/Mencategory';
import Engagement from '../Engagement/Engagement.jsx';
import Map from "../Map/Map.jsx"
import CollectionsPage from '../pages/CollectionsPage.jsx';


function Home() {  
  return (
    <>
      {/* Hero Section */}
      <div className="w-full flex justify-center w-100% md:h-[800px] sm:h-[320px]">
        <img
          src="/images/herosection.png"
          className=" object-cover "
          alt="Banner"
        />
      </div>
      <div className='w-full h-auto mt-[2rem] text-center'>
        <h1 className='text-[28px] md:text-5xl font-bold abril-fatface-regular md:bg-gradient-to-r from-[#092805] to-[#224225] bg-clip-text md:text-transparent text-white'>Personalized Gemstone <br /> Recommendation</h1>
<p className="mt-[1.5rem] max-w-4xl mx-auto text-center text-[14px] md:text-[19px] font-normal px-4">
  Discover authentic, high-quality gemstones carefully selected and verified by
  <span className="font-bold"> Muhammad Islam</span>. We are committed to helping you find the perfect gemstone with trusted quality, expert guidance, and exceptional craftsmanship.
</p>     
   <button className='btn bg-gradient-to-r from-[#092805] to-[#224225] mt-[1.5rem]  text-white px-[20px] md:px-[30px] rounded-[10px] md:text-xl md:py-[25px]'>Book Now</button>
      </div>
      {/* Card Sections */}
<Card/>
 <div className='text-center mt-[50px] md:mt-[-30px] justify-center align-center'>
        <Link 
      to={`/Stone`} 
    >
  <button className='btn bg-gradient-to-r from-[#092805] to-[#224225] text-white  px-[20px] md:px-[25px] rounded-[10px]  md:text-xl   md:py-[25px]'>View All</button>
</Link>
</div> 

{/* Our Gemstones Collection Start Here*/}
<CollectionsPage/>
{/* Our Gemstones Collection End Here*/}

{/* GemzStone Video */}
<div className='justify-items-center align-items-center w-full '>
  <h1 className='mb-[2rem] py-6 text-xl md:text-5xl abril-fatface-regular bg-gradient-to-r from-[#092805] to-[#224225] bg-clip-text md:text-transparent text-white'>How Rings Are Made</h1>
<video muted autoPlay playsInline loop  className="w-full lg:max-w-[1300px] md:h-[470px] object-cover">
  <source src={gemVideo} type="video/mp4" />
</video>
</div>
{/* Video Section End Here */}
{/* Women Category Section Start Here */}
<Womencategory/>
{/* Women Category Section End Here */}
{/* Women Category Section Start Here */}
<Mencategory/>
{/* Women Category Section End Here */}

            {/* Map Section Start here  */}
           <Map/>
            {/* Map Section End Here */}
            {/* Engagement Section Start here */}
    <Engagement/>
            {/* Engagemenet Section End Here */}
            {/* Reviwe Section  */}
    </>
  )
}

export default Home