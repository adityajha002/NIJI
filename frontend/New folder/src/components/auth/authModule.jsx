import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./auth.module.css";
import welcomeVideo from "../../assets/welcome.mp4";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const AuthModule = () => {
    const [option, setOption] = useState("login");
      const { login } = useAuth();
      const navigate = useNavigate();


    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm();

    const {
        register: signupRegister,
        handleSubmit: handleSignupSubmit,
        formState: { errors: signupErrors },
    } = useForm();

    const onLogin = async (data) => {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok){
            console.error(result.error);
            return;
        }
      login(result.user, result.token);
      if (result.user.role === "shop") {
            navigate("/dashboard");
      } else {
            navigate("/");
      }
    };

    const onSignup = async (data) => {
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok){
            console.error(result.error);
            return;
        }
        setOption("login");
    };

    return (
        <div className={styles.main}>
            <div className={styles.box}>
                <video
                    className={styles.animation}
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={welcomeVideo} type="video/mp4" />
                </video>

                <div className={styles.auth}>
                    <div className={styles.options}>
                        <div
                            className={styles.loginOpt}
                            style={
                                option === "login"
                                    ? { color: "#fc9b3a" }
                                    : {}
                            }
                            onClick={() => setOption("login")}
                        >
                            LOGIN
                        </div>

                        <div
                            className={styles.signupOpt}
                            style={
                                option === "signup"
                                    ? { color: "#fc9b3a" }
                                    : {}
                            }
                            onClick={() => setOption("signup")}
                        >
                            SIGN UP
                        </div>
                    </div>

                    {/* LOGIN */}

                    <div
                        className={`${styles.login} ${
                            option === "login" ? styles.active : ""
                        }`}
                    >
                        <form
                            className={styles.Loginform}
                            onSubmit={handleLoginSubmit(onLogin)}
                        >
                            <input
                                type="text"
                                placeholder="username"
                                className={styles.input}
                                {...loginRegister("username", {
                                    required: "username is required",
                                })}
                            />

                            {loginErrors.username && (
                                <p>{loginErrors.username.message}</p>
                            )}

                            <input
                                type="password"
                                placeholder="Password"
                                className={styles.input}
                                {...loginRegister("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Minimum 6 characters",
                                    },
                                })}
                            />

                            {loginErrors.password && (
                                <p>{loginErrors.password.message}</p>
                            )}

                            <button
                                type="submit"
                                className={styles.button}
                            >
                                Login
                            </button>
                        </form>
                    </div>

                    {/* SIGNUP */}

                    <div
                        className={`${styles.signup} ${
                            option === "signup" ? styles.active : ""
                        }`}
                    >
                        <form
                            className={styles.Signupform}
                            onSubmit={handleSignupSubmit(onSignup)}
                        >
                            <input
                                type="text"
                                placeholder="Username"
                                className={styles.input}
                                {...signupRegister("username", {
                                    required: "Username is required",
                                })}
                            />

                            {signupErrors.username && (
                                <p>{signupErrors.username.message}</p>
                            )}

                            <input
                                type="text"
                                placeholder="name"
                                className={styles.input}
                                {...signupRegister("name", {
                                    required: "name is required",
                                })}
                            />

                            {signupErrors.name && (
                                <p>{signupErrors.name.message}</p>
                            )}

                            <input
                                type="password"
                                placeholder="Password"
                                className={styles.input}
                                {...signupRegister("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Minimum 6 characters",
                                    },
                                })}
                            />

                            {signupErrors.password && (
                                <p>{signupErrors.password.message}</p>
                            )}

                            <button
                                type="submit"
                                className={styles.button}
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModule;