// Added: Reviews feature
export interface Review {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  content: string;
  date?: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Fashion Enthusiast", 
    rating: 5,
    content: "ONLYFINDS makes shopping easy. The recommendations are on point and look like the real thing. Less scrolling, more finds.",
    date: "2024-12-15",
    avatar: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1a1a1a"/>
        <circle cx="24" cy="18" r="8" fill="#00BDFF"/>
        <path d="M8 40c0-8.84 7.16-16 16-16s16 7.16 16 16v8H8v-8z" fill="#00BDFF"/>
      </svg>
    `)}`
  },
  {
    id: "2", 
    name: "Sarah Martinez",
    role: "Style Blogger",
    rating: 5,
    content: "I test sites all day—this is the one I open first. Smart curation and CNFANS links that actually land where they should. It saves me hours.",
    date: "2024-12-10",
    avatar: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#2a1a2a"/>
        <circle cx="24" cy="18" r="8" fill="#ff6b9d"/>
        <path d="M8 40c0-8.84 7.16-16 16-16s16 7.16 16 16v8H8v-8z" fill="#ff6b9d"/>
      </svg>
    `)}`
  },
  {
    id: "3",
    name: "Mike Johnson", 
    role: "Sneakerhead",
    rating: 5,
    content: "Finally, a place that gets sneaker culture. Clear guidance, solid CNFANS links, smart shipping tips—I ended up paying less than I expected.",
    date: "2024-12-08",
    avatar: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1a2a1a"/>
        <circle cx="24" cy="18" r="8" fill="#4ade80"/>
        <path d="M8 40c0-8.84 7.16-16 16-16s16 7.16 16 16v8H8v-8z" fill="#4ade80"/>
      </svg>
    `)}`
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "College Student", 
    rating: 4,
    content: "Student budget, still found great looks fast. Honest descriptions with zero hype. Picking sizes is straightforward.",
    date: "2024-12-05",
    avatar: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#2a1a3a"/>
        <circle cx="24" cy="18" r="8" fill="#8b5cf6"/>
        <path d="M8 40c0-8.84 7.16-16 16-16s16 7.16 16 16v8H8v-8z" fill="#8b5cf6"/>
      </svg>
    `)}`
  },
  {
    id: "5",
    name: "David Park",
    role: "Tech Professional",
    rating: 5,
    content: "Clean UI, reliable links, helpful support. CNFANS orders went through without drama. Exactly the kind of predictable I like.",
    date: "2024-12-01",
    avatar: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1a3a2a"/>
        <circle cx="24" cy="18" r="8" fill="#06b6d4"/>
        <path d="M8 40c0-8.84 7.16-16 16-16s16 7.16 16 16v8H8v-8z" fill="#06b6d4"/>
      </svg>
    `)}`
  },
  {
    id: "6",
    name: "Lisa Thompson", 
    role: "Retail Manager",
    rating: 5,
    content: "I've been using ONLYFINDS for months. Recommendations stay consistent and the transparent seller info means no surprises. A site you can trust.",
    date: "2024-11-28",
    avatar: `data:image/svg+xml,${encodeURIComponent(`
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#3a1a2a"/>
        <circle cx="24" cy="18" r="8" fill="#f59e0b"/>
        <path d="M8 40c0-8.84 7.16-16 16-16s16 7.16 16 16v8H8v-8z" fill="#f59e0b"/>
      </svg>
    `)}`
  }
];