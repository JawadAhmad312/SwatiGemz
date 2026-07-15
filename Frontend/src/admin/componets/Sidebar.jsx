import { Link } from "react-router-dom"
import { FaGem,FaUsers,FaShoppingCart,FaRing } from "react-icons/fa"

export default function Sidebar(){

return(

<div className="w-64 h-screen bg-black text-white p-6">

<h1 className="text-2xl font-bold mb-10 flex items-center gap-2">
<FaGem/> Gemstone Admin
</h1>

<ul className="space-y-6">

<li>
<Link to="/admin">Dashboard</Link>
</li>

<li>
<Link to="/admin/addrings">Rings</Link>
</li>

<li>
<Link to="/admin/necklaces">Necklaces</Link>
</li>

<li>
<Link to="/admin/earrings">Earrings</Link>
</li>

<li>
<Link to="/admin/orders">Orders</Link>
</li>

<li>
<Link to="/admin/users">Users</Link>
</li>

</ul>

</div>

)

}
