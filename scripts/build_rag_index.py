from __future__ import annotations

import argparse
from collections import Counter
import json
import math
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Iterable

try:
    from pypdf import PdfReader
except ImportError as exc:
    raise SystemExit("Missing dependency: pypdf. Install it with `python -m pip install pypdf`.") from exc


SUPPORTED_TEXT_EXTS = {".md", ".txt"}


def safe_print(message: str) -> None:
    encoding = sys.stdout.encoding or "utf-8"
    print(message.encode(encoding, errors="replace").decode(encoding, errors="replace"))


def normalize_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def tokenize(text: str) -> list[str]:
    lower = str(text or "").lower()
    latin = re.findall(r"[a-z0-9][a-z0-9_\-./]{1,}", lower)
    chinese_terms: list[str] = []
    for part in re.findall(r"[\u4e00-\u9fa5]+", lower):
        if len(part) <= 2:
            chinese_terms.append(part)
            continue
        chinese_terms.extend(part[index : index + 2] for index in range(len(part) - 1))
    return [token for token in [*latin, *chinese_terms] if len(token) > 1]


def fnv1a(text: str) -> int:
    value = 2166136261
    for byte in text.encode("utf-8"):
        value ^= byte
        value = (value * 16777619) & 0xFFFFFFFF
    return value


def embed_text(text: str, dim: int) -> dict[str, float]:
    counts = Counter(tokenize(text))
    if not counts:
        return {}

    vector: dict[int, float] = {}
    for token, count in counts.items():
        hashed = fnv1a(token)
        index = hashed % dim
        sign = 1 if ((hashed >> 31) & 1) == 0 else -1
        vector[index] = vector.get(index, 0.0) + sign * (1.0 + math.log(count))

    norm = math.sqrt(sum(value * value for value in vector.values()))
    if norm == 0:
        return {}

    return {str(index): round(value / norm, 6) for index, value in sorted(vector.items()) if abs(value) > 1e-9}


def chunk_text(text: str, chunk_size: int, overlap: int) -> Iterable[str]:
    text = normalize_text(text)
    if not text:
        return

    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunk = text[start:end].strip()
        if chunk:
            yield chunk
        if end >= len(text):
            break
        start = max(0, end - overlap)


def extract_pdf(path: Path, max_pages: int) -> Iterable[tuple[int, str]]:
    try:
        reader = PdfReader(str(path))
    except Exception as exc:
        safe_print(f"[skip] cannot read PDF: {path.name} ({exc})")
        return

    for page_index, page in enumerate(reader.pages[:max_pages], start=1):
        try:
            text = page.extract_text() or ""
        except Exception as exc:
            safe_print(f"[skip] cannot extract page {page_index}: {path.name} ({exc})")
            continue
        text = normalize_text(text)
        if text:
            yield page_index, text


def extract_text_file(path: Path) -> Iterable[tuple[int, str]]:
    try:
        yield 1, path.read_text(encoding="utf-8", errors="ignore")
    except Exception as exc:
        safe_print(f"[skip] cannot read text file: {path.name} ({exc})")


def iter_files(source: Path) -> list[Path]:
    files = [p for p in source.rglob("*") if p.is_file() and p.suffix.lower() in {".pdf", *SUPPORTED_TEXT_EXTS}]
    return sorted(files, key=lambda p: p.name.lower())


def build_index(source: Path, output: Path, limit: int, max_pages: int, chunk_size: int, overlap: int, embedding_dim: int) -> None:
    chunks: list[dict] = []
    files = iter_files(source)
    if limit > 0:
        files = files[:limit]

    for file_index, path in enumerate(files, start=1):
        safe_print(f"[{file_index}/{len(files)}] {path.name}")
        if path.suffix.lower() == ".pdf":
            pages = extract_pdf(path, max_pages=max_pages)
        else:
            pages = extract_text_file(path)

        for page, text in pages:
            for chunk_index, chunk in enumerate(chunk_text(text, chunk_size=chunk_size, overlap=overlap), start=1):
                chunks.append(
                    {
                        "id": f"{path.stem[:48]}-p{page}-c{chunk_index}",
                        "source": path.name,
                        "path": str(path),
                        "page": page,
                        "chunk": chunk_index,
                        "text": chunk,
                        "embedding": embed_text(f"{path.name} {chunk}", embedding_dim),
                    }
                )

    output.parent.mkdir(parents=True, exist_ok=True)
    payload = {
      "createdAt": datetime.now().isoformat(timespec="seconds"),
      "sourceDir": str(source),
      "fileCount": len(files),
      "chunkCount": len(chunks),
      "chunkSize": chunk_size,
      "overlap": overlap,
      "maxPages": max_pages,
      "retrieval": {
        "embeddingModel": "local-hash-tfidf-v1",
        "embeddingDim": embedding_dim,
        "vectorSearch": "cosine",
        "rerank": "hybrid-vector-keyword-title-v1",
      },
      "chunks": chunks,
    }
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    safe_print(f"[done] wrote {len(chunks)} chunks to {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a local JSON RAG index from PDFs / Markdown / TXT files.")
    parser.add_argument("--source", required=True, help="Directory containing papers or wiki documents.")
    parser.add_argument("--output", default="server/rag-index.json", help="Output JSON index path.")
    parser.add_argument("--limit", type=int, default=80, help="Max files to index. Use 0 for all files.")
    parser.add_argument("--max-pages", type=int, default=8, help="Max PDF pages to extract per file.")
    parser.add_argument("--chunk-size", type=int, default=900, help="Characters per chunk.")
    parser.add_argument("--overlap", type=int, default=120, help="Chunk overlap characters.")
    parser.add_argument("--embedding-dim", type=int, default=384, help="Hash embedding dimensions.")
    args = parser.parse_args()

    source = Path(args.source).expanduser().resolve()
    if not source.exists():
        raise SystemExit(f"Source directory does not exist: {source}")

    build_index(
        source=source,
        output=Path(args.output).resolve(),
        limit=args.limit,
        max_pages=args.max_pages,
        chunk_size=args.chunk_size,
        overlap=args.overlap,
        embedding_dim=args.embedding_dim,
    )


if __name__ == "__main__":
    main()
