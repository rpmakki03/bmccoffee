"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { mainnet, sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "BuyMeACoffee",
  projectId: "demo", // Replace with WalletConnect projectId in production
  chains: [sepolia, mainnet],
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http()
  }
});

export const DEFAULT_CHAIN_ID = sepolia.id;


