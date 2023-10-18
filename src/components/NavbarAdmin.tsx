import { useSession } from "next-auth/react";
import Button from "./Button";
import Button2 from "./Button2";

export function NavbarAdmin() {
  //////////////////
  const session = useSession();
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated") return null;
  if (!session.data) return null;

  if (session.data.user.is_admin)
    return (
      <div>
        <Button2 href="/admin">Admin</Button2>
      </div>
    );

  return null;
}
