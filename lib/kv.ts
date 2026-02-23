let kvPromise: Promise<Deno.Kv> | null = null;

export function getKv() {
  if (kvPromise === null) {
    kvPromise = Deno.openKv();
  }

  return kvPromise;
}
