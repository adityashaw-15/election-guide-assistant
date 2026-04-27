const localizedMessages = {
  en: {
    missing: {
      hasVoterId: "Collect or confirm an accepted identity document before polling day.",
      isRegistered: "Complete voter registration and verify your name on the electoral roll.",
      knowsBoothLocation: "Confirm your polling booth location and travel plan in advance.",
      hasCheckedDocuments: "Review the list of accepted documents and carry the right one."
    },
    ready: {
      level: "Ready",
      summary: "You appear prepared for polling day.",
      suggestions: ["Keep your ID handy, recheck polling hours, and arrive with enough time."]
    },
    almostReady: {
      level: "Almost ready",
      summary: "You are close, but there are a few steps to finish."
    },
    needsAttention: {
      level: "Needs attention",
      summary: "You should complete key voting preparations before polling day."
    }
  },
  hi: {
    missing: {
      hasVoterId: "मतदान दिवस से पहले मान्य पहचान दस्तावेज़ की पुष्टि करें।",
      isRegistered: "मतदाता पंजीकरण पूरा करें और मतदाता सूची में अपना नाम जाँचें।",
      knowsBoothLocation: "अपने मतदान केंद्र और यात्रा योजना की पहले से पुष्टि करें।",
      hasCheckedDocuments: "स्वीकृत दस्तावेज़ों की सूची फिर से देखें और सही दस्तावेज़ साथ रखें।"
    },
    ready: {
      level: "तैयार",
      summary: "आप मतदान दिवस के लिए तैयार दिखते हैं।",
      suggestions: ["पहचान दस्तावेज़ साथ रखें, समय फिर से जाँचें और थोड़ा पहले पहुँचें।"]
    },
    almostReady: {
      level: "लगभग तैयार",
      summary: "आप काफ़ी तैयार हैं, बस कुछ अंतिम कदम बाकी हैं।"
    },
    needsAttention: {
      level: "अभी तैयारी बाकी है",
      summary: "मतदान दिवस से पहले आपको कुछ महत्वपूर्ण तैयारी पूरी करनी चाहिए।"
    }
  }
};

export function evaluateReadinessChecklist(answers, locale = "en") {
  const normalizedAnswers = {
    hasVoterId: Boolean(answers.hasVoterId),
    isRegistered: Boolean(answers.isRegistered),
    knowsBoothLocation: Boolean(answers.knowsBoothLocation),
    hasCheckedDocuments: Boolean(answers.hasCheckedDocuments)
  };
  const messages = localizedMessages[locale] || localizedMessages.en;

  const missing = [];

  if (!normalizedAnswers.hasVoterId) {
    missing.push(messages.missing.hasVoterId);
  }

  if (!normalizedAnswers.isRegistered) {
    missing.push(messages.missing.isRegistered);
  }

  if (!normalizedAnswers.knowsBoothLocation) {
    missing.push(messages.missing.knowsBoothLocation);
  }

  if (!normalizedAnswers.hasCheckedDocuments) {
    missing.push(messages.missing.hasCheckedDocuments);
  }

  const score = 4 - missing.length;

  if (score === 4) {
    return {
      score,
      level: messages.ready.level,
      summary: messages.ready.summary,
      suggestions: messages.ready.suggestions
    };
  }

  if (score >= 2) {
    return {
      score,
      level: messages.almostReady.level,
      summary: messages.almostReady.summary,
      suggestions: missing
    };
  }

  return {
    score,
    level: messages.needsAttention.level,
    summary: messages.needsAttention.summary,
    suggestions: missing
  };
}
