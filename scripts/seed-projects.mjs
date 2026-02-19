/**
 * Seed 30 fake projects into Sanity CMS for development.
 * Usage: node scripts/seed-projects.mjs
 *
 * Requires SANITY_WRITE_TOKEN in .env.local
 * Get one: https://www.sanity.io/manage → your project → API → Tokens → Add API token (Editor)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
    return Object.fromEntries(
      raw
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && l.includes("="))
        .map((l) => {
          const idx = l.indexOf("=");
          return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
        })
    );
  } catch {
    return {};
  }
}

const env = loadEnv();
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN in .env.local");
  console.error("Get one at: https://www.sanity.io/manage → API → Tokens → Add API token (Editor)");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

// ── Image upload helper ──────────────────────────────────────────────────────
async function uploadImage(seed, width, height, label) {
  const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: `${label}-${seed}.jpg`,
    contentType: "image/jpeg",
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// ── Project data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  // STANDUP (10)
  { seed: "sw01", artist: "Marcus Webb", title: "Out of Order", slug: "out-of-order", date: "2024-03-15", category: "standup", starring: ["Marcus Webb"], directedBy: "James Holloway", description: "An hour of razor-sharp observations on modern chaos, family dysfunction, and the absurdity of trying to be an adult. Webb's most focused and personal set to date." },
  { seed: "sw02", artist: "Priya Nair", title: "No Filter", slug: "no-filter", date: "2024-01-20", category: "standup", starring: ["Priya Nair"], directedBy: "Leo Fontaine", description: "Priya tears apart social media culture, influencer logic, and the tyranny of the personal brand — with the precision of someone who genuinely logs off." },
  { seed: "sw03", artist: "Derrick Okafor", title: "Second Language", slug: "second-language", date: "2023-11-08", category: "standup", starring: ["Derrick Okafor"], directedBy: null, description: "A deeply funny and unexpectedly moving hour about identity, belonging, and the daily performance of knowing how to code-switch in every room you walk into." },
  { seed: "sw04", artist: "Caitlin Voss", title: "Extremely Normal", slug: "extremely-normal", date: "2023-08-22", category: "standup", starring: ["Caitlin Voss"], directedBy: "Sara Chen", description: "Caitlin catalogues the quiet catastrophes of a completely average life — the mortgage anxiety, the group chats, the minor victories no one claps for — with devastating comic precision." },
  { seed: "sw05", artist: "TJ Malone", title: "Blue-Collar Metaphysics", slug: "blue-collar-metaphysics", date: "2023-05-10", category: "standup", starring: ["TJ Malone"], directedBy: "Marcus Reid", description: "Part philosophical inquiry, part blue-collar roast — TJ bridges the gap between Nietzsche and a 6am shift at a distribution warehouse in ways that shouldn't work but absolutely do." },
  { seed: "sw06", artist: "Amara Diallo", title: "First World Problems", slug: "first-world-problems", date: "2022-12-01", category: "standup", starring: ["Amara Diallo"], directedBy: null, description: "Amara skewers privilege, performative gratitude, and the ongoing drama of having too many streaming services and nothing to watch on any of them." },
  { seed: "sw07", artist: "Nick Barretta", title: "Overcorrected", slug: "overcorrected", date: "2022-09-14", category: "standup", starring: ["Nick Barretta"], directedBy: "Leo Fontaine", description: "A relentless hour on political anxiety, wellness culture, and the exhausting project of trying to be a morally consistent person in 2022. Recorded live at The Paramount." },
  { seed: "sw08", artist: "Yuki Tanaka", title: "Soft Launch", slug: "soft-launch", date: "2022-06-03", category: "standup", starring: ["Yuki Tanaka"], directedBy: "Sara Chen", description: "Yuki's debut special: a warmly chaotic meditation on perfectionism, the myth of being ready, and what happens when you launch yourself before you think you're done." },
  { seed: "sw09", artist: "Devon Cross", title: "The Hard Sell", slug: "the-hard-sell", date: "2021-10-30", category: "standup", starring: ["Devon Cross"], directedBy: null, description: "Devon dissects consumerism, therapy-speak, and his brief and catastrophic stint as a certified life coach. A testament to the comedy of failed self-improvement." },
  { seed: "sw10", artist: "Lena Sokolova", title: "Working Title", slug: "working-title", date: "2021-04-17", category: "standup", starring: ["Lena Sokolova"], directedBy: "James Holloway", description: "Lena explores immigrant hustle, artistic identity, and whether 'finding yourself' is a luxury rebranded as a spiritual obligation. Filmed over two nights in Chicago." },

  // FILM (7)
  { seed: "fl01", artist: "Various Artists", title: "After the Show", slug: "after-the-show", date: "2024-02-14", category: "film", starring: ["Marcus Webb", "Caitlin Voss", "TJ Malone"], directedBy: "Sara Chen", description: "Three standups. One city. No plan. A candid portrait of the hours nobody films — the drives back, the diner booths, the conversations that only happen after midnight." },
  { seed: "fl02", artist: "Priya Nair", title: "Offline", slug: "offline", date: "2023-07-07", category: "film", starring: ["Priya Nair", "Derrick Okafor"], directedBy: "Leo Fontaine", description: "A lo-fi road movie shot in 12 days — two comedians driving cross-country with no bit to sell, nowhere to be, and a passenger-seat camera running the whole time." },
  { seed: "fl03", artist: "Various Artists", title: "Green Room", slug: "green-room", date: "2023-02-28", category: "film", starring: ["Nick Barretta", "Amara Diallo", "Devon Cross", "Yuki Tanaka"], directedBy: "Marcus Reid", description: "Four comedians. One dressing room. Every bit of superstition, self-doubt, and gallows humour that lives in the forty minutes before the lights go down." },
  { seed: "fl04", artist: "TJ Malone", title: "Last Set", slug: "last-set", date: "2022-04-22", category: "film", starring: ["TJ Malone"], directedBy: "James Holloway", description: "A short film about a comedian who decides every night is going to be his last gig — and keeps not following through on it. Shot in black and white over three weekends." },
  { seed: "fl05", artist: "Lena Sokolova", title: "The Bit", slug: "the-bit", date: "2021-09-09", category: "film", starring: ["Lena Sokolova", "Devon Cross"], directedBy: "Sara Chen", description: "When a five-minute bit goes viral for entirely the wrong reasons, two comedians have 48 hours to get ahead of the story. A thriller that's also somehow very funny." },
  { seed: "fl06", artist: "Amara Diallo", title: "Set List", slug: "set-list", date: "2021-01-15", category: "film", starring: ["Amara Diallo"], directedBy: "Leo Fontaine", description: "A debut narrative short: a comic navigates the petty politics and unexpected grace of a prestigious festival competition she was never supposed to be in." },
  { seed: "fl07", artist: "Various Artists", title: "Punchlines", slug: "punchlines", date: "2020-08-01", category: "film", starring: ["Caitlin Voss", "Nick Barretta", "Yuki Tanaka"], directedBy: "Marcus Reid", description: "An anthology of seven micro-films, each built around a single joke and the entire life hiding inside it. Seven directors. Seven cities. One runtime." },

  // DOCUMENTARY (7)
  { seed: "do01", artist: "Various Artists", title: "On the Road: Year One", slug: "on-the-road-year-one", date: "2024-06-30", category: "documentary", starring: ["Marcus Webb", "Priya Nair", "TJ Malone", "Derrick Okafor"], directedBy: "Sara Chen", description: "Twelve months of touring distilled into 90 minutes — the van breakdowns, the sold-out nights, the towns that shouldn't work but do. Ambition and grind and unexpected grace." },
  { seed: "do02", artist: "Derrick Okafor", title: "Becoming Derrick", slug: "becoming-derrick", date: "2023-10-10", category: "documentary", starring: ["Derrick Okafor"], directedBy: "James Holloway", description: "An intimate four-year portrait of a comedian constructing a one-hour special — and slowly reckoning with who he's become in the process. Raw access, nothing staged." },
  { seed: "do03", artist: "Various Artists", title: "The Room Works", slug: "the-room-works", date: "2023-03-21", category: "documentary", starring: ["Caitlin Voss", "Devon Cross", "Lena Sokolova"], directedBy: "Leo Fontaine", description: "A full year inside a small weekly showcase that launched three careers, ended two relationships, and somehow kept the lights on every single Wednesday." },
  { seed: "do04", artist: "Various Artists", title: "Late Night, Early Days", slug: "late-night-early-days", date: "2022-11-11", category: "documentary", starring: ["Nick Barretta", "Amara Diallo", "Yuki Tanaka"], directedBy: "Marcus Reid", description: "Three first-generation standups navigate the gap between where they're from and what the industry expects them to be. Honest, uncomfortable, and completely essential." },
  { seed: "do05", artist: "Marcus Webb", title: "Writing the Hour", slug: "writing-the-hour", date: "2022-03-07", category: "documentary", starring: ["Marcus Webb"], directedBy: "Sara Chen", description: "Exclusive access to 18 months of building a one-hour special from scratch — every abandoned premise, every rewrite, every night something finally clicked in a half-empty room." },
  { seed: "do06", artist: "Various Artists", title: "The Business of Funny", slug: "the-business-of-funny", date: "2021-07-04", category: "documentary", starring: ["Priya Nair", "TJ Malone", "Derrick Okafor", "Caitlin Voss"], directedBy: "James Holloway", description: "An unvarnished look at the deals, touring economics, and compounding costs of making comedy a full-time career. No mythology — just the spreadsheet." },
  { seed: "do07", artist: "Lena Sokolova", title: "Language Barrier", slug: "language-barrier", date: "2020-12-12", category: "documentary", starring: ["Lena Sokolova"], directedBy: "Leo Fontaine", description: "Lena performs standup in three countries where English isn't the first language and discovers what actually survives translation — and what absolutely does not." },

  // MISC (6)
  { seed: "mi01", artist: "Various Artists", title: "New Year's Eve Live", slug: "new-years-eve-live", date: "2023-12-31", category: "misc", starring: ["Marcus Webb", "Amara Diallo", "Nick Barretta", "Yuki Tanaka", "Devon Cross"], directedBy: "Marcus Reid", description: "Five hours of live comedy broadcast from five cities to ring in the new year. Chaotic, overlong, and completely unmissable." },
  { seed: "mi02", artist: "Various Artists", title: "Charity Gala 2023", slug: "charity-gala-2023", date: "2023-05-27", category: "misc", starring: ["Priya Nair", "TJ Malone", "Lena Sokolova"], directedBy: null, description: "A benefit night for arts education — three headliners, one cause, two encores, and a crowd that didn't want to go home." },
  { seed: "mi03", artist: "Various Artists", title: "Best Of: Vol. 1", slug: "best-of-vol-1", date: "2022-08-19", category: "misc", starring: ["Derrick Okafor", "Caitlin Voss", "Devon Cross", "Amara Diallo"], directedBy: "Sara Chen", description: "Curated highlights from four years of specials, road footage, and bits that almost didn't make the cut. A document of what this run actually looked like." },
  { seed: "mi04", artist: "Various Artists", title: "Writers Room: Live", slug: "writers-room-live", date: "2022-01-28", category: "misc", starring: ["Marcus Webb", "Yuki Tanaka", "Nick Barretta"], directedBy: "James Holloway", description: "A live experiment: three comedians workshop unfinished material in real time in front of a paying audience. Messy, honest, and oddly moving." },
  { seed: "mi05", artist: "Various Artists", title: "Industry Night", slug: "industry-night", date: "2021-03-03", category: "misc", starring: ["Priya Nair", "Derrick Okafor", "Lena Sokolova", "TJ Malone"], directedBy: null, description: "An invite-only showcase captured on film. The night every booker, manager, and fan wishes they'd been in the room for. Now they can be." },
  { seed: "mi06", artist: "Various Artists", title: "Festival Closing Set", slug: "festival-closing-set", date: "2020-07-11", category: "misc", starring: ["Marcus Webb", "Amara Diallo", "Caitlin Voss", "Devon Cross", "Nick Barretta", "Yuki Tanaka"], directedBy: "Marcus Reid", description: "The legendary closing night of the inaugural festival — six performers, two hours, and a crowd that refused to leave when the house lights came on." },
];

// ── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`Connecting to Sanity project "${projectId}" (${dataset})...`);

  // Check for existing slugs so re-runs don't duplicate
  const existing = await client.fetch(`*[_type == "project"]{ "slug": slug.current }`);
  const existingSlugs = new Set(existing.map((p) => p.slug));

  const toCreate = PROJECTS.filter((p) => !existingSlugs.has(p.slug));
  if (toCreate.length === 0) {
    console.log("All projects already exist — nothing to seed.");
    return;
  }

  console.log(`Seeding ${toCreate.length} projects (${PROJECTS.length - toCreate.length} already exist)...\n`);

  for (const p of toCreate) {
    process.stdout.write(`  [${p.category.padEnd(11)}] ${p.artist} — "${p.title}" ... `);

    const [titleCard, coverPhoto] = await Promise.all([
      uploadImage(p.seed + "t", 610, 904, "titlecard"),
      uploadImage(p.seed + "c", 1920, 1080, "cover"),
    ]);

    await client.create({
      _type: "project",
      featured: false,
      category: p.category,
      artist: p.artist,
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      releaseDate: new Date(p.date).toISOString(),
      starring: p.starring,
      ...(p.directedBy && { directedBy: p.directedBy }),
      description: p.description,
      titleCard,
      coverPhoto,
    });

    console.log("done");
  }

  console.log(`\nSeeded ${toCreate.length} projects successfully.`);
}

seed().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
