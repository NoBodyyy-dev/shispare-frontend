import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Layout} from "../Layout";
import {Home} from "../pages/Home/HomePage";
import {About} from "../pages/About/AboutPage";
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
import {CheckoutPage} from "../pages/Cart/CheckoutPage";
import {OrdersPage} from "../pages/Orders/OrdersPage.tsx";
import {OneOrderPage} from "../pages/Orders/OneOrderPage.tsx";
import {Error404} from "../pages/Error/Error404.tsx";
import {Error500} from "../pages/Error/Error500.tsx";
import {Error403} from "../pages/Error/Error403.tsx";
import {ReviewsTab} from "../pages/LK/ReviewTab.tsx";
import {OrdersTab} from "../pages/LK/OrdersTab.tsx";
import {ProfileTab} from "../pages/LK/ProfileTab.tsx";
import {SearchPage} from "../pages/Products/SearchPage.tsx";
import {AdminProductsAccordionPage} from "../pages/Admin/AdminProductsAccordionPage.tsx";
import {ProtectedRoute} from "./Protected.route.tsx";
import {AdminRoute} from "./Admin.route.tsx";
import {CodeVerification} from "../pages/Auth/CodeVerification.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout/>
        ),
        children: [
            {
                path: "/admin",
                element: (
                    <AdminRoute>
                        <AdminProductsAccordionPage/>
                    </AdminRoute>
                )
            },
            {
                path: "/users",
                element: (
                    <AdminRoute>
                        <UsersPage/>
                    </AdminRoute>
                )
            },

            {path: "/", element: <Home/>},
            {path: "/blog", element: <Blog/>},
            {path: "/blog/:slug", element: <OneBlog/>},
            {path: "/about", element: <About/>},
            {path: "/cart", element: <Cart/>},
            {path: "/contacts", element: <Contacts/>},
            {path: "/delivery-payment", element: <DeliveryPayment/>},
            {path: "/categories", element: <Categories/>},
            {path: "/categories/:category-slug", element: <Products/>},
            {
                path: "/categories/:category-slug/:article",
                element: <OneProductPage/>,
                // errorElement: <Error404/>
            },
            {path: "/search", element: <SearchPage/>},
            {path: "/solution", element: <Solution/>},
            {path: "/solution/:solution-slug", element: <OneSolution/>},
            {path: "/stock/:stock-slug", element: <StockPage/>},
            {path: "/videos", element: <VideosPage/>},

            {path: "/auth", element: <AuthPage/>},
            {path: "/auth/confirm", element: <CodeVerification/>},

            {
                path: "/cart/checkout",
                element: (
                    <ProtectedRoute>
                        <CheckoutPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/chat",
                element: (
                        <Chat/>
                )
            },
            {
                path: "/orders",
                element: (
                        <OrdersPage/>
                )
            },
            {
                path: "/orders/:orderNumber",
                element: (
                        <OneOrderPage/>
                )
            },
            {
                path: "/lk/:id",
                element: (
                        <Lk/>
                ),
                children: [
                    {index: true, element: <ProfileTab/>},
                    {path: "orders", element: <OrdersTab/>},
                    {path: "comments", element: <ReviewsTab/>},
                ]
            },

            {path: "/403", element: <Error403/>},
            {path: "/404", element: <Error404/>},
            {path: "/500", element: <Error500/>},
            {path: "*", element: <Error404/>}
        ],
        errorElement: <Error500/>,
    },
]);

export const MainRouterProvider = () => <RouterProvider router={router}/>;