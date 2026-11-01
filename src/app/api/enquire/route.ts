import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

const MAX = { name: 120, email: 200, company: 160, discipline: 40, budget: 40, message: 5000 };

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const enquiry = Object.fromEntries(Object.entries(MAX).map(([key, max]) => [key, clean(body[key], max)]));
  if (!enquiry.name || !/^\S+@\S+\.\S+$/.test(enquiry.email) || !enquiry.message) {
    return NextResponse.json({ error: "Please add your name, a valid email and a few words about the project." }, { status: 400 });
  }

  const client = writeClient();
  if (!client) {
    return NextResponse.json({ error: "The form isn't connected yet." }, { status: 503 });
  }

  try {
    await client.create({ _type: "enquiry", ...enquiry, receivedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[enquire] could not save enquiry", error);
    return NextResponse.json({ error: "Couldn't send right now." }, { status: 500 });
  }
}
