import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/16/solid";
import { Avatar } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";

function LoginAvatar() {
  const { user, logout } = useAuth();
  console.log(user);
  
  return (
    <div>
      <Menu>
        <MenuButton>
          <Avatar rounded />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="bg-white font-semibold mt-4 max-w-60 origin-top-right rounded-xl border p-1 text-sm/6 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div>
            <div className="flex items-center gap-2 p-3">
              <Avatar rounded />
              <div>
                <div className="text-sm/5 font-semibold">{user?.fullName}</div>
                <div className="text-xs/5 text-gray-500 font-normal">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
          <div className="my-1 h-px bg-gray-200" />
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100">
              <UserCircleIcon className="size-4 fill-purple-500" />
              Profile
              <kbd className="ml-auto hidden font-sans text-xs text-purple-800 group-data-[focus]:inline">
                ⌘P
              </kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100">
              <AdjustmentsHorizontalIcon className="size-4 fill-purple-500" />
              Setting
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
    </div>
  );
}

export default LoginAvatar;
