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
import {FullOrderPage} from "../pages/Orders/FullOrderPage.tsx";
import {Error404} from "../pages/Error/Error404.tsx";
import {Error500} from "../pages/Error/Error500.tsx";
import {Error403} from "../pages/Error/Error403.tsx";
import {ReviewsTab} from "../pages/LK/ReviewTab.tsx";
import {OrdersTab} from "../pages/LK/OrdersTab.tsx";
import {ProfileTab} from "../pages/LK/ProfileTab.tsx";
import {OrderDetailPage} from "../pages/LK/OrderDetailPage.tsx";
import {SearchPage} from "../pages/Products/SearchPage.tsx";
import {AdminProductsAccordionPage} from "../pages/Admin/AdminProductsAccordionPage.tsx";
import {RequestsPage} from "../pages/Admin/RequestsPage.tsx";
import {AdminProfilePage} from "../pages/Admin/AdminProfilePage.tsx";
import {ProtectedRoute} from "./Protected.route.tsx";
import {AdminRoute} from "./Admin.route.tsx";
import {CodeVerification} from "../pages/Auth/CodeVerification.tsx";
import {SolutionsPage} from "../pages/Solution/SolutionsPage.tsx";
import {OneSolutionPage} from "../pages/Solution/OneSolutionPage.tsx";
import {PrivacyPolicyPage} from "../pages/Legal/PrivacyPolicyPage.tsx";
import {UserAgreementPage} from "../pages/Legal/UserAgreementPage.tsx";
import {PublicOfferPage} from "../pages/Legal/PublicOfferPage.tsx";
import {ReturnPolicyPage} from "../pages/Legal/ReturnPolicyPage.tsx";
import {CreateSolutionPage} from "../pages/Admin/CreateSolutionPage.tsx";
import {StaffPage} from "../pages/Admin/StaffPage.tsx";
import {CalculatorPage} from "../pages/Calculator/CalculatorPage.tsx";
import {CalculatorResultPage} from "../pages/Calculator/CalculatorResultPage.tsx";

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
            {
                path: "/staff",
                element: (
                    <AdminRoute>
                        <StaffPage/>
                    </AdminRoute>
                )
            },
            {
                path: "/requests",
                element: (
                    <AdminRoute>
                        <RequestsPage/>
                    </AdminRoute>
                )
            },
            {
                path: "/profile",
                element: (
                    <AdminRoute>
                        <AdminProfilePage/>
                    </AdminRoute>
                )
            },
            {
                path: "/admin/create-solution",
                element: (
                    <AdminRoute>
                        <CreateSolutionPage/>
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
            {path: "/catalog", element: <Categories/>},
            {path: "/catalog/:category-slug", element: <Products/>},
            {
                path: "/catalog/:category-slug/:product-slug/:article",
                element: <OneProductPage/>,
            },
            {path: "/search", element: <SearchPage/>},
            {path: "/stock/:stock-slug", element: <StockPage/>},
            {path: "/solution", element: <SolutionsPage/>},
            {path: "/solution/:slug", element: <OneSolutionPage/>},
            {path: "/videos", element: <VideosPage/>},
            {path: "/calculator", element: <CalculatorPage/>},
            {path: "/calculator/:article", element: <CalculatorResultPage/>},
            {path: "/privacy-policy", element: <PrivacyPolicyPage/>},
            {path: "/user-agreement", element: <UserAgreementPage/>},
            {path: "/public-offer", element: <PublicOfferPage/>},
            {path: "/return-policy", element: <ReturnPolicyPage/>},

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
                    {path: "orders/:orderNumber", element: <OrderDetailPage/>},
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