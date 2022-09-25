import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserStore from "./store/UserStore";

interface IContext {
    user: UserStore
}

export const Context = createContext<IContext | null>(null)
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Context.Provider value={{user: new UserStore()}}>
                <App/>
        </Context.Provider>
    </React.StrictMode>
);

reportWebVitals();
