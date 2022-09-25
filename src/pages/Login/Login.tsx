import React from 'react';
import styles from './login.css'
import LoginForm from "../../Component/LoginForm/LoginForm";


const Login = () => {
    return (
        <div className={styles.container}>
            <LoginForm/>
        </div>
    );
};

export default Login;
