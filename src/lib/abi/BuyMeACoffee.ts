export const buyMeACoffeeAbi = [
  {
    type: "event",
    name: "CoffeePurchased",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "message", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "function",
    stateMutability: "payable",
    name: "buyCoffee",
    inputs: [{ name: "message", type: "string" }],
    outputs: []
  },
  {
    type: "function",
    stateMutability: "view",
    name: "coffeeCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    stateMutability: "view",
    name: "getMessages",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "sender", type: "address" },
          { name: "message", type: "string" },
          { name: "timestamp", type: "uint256" }
        ]
      }
    ]
  }
] as const;

export type CoffeeMessage = {
  sender: `0x${string}`;
  message: string;
  timestamp: bigint;
};


