import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "./Avatar";
import { NavbarAdmin } from "./NavbarAdmin";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "./Button";
import { SolanaPublicInfo } from "./SolanaPublicInfo";

import { useAppState } from "~/hooks/useAppState";
export function Navbar() {
  const session = useSession();
  const appState = useAppState();

  return (
    <nav className="flex gap-2 p-2">
      <Button
        className="items-center gap-0 border-none text-gray-900 dark:bg-transparent dark:text-white dark:hover:bg-transparent hover:dark:text-white"
        href="/"
      >
        SolCity
      </Button>
      <div className="flex-1" />

      {session.status === "authenticated" && (
        <>
          <NavbarAdmin />

          <Button href="/wallet" className="h-7 items-center">
            <SolanaPublicInfo
              onlyString
              publicKey={session.data.user.publicKey}
              onGetBalance={(balance_lamports) => {
                appState.set({ balance_lamports });
              }}
            />
          </Button>

          <Avatar
            image={session.data.user.image}
            // image={null}
            onClick={function (): void {
              void signOut();
            }}
          />
        </>
      )}
      {session.status === "unauthenticated" && (
        <Button
          onClick={() => {
            void signIn("discord");
          }}
        >
          Sign in with Discord
        </Button>
      )}

      {session.status === "loading" && (
        <AiOutlineLoading3Quarters className="animate-spin self-center text-emerald-400" />
      )}
    </nav>
  );
}
