import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import axios from 'axios'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster }
from "react-hot-toast";
import { API_BASE_URL, rewriteBackendUrl } from "./lib/api"
import Layout from '../Layout.jsx'
import Home from './components/Home/Home.jsx'
import Card from './components/Card/Card.jsx'
import Show from "./components/Show/Show.jsx";
import Stone from './components/Card/Stone.jsx'
import Services from './components/Services/Services.jsx';
import About from './Pages/AboutUs/AboutUS.jsx'
import ContactUs from './Pages/ContactUs/ContactUs.jsx'
import FAQ from './Pages/FAQS/Faqs.jsx'
import Signup from './User/Signup.jsx'
import Login from './User/Login.jsx'
import MenRing from './components/MenRing/Rings.jsx'
import Necklace from './components/Necklaces/Necklaces.jsx'
import Earrings from './components/Earrings/Earrings.jsx'
import Cart from './components/Cart/Cart.jsx'
import { AuthProvider } from "./context/AuthContext"
import Checkout from './components/Checkout/Checkout.jsx'
import OrderSuccess from "./Pages/OrderSuccess/OrderSuccess.jsx"
import AddRing from './admin/pages/MenRing/AddRing.jsx'
import AddNecklace from './admin/pages/Necklace/AddNecklaces.jsx'
import AddEarring from './admin/pages/Earring/AddEarrings.jsx'
import AddStone from './admin/pages/Stone/AddStone.jsx'
import Dashboard from './admin/pages/Dashboard.jsx'
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import ProtectedRoute from "./admin/pages/ProtectedRoute";
import WomenRing from "./components/WomenRing/WomenRing.jsx";
import EditRing from './admin/pages/MenRing/EditRing.jsx'
import AddWomenRing from './admin/pages/WomenRing/AddWomenRing.jsx'
import EditWomenRing from './admin/pages/WomenRing/EditWomenRing.jsx'
import EditNecklace from './admin/pages/Necklace/EditNecklace.jsx'
import EditEarring from './admin/pages/Earring/EditEarring.jsx'
import EditStone from './admin/pages/Stone/EditStone.jsx'
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy.jsx'
import CollectionsPage from "./components/pages/CollectionsPage.jsx";
import CollectionProductsPage from './components/pages/CollectionProductsPage.jsx'
import ScrollRestoration from './components/ScrollRestoration/ScrollRestoration.jsx'
import Collections from "./admin/pages/Collection/Collections";
import AddCollection from "./admin/pages/Collection/AddCollection";
import EditCollection from "./admin/pages/Collection/EditCollection";
import Gemstone from './admin/pages/Gemstone/Gemstones.jsx'
import AddGemstone from './admin/pages/Gemstone/AddGemstone.jsx'
import EditGemstone from './admin/pages/Gemstone/EditGemstone.jsx'
import AddMenCategory from './admin/pages/MenCategory/AddMenCategory.jsx'
import EditMenCategory from './admin/pages/MenCategory/EditMenCategory.jsx'
import AddWomenCategory from './admin/pages/WomenCategory/AddWomenCategory.jsx'
import EditWomenCategory from './admin/pages/WomenCategory/EditWomenCatgory.jsx'
import Orders from './admin/order/Orders.jsx'
import MyOrders from './Pages/MyOrders/MyOrders.jsx';
import TrackOrder from './Pages/MyOrders/TrackOrder.jsx';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use((config) => {
  if (config?.url) {
    config.url = rewriteBackendUrl(config.url);
  }

  config.withCredentials = true;

  if (!config.baseURL) {
    config.baseURL = API_BASE_URL;
  }

  return config;
});

const originalFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  const requestUrl =
    typeof input === "string"
      ? input
      : input instanceof Request
        ? input.url
        : "";

  const rewrittenUrl = rewriteBackendUrl(requestUrl);
  const nextInput =
    typeof input === "string"
      ? rewrittenUrl
      : input instanceof Request && rewrittenUrl !== requestUrl
        ? new Request(rewrittenUrl, input)
        : input;

  const isBackendRequest =
    rewrittenUrl.startsWith("/") ||
    rewrittenUrl.startsWith(API_BASE_URL) ||
    /^https?:\/\/(localhost|127\.0\.0\.1):8080/i.test(rewrittenUrl);

  const nextInit = isBackendRequest
    ? {
        ...init,
        credentials: init.credentials ?? "include",
      }
    : init;

  return originalFetch(nextInput, nextInit);
};



const router = createBrowserRouter(
  
  [
    {
      path: "/",
      element: (
        <>
          <ScrollRestoration />
          <Layout />
        </>
      ),
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "product/:id",
          element: <Show />
        },
        {
          path: "product/:type/:id",
          element: <Show />,
        },
        {
          path: "gemstone/:slug",
          element: <Show />
        },
        {
          path: "collections",
          element: <CollectionsPage />
        },
        {
          path: "collections/:slug",
          element: <CollectionProductsPage />
        },
        {
          path: "collection/:id",
          element: <Show />  // your Show.jsx
        }, {
          path: "Stone",
          element: <Stone />
        },
        {
          path: "collections/menrings",
          element: <MenRing />
        },
        {
          path: "collections/womenrings",
          element: <WomenRing />
        },
        {
          path: "collections/necklaces",
          element: <Necklace />
        }, {
          path: "collections/earrings",
          element: <Earrings />
        },
        {
          path: "cart",
          element: <Cart />
        },
        {
          path: "Services",
          element: <Services />
        },
        {
          path: "AboutUS",
          element: <About />
        },
        {
          path: "about",
          element: <About />
        },
        {
          path: "ContactUs",
          element: <ContactUs />
        },
        {
          path: "contact",
          element: <ContactUs />
        },
        {
          path:"my-orders",
          element:<MyOrders/>
        },
        {
          path:"orders",
          element:<MyOrders/>
        },
        {
          path:"profile",
          element:<MyOrders/>
        },
        {
        path:"track-order/:id",
        element:<TrackOrder/>
        },
        {
          path: "Faqs",
          element: <FAQ />
        },
        {
          path: "pages/privacy-policy",
          element: <PrivacyPolicy />
        },
        {
          path: "checkout",
          element: <Checkout />
        },
        {
          path: "order-success",
          element: <OrderSuccess />
        },
        {
          path: "signup",
          element: <Signup />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "admin",
          element: <AdminLogin />
        },
        {
          path: "admin/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/addstone",
          element: (
            <ProtectedRoute>
              <AddStone />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/edit-stone/:id",
          element: (
            <ProtectedRoute>
              <EditStone />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/addring",
          element: (
            <ProtectedRoute>
              <AddRing />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/edit/:id",
          element: (
            <ProtectedRoute>
              <EditRing />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/addwomenring",
          element: (
            <ProtectedRoute>
              <AddWomenRing />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/edit-women/:id",
          element: (
            <ProtectedRoute>
              <EditWomenRing />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/addnecklace",
          element: (
            <ProtectedRoute>
              <AddNecklace />
            </ProtectedRoute>
          )
        }, {
          path: "admin/dashboard/edit-necklace/:id",
          element: (
            <ProtectedRoute>
              <EditNecklace />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/dashboard/addearring",
          element: (
            <ProtectedRoute>
              <AddEarring />
            </ProtectedRoute>
          )
        }, {
          path: "admin/dashboard/edit-earring/:id",
          element: (
            <ProtectedRoute>
              <EditEarring />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/add-collection",
          element: (
            <ProtectedRoute>
              <AddCollection />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/edit-collection/:id",
          element: (
            <ProtectedRoute>
              <EditCollection />
            </ProtectedRoute>
          ),
        },
        {
          path:"admin/gemstones",
          element: (
            <ProtectedRoute>
              <Gemstone />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/add-gemstone",
          element: (
            <ProtectedRoute>
              <AddGemstone />
            </ProtectedRoute>
          )
        },
        {
          path: "admin/edit-gemstone/:slug",
          element: (
            <ProtectedRoute>
              <EditGemstone />
            </ProtectedRoute>
          )
        },
        {
           path:"admin/dashboard/addmencategory",
           element:(
            <ProtectedRoute>
              <AddMenCategory/>
            </ProtectedRoute>
           )
        },
        {
          path:"admin/dashboard/editmencategory/:id",
          element:(
            <ProtectedRoute>
              <EditMenCategory/>
            </ProtectedRoute>
          )
        },
         /* ================= WOMEN CATEGORY ================= */
        {
          path:"admin/addwomencategory",
          element:(
            <ProtectedRoute>
              <AddWomenCategory/>
            </ProtectedRoute>
          )
        },
        {
          path:"admin/editwomencategory/:id",
          element:(
            <ProtectedRoute>
              <EditWomenCategory/>
            </ProtectedRoute>
          )
        },
        {
          path:"admin/orders",
          element:(
            <ProtectedRoute>
              <Orders/>
            </ProtectedRoute>
          )
        }


      ]
    }
  ]
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
          <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
