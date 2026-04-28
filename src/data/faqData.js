export const faqEntries = [
  {
    id: "how-to-vote",
    question: "How do I vote in India?",
    keywords: ["vote", "voting", "polling", "how do i vote", "cast", "मतदान", "वोट"],
    answer: {
      title: "How voting usually works",
      summary: "Verify that you are registered, visit your assigned polling booth, complete identity verification, and cast your vote using the EVM.",
      bullets: [
        "Check your name on the electoral roll before polling day.",
        "Carry an accepted identity document if required.",
        "Follow booth staff instructions, vote on the EVM, and confirm the VVPAT display."
      ],
      followUp: "For exact booth location and accepted documents, check the latest official election guidance for your constituency."
    }
  },
  {
    id: "what-is-evm",
    question: "What is an EVM?",
    keywords: ["evm", "machine", "electronic voting machine", "ईवीएम"],
    answer: {
      title: "Electronic Voting Machine",
      summary: "An EVM is the device used to record votes electronically in many Indian elections.",
      bullets: [
        "It lets the voter choose a candidate by pressing the matching button.",
        "The machine stores the vote securely for counting.",
        "It works with VVPAT in many elections so the voter can visually confirm the selected candidate."
      ],
      followUp: "EVM procedures are defined by election authorities and are used under supervised polling conditions."
    }
  },
  {
    id: "what-is-vvpat",
    question: "What is VVPAT?",
    keywords: ["vvpat", "paper trail", "slip", "वीवीपैट"],
    answer: {
      title: "VVPAT explained",
      summary: "VVPAT stands for Voter Verifiable Paper Audit Trail and helps the voter confirm that the intended candidate was recorded.",
      bullets: [
        "After a vote is cast, a small display briefly shows the selected candidate or symbol.",
        "The paper trail supports audit and verification processes.",
        "The voter sees the confirmation but does not take the slip away."
      ],
      followUp: "Verification rules may vary by election process and official directions."
    }
  },
  {
    id: "registration",
    question: "How do I register to vote?",
    keywords: ["register", "registration", "enroll", "voter id", "electoral roll", "पंजीकरण"],
    answer: {
      title: "Registration basics",
      summary: "Apply to be added to the electoral roll, submit the required proof documents, and verify that your application is accepted.",
      bullets: [
        "Make sure you meet age and citizenship requirements.",
        "Keep proof of identity, age, and address ready.",
        "Track your application and check the final roll before voting."
      ],
      followUp: "Use the official voter services portal in your region for current forms and deadlines."
    }
  },
  {
    id: "counting",
    question: "How are votes counted?",
    keywords: ["count", "counting", "result", "results", "मतगणना", "परिणाम"],
    answer: {
      title: "Counting overview",
      summary: "Votes are counted in controlled centers with observers, round-wise tabulation, and official verification before results are declared.",
      bullets: [
        "Postal ballots and EVM rounds follow defined procedures.",
        "Authorized agents can observe the counting process.",
        "Results are released only after checks are complete."
      ],
      followUp: "Local rules and timing can differ between elections."
    }
  },
  {
    id: "documents",
    question: "What documents do I need to vote?",
    keywords: ["documents", "required documents", "id", "identity", "proof", "दस्तावेज़", "पहचान"],
    answer: {
      title: "Documents to keep ready",
      summary: "Keep an accepted identity document ready and verify the latest polling instructions for your constituency before election day.",
      bullets: [
        "Carry a valid accepted identity proof if the local process requires it.",
        "Check your name on the electoral roll before leaving for the booth.",
        "Review the latest official list of accepted documents and polling hours."
      ],
      followUp: "Accepted identity documents can vary by election instructions, so confirm the current official list."
    }
  }
];
