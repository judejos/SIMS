def get_embedding(text: str) -> list:
    words = text.lower().split()
    return list(set(words))


def cosine_similarity(vec_a: list, vec_b: list) -> float:
    set_a, set_b = set(vec_a), set(vec_b)
    if not set_a or not set_b:
        return 0.0
    intersection = len(set_a & set_b)
    return intersection / (len(set_a) ** 0.5 * len(set_b) ** 0.5)


def find_most_similar(query: str, candidates: list) -> str:
    query_vec = get_embedding(query)
    best, best_score = candidates[0], -1
    for c in candidates:
        score = cosine_similarity(query_vec, get_embedding(c))
        if score > best_score:
            best_score = score
            best = c
    return best
