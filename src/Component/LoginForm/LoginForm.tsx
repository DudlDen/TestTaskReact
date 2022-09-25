import React from 'react';
import styles from './loginForm.css'
import {TextField} from "@mui/material";

const LoginForm = () => {
    return (
        <div className={styles.container}>
            Login
            <TextField id="standard-basic" label="Login" variant="standard" />
            Password
            <TextField id="standard-basic" label="Password"  type="password" variant="standard" />
        </div>
    );
};

export default LoginForm;
