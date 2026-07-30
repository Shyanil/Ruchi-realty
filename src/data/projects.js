export const PROJECTS = [
  { name: "One Victoria", city: "Action Area 1, New Town, Kolkata", type: "Residential", status: "Ongoing", url: "/projects/one-victoria-new-town", img: "/projects/one-victoria-new-town/hero.webp" },
  { name: "One Prime Residential", city: "New Town, Kolkata", type: "Residential", status: "Ready to Move", url: "/projects/one-prime-residential", img: "/projects/one-prime-residential/card.webp" },
  { name: "Oscar Billionaires", city: "Indore", type: "Residential", status: "Ready to Move", url: "/projects/oscar-indore", img: "assets/projects/oscar-billionaires.webp" },
  { name: "Active Acres", city: "Kolkata", type: "Residential", status: "Ready to Move", url: "/projects", img: "assets/projects/active-acres.webp" },
  { name: "One Rajarhat", city: "Rajarhat - Kolkata", type: "Residential", status: "Ready to Move", url: "/projects/one-rajarhat", img: "assets/projects/one-rajarhat.webp" },
  { name: "Active Business Park", city: "Kolkata", type: "Commercial", status: "Ready to Move", url: "/projects/active-business-park", img: "assets/projects/active-business-park.webp" },
  { name: "Active Greens", city: "Kolkata", type: "Residential", status: "Ready to Move", url: "/projects/active-greens", img: "assets/projects/active-green.webp" },
  { name: "Oscar Pride", city: "Indore", type: "Residential", status: "Ready to Move", url: "/projects/oscar-pride-indore", img: "/projects/oscar-pride-indore/hero.webp" },
  { name: "Saatvik Vihar", city: "Mangliya Sadak, Indore", type: "Residential", status: "Ready to Move", url: "/projects/saatvik-vihar-indore", img: "/projects/saatvik-vihar-indore/hero.webp" },
  { name: "Ruchi Lifescapes", city: "Jhalariya, Indore", type: "Residential", status: "Ready to Move", url: "/projects/ruchi-lifescapes-indore-project", img: "/projects/ruchi-lifescapes-indore-project/hero.webp" },
  { name: "Saatvik Green", city: "Rahukhedi, Mangliya, Indore", type: "Residential", status: "Ready to Move", url: "/projects/saatvikgreen-indore", img: "/projects/saatvikgreen-indore/hero.webp" },
  { name: "Anand Vihar", city: "Morod, Indore", type: "Residential", status: "Ready to Move", url: "/projects/anand-vihar-indore", img: "/projects/anand-vihar-indore/hero.webp" },
  { name: "Ruchi Lifescapes", city: "Bhopal, Madhya Pradesh", type: "Residential", status: "Ready to Move", url: "/projects/lifescapes-bhopal", img: "/projects/lifescapes-bhopal/card.webp" },
  { name: "Active Acres Angelica", city: "Active Acres - Kolkata", type: "Residential", status: "Ongoing", url: "/projects/active-acres-angelica", img: "/assets/projects/active-acres-angelica/hero.webp" },
  { name: "Oscar Fort", city: "Indore", type: "Residential", status: "Ongoing", url: "/projects/oscar-fort-indore", img: "/projects/oscar-fort-indore/hero.webp" },
  { name: "Oscar Sanctuary", city: "Indore", type: "Residential", status: "Ongoing", url: "/projects/oscar-sanctuary-indore", img: "/projects/oscar-sanctuary-indore/hero.webp" },
  { name: "Oscar Palace", city: "Indore", type: "Residential", status: "Upcoming", url: "/projects/oscar-palace", img: "/projects/oscar-palace/hero.webp", mediaBadge: "Video" },
  { name: "Ruchi Enclave", city: "Indore", type: "Residential", status: "Ready to Move", url: "/projects/ruchi-enclave-indore", img: "/projects/ruchi-enclave-indore/hero.webp" },
  { name: "Ruchi Hills", city: "Indore", type: "Residential", status: "Upcoming", img: "assets/projects/ruchi-hills.webp" },
];

export const PROJECT_OPTIONS = [
  "One Victoria - New Town, Kolkata",
  "One Rajarhat - Kolkata",
  "Active Acres - Kolkata",
  "Active Acres Angelica - Kolkata",
  "Active Greens - Kolkata",
  "Active Business Park - Kolkata",
  "One Prime Residential - New Town, Kolkata",
  "Oscar Billionaires - Indore",
  "Oscar Pride - Indore",
  "Oscar Fort - Indore",
  "Ruchi Lifescapes - Bhopal",
  "Another project / Not sure yet",
];

if (typeof window !== 'undefined') {
  // Keep runtime/backend synchronization from mutating the imported seed list.
  // Project cards use the original list as their guaranteed local image fallback.
  window.PROJECTS = PROJECTS.map((project) => ({ ...project }));
}
