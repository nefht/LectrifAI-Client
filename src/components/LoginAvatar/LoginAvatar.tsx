import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { UserCircleIcon, PowerIcon } from "@heroicons/react/16/solid";
import { MdStorage } from "react-icons/md";
import { Avatar } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

interface LoginAvatarProps {
  displayMode: "header" | "dialog";
}

function LoginAvatar({ displayMode }: LoginAvatarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {displayMode === "header" ? (
        <Menu>
          <MenuButton>
            <Avatar rounded img={user?.avatarUrl} />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="z-[9999] bg-white font-semibold mt-4 max-w-60 origin-top-right rounded-xl border p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/user-profile/${user?.id}`)}
            >
              <div className="flex items-center gap-2 p-3">
                <Avatar rounded img={user?.avatarUrl} />
                <div>
                  <div className="text-sm/5 font-semibold">
                    {user?.fullName}
                  </div>
                  <div className="text-xs/5 text-gray-500 font-normal">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="my-1 h-px bg-gray-200" />
            <MenuItem>
              <button
                onClick={() => navigate(`/edit-profile/${user?.id}`)}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100"
              >
                <UserCircleIcon className="size-4 fill-purple-500" />
                Profile
                <kbd className="ml-auto hidden font-sans text-xs text-purple-800 group-data-[focus]:inline">
                  ⌘P
                </kbd>
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100"
                onClick={() => navigate("/storage")}
              >
                <MdStorage className="size-4 fill-purple-500" />
                Storage
                <kbd className="ml-auto hidden font-sans text-xs text-purple-800 group-data-[focus]:inline">
                  ⌘S
                </kbd>
              </button>
            </MenuItem>
            <div className="my-1 h-px bg-gray-200" />
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-purple-200/80"
                onClick={logout}
              >
                <PowerIcon className="size-4 fill-purple-500" />
                Logout
                <kbd className="ml-auto hidden font-sans text-xs text-purple-800 group-data-[focus]:inline">
                  ⌘L
                </kbd>
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      ) : (
        <div className="-mx-3">
          <div
            className="ml-3 mb-3 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/user-profile/${user?.id}`)}
          >
            <Avatar rounded img={user?.avatarUrl} />
            <div>
              <div className="text-sm/5 font-semibold">{user?.fullName}</div>
              <div className="text-xs/5 text-gray-500 font-normal">
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/edit-profile/${user?.id}`)}
            className="group flex w-full items-center gap-3 rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
          >
            <UserCircleIcon className="size-4 fill-purple-500 dark:fill-indigo-700" />
            Profile
            <kbd className="ml-auto hidden font-sans text-xs text-purple-800 group-hover:inline dark:text-indigo-800">
              ⌘P
            </kbd>
          </button>
          <button
            className="group flex w-full items-center gap-3 rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
            onClick={() => navigate("/storage")}
          >
            <MdStorage className="size-4 fill-purple-500 dark:fill-indigo-700" />
            Storage
            <kbd className="ml-auto hidden font-sans text-xs text-purple-800 group-hover:inline dark:text-indigo-800">
              ⌘S
            </kbd>
          </button>
          <button
            className="group flex w-full items-center gap-3 rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 bg-purple-200 dark:bg-indigo-200 hover:bg-purple-200/80 dark:hover:bg-indigo-200/80"
            onClick={logout}
          >
            <PowerIcon className="size-4 fill-purple-500 dark:fill-indigo-700" />
            Logout
            <kbd className="ml-auto hidden font-sans text-xs text-purple-800 group-hover:inline dark:text-indigo-800">
              ⌘L
            </kbd>
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginAvatar;
