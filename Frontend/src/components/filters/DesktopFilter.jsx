import React from "react";
import { FiRotateCcw } from "react-icons/fi";

const DesktopFilter = ({
  filters,
  setFilters,
  categories,
  totalProducts,
}) => {

  const resetFilters = () => {

    setFilters({
      category: "All",
      availability: "all",
      sort: "default",
      minPrice: "",
      maxPrice: "",
    });

  };

  return (

<div
className="
hidden
md:flex
items-center
justify-between
bg-white
rounded-2xl
border
border-gray-200
px-6
py-4
mb-8
shadow-sm
"
>

{/* LEFT */}

<div className="flex items-center gap-4">

<p className="font-semibold text-gray-800">

Filter

</p>

{/* CATEGORY */}

<select

value={filters.category}

onChange={(e)=>

setFilters({

...filters,

category:e.target.value,

})

}

className="
h-11
rounded-full
border
border-gray-300
px-5
text-sm
outline-none
hover:border-[#1D4F38]
focus:border-[#1D4F38]
transition
"

>

{categories.map(cat=>(

<option

key={cat}

value={cat}

>

{cat}

</option>

))}

</select>

{/* AVAILABILITY */}

<select

value={filters.availability}

onChange={(e)=>

setFilters({

...filters,

availability:e.target.value,

})

}

className="
h-11
rounded-full
border
border-gray-300
px-5
text-sm
outline-none
hover:border-[#1D4F38]
focus:border-[#1D4F38]
transition
"

>

<option value="all">

All Products

</option>

<option value="inStock">

In Stock

</option>

<option value="outStock">

Out Of Stock

</option>

</select>

{/* PRICE */}

<select

onChange={(e)=>{

const value=e.target.value;

if(value==="low"){

setFilters({

...filters,

minPrice:0,

maxPrice:5000

})

}

else if(value==="mid"){

setFilters({

...filters,

minPrice:5000,

maxPrice:15000

})

}

else if(value==="high"){

setFilters({

...filters,

minPrice:15000,

maxPrice:""

})

}

else{

setFilters({

...filters,

minPrice:"",

maxPrice:""

})

}

}}

className="
h-11
rounded-full
border
border-gray-300
px-5
text-sm
outline-none
hover:border-[#1D4F38]
focus:border-[#1D4F38]
transition
"

>

<option>

Price

</option>

<option value="low">

Below 5K

</option>

<option value="mid">

5K - 15K

</option>

<option value="high">

Above 15K

</option>

</select>

</div>

{/* RIGHT */}

<div className="flex items-center gap-5">

<select

value={filters.sort}

onChange={(e)=>

setFilters({

...filters,

sort:e.target.value,

})

}

className="
h-11
rounded-full
border
border-gray-300
px-5
text-sm
outline-none
hover:border-[#1D4F38]
focus:border-[#1D4F38]
transition
"

>

<option value="default">

Best Selling

</option>

<option value="az">

A → Z

</option>

<option value="za">

Z → A

</option>

<option value="low">

Price Low → High

</option>

<option value="high">

Price High → Low

</option>

</select>

<p
className="
text-sm
text-gray-500
"
>

{totalProducts} Products

</p>

<button

onClick={resetFilters}

className="
flex
items-center
gap-2
px-5
h-11
rounded-full
border
border-gray-300
hover:bg-gray-100
transition
"

>

<FiRotateCcw/>

Reset

</button>

</div>

</div>

);

};

export default DesktopFilter;