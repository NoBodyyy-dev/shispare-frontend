import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Layout} from "../Layout";
import {Home} from "../pages/Home/HomePage";
import {About} from "../pages/About/AboutPage";
import {Profile} from "../pages/Profile/ProfilePage";
import {Cart} from "../pages/Cart/CartPage";
import {DeliveryPayment} from "../pages/DeliveryPayment/DeliveryPaymentPage";
import {Categories} from "../pages/Products/CategoriesPage";
import {Products} from "../pages/Products/ProductsPage";
import {OneProductPage} from "../pages/Products/OneProductPage";
import {Blog} from "../pages/Blog/BlogPage";
import {Solution} from "../pages/Solution/SolutionPage";
import {OneSolution} from "../pages/Solution/OneSolutionPage";
import {Contacts} from "../pages/Contacts/ContactsPage";
import {OneBlog} from "../pages/Blog/OneBlogPage.tsx";
import {StockPage} from "../pages/Stock/StockPage.tsx";
import {VideosPage} from "../pages/Videos/VideosPage.tsx";
import {AuthPage} from "../pages/Auth/AuthPage.tsx";
import {Lk} from "../pages/LK/LK.tsx";
import {UsersPage} from "../pages/users/UsersPage.tsx";
import {Chat} from "../pages/Chat/Chat.tsx";
import CheckoutPage from "../pages/Cart/CheckoutPage";
import {OrdersPage} from "../pages/Orders/OrdersPage.tsx";
import {OneOrderPage} from "../pages/Orders/OneOrderPage.tsx";
import {NotFoundPage} from "../pages/Error/NotFoundPage.tsx";
import {ServerErrorPage} from "../pages/Error/ServerErrorPage.tsx";
// import CodeVerification from "../pages/Auth/CodeVerification.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {path: "/", element: <Home/>},
            {path: "/auth", element: <AuthPage/>},
            {path: "/blog", element: <Blog/>},
            {path: "/blog/:slug", element: <OneBlog/>},
            {path: "/about", element: <About/>},
            {path: "/cart", element: <Cart/>},
            {path: "/cart/checkout", element: <CheckoutPage/>},
            {path: "/chat", element: <Chat/>},
            {path: "/contacts", element: <Contacts/>},
            {path: "/delivery-payment", element: <DeliveryPayment/>},
            {path: "/categories", element: <Categories/>},
            {path: "/categories/:category-slug", element: <Products/>},
            {path: "/categories/:category-slug/:product-slug", element: <OneProductPage/>},
            {path: "/lk/:id", element: <Lk/>},
            {path: "/orders", element: <OrdersPage/>},
            {path: "/orders/:orderId", element: <OneOrderPage/>},
            {path: "/profile", element: <Profile/>},
            {path: "/solution", element: <Solution/>},
            {path: "/solution/:solution-slug", element: <OneSolution/>},
            {path: "/stock/:stock-slug", element: <StockPage/>},
            {path: "/videos", element: <VideosPage/>},
            {path: "/users", element: <UsersPage/>},
            {path: "*", element: <NotFoundPage/>},
        ],
        errorElement: <ServerErrorPage/>,
    },
]);

export const MainRouterProvider = () => <RouterProvider router={router}/>;
