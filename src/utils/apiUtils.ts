import {
  generateClientFallbackObservasi,
  generateClientFallbackRtl,
  generateClientFallbackRecap,
  generateClientFallbackUrl,
  generateClientFallbackRpp,
} from './clientFallbackGenerators';

export async function safeApiCall(url: string, options?: RequestInit) {
  let res: Response;
  let bodyParsed: any = {};
  try {
    if (options?.body && typeof options.body === 'string') {
      try {
        bodyParsed = JSON.parse(options.body);
      } catch (e) {}
    }
    res = await fetch(url, options);
  } catch (err: any) {
    return getFallbackResponse(url, bodyParsed);
  }

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (e) {
    return getFallbackResponse(url, bodyParsed);
  }

  if (!res.ok || json.success === false) {
    return getFallbackResponse(url, bodyParsed);
  }

  return json;
}

function getFallbackResponse(url: string, body: any) {
  if (url.includes('analyze-observasi-ai')) {
    return { success: true, data: generateClientFallbackObservasi(body), isClientFallback: true };
  }
  if (url.includes('generate-rtl-ai')) {
    return { success: true, data: generateClientFallbackRtl(body), isClientFallback: true };
  }
  if (url.includes('analyze-recap-recommendations')) {
    return { success: true, data: generateClientFallbackRecap(body?.evaluations || []), isClientFallback: true };
  }
  if (url.includes('fetch-url-content')) {
    return generateClientFallbackUrl(body?.url || '');
  }
  if (url.includes('analyze-rpp')) {
    return generateClientFallbackRpp(body);
  }
  return { success: true, data: {}, isClientFallback: true };
}
