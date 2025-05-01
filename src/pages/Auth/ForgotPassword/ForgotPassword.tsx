import { Link } from "react-router";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { IoIosArrowBack } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import logo from "../../../assets/images/astronaut.svg";
import decorImg from "../../../assets/images/login/decor-bg.svg";
import planetImg from "../../../assets/images/login/planet.svg";
import { useMutation } from "@tanstack/react-query";
import authService from "../services/authService";
import { useToast } from "../../../hooks/useToast";
import { useState } from "react";

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handleForgotPassword = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      const response = await authService.forgotPassword(email);
    },
    onSuccess: () => {
      showToast("success", "Reset password email sent successfully!");
    },
  });

  return (
    <div className="w-full h-screen relative flex items-center justify-center bg-gradient-to-b from-indigo-500 to-purple-500">
      <img
        src={decorImg}
        alt="Decoration Login"
        className="absolute bottom-0 w-full"
      />
      <div className="absolute w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden z-10">
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
            <span className="font-degular font-bold text-4xl text-[#533aae] dark:text-purple-200">
              LectrifAI
            </span>
          </a>
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-800 md:text-2xl dark:text-white">
            Reset your password
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            method="POST"
            action="#"
            onSubmit={(e) => handleForgotPassword.mutate(e)}
          >
            <p className="text-sm text-gray-700 dark:text-white">
              Enter your user account's verified email address and we will send
              you a password reset link.
            </p>
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
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
                  placeholder="abcde@gmail.com"
                  value={email}
                  onChange={handleChangeEmail}
                />
              </div>
            </div>
            {/* <div>
              <label
                htmlFor="verify"
                className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
              >
                Verify your account
              </label>
              <div className="w-full">
                <HCaptcha
                  sitekey={HCAPTCHA_SITE_KEY}
                  //   onVerify={(token, ekey) =>
                  //     handleVerificationSuccess(token, ekey)
                  //   }
                />
              </div>
            </div> */}
            <div className="flex items-center justify-between gap-4">
              <Link
                to={"/login"}
                type="submit"
                className="flex items-center justify-center gap-2 w-full text-gray-800 bg-white border border-gray-300 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400"
              >
                <IoIosArrowBack className="text-base" />
                Back to Login
              </Link>
              <button
              disabled={handleForgotPassword.isPending}
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
              >
                Send email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
