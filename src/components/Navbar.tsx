import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "./Avatar";
import { NavbarAdmin } from "./NavbarAdmin";
import Button from "./Button";
import { SolanaPublicInfo } from "./SolanaPublicInfo";

import { useAppState } from "~/hooks/useAppState";
import { Loading } from "./Loading";
export function Navbar() {
  const session = useSession();
  const appState = useAppState();

  return (
    <nav className="flex gap-4">
      <Button href="/">SolCity</Button>
      <div className="flex-1" />

      {session.status === "authenticated" && (
        <>
          <NavbarAdmin />

          <Button href="/wallet" className="h-7 items-center">
            <SolanaPublicInfo
              onlyString
              own
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
            void signIn();
          }}
        >
          Signin
        </Button>
      )}

      {session.status === "loading" && <Loading />}
    </nav>
  );
}
