import { NextResponse } from "next/server";

export function errorResponse(
  error: unknown,
  fallbackMessage = "Terjadi kesalahan"
) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : fallbackMessage;

  console.error("[API_ERROR]", error);

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 500 }
  );
}
