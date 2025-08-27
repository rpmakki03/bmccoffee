import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type CoffeePayload = { sender: string; message: string; amount: string };

export async function POST(request: Request) {
  try {
    const { sender, message, amount } = (await request.json()) as CoffeePayload;

    if (!sender || typeof message !== "string" || !amount) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "rpmakki03@gmail.com",
      subject: "New Coffee Purchase",
      text: `Sender: ${sender}\nAmount: ${amount}\nMessage: ${message}`
    });

    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



