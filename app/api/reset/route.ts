import { pusherServer } from "@/libs/pusher"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  try {
    await pusherServer.trigger("reset", "reset:form", null)
    console.log(8, 'await pusherServer.trigger("reset", "reset:form", null)')
    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.log(12, "RESET_FORM_ERROR - ", error)
    return NextResponse.json({ error: error })
  }
}
