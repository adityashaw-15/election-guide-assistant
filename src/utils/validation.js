export function validateQuestionInput(question) {
  if (!question) {
    return { valid: false, message: "Please enter a question before submitting." };
  }

  if (question.length < 3) {
    return { valid: false, message: "Please ask a slightly more detailed question." };
  }

  if (question.length > 240) {
    return { valid: false, message: "Questions must stay under 240 characters." };
  }

  return { valid: true, message: "" };
}
