import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { HiMiniIdentification } from "react-icons/hi2";
import { MdAccountCircle } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import logo from "../../../assets/images/astronaut.svg";
import decorImg from "../../../assets/images/login/decor-bg.svg";
import googleLogo from "../../../assets/images/login/google-logo.webp";
import authService from "../services/authService";
import { useToast } from "../../../hooks/useToast";

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

function Signup() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    account: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authService.register(formData);
      showToast("success", "Register successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-500">
      <img
        src={decorImg}
        alt="Decoration Login"
        className="absolute bottom-0 w-full z-0"
      />
      <div className="absolute w-5/6 md:w-2/3 max-h-[90%] bg-white dark:bg-gray-800 shadow-2xl rounded-3xl z-50 overflow-scroll hide-scrollbar">
        <div className="w-full p-8 space-y-8 md:space-y-4 sm:p-10">
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
            Create an account
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            method="POST"
            action="#"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-500 dark:text-gray-300">
                    <HiMiniIdentification className="h-5 w-5" />
                  </div>
                  <input
                    required={true}
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="Full name"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-500 dark:text-gray-300">
                    <MdEmail className="h-5 w-5" />
                  </div>
                  <input
                    required={true}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="abcde@google.com"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="account"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Account
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-500 dark:text-gray-300">
                    <MdAccountCircle className="h-5 w-5" />
                  </div>
                  <input
                    required={true}
                    type="text"
                    name="account"
                    id="account"
                    className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    placeholder="Your account here!"
                    onChange={handleChange}
                  />
                </div>
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
                    required={true}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="relative bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                    onChange={handleChange}
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
                    placeholder="••••••••"
                    className="relative bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
                >
                  Verify yourself
                </label>
                <HCaptcha
                  sitekey={HCAPTCHA_SITE_KEY}
                  //   onVerify={(token, ekey) =>
                  //     handleVerificationSuccess(token, ekey)
                  //   }
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 checked:border-purple-600 checked:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 focus:ring-3 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    I do not wish to receive news and promotions from LectrifAI
                    by email.
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              >
                <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
                Continue with Google
              </button>
              <button
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Sign up
              </button>
            </div>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:underline dark:text-purple-500"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
