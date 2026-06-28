# Reverie — Architecture

> Submission diagram for H0. Frontend on Vercel, **Amazon Aurora PostgreSQL +
> pgvector** as the primary database, **Amazon Bedrock** for multimodal AI.

## System diagram

```mermaid
flowchart TD
    U[User] -->|upload photo / ask / search| FE[Next.js on Vercel<br/>scaffolded with v0]
    FE -->|REST| BE[FastAPI backend]

    subgraph AWS["AWS (ap-south-1)"]
        VIS[Amazon Bedrock<br/>Claude 3.5 Sonnet — vision]
        EMB[Amazon Bedrock<br/>Titan Text Embeddings v2]
        GEN[Amazon Bedrock<br/>Claude — RAG answers + reel narration]
        DB[(Amazon Aurora PostgreSQL<br/>+ pgvector — IVFFlat ANN)]
        S3[Amazon S3<br/>photo storage]
    end

    BE -->|1. understand photo| VIS
    VIS -->|caption, mood, tags, people, palette| BE
    BE -->|2. embed the memory| EMB
    EMB -->|1024-d vector| BE
    BE -->|3. store memory + vector| DB
    BE -->|store original| S3
    FE -->|"sunsets by the water"| BE
    BE -->|4. semantic recall| DB
    BE -->|5. ground answer| GEN
```

## The ingestion pipeline (what makes it intelligent)

```
photo ─► Bedrock Claude vision ─► { caption, scene, mood, tags, people, palette }
                                        │
                                        ▼
                        Titan embeds the memory text ─► 1024-d vector
                                        │
                                        ▼
                    Aurora: row + pgvector(embedding_vec) + IVFFlat index
```

## Retrieval (Talk to your memories — RAG)

```
question ─► Titan embed ─► Aurora pgvector ANN (cosine <=>) ─► top-k memories
                                                                     │
                                              Claude answers grounded in them
```

## Data model

| Table   | Key columns |
| ------- | ----------- |
| `photos` | caption, scene, mood, tags[], people, palette[], taken_at, embedding (json), **embedding_vec vector(1024)**, favorite, owner |
| `frames` | name, mode (shuffle/mood/favorites/on-this-day), query, owner |

## AWS services used

| Service | Role |
| ------- | ---- |
| **Amazon Aurora PostgreSQL** | Primary database + **pgvector** semantic memory search |
| **Amazon Bedrock — Claude 3.5 Sonnet (vision)** | Understands every photo |
| **Amazon Bedrock — Titan Embeddings v2** | 1024-d memory vectors |
| **Amazon Bedrock — Claude (text)** | RAG answers + reel narration |
| **Amazon S3** | Original photo storage |
| **Vercel** | Next.js frontend hosting (v0-scaffolded) |

## Environment parity (no code change dev → prod)

```
DEV   sqlite + local fallbacks   (vercel dev)
PROD  Aurora pgvector + Bedrock  (vercel deploy)
```
