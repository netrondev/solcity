import { AdminDraws } from "~/screens/admin/AdminDraws";
import { AdminUsers } from "~/screens/admin/AdminUsers";

export default function AdminHome() {
  return (
    <section>
      <AdminDraws />
      <AdminUsers />
    </section>
  );
}
