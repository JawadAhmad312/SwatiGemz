import React from 'react'

function Engagement() {
    return (
        <>
            <section className="w-full bg-white my-[2rem]  md:mt-[4rem]">
                <div className="max-w-5xl mx-auto px-2 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                    {/* Left Image */}
                    <div className="flex justify-start p-0">
                        <img
                            src="/images/engagment_ring.jpg"
                            alt="Engagement Rings"
                            className="w-full md:max-w-[420px] rounded-xl h-[460px] md:h-[500px] p-0"
                        />
                    </div>

                    {/* Right Content */}
                    <div className="max-w-[950px] md:mt-6 md:ml-[-9rem] px-14 md:py-12 bg-white ">
                        <h1 className="text-4xl abril-fatface-regular lg:text-5xl font-semibold text-black mb-6">
                            Engagement Rings
                        </h1>

                        <p className="text-[16.5px] leading-[1.9] text-gray-600 mb-5 ">
                            In love and commitment, Jawa Gems' range of engagement rings is an exquisite
                            symbol. They are all intricately cut and crafted and symbolic works of art
                            that symbolize the connection between two people.The rings we provide are a fusion of fantastic elements such as metals and
                            wonderfully made by professional designers that can only guarantee perfect
                            rings that will be passed from one generation to another.
                            You may fancy traditional style or contemporary design; at Swati Gemz, we
                            have a design that fits your choice. Since love is unique, so is our
                            dedication to making your special moment more memorable with our rings.
                        </p>

                        {/* Button */}
                        <button
                            className="px-10 py-3 text-sm tracking-widest uppercase
                   bg-[#101828 ] text-white cursor-pointer
                   hover:bg-gray-900 transition-all duration-300"
                        >
                            Explore
                        </button>

                    </div>
                </div>
            </section>
        </>
    )
}

export default Engagement