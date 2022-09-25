import React, {useContext} from 'react';
import Login from "./pages/Login/Login";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import { Context } from '.';
import {observer} from "mobx-react-lite";
import Contact from "./pages/Contact/Contact";

const App = observer(() => {
    const user = useContext(Context)?.user
    return (
    <BrowserRouter>
        <Routes>
            {user?.isAuth ? <Route path={'/'} element={<Contact/>}/> : <Route path={'/'} element={<Login/>}/>}
            <Route path={'*'} element={<Navigate to={'/'}/>}/>
        </Routes>
    </BrowserRouter>
    );
})

export default App;
