# Reverie — H0 Submission Package

**Tagline:** The frame that remembers — an AI that turns your photos into living,
searchable, conversational memories.

**Track:** Open Innovation
**AWS Database:** Amazon Aurora PostgreSQL (+ pgvector)
**Also used:** Amazon Bedrock (Claude vision + Titan embeddings), Amazon S3

---

## Inspiration
Our most precious memories die in a dead camera roll — 10,000 photos nobody ever
scrolls back through. Physical photo frames show one picture forever; phone
galleries are an endless, dumb grid. We asked: what if a frame could actually
*understand* your life — and let you talk to it?

## What it does
Reverie turns a pile of photos into living memories:
- **Understands every photo** — Bedrock Claude vision writes a warm caption and
  extracts scene, mood, the number of people, and a color palette.
- **Search by meaning** — type "sunsets by the water with friends" and Aurora
  pgvector finds the right memories, not filename matches.
- **Talk to your memories** — ask "what did I do last summer?" and it answers,
  grounded in your actual photos (RAG).
- **The living Frame + Cast mode** — a full-screen, auto-curating display with
  ambient light pulled from each photo's palette; "3 years ago today."
- **AI Memory Reels** — an auto-narrated cinematic montage of a collection.
- **AI insights** — your memories by mood, by year, your "life in color."

## How we built it
v0-scaffolded **Next.js** on Vercel → **FastAPI** → **Aurora PostgreSQL +
pgvector**. Each upload runs through Bedrock Claude vision, gets embedded by Titan
into a 1024-d vector, and is stored in Aurora with a pgvector IVFFlat index for
fast cosine search. "Talk to your memories" is retrieval-augmented generation over
those vectors. Originals live in S3. The whole stack is environment-driven: it
runs locally on SQLite with AI fallbacks and on Aurora + Bedrock in production with
zero code changes.

## Challenges
- Bedrock on-demand throttling during bulk ingest → solved with adaptive retries +
  pacing.
- Keeping one codebase runnable offline *and* at scale → a storage/DB/AI
  abstraction that swaps by environment.

## Impact (why it matters)
Photo reminiscence is a documented therapeutic tool for **dementia and elderly
memory care**, and a comfort for those grieving a loved one. Reverie makes that
effortless: a grandparent can *ask* for "the summer at the lake house" and watch it
come back, narrated. It's not a gallery — it's a way to keep people and moments
alive.

## What's next
Shared family frames, voice (Polly) narration, on-device casting, and faces via
Rekognition.

---

# 🎬 3-Minute Demo Script (record this)

> Demo on YOUR real photos — it's the difference between "nice" and unforgettable.

**[0:00–0:20] Hook**
"This is my camera roll — thousands of photos I never look at again. Watch what
happens when an AI actually understands them." *(Open Reverie — the frame is
already alive, rotating a memory with its caption.)*

**[0:20–0:50] Understanding (Bedrock vision)**
"I'll add a photo." *(Drag in a real photo.)* "In seconds, Amazon Bedrock's vision
model wrote this caption, read the mood, counted the people, even pulled the
colors." *(Show the new memory in the frame with its palette dots.)*

**[0:50–1:30] Search + Talk to your memories (pgvector + RAG)**
"Now I can search by *meaning*." *(Type "sunsets by the water" → results grid with
match %.)* "That's Aurora pgvector. But here's the magic —" *(Click Ask, type
"what did I do last summer?")* "It answers from my actual photos." *(Read the
grounded answer.)*

**[1:30–2:10] The Frame + Reel (the emotion)**
"This is meant to live on your wall." *(Click Cast — full-screen, ambient clock.)*
"And it can tell your story." *(Click Reel — the AI-narrated montage plays with its
title card.)* *(Let one beautiful line land.)*

**[2:10–2:40] The tech (for the judges)**
*(Switch to AWS console.)* "Every memory is understood by Bedrock and stored in
Amazon Aurora PostgreSQL with pgvector — here's the live cluster. The frontend is
Next.js on Vercel." *(Show the cluster + a pgvector query.)*

**[2:40–3:00] Close (impact)**
"Photo reminiscence is real therapy for memory loss and grief. Reverie makes it
effortless — you don't browse your life, you *talk* to it. Reverie: the frame that
remembers."

---

# Submission checklist
- [ ] Public Vercel URL (deployed, judge-testable)
- [ ] Demo video < 3 min (script above), on real photos, on YouTube
- [ ] Architecture diagram (architecture.md → export PNG)
- [ ] AWS console screenshot: Aurora cluster `muse-aurora` (RDS, ap-south-1)
- [ ] Vercel Team ID
- [ ] Text description (use "What it does" + "How we built it" above)
- [ ] Track: Open Innovation
- [ ] Bonus: publish a build write-up with #H0Hackathon (+0.6 pts) — see below

# Bonus content (free +0.6 points — most people skip this)
Publish 1–3 short posts (Dev.to / LinkedIn / builder.aws.com) titled e.g.
"Building an AI memory frame with Vercel, Aurora pgvector, and Bedrock" — paste the
"How we built it" + architecture. Tag **#H0Hackathon**. 0.2 pts each, up to 0.6.
