import { useState } from "react";
import { Link } from "react-router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import logo from "../../../assets/images/astronaut.svg";
import decorImg from "../../../assets/images/login-img/decor-bg.svg";
import planetImg from "../../../assets/images/login-img/planet.svg";

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-500">
      <img
        src={decorImg}
        alt="Decoration Login"
        className="absolute bottom-0 w-full"
      />
      <div className="absolute w-5/6 md:w-1/3 bg-white shadow-2xl rounded-3xl overflow-hidden z-10">
        <img
          src={planetImg}
          alt="Planet Image"
          className="absolute right-0 bottom-0 w-4/5 opacity-70 z-0"
        />
        <div className="relative w-full p-8 space-y-8 md:space-y-4 sm:p-10 z-20">
          <a
            href="/"
            className="flex flex-row items-center justify-center gap-2"
          >
            <span className="sr-only">Logo LectrifAI</span>
            <img alt="" src={logo} className="h-10 w-auto" />
            <span className="font-degular font-bold text-4xl text-[#533aae] dark:text-purple-300">
              LectrifAI
            </span>
          </a>
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
            Reset your password
          </h1>
          <form className="space-y-4 md:space-y-6" method="POST" action="#">
            <p className="text-sm text-gray-700 dark:text-white">
              Enter your new password and confirm it to reset your password.
            </p>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  required={true}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                  placeholder="••••••••"
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  required={true}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-500 dark:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <FaEye className="h-5 w-5" />
                  ) : (
                    <FaEyeSlash className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center pt-4">
              <Link
                to={"/login"}
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Confirm
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
