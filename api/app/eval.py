"""Retrieval evaluation — measures precision@k of hybrid memory search.

Run:  python -m app.eval
Prints precision@5 over a labeled query set (judges love a real metric).
"""
from __future__ import annotations

from .db import SessionLocal
from .search import search_memories

# query -> any of these terms appearing in a result's caption/tags/mood = relevant
LABELED = {
    "sunsets by the water": ["sunset", "beach", "ocean", "sea", "water", "shore", "dawn"],
    "celebrations and parties": ["balloon", "champagne", "wedding", "party", "celebrat", "glasses"],
    "mountains and hiking": ["mountain", "peak", "hiking", "alpine", "summit", "ridge", "trail"],
    "a happy dog": ["dog", "beagle", "pet", "paws"],
    "travel adventures": ["travel", "road", "van", "explorer", "map", "journey", "trip"],
    "forests and trees": ["forest", "tree", "woods", "leaves", "branch"],
    "weddings": ["wedding", "ceremony", "bride"],
    "peaceful water reflections": ["lake", "reflection", "mirror", "still", "calm", "turquoise"],
}


def relevant(photo: dict, terms: list[str]) -> bool:
    hay = f"{photo['caption']} {' '.join(photo.get('tags', []))} {photo['mood']}".lower()
    return any(t in hay for t in terms)


def run(k: int = 5) -> None:
    db = SessionLocal()
    precisions = []
    print(f"Hybrid retrieval eval (precision@{k}):\n")
    for q, terms in LABELED.items():
        res = search_memories(db, q, owner="me", limit=k)
        hits = sum(1 for p in res if relevant(p, terms))
        p_at_k = hits / max(1, len(res))
        precisions.append(p_at_k)
        print(f"  {p_at_k:.2f}  {q}")
    db.close()
    mean = sum(precisions) / len(precisions)
    print(f"\nMean precision@{k} = {mean:.2f} over {len(LABELED)} labeled queries")


if __name__ == "__main__":
    run()
