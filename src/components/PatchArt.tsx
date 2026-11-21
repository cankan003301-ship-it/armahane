/**
 * Nakış arma görselini SVG olarak çizer (ürün fotoğrafı yokken ve özel tasarım önizlemesinde).
 * Saf fonksiyon: sunucuda ve tarayıcıda çalışır. Kullanıcı metni her zaman kaçışlanır.
 */
export type ArtShape = "yuvarlak" | "kalkan" | "dikdortgen" | "ozel";
export type ArtIcon =
  | "dag" | "ates" | "pusula" | "kanat" | "ay" | "simsek" | "lale" | "nazar" | "cay"
  | "yildiz" | "capa" | "dalga" | "fener" | "kalp" | "gunes" | "yok";

export type ArtSpec = {
  shape: ArtShape;
  bg: string;
  border: string;
  fg: string;
  accent?: string;
  icon: ArtIcon;
  text?: string;
  sub?: string;
  /** Özel tasarımda yüklenen logo (data: veya https URL). */
  imageUrl?: string;
};

export const ICON_LABELS: Record<ArtIcon, string> = {
  dag: "Dağ", ates: "Ateş", pusula: "Pusula", kanat: "Kanat", ay: "Ay", simsek: "Şimşek",
  lale: "Lale", nazar: "Nazar", cay: "Çay", yildiz: "Yıldız", capa: "Çapa", dalga: "Dalga",
  fener: "Fener", kalp: "Kalp", gunes: "Güneş", yok: "Simge yok",
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const color = (c: string | undefined, fallback: string) => (c && /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : fallback);

function star(cx: number, cy: number, points: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/** 100×100 kutuda simge. */
function icon(id: ArtIcon, fg: string, ac: string): string {
  switch (id) {
    case "dag":
      return `<circle cx="76" cy="24" r="9" fill="${ac}"/><polygon points="4,86 38,30 54,54 66,40 96,86" fill="${fg}"/><polygon points="38,30 47,45 41,42 35,48 30,43" fill="${ac}"/>`;
    case "ates":
      return `<path d="M50 6C62 28 80 40 74 64 70 82 58 88 50 88 38 88 26 82 26 64 26 48 38 42 40 28 46 38 48 44 52 46 56 34 54 20 50 6Z" fill="${ac}"/><path d="M50 44C56 56 64 62 60 74 58 82 54 84 50 84 44 84 40 80 40 72 40 64 46 60 50 44Z" fill="${fg}"/><rect x="18" y="86" width="64" height="7" rx="3" fill="${fg}" transform="rotate(-8 50 90)"/>`;
    case "pusula":
      return `<circle cx="50" cy="50" r="40" fill="none" stroke="${fg}" stroke-width="6"/><polygon points="50,14 59,50 41,50" fill="${ac}"/><polygon points="41,50 59,50 50,86" fill="${fg}"/>`;
    case "kanat": {
      const w = `M50 52C32 30 12 32 2 38 14 41 20 45 22 49 12 49 6 53 4 58 16 58 24 60 28 62 22 64 18 68 18 73 32 69 44 62 50 58Z`;
      return `<path d="${w}" fill="${fg}"/><path d="${w}" fill="${fg}" transform="translate(100 0) scale(-1 1)"/><circle cx="50" cy="54" r="10" fill="${ac}"/>`;
    }
    case "ay":
      return `<path d="M64 12A40 40 0 1 0 64 88 31 31 0 1 1 64 12Z" fill="${fg}"/><polygon points="${star(78, 36, 5, 9, 4)}" fill="${ac}"/>`;
    case "simsek":
      return `<polygon points="60,4 18,56 46,56 36,96 82,40 54,40" fill="${ac}" stroke="${fg}" stroke-width="3" stroke-linejoin="round"/>`;
    case "lale":
      return `<path d="M50 94V64" stroke="${ac}" stroke-width="5"/><path d="M50 86C40 74 30 72 22 74 30 80 40 86 50 90Z" fill="${ac}"/><path d="M50 18C40 28 28 26 26 44 26 60 38 68 50 68 62 68 74 60 74 44 72 26 60 28 50 18Z" fill="${fg}"/><path d="M50 28C43 38 43 56 50 66 57 56 57 38 50 28Z" fill="${ac}" opacity=".55"/>`;
    case "nazar":
      return `<circle cx="50" cy="50" r="44" fill="${ac}"/><circle cx="50" cy="50" r="32" fill="#ffffff"/><circle cx="50" cy="50" r="21" fill="#5fa8d3"/><circle cx="50" cy="50" r="10" fill="#111111"/>`;
    case "cay":
      return `<path d="M33 16H67C61 32 58 42 62 52 66 64 62 80 58 86H42C38 80 34 64 38 52 42 42 39 32 33 16Z" fill="#b5452e" stroke="${fg}" stroke-width="4" stroke-linejoin="round"/><ellipse cx="50" cy="91" rx="28" ry="5" fill="${ac}"/>`;
    case "yildiz":
      return `<polygon points="${star(50, 50, 8, 46, 24)}" fill="${fg}"/><circle cx="50" cy="50" r="11" fill="${ac}"/>`;
    case "capa":
      return `<g fill="none" stroke="${fg}" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="14" r="8"/><path d="M50 22V90M32 36H68M16 62Q22 92 50 90Q78 92 84 62"/></g><polygon points="10,66 22,56 24,70" fill="${ac}"/><polygon points="90,66 78,56 76,70" fill="${ac}"/>`;
    case "dalga":
      return `<circle cx="72" cy="28" r="14" fill="${ac}"/><path d="M4 62C18 40 34 40 44 54 52 66 66 64 70 52 60 56 54 48 58 40 66 26 86 26 96 42V92H4Z" fill="${fg}"/>`;
    case "fener":
      return `<polygon points="22,30 4,18 4,42" fill="${ac}" opacity=".45"/><polygon points="78,30 96,18 96,42" fill="${ac}" opacity=".45"/><polygon points="36,22 50,8 64,22" fill="${ac}"/><rect x="40" y="22" width="20" height="14" fill="${ac}"/><polygon points="40,94 44,36 56,36 60,94" fill="${fg}"/><polygon points="42.6,56 57.4,56 58,66 42,66" fill="${ac}"/><polygon points="41.4,76 58.6,76 59.2,86 40.8,86" fill="${ac}"/>`;
    case "kalp":
      return `<path d="M50 88C20 66 8 50 8 33 8 19 20 11 32 11 40 11 46 15 50 21 54 15 60 11 68 11 80 11 92 19 92 33 92 50 80 66 50 88Z" fill="${fg}"/>`;
    case "gunes": {
      let rays = "";
      for (let i = 0; i < 12; i++) rays += `<rect x="47" y="4" width="6" height="18" rx="3" fill="${ac}" transform="rotate(${i * 30} 50 50)"/>`;
      return `${rays}<circle cx="50" cy="50" r="22" fill="${fg}"/>`;
    }
    default:
      return "";
  }
}

function fitSize(text: string, max: number, width: number) {
  return Math.max(9, Math.min(max, Math.floor((width / Math.max(text.length, 1)) * 1.7)));
}

export function patchSvg(spec: ArtSpec, opts: { title?: string } = {}): string {
  const bg = color(spec.bg, "#1f3b4d");
  const border = color(spec.border, "#e9c46a");
  const fg = color(spec.fg, "#f4efe6");
  const ac = color(spec.accent, border);
  const text = (spec.text ?? "").slice(0, 22).toLocaleUpperCase("tr-TR");
  const sub = (spec.sub ?? "").slice(0, 22).toLocaleUpperCase("tr-TR");
  const font = `font-family="'Oswald','Arial Narrow',Arial,sans-serif" font-weight="700"`;
  const stitch = `fill="none" stroke="${fg}" stroke-opacity=".35" stroke-width="1.6" stroke-dasharray="4 3"`;
  const hasText = Boolean(text || sub);
  let body = "";
  let iconBox = { x: 55, y: 50, s: 90 };

  if (spec.shape === "yuvarlak" || spec.shape === "ozel") {
    const outline =
      spec.shape === "yuvarlak"
        ? `<circle cx="100" cy="100" r="96" fill="${border}"/><circle cx="100" cy="100" r="84" fill="${bg}"/><circle cx="100" cy="100" r="78" ${stitch}/>`
        : `<polygon points="${star(100, 100, 14, 97, 84)}" fill="${border}" stroke-linejoin="round"/><circle cx="100" cy="100" r="78" fill="${bg}"/><circle cx="100" cy="100" r="72" ${stitch}/>`;
    body += outline;
    if (hasText) {
      iconBox = { x: 66, y: 66, s: 68 };
      body += `<defs><path id="t" d="M38 100A62 62 0 0 1 162 100"/><path id="b" d="M30 100A70 70 0 0 0 170 100"/></defs>`;
      if (text) body += `<text ${font} font-size="${fitSize(text, 20, 150)}" letter-spacing="1.5" fill="${fg}" text-anchor="middle"><textPath href="#t" startOffset="50%">${esc(text)}</textPath></text>`;
      if (sub) body += `<text ${font} font-size="${fitSize(sub, 16, 140)}" letter-spacing="2" fill="${fg}" text-anchor="middle"><textPath href="#b" startOffset="50%">${esc(sub)}</textPath></text>`;
    } else iconBox = { x: 52, y: 52, s: 96 };
  } else if (spec.shape === "kalkan") {
    const d = "M100 4L188 30V92C188 140 150 178 100 196 50 178 12 140 12 92V30Z";
    const inner = "M100 18L176 40V92C176 132 144 164 100 180 56 164 24 132 24 92V40Z";
    body += `<path d="${d}" fill="${border}"/><path d="${inner}" fill="${bg}"/><path d="M100 26L168 46V92C168 128 140 156 100 172 60 156 32 128 32 92V46Z" ${stitch}/>`;
    iconBox = hasText ? { x: 62, y: 38, s: 76 } : { x: 52, y: 48, s: 96 };
    if (text) body += `<text x="100" y="${sub ? 136 : 146}" ${font} font-size="${fitSize(text, 24, 120)}" letter-spacing="1.5" fill="${fg}" text-anchor="middle">${esc(text)}</text>`;
    if (sub) body += `<text x="100" y="158" ${font} font-size="${fitSize(sub, 15, 90)}" letter-spacing="2" fill="${ac}" text-anchor="middle">${esc(sub)}</text>`;
  } else {
    body += `<rect x="4" y="38" width="192" height="124" rx="16" fill="${border}"/><rect x="14" y="48" width="172" height="104" rx="10" fill="${bg}"/><rect x="20" y="54" width="160" height="92" rx="7" ${stitch}/>`;
    const noIcon = spec.icon === "yok" && !spec.imageUrl;
    if (noIcon) {
      if (text) body += `<text x="100" y="${sub ? 98 : 112}" ${font} font-size="${fitSize(text, 36, 150)}" letter-spacing="1" fill="${fg}" text-anchor="middle">${esc(text)}</text>`;
      if (sub) body += `<text x="100" y="${text ? 132 : 112}" ${font} font-size="${fitSize(sub, 30, 150)}" letter-spacing="1" fill="${ac}" text-anchor="middle">${esc(sub)}</text>`;
    } else if (hasText) {
      iconBox = { x: 24, y: 62, s: 76 };
      const line = [text, sub].filter(Boolean);
      line.forEach((t, i) =>
        (body += `<text x="140" y="${line.length > 1 ? 96 + i * 26 : 110}" ${font} font-size="${fitSize(t, 24, 82)}" fill="${i ? ac : fg}" text-anchor="middle">${esc(t)}</text>`),
      );
    } else iconBox = { x: 62, y: 62, s: 76 };
  }

  const scale = iconBox.s / 100;
  if (spec.imageUrl && /^(data:image\/(png|jpeg|webp|svg\+xml);base64,|https:\/\/)/.test(spec.imageUrl)) {
    body += `<image href="${esc(spec.imageUrl)}" x="${iconBox.x}" y="${iconBox.y}" width="${iconBox.s}" height="${iconBox.s}" preserveAspectRatio="xMidYMid meet"/>`;
  } else {
    body += `<g transform="translate(${iconBox.x} ${iconBox.y}) scale(${scale})">${icon(spec.icon, fg, ac)}</g>`;
  }
  const title = opts.title ? `<title>${esc(opts.title)}</title>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img">${title}${body}</svg>`;
}

export default function PatchArt({ spec, title, className }: { spec: ArtSpec; title?: string; className?: string }) {
  return <div className={className ?? "patch-art"} aria-label={title} dangerouslySetInnerHTML={{ __html: patchSvg(spec, { title }) }} />;
}
