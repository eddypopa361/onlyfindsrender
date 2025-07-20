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
    content: "ONLYFINDS has completely transformed my shopping experience. The product quality recommendations are spot-on, and the platform makes finding authentic-looking replicas so much easier.",
    date: "2025-01-15"
  },
  {
    id: "2", 
    name: "Sarah Martinez",
    role: "Style Blogger",
    rating: 5,
    content: "As someone who reviews fashion regularly, I'm impressed by ONLYFINDS' curation. The connection to trusted sellers and the detailed product information saves me hours of research.",
    date: "2025-01-12"
  },
  {
    id: "3",
    name: "Mike Johnson", 
    role: "Sneakerhead",
    rating: 5,
    content: "Finally found a platform that understands quality replicas. The CNFANS integration and shipping discounts make this the go-to place for smart shoppers.",
    date: "2025-01-10"
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "College Student", 
    rating: 4,
    content: "Love the variety and the honest approach to replica shopping. ONLYFINDS doesn't oversell - they just connect you to what you're looking for at fair prices.",
    date: "2025-01-08"
  },
  {
    id: "5",
    name: "David Park",
    role: "Tech Professional",
    rating: 5,
    content: "The user experience is fantastic. Clean interface, reliable links, and the customer service guidance for CNFANS orders has been invaluable.",
    date: "2025-01-05"
  },
  {
    id: "6",
    name: "Lisa Thompson", 
    role: "Retail Manager",
    rating: 5,
    content: "Been using ONLYFINDS for months now. The consistency in quality recommendations and the transparent approach to connecting with sellers sets them apart.",
    date: "2025-01-03"
  }
];