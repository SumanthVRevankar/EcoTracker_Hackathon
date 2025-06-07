export interface ModerationResult {
  isAppropriate: boolean;
  confidence: number;
  flaggedCategories: string[];
  suggestedAction: 'approve' | 'review' | 'reject';
}

// Simple content moderation using keyword filtering
// In a real app, you'd use services like Google Cloud Natural Language API or AWS Comprehend
export const moderateContent = (content: string): ModerationResult => {
  const inappropriateKeywords = [
    // Profanity
    'damn', 'hell', 'crap', 'stupid', 'idiot',
    // Spam indicators
    'buy now', 'click here', 'free money', 'get rich quick',
    // Hate speech indicators
    'hate', 'discrimination', 'racist', 'sexist',
    // Misinformation indicators
    'climate hoax', 'global warming fake', 'science lie'
  ];

  const spamPatterns = [
    /(.)\1{4,}/, // Repeated characters
    /[A-Z]{5,}/, // All caps words
    /\b\d{10,}\b/, // Long numbers (phone numbers)
    /(https?:\/\/[^\s]+)/g // URLs
  ];

  const flaggedCategories: string[] = [];
  let confidence = 1.0;

  // Check for inappropriate keywords
  const lowerContent = content.toLowerCase();
  const foundKeywords = inappropriateKeywords.filter(keyword => 
    lowerContent.includes(keyword)
  );

  if (foundKeywords.length > 0) {
    flaggedCategories.push('inappropriate_language');
    confidence -= foundKeywords.length * 0.2;
  }

  // Check for spam patterns
  const hasSpamPatterns = spamPatterns.some(pattern => pattern.test(content));
  if (hasSpamPatterns) {
    flaggedCategories.push('spam');
    confidence -= 0.3;
  }

  // Check content length (very short or very long might be spam)
  if (content.length < 10) {
    flaggedCategories.push('too_short');
    confidence -= 0.1;
  } else if (content.length > 2000) {
    flaggedCategories.push('too_long');
    confidence -= 0.1;
  }

  // Determine action based on confidence and flags
  let suggestedAction: 'approve' | 'review' | 'reject' = 'approve';
  
  if (confidence < 0.3 || flaggedCategories.includes('inappropriate_language')) {
    suggestedAction = 'reject';
  } else if (confidence < 0.7 || flaggedCategories.length > 0) {
    suggestedAction = 'review';
  }

  return {
    isAppropriate: confidence > 0.7 && flaggedCategories.length === 0,
    confidence: Math.max(0, confidence),
    flaggedCategories,
    suggestedAction
  };
};

export const sanitizeContent = (content: string): string => {
  // Remove potential XSS attempts
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const generateModerationReport = (content: string, result: ModerationResult) => {
  return {
    content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
    timestamp: new Date(),
    result,
    reviewRequired: result.suggestedAction === 'review',
    autoRejected: result.suggestedAction === 'reject'
  };
};