import { VETERINARY_KNOWLEDGE_BASE, VeterinaryKnowledgeDoc } from './veterinary-knowledge-base';

export interface RetrievalResult {
  doc: VeterinaryKnowledgeDoc;
  relevanceScore: number; // 0.0 to 1.0
  matchedKeywords: string[];
  citation: string;
}

/**
 * Lightweight Semantic / Keyword Vector Retriever
 * Grounded strictly in authoritative veterinary literature without hallucinations.
 */
export class VeterinaryRetriever {
  /**
   * Search knowledge base with query string
   */
  public static search(query: string, maxResults: number = 3): RetrievalResult[] {
    const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/g, ' ');
    const queryTokens = normalizedQuery.split(/\s+/).filter(t => t.length > 2);

    if (queryTokens.length === 0) return [];

    const scoredDocs: RetrievalResult[] = VETERINARY_KNOWLEDGE_BASE.map(doc => {
      let score = 0;
      const matchedKeywords: string[] = [];

      const docText = [
        doc.conditionName,
        ...doc.symptoms,
        doc.clinicalSigns,
        doc.pathologyAndCauses,
        doc.recommendedEmergencyProtocol,
        doc.textChunk
      ]
        .join(' ')
        .toLowerCase();

      // Token matching with term weighting
      for (const token of queryTokens) {
        if (doc.conditionName.toLowerCase().includes(token)) {
          score += 4.0;
          matchedKeywords.push(token);
        } else if (doc.symptoms.some(s => s.toLowerCase().includes(token))) {
          score += 2.5;
          matchedKeywords.push(token);
        } else if (docText.includes(token)) {
          score += 1.0;
          matchedKeywords.push(token);
        }
      }

      // Normalize score between 0.0 and 1.0
      const maxPossible = queryTokens.length * 4.0;
      const normalizedScore = Math.min(1.0, score / maxPossible);

      return {
        doc,
        relevanceScore: Math.round(normalizedScore * 100) / 100,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        citation: `${doc.sourceAuthority} — ${doc.citation}`
      };
    });

    // Filter results with non-zero match and sort by relevance
    return scoredDocs
      .filter(res => res.relevanceScore > 0.10)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }
}
