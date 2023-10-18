import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "./Avatar";
import { NavbarAdmin } from "./NavbarAdmin";
import Button from "./Button";
import { SolanaPublicInfo } from "./SolanaPublicInfo";
import Image from "next/image";
import { useAppState } from "~/hooks/useAppState";
import { Loading } from "./Loading";
import Button2 from "./Button2";
export function Navbar() {
  const session = useSession();
  const appState = useAppState();

  return (
    <nav className="flex gap-4">
      <Image
        className="h-10 w-auto"
        src="/assets/images/logowhite.png"
        alt={"Sol City"}
        width={200}
        height={2000}
      />
      <Button2 href="/">Home</Button2>
      <Button2 href="/">Wallet</Button2>
      <div className="flex-1" />

      {session.status === "authenticated" && (
        <>
          <NavbarAdmin />

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
