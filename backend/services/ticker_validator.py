from functools import lru_cache
from typing import Set

from services.stock_universe import get_all_tickers


@lru_cache(maxsize=1)
def _cached_allowed_tickers() -> Set[str]:
    """Return a cached set of allowed NSE tickers (with suffixes).

    Ensures the set is normalized to uppercase and suffixed with `.NS` so
    lookups are reliable and fast.
    """
    allowed = get_all_tickers()
    normalized = set()
    for t in allowed:
        if not isinstance(t, str):
            continue
        n = t.strip().upper()
        if not n:
            continue
        if '.' in n:
            base = n.split('.')[0]
            n = f"{base}.NS"
        else:
            n = f"{n}.NS"
        normalized.add(n)
    return normalized


def validate_and_normalize_ticker(ticker: str, require_nse: bool = True) -> str:
    """Validate and normalize an input ticker for NSE-only processing.

    - Trims and uppercases input.
    - Replaces any suffix with `.NS` (or appends `.NS` when absent).
    - Checks membership in the cached allowed-ticker set.

    On failure raises `ValueError` with a helpful debug message.
    """
    if not ticker or not isinstance(ticker, str):
        raise ValueError("Ticker must be a non-empty string")

    # Debug: capture raw incoming value
    raw = ticker

    # Normalize: trim and uppercase
    norm = raw.strip().upper()
    if not norm:
        raise ValueError("Ticker must contain non-whitespace characters")

    # Enforce .NS suffix: if any suffix present, replace it with .NS; if none, append .NS
    if '.' in norm:
        base = norm.split('.')[0]
        norm = f"{base}.NS"
    else:
        norm = f"{norm}.NS"

    # Quick alias map for common shorthand tickers that differ from Yahoo tickers
    # (e.g., users may enter HDFC which maps to HDFCBANK.NS on Yahoo)
    alias_map = {
        'HDFC.NS': 'HDFCBANK.NS'
    }
    if norm in alias_map:
        norm = alias_map[norm]

    if require_nse:
        allowed = _cached_allowed_tickers()
        if norm not in allowed:
            # Provide helpful debug context for investigation
            sample = list(sorted(allowed))[:10]
            raise ValueError(
                f"Ticker '{norm}' is not in the allowed NSE universe. "
                f"(incoming: '{raw}'). Sample allowed: {sample} (total {len(allowed)})."
            )

    return norm
