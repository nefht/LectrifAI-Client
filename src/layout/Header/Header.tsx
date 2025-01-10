import { useState, useEffect, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import styles from "./Header.module.css";
import { Link, useLocation } from "react-router";
import { Button } from "flowbite-react";
import logo from "../../assets/images/astronaut.svg";
import CategorySearchBar from "../../components/CategorySearchBar";
import HeaderDropdownOption from "../../layout/Header/HeaderDropdownOption/HeaderDropdownOption";
import { useHeader } from "../../hooks/useHeader";
import { useTheme } from "../../hooks/useTheme";

function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { headerClass } = useHeader();
  // theme context
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full h-16 z-50 transition duration-320 ease-in-out ${
          scrolled ? "bg-header shadow-lg border-none" : ""
        } ${
          location.pathname === "/"
            ? ""
            : "border-b border-gray-200 shadow-md dark:bg-[#47126B]"
        } ${headerClass}`}
      >
        <nav
          aria-label="Global"
          className="mx-auto flex w-full xl:max-w-header h-full items-center justify-between p-4 lg:px-4"
        >
          <div className="flex mr-10">
            <a
              href="/"
              className="-m-1.5 p-1.5 flex flex-row items-center gap-2"
            >
              <span className="sr-only">Logo LectrifAI</span>
              <img alt="" src={logo} className="h-10 w-auto" />
              <span className="font-degular font-bold text-[24px] xl:text-[30px] text-purple-900 dark:text-purple-300">
                LectrifAI
              </span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:justify-between lg:items-center gap-x-8 ml-6 mr-6">
            <HeaderDropdownOption
              displayMode="header"
              optionTitle="Slide Tools"
            />
            <HeaderDropdownOption
              displayMode="header"
              optionTitle="Lecture Tools"
            />
            <HeaderDropdownOption
              displayMode="header"
              optionTitle="Templates"
            />
            {/* <div className="hidden lg:flex lg:gap-x-12">
              <a
                href="/about-us"
                className="xl:text-sm/6 text-ssm/6 font-semibold text-gray-900"
              >
                About Us
              </a>
            </div> */}
            <button className="bg-green-200" onClick={toggleTheme}>
              Theme
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 justify-center">
            <CategorySearchBar />
          </div>
          <div className="hidden lg:flex lg:justify-end ml-4">
            <Button color="purple" className={styles["login-button"]}>
              Log in
            </Button>
            {/* <a href="#" className="text-sm/6 font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a> */}
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img alt="" src={logo} className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <HeaderDropdownOption
                    displayMode="dialog"
                    optionTitle="Slide Tools"
                  />
                  <HeaderDropdownOption
                    displayMode="dialog"
                    optionTitle="Lecture Tools"
                  />
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    About Us
                  </a>
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  );
}

export default Header;
