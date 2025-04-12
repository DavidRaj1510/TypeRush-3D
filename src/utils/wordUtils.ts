
// Common English words for typing practice
const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
  "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
  "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
  "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them",
  "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new",
  "want", "because", "any", "these", "give", "day", "most", "code", "data", "type", "function"
];

// Programming related words for harder difficulty
const PROGRAMMING_WORDS = [
  "function", "variable", "array", "string", "number", "boolean", "object", "class",
  "method", "property", "interface", "type", "loop", "condition", "if", "else", "return",
  "async", "await", "promise", "callback", "event", "component", "props", "state", "hook",
  "render", "effect", "context", "reducer", "action", "store", "dispatch", "commit", "mutation",
  "get", "set", "prototype", "instance", "static", "public", "private", "protected", "namespace",
  "module", "import", "export", "default", "param", "argument", "compile", "build", "debug", "test",
  "deployment", "production", "development", "staging", "server", "client", "database", "query",
  "api", "rest", "graphql", "json", "xml", "http", "request", "response", "token", "auth", "secure"
];

// Space themed words for the TypeRush3D theme
const SPACE_WORDS = [
  "alien", "asteroid", "astronaut", "comet", "cosmos", "crater", "earth", "galaxy",
  "gravity", "lunar", "meteor", "moon", "nebula", "orbit", "planet", "rocket", "satellite",
  "solar", "space", "star", "sun", "telescope", "universe", "wormhole", "mars", "jupiter",
  "saturn", "venus", "mercury", "pluto", "neptune", "uranus", "quasar", "pulsar", "supernova",
  "constellation", "starship", "launch", "mission", "shuttle", "station", "command", "module",
  "engine", "booster", "reentry", "trajectory", "velocity", "vacuum", "zero-gravity", "cosmic"
];

/**
 * Generate a list of words for the typing game
 * @param count Number of words to generate
 * @returns Array of word strings
 */
export const generateWordList = (count: number): string[] => {
  // Combine all word lists with space words having higher probability
  const combinedWords = [
    ...COMMON_WORDS,
    ...PROGRAMMING_WORDS,
    ...SPACE_WORDS,
    ...SPACE_WORDS // Add space words twice to increase probability
  ];
  
  const wordList: string[] = [];
  
  // Generate random words
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * combinedWords.length);
    wordList.push(combinedWords[randomIndex]);
  }
  
  return wordList;
};

/**
 * Calculate words per minute (WPM) based on typed words and elapsed time
 * @param wordCount Number of words typed
 * @param timeInSeconds Elapsed time in seconds
 * @returns WPM as an integer
 */
export const calculateWpm = (wordCount: number, timeInSeconds: number): number => {
  if (timeInSeconds === 0) return 0;
  const minutes = timeInSeconds / 60;
  return Math.floor(wordCount / minutes);
};
