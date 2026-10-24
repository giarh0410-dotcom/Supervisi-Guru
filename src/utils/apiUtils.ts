export async function safeApiCall(url: string, options?: RequestInit) {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (err: any) {
    throw new Error(err.message || 'Gagal terhubung ke server.');
  }

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`Server error (${res.status}): ${text.slice(0, 120) || 'Respon server tidak valid.'}`);
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.error || json.message || `Gagal memproses permintaan (Status ${res.status}).`);
  }

  return json;
}
