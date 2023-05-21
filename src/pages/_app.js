import Header from "@/common/header";
import "@/styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Check the current page path
  console.log(router.pathname);
  return (
    <>
      {router && router.pathname !== '/' && <Header />}
      <Component {...pageProps} />
    </>
  );
}
