import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/colors.css";
import "@next/font/google";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "bootstrap/dist/css/bootstrap.css";
// import "@cryptogate/react-ui/dist/esm/index.css";
import { MultiChainProvider } from "@cryptogate/react-providers";
import config from "../config";
import React, { useEffect } from "react";
import Footer from "../components/Footer";
import { Inter } from "@next/font/google";
import { AuthModalProvider } from "../context/AuthModalProvider";
import { ProSidebarProvider } from "react-pro-sidebar";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../auth/useAuth";
import { CartProvider } from "../cart/cart-provider";
import TickitNavBar from "../components/TickitNavBar";

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
  return (
    <div className={inter.className}>
      <MultiChainProvider config={config}>
        <AuthProvider>
          <AuthModalProvider>
            <CartProvider>
              <ProSidebarProvider>
                <TickitNavBar />
                <Component {...pageProps} />
                <Footer />
              </ProSidebarProvider>
            </CartProvider>
          </AuthModalProvider>
        </AuthProvider>
      </MultiChainProvider>
    </div>
  );
}

export default MyApp;
