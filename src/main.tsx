import {createRoot} from 'react-dom/client'
import {Provider} from "react-redux";
import {store} from "./store/store.ts";
import { MainRouterProvider } from './router/Router.tsx';
import "./styles/index.sass"

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <MainRouterProvider/>
    </Provider>
)
