import { Router } from "express";

const router = Router();

const SPANISH_COUNTRIES = new Set([
  "ES", "MX", "CO", "AR", "CL", "PE", "EC", "VE", "GT", "CU",
  "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "PR", "UY", "GQ"
]);

const PORTUGUESE_COUNTRIES = new Set([
  "BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL"
]);

export function detectLanguageFromRequest(request) {
  // 1. Check explicit parameter or header
  const explicit = (
    request.query.lang ||
    request.headers["x-user-lang"] ||
    ""
  ).toString().toLowerCase().trim();

  if (["pt", "es", "en"].includes(explicit)) {
    return explicit;
  }

  // 2. Check Geo headers (Vercel, Cloudflare, AWS CloudFront)
  const country = (
    request.headers["x-vercel-ip-country"] ||
    request.headers["cf-ipcountry"] ||
    request.headers["cloudfront-viewer-country"] ||
    request.headers["x-country-code"] ||
    ""
  ).toString().toUpperCase().trim();

  if (country) {
    if (PORTUGUESE_COUNTRIES.has(country)) return "pt";
    if (SPANISH_COUNTRIES.has(country)) return "es";
    return "en";
  }

  // 3. Check Accept-Language header
  const accept = (request.headers["accept-language"] || "").toLowerCase();
  if (accept.includes("es")) return "es";
  if (accept.includes("pt")) return "pt";
  if (accept.includes("en")) return "en";

  return "pt";
}

router.get("/detect", (request, response) => {
  const country = (
    request.headers["x-vercel-ip-country"] ||
    request.headers["cf-ipcountry"] ||
    request.headers["cloudfront-viewer-country"] ||
    request.headers["x-country-code"] ||
    null
  );

  const language = detectLanguageFromRequest(request);

  return response.json({
    country: country ? country.toString().toUpperCase().trim() : null,
    language,
  });
});

export default router;
