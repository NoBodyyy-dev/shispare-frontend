import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Layout from "../Layout";
import Home from "../pages/Home/HomePage";
import About from "../pages/About/AboutPage";
import Profile from "../pages/Profile/ProfilePage";
import Cart from "../pages/Cart/CartPage";
import DeliveryPayment from "../pages/DeliveryPayment/DeliveryPaymentPage";
import Categories from "../pages/Products/CategoriesPage";
import Products from "../pages/Products/ProductsPage";
import OneProductPage from "../pages/Products/OneProductPage";
import Blog from "../pages/Blog/BlogPage";
import Auth from "../pages/Auth/AuthPage";
import Solution from "../pages/Solution/SolutionPage";
import OneSolution from "../pages/Solution/OneSolutionPage";
import Contacts from "../pages/Contacts/ContactsPage";
import OneBlog from "../pages/Blog/OneBlogPage.tsx";
import StockPage from "../pages/Stock/StockPage.tsx";
import VideosPage from "../pages/Videos/VideosPage.tsx";
// import CodeVerification from "../pages/Auth/CodeVerification.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "/blog", element: <Blog/>},
            {path: "/blog/:blog-slug", element: <OneBlog/>},
            {path: "/about", element: <About/>},
            {
                path: "/auth", element: <Auth/>, children: [
                    // {path: "к/verify", element: <CodeVerification />}
                ]
            },
            {path: "/cart", element: <Cart/>},
            {path: "/contacts", element: <Contacts/>},
            {path: "/delivery-payment", element: <DeliveryPayment/>},
            {path: "/categories", element: <Categories/>},
            {path: "/categories/:category-slug", element: <Products/>},
            {
                path: "/categories/:category-slug/:product-slug",
                element: <OneProductPage/>,
            },
            {path: "/profile", element: <Profile/>},
            {path: "/solution", element: <Solution/>},
            {path: "/solution/:solution-slug", element: <OneSolution/>},
            {path: "/stock/:stock-slug", element: <StockPage/>},
            {path: "/videos", element: <VideosPage/>},
        ],
        errorElement: (
            <>
                <h1>Error</h1>
            </>
        ),
    },
]);

export const MainRouterProvider = () => <RouterProvider router={router}/>;
