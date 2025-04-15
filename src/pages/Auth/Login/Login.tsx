import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import styles from "./Login.module.css";
import logo from "../../../assets/images/astronaut.svg";
import decorImg from "../../../assets/images/login/decor-bg.svg";
import planetImg from "../../../assets/images/login/planet.svg";
import astronautImg from "../../../assets/images/astronaut.svg";
import googleLogo from "../../../assets/images/login/google-logo.webp";
import authService from "../services/authService";
import { useAuth } from "../../../hooks/useAuth";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    account: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChangeLoginForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Logging in...", loginForm);
      const response = await authService.login(
        loginForm.account,
        loginForm.password,
        rememberMe
      );

      login(response.token, response.user);
      navigate("/");
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-500">
      <img
        src={decorImg}
        alt="Decoration Login"
        className="absolute bottom-0 w-full z-0"
      />
      <div className="absolute w-5/6 md:w-2/3 bg-white dark:bg-gray-800 shadow-2xl rounded-3xl z-50 overflow-hidden">
        <img
          src={planetImg}
          alt="Planet Image"
          className="hidden xl:block absolute right-0 bottom-0 w-3/5"
        />
        <img
          src={astronautImg}
          alt="Astronaut Image"
          className={`hidden xl:block absolute right-32 bottom-36 w-2/5 ${styles["astronaut"]}`}
        />
        <div className="w-full xl:w-1/2 p-8 space-y-8 md:space-y-4 sm:p-10">
          <a
            href="/"
            className="xl:absolute xl:top-10 xl:right-10 flex flex-row items-center gap-2"
          >
            <span className="sr-only">Logo LectrifAI</span>
            <img alt="" src={logo} className="h-10 w-auto" />
            <span className="font-degular font-bold text-4xl text-[#533aae] dark:text-purple-200">
              LectrifAI
            </span>
          </a>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            method="POST"
            action="#"
            onSubmit={handleLogin}
          >
            <div>
              <label
                htmlFor="account"
                className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
              >
                Account
              </label>
              <input
                type="text"
                name="account"
                id="account"
                className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                placeholder="Your account here!"
                value={loginForm.account}
                onChange={handleChangeLoginForm}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="relative bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                  value={loginForm.password}
                  onChange={handleChangeLoginForm}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-500 dark:text-gray-300"
                >
                  {showPassword ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
            >
              <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
              Log in with Google
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 checked:border-purple-600 checked:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 focus:ring-3 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-purple-600 hover:underline dark:text-purple-500"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            >
              Log in
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-purple-600 hover:underline dark:text-purple-500"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
