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

    <nav className="flex gap-4 rounded-xl bg-gradient-to-b from-gray-900 to-blue-950 p-2">
      <Image
        className="h-10 w-auto rounded-lg"
        src="/assets/images/solcitylogo.png"
        alt={"Sol City"}
        width={200}
        height={2000}
      />
      <div className="flex gap-5 pt-1">
        <Button2 href="/">Home</Button2>
        <Button2 href="/">Wallet</Button2>
      </div>

      <div className="flex-1" />

      {session.status === "authenticated" && (
        <>
          <div className="flex gap-3 pt-1">
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
          </div>
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
