// labs-data.js — playbook content for the two hands-on sessions.
window.LABS = [
  {
    id: "lab1",
    tag: "Day 1 · 01:00–02:00",
    title: "Hands-On Lab 1",
    subtitle: "Produce your first AI video clip from a guided story — then peer review and facilitator feedback.",
    goal: "By the end you'll have one animated clip built end-to-end: a Gem-driven storyboard, generated images, and an image-to-video render in Firefly.",
    duration: "60 min",
    steps: [
      { t: "Open the playbook", d: "Grab the participant playbook and skim the full flow before you start." },
      { t: "Create your Gem", d: "Copy & paste the provided instructions to spin up your executive-producer Gem." },
      { t: "Upload your images", d: "Bring in your reference images so the Gem has visual context." },
      { t: "Ask for the animation prompt", d: "Have the Gem write the prompt that will animate your images." },
      { t: "Log in to Firefly", d: "Sign in and open your workspace." },
      { t: "Create a demo board", d: "Start a fresh board for this lab." },
      { t: "Upload images to the board", d: "Drop your generated stills onto the board." },
      { t: "Generate videos", d: "Run the image-to-video generation and review your first clip." },
    ],
    footer: { label: "Need the tools?", link: "index.html", linkText: "Review the platform stack" },
  },
  {
    id: "sprint",
    tag: "Day 2 · 10:30–12:30",
    title: "Final Project Sprint",
    subtitle: "Produce your chosen project — commercial or story — using the full stack. Facilitators circulate for 1-on-1 support.",
    goal: "Take an idea you prepped overnight (a 5–10 shot story, commercial, or short movie) all the way through the full workflow to a finished sequence.",
    duration: "120 min",
    steps: [
      { t: "Share your idea", d: "Pitch your concept to the room — story, commercial, or short movie, 5–10 shots." },
      { t: "Create your Gem", d: "Set up your executive-producer Gem for this project." },
      { t: "Generate a demo storyboard", d: "Produce a storyboard with a description for each scene." },
      { t: "Instructor review", d: "Get a facilitator's eyes on your storyboard before you commit to render." },
      { t: "Continue the workflow", d: "Generate images, pick your video models, render, finish and assemble the cut." },
    ],
    footer: { label: "Stuck on a tool choice?", link: "index.html", linkText: "Open Module 2 — which model when" },
  },
];

// idea prompts for the overnight prep card
window.SPRINT_IDEAS = [
  { k: "Story", d: "A 5–10 shot narrative with a clear beginning, turn and end." },
  { k: "Commercial", d: "A product or brand spot — hook, value, call to action." },
  { k: "Short movie", d: "A self-contained cinematic scene with mood and motion." },
];
