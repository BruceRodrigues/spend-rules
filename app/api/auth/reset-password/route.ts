import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { token, password } = body as { token: string; password: string };

  if (!token) {
    return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || !verificationToken.identifier.startsWith("password-reset:")) {
    return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ error: "Link expired. Request a new one." }, { status: 400 });
  }

  const email = verificationToken.identifier.replace("password-reset:", "");
  const hashedPassword = await hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ message: "Password updated." });
}
