import {createRoot} from 'react-dom/client'
import {Provider} from "react-redux";
import {MainRouterProvider} from './router/Router.tsx';
import {store} from "./store/store.ts";
import "./styles/index.sass"
import {AuthProvider} from "./context/AuthContext.tsx";
import {SocketProvider} from "./context/SocketContext.tsx";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <AuthProvider>
            <SocketProvider>
                <MainRouterProvider/>
            </SocketProvider>
        </AuthProvider>
    </Provider>
)