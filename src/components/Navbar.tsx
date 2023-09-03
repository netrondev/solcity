import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar } from "./Avatar";
import { NavbarAdmin } from "./NavbarAdmin";
import { AiOutlineHome } from "react-icons/ai";
import Button from "./Button";
export function Navbar() {
  const session = useSession();
  return (
    <nav className="flex gap-2 p-2">
      <Button
        className="aspect-square items-center dark:bg-transparent dark:text-neutral-500 dark:hover:bg-transparent hover:dark:text-white"
        href="/"
      >
        <AiOutlineHome size={20} />
      </Button>

      {session.status === "authenticated" && (
        <>
          <div className="flex-1" />
          <NavbarAdmin />

          <Button>0.0 SOL</Button>
          <Button>Deposit</Button>

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
        <>
          <button
            onClick={() => {
              void signIn();
            }}
          >
            SIGNIN
          </button>
        </>
      )}
    </nav>
  );
}
