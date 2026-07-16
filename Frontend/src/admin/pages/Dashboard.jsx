import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Gem, Diamond, Sparkles, Circle } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { io }
from "socket.io-client";
import toast
from "react-hot-toast";
import { API_BASE_URL } from "../../lib/api";
import Navbar from '../componets/Navbar.jsx'
import { FiEye, FiEdit2, FiTrash2 , FiBell } from "react-icons/fi";
import StatsCards from '../componets/Dashboard/StatsCards.jsx'
import SalesChart from '../componets/Dashboard/SalesChart.jsx'
import DonutChart from '../componets/Dashboard/DonutChart.jsx'
import WorldMap from '../componets/Dashboard/WorldMap.jsx'
import Activity from '../componets/Dashboard/Activity.jsx'
import OrdersTable from '../componets/Dashboard/OrdersTable.jsx'
import ProductChart from "../charts/ProductChart.jsx";
import SalesTicker from '../componets/Dashboard/SalesTicker.jsx'
import Collections from "./Collection/Collections.jsx";
import Gemstone from "./Gemstone/Gemstones.jsx";
import Necklaces from "./Necklace/Necklaces.jsx";
import Earrings from "./Earring/Earrings.jsx";
import Womenrings from "./WomenRing/Womenrings.jsx";
import Rings from "./MenRing/Rings.jsx";
import Stones from "./Stone/Stones.jsx";
import MenCategory from "./MenCategory/MenCategory.jsx";
import WomenCategory from "./WomenCategory/WomenCategory.jsx";
import Orders from "../order/Orders";
import axios from "axios";





function Dashboard() {
const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stone, setStone] = useState([]);
  const [stonePage, setStonePage] = useState(1);
  const [rings, setRings] = useState([]);
  const [womenRings, setWomenRings] = useState([]);
  const [earrings, setEarrings] = useState([]);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard"); // ✅ NEW
  const [earringPage, setEarringPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [womenringPage, setWomenringPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const navigate = useNavigate();
  const currentRings = rings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rings.length / itemsPerPage);
  const indexOfLastEarring = earringPage * itemsPerPage;
  const indexOfFirstEarring = indexOfLastEarring - itemsPerPage;
  const indexOfLastStone = stonePage * itemsPerPage;
  const indexOfFirstStone = indexOfLastStone - itemsPerPage;
  const currentStones = stone.slice(indexOfFirstStone, indexOfLastStone);
  const totalStonePages = Math.ceil(stone.length / itemsPerPage);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const currentEarrings = earrings.slice(indexOfFirstEarring, indexOfLastEarring);
  const totalEarringPages = Math.ceil(earrings.length / itemsPerPage);
  const indexOfLastWomenring = womenringPage * itemsPerPage;
  const indexOfFirstWomenring = indexOfLastWomenring - itemsPerPage;
const [showRoleModal, setShowRoleModal] = useState(false);

const [selectedUser, setSelectedUser] = useState(null);


const [roleForm, setRoleForm] = useState({
  role: "",
  status: "",
});
  const indexOfLastUser = userPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
const roleStats = {
  Admin: users.filter(u => u.role === "Admin").length,
  Manager: users.filter(u => u.role === "Manager").length,
  Moderator: users.filter(u => u.role === "Moderator").length,
  Support: users.filter(u => u.role === "Support").length,
  Security: users.filter(u => u.role === "Security").length,
  Customer: users.filter(u => u.role === "Customer").length,
};

const activeUsers = users.filter(
  u => u.status === "Active"
).length;

const suspendedUsers = users.filter(
  u => u.status === "Suspended"
).length;
  // DATA SLICE (IMPORTANT: use filtered/sorted users if you have them)
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

// Notification USe effect 

useEffect(() => {

  const socket = io(

    API_BASE_URL,

    {

      transports: ["websocket"],
      withCredentials: true
    }
  );

 socket.on("connect", () => {

  socket.emit("joinAdmin");

});

 socket.on(

  "newOrder",

  async (data) => {

    toast.success(
      `New Order from ${data.customer}`
    );

    setNotifications(prev => [

      {
        id: Date.now(),
        customer: data.customer,
        total: data.total,
        time: new Date().toLocaleTimeString()
      },

      ...prev

    ]);

    setUnreadCount(
      prev => prev + 1
    );

    try {

      const res = await fetch(
  "http://localhost:8080/admin/dashboard",
  {
    credentials: "include"
  }
);

      const dashboardData =
        await res.json();

      setStats(
        dashboardData.stats
      );

      setOrders(
        dashboardData.recentOrders || []
      );

      setProducts(
        dashboardData.latestProducts || []
      );
       setProducts(data.latestProducts || []);

    } catch (err) {

      console.log(
        err
      );
    }

  }
);

socket.on(

  "topProductsUpdate",

  (data) => {

    setTopProducts(data);

  }
);
socket.on(

  "productStockUpdated",

  async () => {

    try {

      const res =
        await fetch(
          "http://localhost:8080/admin/dashboard"
          ,
          {
            credentials: "include"
          }
        );

      const data =
        await res.json();

      setStats(
        data.stats
      );

      setOrders(
        data.recentOrders || []
      );

      setProducts(
        data.latestProducts || []
      );

    } catch (err) {

      console.log(err);

    }

  }
);
  return () => {

    socket.disconnect();
  };

}, []);
  // TOTAL PAGES
  const totalUserPages = Math.ceil(users.length / itemsPerPage);
  useEffect(() => {
    if (activePage === "dashboard") {
    fetch("http://localhost:8080/admin/dashboard", {
  credentials: "include"
})
        .then(res => res.json())
        .then(data => {
          setStats(data.stats);
          setProducts(data.latestProducts || []);
          setOrders(data.recentOrders || []);
        });
    }
  }, [activePage]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stonePage]);
  // 👉 NEW: fetch Rings



  // 👉 NEW: fetch Users
  useEffect(() => {
    fetch("http://localhost:8080/users", {
  credentials: "include"
})
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/admin/top-products", {
  credentials: "include"
})
      .then(res => res.json())
      .then(data => setTopProducts(data));
  }, []);
  if (!stats) return <h2 className="p-10">Loading...</h2>;


  const handleView = (id) => {
    navigate(`/admin/dashboard/view/${id}`);
  };




 
  const categories = [...new Set(stone.map(item => item.category))];
  const menuClass = (page) =>
    `cursor-pointer p-2 rounded transition-all duration-200 ${activePage === page
      ? "bg-gray-700 text-white"
      : "hover:bg-gray-700 text-gray-300"
    }`;

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
    const res = await fetch(
  `http://localhost:8080/api/users/${id}`,
  {
    method: "DELETE",
    credentials: "include"
  }
);

      if (!res.ok) {
        alert("Failed to delete user");
        return;
      }

      // ✅ remove from UI instantly
      setUsers((prev) => prev.filter((user) => user._id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  const updateUserRole = async () => {

  if (!selectedUser) return;

  try {

    // Update Role
    await axios.put(

      `http://localhost:8080/api/users/${selectedUser._id}/role`,

      {
        role: roleForm.role,
      },

      {
        withCredentials: true,
      }

    );

    // Update Status
    await axios.put(

      `http://localhost:8080/api/users/${selectedUser._id}/status`,

      {
        status: roleForm.status,
      },

      {
        withCredentials: true,
      }

    );

    // Update UI without refresh
    setUsers(prev =>
      prev.map(user =>
        user._id === selectedUser._id
          ? {
              ...user,
              role: roleForm.role,
              status: roleForm.status,
            }
          : user
      )
    );

    setShowRoleModal(false);

    alert("User updated successfully ✅");

  } catch (err) {

    console.log(err);

    alert("Failed to update user");

  }

};


  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
{sidebarOpen && (
  <div
    className="
      fixed inset-0
      bg-black/50
      z-40
      md:hidden
    "
    onClick={() =>
      setSidebarOpen(false)
    }
  />
)}
      {/* SIDEBAR */}
 <div
  className={`
    fixed
    top-0
    left-0
    z-50

    w-64
    h-screen

    bg-[#0f172a]
    text-white
    p-5
    overflow-y-auto

    transition-transform
    duration-300

    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full"
    }

    md:translate-x-0
  `}
>
        <h1 className="text-2xl font-bold mb-8">Admin</h1>

        <div className="space-y-3">
          <p
            onClick={() => setActivePage("dashboard")}
            className={menuClass("dashboard")}
          >
            Dashboard
          </p>
          {/* PRODUCTS DROPDOWN */}
          <div>
            <p
              onClick={() => setShowProductsMenu(!showProductsMenu)}
              className="cursor-pointer p-2 hover:bg-gray-800 rounded flex justify-between items-center"
            >
              Products
              <span className="ml-2 transition-transform duration-300">
                {showProductsMenu ? (
                  <ChevronUp size={18} className="text-white opacity-80" />
                ) : (
                  <ChevronDown size={18} className="text-white opacity-80" />
                )}
              </span>
            </p>

            {showProductsMenu && (
              <div className="ml-4 mt-2 space-y-2">
                <p
                  onClick={() => {
                    setActivePage("stone");
                  }}
                  className={menuClass("stone")}
                >
                  Stones
                </p>
                <p
                  onClick={() => {
                    setActivePage("rings");
                  }}
                  className={menuClass("rings")}
                >
                  MenRings
                </p>
                <p
                  onClick={() => {
                    setActivePage("Womenrings");
                  }}
                  className={menuClass("Womenrings")}
                >
                  WomenRings
                </p>
                <p
                  onClick={() => {
                    setActivePage("necklaces");
                  }}
                  className={menuClass("necklaces")}
                >
                  Necklaces
                </p>

                <p
                  onClick={() => {
                    setActivePage("earrings");
                  }}
                  className={menuClass("earrings")}
                >
                  Earrings
                </p>


              </div>
            )}
          </div>
          <p
            onClick={() => {
              setActivePage("collections");
            }}
            className={menuClass("collections")}
          >
            Collections
          </p>
          <p
            onClick={() => {
              setActivePage("gemstones");
            }}
            className={menuClass("gemstones")}
          >
            Gemstones
          </p>
          <p
            onClick={() => {
              setActivePage("mencategory");
            }}
            className={menuClass("mencategory")}
          >
            MenCategory
          </p>
          <p
            onClick={() => {
              setActivePage("womencategory");
            }}
            className={menuClass("womencategory")}
          >
            WomenCategory
          </p>
          <p
            onClick={() => setActivePage("orders")}
            className={menuClass("orders")}
          >
            Orders
          </p>
          <p
            onClick={() => setActivePage("users")}
            className={menuClass("users")}
          >
            Users
          </p>
        </div>
      </div>

      {/* MAIN */}
  <div
  className="
    flex-1
    flex
    flex-col
    w-full
    min-w-0

    md:ml-64
  "
>

        {/* NAVBAR */}
<Navbar
  notifications={notifications}
  unreadCount={unreadCount}
  clearUnread={() => setUnreadCount(0)}
  toggleSidebar={() =>
    setSidebarOpen(!sidebarOpen)
  }
/>

        {/* CONTENT */}
        <div className="w-full p-3 md:p-6 overflow-y-auto">

          {/* ================= DASHBOARD ================= */}
          {activePage === "dashboard" && (

           <div className="w-full space-y-6">
              <SalesTicker data={topProducts} />
              <StatsCards stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <DonutChart
  rings={stats.rings}
  women={stats.women}
  necklaces={stats.necklaces}
  earrings={stats.earrings}
  stones={stats.stones}
  gemstones={stats.gemstones}
  collections={stats.collections}
/>
                <SalesChart />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <OrdersTable orders={orders} />
                <WorldMap />
                <Activity />
                <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
                  <h2 className="font-semibold mb-4">Top Selling Products</h2>

                  {topProducts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No data available</p>
                  ) : (
                    topProducts.map((item, i) => {

                      const status =
                        item.stock === 0
                          ? "Out of Stock"
                          : item.stock < 10
                            ? "Low Stock"
                            : "In Stock";

                      const statusColor =
                        item.stock === 0
                          ? "bg-red-100 text-red-500"
                          : item.stock < 10
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600";

                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center border-b py-3"
                        >
                          {/* PRODUCT INFO */}
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.category}</p>
                          </div>

                          {/* PRICE */}
                          <div className="text-sm font-medium">
                            ${item.price}
                          </div>

                          {/* STATUS */}
                          <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                            {status}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <ProductChart data={topProducts} />
            </div>


          )}

          {/* ================= PRODUCTS ================= */}
          {activePage === "products" && (
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>

              {products.map((p) => {

                const stock = p.stock || 10;

                const getStatus = () => {
                  if (stock === 0) return ["Out of Stock", "bg-red-100 text-red-500"];
                  if (stock < 20) return ["Low Stock", "bg-yellow-100 text-yellow-600"];
                  return ["In Stock", "bg-green-100 text-green-600"];
                };

                const [statusText, statusColor] = getStatus();

                return (
                  <div key={p._id} className="flex justify-between items-center border-b py-4">

                    {/* LEFT */}
                    <div className="flex gap-4 items-center w-[35%]">
                      <img src={p.image} className="w-12 h-12 rounded" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <small className="text-gray-400">By Admin</small>
                      </div>
                    </div>

                    <div className="w-[15%] text-center">${p.price}</div>
                    <div className="w-[15%] text-center">{stock}</div>
                    <div className="w-[15%] text-center">${p.price * stock}</div>

                    <div className="w-[20%] text-center">
                      <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* ================= Stones List ================= */}
          {activePage === "stone" && (
            <Stones />
          )}
          {/* ================= MenRings List ================= */}
          {activePage === "rings" && (
            <Rings />
          )}

          {/* ================= WomenRings List ================= */}
          {activePage === "Womenrings" && (
            <Womenrings />
          )}

          {/* ================= Necklaces List ================= */}
          {activePage === "necklaces" && (
            <Necklaces />
          )}

          {/* ================= Earrings List ================= */}
          {activePage === "earrings" && (
            <Earrings />
          )}
          {activePage === "collections" && (
            <Collections />
          )}
          {activePage === "gemstones" && (
            <Gemstone />
          )}
          {activePage ==="mencategory"&&(
            <MenCategory/>
          )}
          {activePage === "womencategory" && (
            <WomenCategory/>
          )}
          {/* ================= ORDERS ================= */}
          {activePage === "orders" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

              <Orders/>
            </div>
          )}

          {/* ================= USERS ================= */}
          {activePage === "users" && (
           <div className="flex flex-col xl:flex-row gap-6">

              {/* LEFT ROLE CARD */}
              <div className="
w-full
xl:w-[300px]
bg-white
rounded-xl
shadow
p-5
">

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    🛡️
                  </div>
                  <div>
                   <h3 className="font-semibold">
Role Management
</h3>
                    <p className="text-xs text-gray-400">
Manage user roles and permissions.
</p>
                  </div>
                </div>

                {/* PERMISSIONS */}
                <div className="space-y-2 text-sm mb-4">
                <div className="space-y-2 text-sm mb-5">

<p className="flex items-center gap-2">
<span className="text-green-600">✔</span>
Manage Users
</p>

<p className="flex items-center gap-2">
<span className="text-green-600">✔</span>
Manage Roles
</p>

<p className="flex items-center gap-2">
<span className="text-green-600">✔</span>
Suspend Accounts
</p>

<p className="flex items-center gap-2">
<span className="text-green-600">✔</span>
Delete Accounts
</p>

</div>
                </div>

                {/* USERS COUNT */}
                <p className="text-sm text-gray-500 mb-2">Total {users.length} Users</p>

                {/* AVATARS */}
                <div className="flex -space-x-2 mb-4">
               <div className="flex -space-x-2 mb-5">

{users.slice(0,5).map(user=>(

<div
key={user._id}
className="
w-9
h-9
rounded-full
bg-blue-500
text-white
border-2
border-white
flex
items-center
justify-center
font-semibold
"
>

{user.username?.charAt(0).toUpperCase()}

</div>

))}

</div>
                </div>
<div className="space-y-2 text-sm border-t pt-4">

<div className="flex justify-between">
<span>Admins</span>
<b>{roleStats.Admin}</b>
</div>

<div className="flex justify-between">
<span>Managers</span>
<b>{roleStats.Manager}</b>
</div>

<div className="flex justify-between">
<span>Moderators</span>
<b>{roleStats.Moderator}</b>
</div>

<div className="flex justify-between">
<span>Support</span>
<b>{roleStats.Support}</b>
</div>

<div className="flex justify-between">
<span>Security</span>
<b>{roleStats.Security}</b>
</div>

<div className="flex justify-between">
<span>Customers</span>
<b>{roleStats.Customer}</b>
</div>

<div className="flex justify-between text-green-600">
<span>Active</span>
<b>{activeUsers}</b>
</div>

<div className="flex justify-between text-red-600">
<span>Suspended</span>
<b>{suspendedUsers}</b>
</div>

</div>
                {/* FOOTER */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">Updated Just Now</p>
              
                </div>

              </div>

              {/* RIGHT USERS TABLE */}
              <div className="
flex-1
w-full
bg-white
rounded-xl
shadow
overflow-hidden
">

                {/* TOP BAR */}
                <div className="flex justify-between items-center mb-6 px-3 py-2">

                  <div>
                    <h2 className="text-xl font-semibold">Role Details</h2>
                    <p className="text-sm text-gray-400">
                      Define and manage roles to streamline operations
                    </p>
                  </div>
                </div>

                {/* SEARCH + FILTER */}
                <div 
className="
flex
flex-col
lg:flex-row
justify-between
lg:items-center
mb-4
px-4
gap-4
"
>

                  <input
                    type="text"
                    value={search}
onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="
border
border-gray-400
px-4
py-2
rounded-lg
outline-none
w-full
lg:w-64
"
                  />

                  <div
className="
grid
grid-cols-2
md:flex
gap-2
items-center
w-full
lg:w-auto
"
>
              

                 
                  </div>

                </div>

                {/* TABLE HEADER */}
                <div className="hidden lg:flex text-gray-400 text-sm border-b pb-2 font-medium px-3">
                  <div className="w-[12%] ">ID</div>
                  <div className="w-[33%] text-start">User</div>
                  <div className="w-[10%] text-start">Joined Date</div>
                  <div className="w-[20%] text-center">Status</div>
                  <div className="w-[40%] text-center">Actions</div>
                </div>

                {/* DATA */}
                {users.length === 0 ? (
                  <p className="text-center text-gray-400 mt-4">No Users Found</p>
                ) : (
                  users.map((user) => {

                 const isActive =
user.status === "Active";

                    return (
                     <div
key={user._id}
className="
hidden
lg:flex
items-center
border-b
border-gray-300
px-3
py-4
hover:bg-gray-50
transition
"
>

                        {/* ID */}
                        <div className="w-[12%] text-sm text-gray-500">
                          #{user._id.slice(-6)}
                        </div>

                        {/* USER */}
                        <div className="w-[33%] flex items-start gap-3">

                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                            {user.username?.charAt(0)}
                          </div>

                          <div>
                            <p className="font-medium text-sm">{user.username}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>

                        </div>

                        {/* DATE */}
                        <div className="w-[10%] text-start text-sm text-gray-500">
                       {
user.createdAt
? new Date(user.createdAt).toLocaleDateString()
: "N/A"
}
                        </div>

                        {/* STATUS */}
                        <div className="w-[15%] text-start">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                              }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="w-[30%] flex justify-center gap-2">
                         
                          <button onClick={() => handleDeleteUser(user._id)}
                            className="px-4 py-2  flex items-center justify-center border border-gray-400 rounded-xl cursor-pointer gap-2 hover:bg-gray-100">Delete User<FiTrash2 /></button>
                        </div>

                      </div>
                    );
                  })
                )}
                <div className="lg:hidden p-4 space-y-4">

{currentUsers.map((user)=>{

const isActive =
user.status==="Active";

return(

<div
key={user._id}
className="bg-white rounded-xl shadow border p-4"
>

<div className="flex items-center gap-3">

<div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">

{user.username?.charAt(0)}

</div>

<div>

<h3 className="font-semibold">

{user.username}

</h3>

<p className="text-gray-500 text-sm">

{user.email}

</p>

</div>

</div>

<div className="mt-4 space-y-2">

<p>

<strong>ID:</strong>

#{user._id.slice(-6)}

</p>

<p>

<strong>Joined:</strong>

{
user.createdAt
? new Date(user.createdAt).toLocaleDateString()
: "N/A"
}

</p>

<p>

<strong>Status:</strong>

<span
className={`ml-2 px-2 py-1 rounded-full text-xs ${
isActive
?
"bg-green-100 text-green-600"
:
"bg-yellow-100 text-yellow-600"
}`}
>

{isActive?"Active":"Inactive"}

</span>

</p>

</div>

<button
onClick={()=>handleDeleteUser(user._id)}
className="
w-full
mt-4
bg-gray-400
text-white
py-2
rounded-lg
flex
justify-center
items-center
gap-2
"
>

Delete User

<FiTrash2/>

</button>

</div>

)

})}

</div>
                {users.length > 0 && (
                  <div className="flex
flex-col
md:flex-row
justify-between
items-center
gap-4 mt-4 px-4 pb-2 ">

                    <p className="text-sm text-gray-400">
                      Showing {indexOfFirstUser + 1} to{" "}
                      {Math.min(indexOfLastUser, users.length)} of {users.length} products
                    </p>

                    <div className="flex gap-2">

                      {/* PREV */}
                      <button
                        onClick={() => setUserPage(userPage - 1)}
                        disabled={userPage === 1}
                        className="border px-3 py-1 rounded disabled:opacity-50"
                      >
                        ‹
                      </button>

                      {/* PAGE NUMBERS */}
                      {[...Array(totalUserPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setUserPage(i + 1)}
                          className={`px-3 py-1 rounded ${userPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "border"
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      {/* NEXT */}
                      <button
                        onClick={() => setUserPage(userPage + 1)}
                        disabled={userPage === totalUserPages}
                        className="border px-3 py-1 rounded disabled:opacity-50"
                      >
                        ›
                      </button>

                    </div>

                  </div>
                )}

              </div>

            </div>
          )}


        </div>

      </div>
{showRoleModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">

      <h2 className="text-2xl font-bold mb-5">
        Update User
      </h2>

      <div className="space-y-4">

        <div>

          <label className="text-sm font-medium">
            Username
          </label>

          <input
            value={selectedUser?.username || ""}
            disabled
            className="w-full border rounded-lg p-2 bg-gray-100 mt-1"
          />

        </div>

       <div>

  <label className="text-sm font-semibold mb-3 block">
    Select Role
  </label>

  <div className="grid grid-cols-2 gap-3">

    {[

      "Manager",
      "Moderator",
      "Support",
      "Security",
      "Customer",
    ].map((role) => (

      <button
        key={role}
        type="button"
        onClick={() =>
          setRoleForm({
            ...roleForm,
            role,
          })
        }
        className={`
          p-3
          rounded-xl
          border-2
          transition
          text-sm
          font-medium

          ${
            roleForm.role === role
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 hover:border-blue-400"
          }
        `}
      >
        {role}
      </button>

    ))}

  </div>

</div>

        <div className="mt-5">
<div>

<label className="text-sm font-semibold mb-3 block">
Status
</label>

<select
value={roleForm.status}
onChange={(e)=>

setRoleForm({

...roleForm,

status:e.target.value

})

}
className="w-full border rounded-lg p-2"
>

<option value="Active">
Active
</option>

<option value="Suspended">
Suspended
</option>

</select>

</div>

</div>
      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => setShowRoleModal(false)}
          className="border px-4 py-2 rounded-lg"
        >
          Cancel
        </button>

       <button
  onClick={updateUserRole}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
  Save Changes
</button>
      </div>

    </div>

  </div>
)}
    </div>
  );
}


/* CARD */
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

export default Dashboard;
