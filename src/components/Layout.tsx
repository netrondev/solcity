import { useEffect, type ReactNode, useState } from "react";

import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

import { Section } from "./Section";
import { useRouter } from "next/router";

import { Loading } from "./Loading";
import { Starsbg } from "./StarsBG";

import NavBar from "./nav";
import Footer from "./Footer1";

export function AdminCheck(props: { children: ReactNode }) {
  const session = useSession();

  if (session.status === "loading") {
    return <>LOADING...</>;
  }

  if (session.status === "authenticated" && session.data.user.is_admin) {
    return <Section className="">{props.children}</Section>;
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

  if (session.status === "loading")
    return (
      <div className="animate-pulse">
        <Loading className="mx-auto mt-20 h-20 w-20 animate-spin" />
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-black to-blue-950">
      <Starsbg />
      <div className="relative min-h-screen overflow-auto   bg-transparent font-mono text-gray-900 dark:text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 pt-5 ">
          {/* <Navbar /> */}
          <NavBar />
          {props.children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
