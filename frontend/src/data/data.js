// Demo data cho Category/Post
export const categories = [
  { slug: "disease", name: "Disease" },
  { slug: "preventions", name: "Preventions" },
  { slug: "cure", name: "Cure" },
];

export const posts = [
  {
    id: "1",
    title: "What is Disease?",
    slug: "disease-101",
    category: "disease",
    date: "2022-06-25",
    author: "Z Lopez",
    image: "https://picsum.photos/seed/disease/1200/700",
    excerpt: "Disease overview and common symptoms...",
    content:
      "This is a demo post content about Disease. Replace with API content later.",
  },
  {
    id: "2",
    title: "Prevention Methods",
    slug: "preventions-basic",
    category: "preventions",
    date: "2022-06-25",
    author: "Z Lopez",
    image: "https://picsum.photos/seed/prevention/1200/700",
    excerpt: "How to prevent common diseases effectively...",
    content:
      "This is a demo post content about Preventions. Replace with API content later.",
  },
  {
    id: "3",
    title: "Cure & Treatment",
    slug: "cure-treatment",
    category: "cure",
    date: "2022-06-25",
    author: "Z Lopez",
    image: "https://picsum.photos/seed/cure/1200/700",
    excerpt: "When to seek treatment and typical cures...",
    content:
      "This is a demo post content about Cure. Replace with API content later.",
  },
];