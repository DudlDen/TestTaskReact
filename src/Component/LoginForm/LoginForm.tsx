import React, {ChangeEvent, useContext, useState} from 'react';
import styles from './loginForm.css'
import {Button, TextField} from "@mui/material";
import axios from "axios";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const LoginForm = observer(() => {
    const user = useContext(Context)?.user
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    function changeLogin(e:ChangeEvent<HTMLInputElement>){
        setLogin(e.target.value)
    }
    function changePassword(e:ChangeEvent<HTMLInputElement>){
        setPassword(e.target.value)
    }

    async function clickLogin(){
        if (password === '' || login === ''){
            return alert('Введите все поля')
        }
        await axios.get('http://localhost:3000/users?login='+login)
                .then((res) => {
                    if (!res.data[0]){
                        return alert('Неверный логин')
                    }
                    if (res.data[0].password === password){
                        user?.setIsAuth(true)
                    }else{
                        alert('Неверный пароль')
                    }
                })
                .catch(console.log)
    };

    return (
        <div className={styles.container}>
            <TextField value={login} onChange={changeLogin} className={styles.input} label="Login" variant="standard" />
            <TextField value={password} onChange={changePassword} label="Password" variant="standard" type="password" />
            <div className={styles.btnContainer}>
                <Button onClick={clickLogin} variant="outlined">Login</Button>
            </div>
        </div>
    );
});

export default LoginForm;
