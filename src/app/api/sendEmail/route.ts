import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sender, message, amount } = await request.json();

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
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}


