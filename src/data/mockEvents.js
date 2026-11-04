export const INITIAL_EVENTS = [
  {
    id: "evt-101",
    title: "HackCampus 2026: AI & Web3 Sprint",
    tagline: "36-hour flagship inter-college hackathon building decentralized & AI-first solutions",
    category: "Hackathon",
    organizer: {
      id: "org-01",
      name: "Turing Computer Society",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      department: "Dept. of Computer Science & Engineering",
      email: "turing.society@campus.edu",
      isOwner: true
    },
    date: "Nov 14 - 15, 2026",
    startTime: "09:00 AM",
    endTime: "09:00 PM",
    venue: "Main Auditorium & Labs, Tech Block B",
    isOnline: false,
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
    description: "Join over 400 student developers, designers, and innovators across the region for HackCampus 2026. Pitch projects to industry judges from top tech giants, attend mentor office hours, and compete for a prize pool exceeding $15,000.",
    highlights: [
      "$15,000+ total cash prizes & cloud credits",
      "Mentors from Google, Microsoft & OpenAI alumni",
      "Free meals, midnight snacks, swag kits & certificates",
      "Fast-track summer internship interviews for top 5 teams"
    ],
    schedule: [
      { time: "Day 1 - 08:30 AM", title: "Registration & Breakfast" },
      { time: "Day 1 - 10:00 AM", title: "Keynote & Problem Statements Reveal" },
      { time: "Day 1 - 11:00 AM", title: "Hacking Starts" },
      { time: "Day 2 - 04:00 PM", title: "Final Submissions & Live Pitching" }
    ],
    capacity: 350,
    registeredCount: 294,
    price: "Free",
    status: "Upcoming",
    tags: ["Artificial Intelligence", "Blockchain", "React", "Python"]
  },
  {
    id: "evt-102",
    title: "UI/UX Masterclass: Designing with Figma",
    tagline: "Hands-on design systems and interactive prototyping with industry pros",
    category: "Workshop",
    organizer: {
      id: "org-02",
      name: "Campus Design Guild",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      department: "School of Design & Creative Arts",
      email: "designguild@campus.edu",
      isOwner: false
    },
    date: "Nov 18, 2026",
    startTime: "02:00 PM",
    endTime: "05:30 PM",
    venue: "Media Innovation Lab, Room 302",
    isOnline: false,
    bannerUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80",
    description: "Take your product design capabilities to the next level. In this 3.5 hour intensive workshop, students will master Figma auto-layout, component variants, interactive micro-animations, and modern design handoffs.",
    highlights: [
      "Bring your own laptop with Figma installed",
      "Exclusive UI asset kit and icon library included",
      "Portfolio critique session for all attendees",
      "Verified Certificate of Completion"
    ],
    schedule: [
      { time: "02:00 PM", title: "Design Tokens & Grid Systems" },
      { time: "03:15 PM", title: "Building Responsive Components" },
      { time: "04:30 PM", title: "Micro-interactions & Live Critique" }
    ],
    capacity: 60,
    registeredCount: 57,
    price: "Free",
    status: "Filling Fast",
    tags: ["Figma", "Design Systems", "UX Research", "Prototyping"]
  },
  {
    id: "evt-103",
    title: "Rhythm & Echo: Annual Cultural Night",
    tagline: "A night of acoustic performances, dance crews, and culinary street stalls",
    category: "Cultural",
    organizer: {
      id: "org-03",
      name: "Student Affairs & Arts Council",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      department: "Student Affairs Office",
      email: "arts.council@campus.edu",
      isOwner: true
    },
    date: "Nov 22, 2026",
    startTime: "06:00 PM",
    endTime: "10:30 PM",
    venue: "Open Air Amphitheatre, Central Lawn",
    isOnline: false,
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
    description: "Experience the biggest social event of the semester! Rhythm & Echo brings together live collegiate bands, indie artists, contemporary dance groups, and over 20 student-run artisan and street food stalls.",
    highlights: [
      "Guest performance by chart-topping indie band 'The Lumens'",
      "Battle of the Campus Dance Crews",
      "Interactive art installations & photobooths",
      "Food truck festival featuring student discounts"
    ],
    schedule: [
      { time: "06:00 PM", title: "Gates Open & Acoustic Sets" },
      { time: "07:30 PM", title: "Dance Crew Showdown" },
      { time: "09:00 PM", title: "Headline Concert" }
    ],
    capacity: 1200,
    registeredCount: 880,
    price: "Free Pass",
    status: "Upcoming",
    tags: ["Music", "Dance", "Food Fest", "Night Life"]
  },
  {
    id: "evt-104",
    title: "Autonomous Robotics & Drone Showcase",
    tagline: "Live demonstrations of obstacle navigation, drone swarms, and ROS 2",
    category: "Tech",
    organizer: {
      id: "org-04",
      name: "Robotics & Automation Club",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      department: "Dept. of Mechanical & Mechatronics",
      email: "robotics@campus.edu",
      isOwner: false
    },
    date: "Nov 28, 2026",
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    venue: "Innovation Hangar & Indoor Stadium",
    isOnline: false,
    bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80",
    description: "Explore the bleeding edge of robotics. Student teams and researchers will showcase autonomous rovers, quadcopters running computer vision SLAM, and bipedal robotic platforms.",
    highlights: [
      "Live drone obstacle race competition",
      "Interactive robotic arm sorting workshop",
      "ROS 2 & NVIDIA Jetson hardware demo booths",
      "Networking with R&D robotics labs"
    ],
    schedule: [
      { time: "10:00 AM", title: "Exhibition Booths Open" },
      { time: "11:30 AM", title: "Autonomous Drone Race Qualifier" },
      { time: "01:00 PM", title: "Robo-Soccer Championship" }
    ],
    capacity: 250,
    registeredCount: 142,
    price: "Free",
    status: "Upcoming",
    tags: ["Robotics", "Drones", "AI", "Hardware"]
  },
  {
    id: "evt-105",
    title: "Campus Career Summit: Fall 2026",
    tagline: "Connect with 50+ visiting recruiters, resume reviews, and mock tech interviews",
    category: "Career",
    organizer: {
      id: "org-05",
      name: "Career Development Center",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
      department: "University Career & Placement Cell",
      email: "careers@campus.edu",
      isOwner: true
    },
    date: "Dec 02, 2026",
    startTime: "09:30 AM",
    endTime: "04:30 PM",
    venue: "University Convention Center, Hall 1 & 2",
    isOnline: false,
    bannerUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80",
    description: "The primary recruitment gathering for engineering, business, and arts students. Bring printed resumes and your digital portfolios for on-the-spot interviews and career mentorship.",
    highlights: [
      "Over 50 multinational companies and fast-growing startups",
      "1-on-1 resume review booths by senior HR executives",
      "Headshot photography booth for your LinkedIn profile",
      "Panel: 'Landing your first role in the AI era'"
    ],
    schedule: [
      { time: "09:30 AM", title: "Recruitment Expo Opens" },
      { time: "11:00 AM", title: "HR Keynote Panel" },
      { time: "02:00 PM", title: "Speed Networking Sessions" }
    ],
    capacity: 800,
    registeredCount: 610,
    price: "Free Pass",
    status: "Upcoming",
    tags: ["Career", "Jobs", "Internships", "Networking"]
  },
  {
    id: "evt-106",
    title: "Inter-Department Football Championship",
    tagline: "The battle for the annual Dean's Trophy kickoff matches",
    category: "Sports",
    organizer: {
      id: "org-06",
      name: "Campus Sports Department",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80",
      department: "Athletics & Recreation",
      email: "athletics@campus.edu",
      isOwner: false
    },
    date: "Dec 06, 2026",
    startTime: "04:00 PM",
    endTime: "07:30 PM",
    venue: "Main Sports Complex, Stadium Turf",
    isOnline: false,
    bannerUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    description: "Cheer on your department team in the thrilling opening rounds of the Dean's Football Trophy. Refreshments and official student cheering kits provided at the gate.",
    highlights: [
      "Opening match: CS Titans vs Mechanical Dynamos",
      "Half-time cheerleading and freestyle trick performances",
      "Free fan merchandise for the first 150 spectators",
      "Live streamed with campus student commentary"
    ],
    schedule: [
      { time: "04:00 PM", title: "Opening Ceremony & March Past" },
      { time: "04:30 PM", title: "Match 1 Kickoff" },
      { time: "06:15 PM", title: "Match 2 Kickoff" }
    ],
    capacity: 500,
    registeredCount: 312,
    price: "Free",
    status: "Upcoming",
    tags: ["Football", "Tournament", "Athletics", "InterCollege"]
  }
];

export const INITIAL_MY_REGISTRATIONS = [
  {
    registrationId: "reg-901",
    eventId: "evt-101",
    eventTitle: "HackCampus 2026: AI & Web3 Sprint",
    eventDate: "Nov 14 - 15, 2026",
    eventVenue: "Main Auditorium & Labs, Tech Block B",
    registeredAt: "2026-10-25T14:32:00.000Z",
    userName: "Alex Morgan",
    userEmail: "alex.morgan@campus.edu",
    ticketCode: "CC-HCK-94812",
    status: "CONFIRMED",
    category: "Hackathon"
  }
];

export const INITIAL_EVENT_REGISTRATIONS = {
  "evt-101": [
    {
      registrationId: "reg-901",
      userName: "Alex Morgan",
      userEmail: "alex.morgan@campus.edu",
      studentId: "CS2023-0491",
      ticketCode: "CC-HCK-94812",
      department: "Computer Science",
      registeredAt: "2026-10-25T14:32:00.000Z",
      checkInStatus: "Attending"
    },
    {
      registrationId: "reg-902",
      userName: "Samantha Chen",
      userEmail: "s.chen@campus.edu",
      studentId: "AI2024-1102",
      ticketCode: "CC-HCK-94813",
      department: "Artificial Intelligence",
      registeredAt: "2026-10-26T09:15:00.000Z",
      checkInStatus: "Attending"
    },
    {
      registrationId: "reg-903",
      userName: "Rohan Patel",
      userEmail: "rohan.p@campus.edu",
      studentId: "ECE2023-0824",
      ticketCode: "CC-HCK-94814",
      department: "Electronics & Comm",
      registeredAt: "2026-10-27T11:45:00.000Z",
      checkInStatus: "Pending"
    },
    {
      registrationId: "reg-904",
      userName: "Elena Rodriguez",
      userEmail: "e.rodriguez@campus.edu",
      studentId: "DES2024-0312",
      department: "Design & UX",
      ticketCode: "CC-HCK-94815",
      registeredAt: "2026-10-28T16:20:00.000Z",
      checkInStatus: "Attending"
    }
  ],
  "evt-103": [
    {
      registrationId: "reg-910",
      userName: "Jordan Lee",
      userEmail: "jordan.lee@campus.edu",
      studentId: "MED2023-0118",
      department: "Media Studies",
      ticketCode: "CC-CUL-10291",
      registeredAt: "2026-10-28T10:00:00.000Z",
      checkInStatus: "Attending"
    }
  ],
  "evt-105": [
    {
      registrationId: "reg-920",
      userName: "Marcus Brody",
      userEmail: "m.brody@campus.edu",
      studentId: "BUS2024-9912",
      department: "Business Administration",
      ticketCode: "CC-CAR-88219",
      registeredAt: "2026-10-27T15:10:00.000Z",
      checkInStatus: "Attending"
    }
  ]
};

