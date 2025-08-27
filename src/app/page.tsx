"use client";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useWriteContract, useReadContract } from "wagmi";
import { buyMeACoffeeAbi, type CoffeeMessage } from "@/lib/abi/BuyMeACoffee";
import { Card, Input, Button } from "@/components/ui";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther, parseEther } from "viem";
import { DEFAULT_CHAIN_ID } from "@/lib/ethConfig";
import { buildSolTransferTx } from "@/lib/solana";
import { PublicKey } from "@solana/web3.js";

export default function Home() {
  const contractAddress = useMemo(() => process.env.NEXT_PUBLIC_COFFEE_CONTRACT as `0x${string}` | undefined, []);
  const { address, chainId, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, chainId });
  const { writeContractAsync, isPending } = useWriteContract();
  const { data: count } = useReadContract({
    abi: buyMeACoffeeAbi,
    address: contractAddress,
    functionName: "coffeeCount",
    chainId: chainId ?? DEFAULT_CHAIN_ID,
    query: { enabled: !!contractAddress }
  });
  const { data: messages } = useReadContract({
    abi: buyMeACoffeeAbi,
    address: contractAddress,
    functionName: "getMessages",
    chainId: chainId ?? DEFAULT_CHAIN_ID,
    query: { enabled: !!contractAddress }
  }) as { data: CoffeeMessage[] } as any;

  const [tip, setTip] = useState("0.01");
  const [msg, setMsg] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  async function sendEmail(payload: { sender: string; message: string; amount: string }) {
    try {
      await fetch("/api/sendEmail", { method: "POST", body: JSON.stringify(payload) });
    } catch {}
  }

  async function onSendEth() {
    if (!contractAddress) return setNotice("Contract not set");
    if (!isConnected || !address) return setNotice("Connect wallet");
    try {
      await writeContractAsync({
        abi: buyMeACoffeeAbi,
        address: contractAddress,
        functionName: "buyCoffee",
        chainId: chainId ?? DEFAULT_CHAIN_ID,
        args: [msg],
        value: parseEther(tip)
      });
      setNotice("ETH tip sent!");
      sendEmail({ sender: address, message: msg, amount: `${tip} ETH` });
      setMsg("");
    } catch (e: any) {
      setNotice(e?.shortMessage || e?.message || "Failed");
    }
  }

  async function onSendSol() {
    try {
      const anyWindow = window as any;
      if (!anyWindow?.solana?.isPhantom) return setNotice("Phantom wallet not found");
      await anyWindow.solana.connect();
      const sender = new PublicKey(anyWindow.solana.publicKey.toString());
      const tx = await buildSolTransferTx(sender, parseFloat(tip || "0"));
      const signed = await anyWindow.solana.signAndSendTransaction(tx);
      setNotice("SOL tip sent!");
      sendEmail({ sender: sender.toBase58(), message: msg, amount: `${tip} SOL` });
      setMsg("");
    } catch (e: any) {
      setNotice(e?.message || "Failed");
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto max-w-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Buy Me A Coffee</h1>
          <ConnectButton />
        </div>
        <Card>
          <div className="space-y-4">
            <div className="text-sm text-neutral-300">
              {isConnected && balance ? `Balance: ${formatEther(balance.value)} ${balance.symbol}` : "Connect wallet to see balance"}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Input value={tip} onChange={(e) => setTip(e.target.value)} placeholder="Tip Amount" />
              <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message" />
            </div>
            <div className="flex gap-2">
              <Button onClick={onSendEth} disabled={isPending}>Send ETH</Button>
              <Button onClick={onSendSol}>Send SOL</Button>
            </div>
            {notice && <div className="text-sm text-neutral-400">{notice}</div>}
          </div>
        </Card>

        <div className="mt-8 space-y-3">
          <div className="text-neutral-300">Total Coffees: {count ? Number(count).toString() : "-"}</div>
          <Card className="space-y-2">
            <div className="font-medium">Messages</div>
            <div className="space-y-2">
              {messages?.length ? (
                messages
                  .slice()
                  .reverse()
                  .map((m: any, i: number) => (
                    <div key={i} className="rounded-md bg-neutral-800 p-3 text-sm">
                      <div className="text-neutral-400">{m.sender}</div>
                      <div className="text-white">{m.message}</div>
                      <div className="text-neutral-500 text-xs">{new Date(Number(m.timestamp) * 1000).toLocaleString()}</div>
                    </div>
                  ))
              ) : (
                <div className="text-neutral-500 text-sm">No messages yet</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
