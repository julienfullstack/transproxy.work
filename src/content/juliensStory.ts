export type JulienStorySection = {
  id: string
  heading: string
  paragraphs: string[]
}

export type JulienStory = {
  title: string
  published: string
  author: string
  summary: string
  sections: JulienStorySection[]
}

export const juliensStory: JulienStory = {
  "title": "I Said No Before Surgery. I Woke Up With the Result Anyway.",
  "published": "2026-11-10",
  "author": "Julien Lenaz",
  "summary": "Before surgery, I asked for a result I could live comfortably with. Afterward, I found myself trying to prove what I had understood, refused and reported. I’m building TransProxy so patients will be able to record their wishes before care, document what happens, share selected evidence and make repeated concerns visible.",
  "sections": [
    {
      "id": "what-i-asked-for",
      "heading": "What I asked for before surgery",
      "paragraphs": [
        "I went into revision surgery in August stable, sober and able to have sex. I wanted to improve my sexual function and feel more comfortable in my body. What happened afterward has affected how I sleep, shower, have sex and leave my home.",
        "I had discussed a different plan with my surgeon earlier. Immediately before surgery, I changed my mind. I told him I wanted complete burial. My recollection is that he said he would honor that decision and that the area would heal flat. That last conversation mattered: I was telling him what I wanted before the operation.",
        "I have disputed the account of our preoperative conversation. My position is that I did not agree to the result I woke up with. I want my understanding, my changed decision, the consent documentation and the operative record examined together."
      ]
    },
    {
      "id": "waking-up",
      "heading": "I objected when I saw the result",
      "paragraphs": [
        "When I woke up, I saw a raised, irregular strip of tissue under my penis. I described it as about four inches long. It looked like a burn graft to me. I was in complete shock. I told my surgeon and Patient Advocacy as soon as I saw it that I had not consented to what I was looking at.",
        "The tissue is intensely sensitive and painful to touch. Its appearance causes me dysphoria. I wanted a body I could feel comfortable using and showing. Instead, I started avoiding looking at myself. I cry when I shower. I have reported losing fifteen pounds since surgery."
      ]
    },
    {
      "id": "explanation-and-questions",
      "heading": "What my surgeon told me",
      "paragraphs": [
        "My surgeon has replied. In a November 2 message, he wrote that my clitoris had been buried and that clitoral skin had been used to cover a skin defect. He described that tissue as generally used for urethral lengthening and offered to remove the differently colored tissue.",
        "That is his explanation. I still need an independent surgeon to examine me, explain what was done and reconcile it with what I understood before surgery. I am afraid of losing erogenous sensation or the ability to orgasm if tissue is removed. I have asked for a step-by-step explanation and a drawing. I need to understand my options before agreeing to another operation."
      ]
    },
    {
      "id": "pain-and-aftercare",
      "heading": "Seven nights without sleep",
      "paragraphs": [
        "I remember being in so much pain in the hospital that I begged to be sedated. I felt that my pain was not being adequately controlled. I want the pain-management and aftercare records reviewed.",
        "At home, I went seven days without sleeping. I was frightened, in pain and struggling to get answers about my body. On the eighth day, I went to Mount Sinai West after a fellow told me I could see my surgical team there. I expected urology. Instead, I was told I was manic.",
        "My understanding is that my expectation of seeing urology and my statement that I had not consented were treated as signs that I was delusional. I was repeating what I had been told and what I had reported when I first saw the result."
      ]
    },
    {
      "id": "living-with-the-result",
      "heading": "What the result has taken from my daily life",
      "paragraphs": [
        "I can have sex with my penis. That does not mean I am comfortable or free of pain. Sober, the sensitivity and dysphoria make sex and masturbation difficult to tolerate. Since this surgery, I have not been able to reach orgasm without drugs. Before it, I could.",
        "I relapsed weeks after surgery. The pain, isolation and loss of sexual comfort brought me to thoughts of suicide. In my November 10 account, I said I was not using drugs and had been staying sober in preparation for the revision I anticipated. Hoping for help had been giving me something to hold on to.",
        "Medication and many therapy sessions have not relieved the physical problem I am describing. I need my distress taken seriously alongside my need for an independent surgical evaluation."
      ]
    },
    {
      "id": "revision-delay",
      "heading": "I learned about the delay by reading my chart",
      "paragraphs": [
        "I left a postoperative visit understanding that a revision would be scheduled for January or February. Mount Sinai had asked me to sign a release to speak with Callen-Lorde. After that contact, I read in my chart that Mount Sinai wanted me to wait six months because of mental health concerns.",
        "I was still emailing and texting about scheduling when I discovered the recommendation. Nobody had told me about the delay. I want to know who recommended it, what information they relied on and how the plan was supposed to address my pain and dysphoria.",
        "I have concerns about how my surgical complaints and distress were interpreted by both institutions. I want those decisions independently reviewed. I want to know what was shared, who made the recommendation and why I was left trying to schedule an operation while a different plan was being discussed."
      ]
    },
    {
      "id": "accountability",
      "heading": "A reply is not the same as resolving the dispute",
      "paragraphs": [
        "I have also reported being misgendered immediately after gender-affirming surgery. I have heard accounts from other patients who describe concerns about their own care. Those accounts deserve to be documented and reviewed on their own evidence.",
        "I have received replies, including my surgeon’s November 2 explanation. I still want a record showing what I asked, what the institution answered, what remains disputed and what action followed. I want the same opportunity for other patients, without requiring them to make every intimate detail public."
      ]
    },
    {
      "id": "independent-help",
      "heading": "What I am asking for now",
      "paragraphs": [
        "I need an independent surgeon experienced in phalloplasty revisions to examine me and explain what can be changed while preserving as much sensation as possible. I have struggled to find someone in New York willing to revise another surgeon’s work. I need help pursuing an out-of-state Medicaid exception if that is what obtaining an evaluation requires.",
        "I am also asking for legal review of my records, consent concerns and subsequent care. I am almost out of money. My November 10 request for legal help describes that continuing search. I want answers based on the evidence, and care that addresses the physical problem."
      ]
    },
    {
      "id": "why-transproxy",
      "heading": "Why I built TransProxy",
      "paragraphs": [
        "I am building TransProxy because patients need a place to record what they understand and want before care, while they can still ask questions and change their minds. Afterward, they need to preserve what happened without starting their history over each time they seek help.",
        "The planned tools include dated wishes and boundaries, appointment summaries, care-team contacts, healing photos and drain logs, and selected private sharing with a clinician, advocate or lawyer. Reports can document experiences involving staff, departments and providers. Reviewed public accounts and separately chosen pattern contributions can help people see repeated concerns.",
        "Private records must stay private unless their owner chooses otherwise. A patient’s account, supporting evidence and a provider’s response must remain distinguishable. These member tools are planned; the waiting list is the starting point.",
        "I cannot undo waking up to a result I say I had explicitly refused. I can build a way for patients to preserve their wishes, their questions and the history of their attempts to be heard."
      ]
    }
  ]
}
