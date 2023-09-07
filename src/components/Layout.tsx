import { useEffect, type ReactNode, useState } from "react";
import { Navbar } from "./Navbar";
import { useTheme } from "next-themes";
import { signIn, useSession } from "next-auth/react";
import Button from "./Button";
import { Section } from "./Section";
import { useRouter } from "next/router";

export function AdminCheck(props: { children: ReactNode }) {
  const session = useSession();

  if (session.status === "loading") {
    return <>LOADING...</>;
  }

  if (session.status === "authenticated" && session.data.user.is_admin) {
    return (
      <Section className="border border-purple-500 dark:border-purple-500">
        {props.children}
      </Section>
    );
  }

  return <>NOT AUTHORIZED</>;
}

export default function Layout(props: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const {
    // systemTheme, theme,
    setTheme,
  } = useTheme();
  // const currentTheme = theme === "system" ? systemTheme : theme;
  const session = useSession();

  if (typeof window !== "undefined") {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        const systemThemeUpdate = e.matches ? "dark" : "light";
        setTheme(systemThemeUpdate);
      });
  }

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  if (session.status === "loading") return <div>loading...</div>;

  // return props.children;

  // if (session.status === "unauthenticated")
  //   return (
  //     <div className="p-10">
  //       SolCity.tech
  //       <Button
  //         onClick={() => {
  //           signIn().catch(console.error);
  //         }}
  //       >
  //         Signin
  //       </Button>
  //     </div>
  //   );

  // if (session.status === "authenticated") {
  return (
    <div className="min-h-screen overflow-auto border-neutral-300 bg-gray-50 font-mono text-gray-900 dark:bg-neutral-950 dark:text-emerald-100/80">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 pt-5">
        <Navbar />
        {props.children}
      </div>
    </div>
  );
  // }

  // return <div>...</div>;
}
