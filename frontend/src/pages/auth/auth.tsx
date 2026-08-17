import React, { useState } from "react";
import { useForm, RegisterOptions } from "react-hook-form";
import styles from "./auth.module.css";
import welcomeVideo from "../../assets/videos/welcome.mp4";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { loginApi, registerApi } from "../../services/authService";
import { ApiError } from "../../utils/apiError";

interface LoginFormData {
  username: string;
  password: string;
}

interface SignupFormData {
  username: string;
  name: string;
  password: string;
}

const Auth: React.FC = () => {
  const [option, setOption] = useState<"login" | "signup">("login");
  const [loginError, setLoginError] = useState<string>("");
  const [signupError, setSignupError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginUsernameRules: RegisterOptions<LoginFormData, "username"> = {
    required: "username is required",
    setValueAs: (value: string) => value.toLowerCase(),
    validate: (value: string) =>
      !value.includes(" ") || "username cannot contain spaces",
  };

  const signupUsernameRules: RegisterOptions<SignupFormData, "username"> = {
    required: "username is required",
    setValueAs: (value: string) => value.toLowerCase(),
    validate: (value: string) =>
      !value.includes(" ") || "username cannot contain spaces",
  };

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>();

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupFormData>();

  const onLogin = async (data: LoginFormData): Promise<void> => {
    setLoginError("");
    setIsSubmitting(true);

    try {
      const result = await loginApi(data);
      login(result.user, result.token);
      navigate("/");
    } catch (error) {
      if (error instanceof ApiError) {
        const message =
          error.status >= 500 ? "Internal Server Error" : error.message;
        setLoginError(message);
        console.error(error.message);
      } else {
        setLoginError("Internal Server Error");
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignup = async (data: SignupFormData): Promise<void> => {
    setSignupError("");
    setIsSubmitting(true);

    try {
      await registerApi(data);
      setOption("login");
    } catch (error) {
      if (error instanceof ApiError) {
        const message =
          error.status >= 500 ? "Internal Server Error" : error.message;
        setSignupError(message);
        console.error(error.message);
      } else {
        setSignupError("Internal Server Error");
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.welcome}> WELCOME USER</h1>
      <p className={styles.desc}>
        Enter your account detail here, or SignUp for a New Account
        if you are new here. By clicking on SignUp you must agree to
        our Terms and Conditions given below...
      </p>
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
                  <div
                    className={styles.serverError}
                    role="alert"
                  >
                    {loginError}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="username"
                  className={styles.input}
                  {...loginRegister(
                    "username",
                    loginUsernameRules
                  )}
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
                      message: "Minimum 6 characters",
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
                  {isSubmitting ? <span className={styles.spinner}></span> : "LOGIN"}
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
                  <div
                    className={styles.serverError}
                    role="alert"
                  >
                    {signupError}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Username"
                  className={styles.input}
                  {...signupRegister(
                    "username",
                    signupUsernameRules
                  )}
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
                      message: "Minimum 6 characters",
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
                  {isSubmitting
                    ? <span className={styles.spinner}></span>
                    : "SIGN UP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
