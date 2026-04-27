import { faqEntries } from "../data/faqData.js";

function scoreQuestion(question, entry) {
  const normalizedQuestion = question.toLowerCase();
  let score = 0;

  for (const keyword of entry.keywords) {
    if (normalizedQuestion.includes(keyword)) {
      score += keyword.length;
    }
  }

  return score;
}

export function getFaqPreview() {
  return faqEntries.map(({ id, question }) => ({ id, question }));
}

export function answerElectionQuestion(question) {
  const scoredEntries = faqEntries
    .map((entry) => ({ entry, score: scoreQuestion(question, entry) }))
    .sort((left, right) => right.score - left.score);

  const bestMatch = scoredEntries[0];

  if (!bestMatch || bestMatch.score === 0) {
    return {
      title: "I need a more specific election question",
      summary: "Try asking about voter registration, polling day, EVM, VVPAT, counting, or results.",
      bullets: [
        "Example: How do I register to vote?",
        "Example: What is VVPAT?",
        "Example: How are election results declared?"
      ],
      followUp: "For legal deadlines or constituency-specific information, confirm with official election sources."
    };
  }

  return bestMatch.entry.answer;
}
