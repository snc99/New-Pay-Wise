export async function fetchJsonSafe<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Ups! Data dari server tidak bisa diproses");
  }

  if (!res.ok) {
    const msg =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Terjadi kesalahan";

    throw new Error(msg);
  }

  return data as T;
}
