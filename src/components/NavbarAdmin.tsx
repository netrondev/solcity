import { useSession } from "next-auth/react";
import Button from "./Button";

export function NavbarAdmin() {
  //////////////////
  const session = useSession();
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated") return null;
  if (!session.data) return null;

  if (session.data.user.is_admin)
    return (
      <div>
        <Button href="/admin">Admin</Button>
      </div>
    );

  return null;
}
