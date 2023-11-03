import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "./Avatar";
import { NavbarAdmin } from "./NavbarAdmin";
import Button from "./Button";
import { SolanaPublicInfo } from "./SolanaPublicInfo";

import { useAppState } from "~/hooks/useAppState";
import { Loading } from "./Loading";
import Button2 from "./Button2";
const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Wallet", href: "wallet", current: false },
  { name: "Deposit", href: "deposit", current: false },
  { name: "Withdraw", href: "withdraw", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar() {
  const session = useSession();
  const appState = useAppState();
  return (
    <Disclosure
      as="nav"
      className="  rounded-xl bg-gradient-to-b from-gray-900 to-blue-950"
    >
      {({ open }) => (
        <>
          <div className=" mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-blue-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="h-10 w-auto rounded-lg"
                    src="/assets/images/logo12.png"
                    alt={"Sol City"}
                    width={2000 * 4}
                    height={2000 * 4}
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-blue-900 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {session.status === "authenticated" && (
                <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <NavbarAdmin />
                  <div className="mr-3 hidden sm:ml-6 sm:block ">
                    <Button2 href="/wallet" className="h-7 items-center">
                      <SolanaPublicInfo
                        onlyString
                        own
                        publicKey={session.data.user.publicKey}
                        onGetBalance={(balance_lamports) => {
                          appState.set({ balance_lamports });
                        }}
                      />
                    </Button2>
                  </div>

                  <Avatar
                    image={session.data.user.image}
                    // image={null}
                    onClick={function (): void {
                      void signOut();
                    }}
                  />
                </div>
              )}
              {session.status === "unauthenticated" && (
                <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Button2
                    className="rounded-xl border border-white p-1 hover:bg-blue-900"
                    onClick={() => {
                      void signIn();
                    }}
                  >
                    Signin
                  </Button2>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-blue-900 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {session.status === "authenticated" && (
                <Button2 href="/wallet" className="mt-2 h-7 items-center">
                  <SolanaPublicInfo
                    onlyString
                    own
                    publicKey={session.data.user.publicKey}
                    onGetBalance={(balance_lamports) => {
                      appState.set({ balance_lamports });
                    }}
                  />
                </Button2>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
