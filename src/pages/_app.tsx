import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "~/components/Layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return ( 
    <ThemeProvider enableSystem={true} attribute="class">
      <SessionProvider session={session}>
         <Layout> 
          <Component {...pageProps} />
        </Layout> 
      </SessionProvider>
    </ThemeProvider>
    
  );
};

export default api.withTRPC(MyApp);
