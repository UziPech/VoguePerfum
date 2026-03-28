/**
 * fuzzyMatch — Motor de búsqueda inteligente reutilizable.
 *
 * Estrategia en 3 capas:
 *  1. Substring directo  → "dior" coincide con "Christian Dior"
 *  2. Multi-token         → "vic sec" coincide con "Victoria's Secret"
 *  3. Prefijo de palabra  → "ch" coincide con "Chanel", "Christian Dior"
 *
 * @param text   El texto donde buscar (ej. nombre de producto/marca)
 * @param query  Lo que el usuario escribió en el buscador
 * @returns      true si hay coincidencia inteligente
 */
export function fuzzyMatch(text: string, query: string): boolean {
    if (!text || !query) return false;

    const normalizedText = text.toLowerCase().trim();
    const normalizedQuery = query.toLowerCase().trim();

    // Capa 1: substring directo (el caso más común)
    if (normalizedText.includes(normalizedQuery)) return true;

    // Capa 2 + 3: tokenización
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
    const textWords = normalizedText.split(/[\s''\-]+/).filter(Boolean);

    return queryTokens.every(token =>
        // Capa 2: el token existe como substring en el texto completo
        normalizedText.includes(token) ||
        // Capa 3: alguna palabra del texto comienza con el token
        textWords.some(word => word.startsWith(token))
    );
}

/**
 * fuzzyMatchAny — Aplica fuzzyMatch contra múltiples campos.
 *
 * Uso típico:
 *   fuzzyMatchAny("ch", [product.name, product.brands?.name, product.categories?.name])
 *
 * @param query   Lo que el usuario escribió
 * @param fields  Lista de strings (pueden ser undefined/null, se ignoran)
 * @returns       true si algún campo coincide
 */
export function fuzzyMatchAny(query: string, fields: (string | undefined | null)[]): boolean {
    if (!query.trim()) return true; // sin búsqueda → todo coincide
    return fields.some(field => field != null && fuzzyMatch(field, query));
}
