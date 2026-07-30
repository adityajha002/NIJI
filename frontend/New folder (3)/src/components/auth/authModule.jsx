import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./auth.module.css";
import welcomeVideo from "../../assets/welcome.mp4";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { API_BASE_URL } from '../../config/api';

const AuthModule = () => {
    const [option, setOption] = useState("login");
    const [loginError, setLoginError] = useState("");
    const [signupError, setSignupError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
      const { login } = useAuth();
      const navigate = useNavigate();

    const usernameRules = {
        required: "username is required",
        setValueAs: (value) => value.toLowerCase(),
        validate: (value) => !value.includes(" ") || "username cannot contain spaces",
    };

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
        setLoginError("");
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json().catch(() => ({}));
            if (!res.ok){
                const message = res.status >= 500
                    ? "Internal Server Error"
                    : result.error || "Unable to login";

                setLoginError(message);
                console.error(result.error || message);
                return;
            }
          login(result.user, result.token);
          navigate("/");
        } catch (error) {
            setLoginError("Internal Server Error");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSignup = async (data) => {
        setSignupError("");
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json().catch(() => ({}));
            if (!res.ok){
                const message = res.status >= 500
                    ? "Internal Server Error"
                    : result.error || "Unable to sign up";

                setSignupError(message);
                console.error(result.error || message);
                return;
            }
            setOption("login");
        } catch (error) {
            setSignupError("Internal Server Error");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.welcome}> WELCOME USER</h1>
            <p className={styles.desc}> Enter your account detail here, or SignUp for a New Account if you are new here. By clicking on SignUp you must agree to our Terms and Conditions given below...</p>
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
                                {loginError && (
                                    <div className={styles.serverError} role="alert">
                                        {loginError}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="username"
                                    className={styles.input}
                                    {...loginRegister("username", usernameRules)}
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Logging in..." : "Login"}
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
                                {signupError && (
                                    <div className={styles.serverError} role="alert">
                                        {signupError}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Username"
                                    className={styles.input}
                                    {...signupRegister("username", usernameRules)}
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Signing up..." : "Sign Up"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModule;
