export const PROJECTS = [
  { name: "One Victoria", city: "Action Area 1, New Town, Kolkata", type: "Residential", status: "Ongoing", url: "/projects/one-victoria-new-town", img: "/projects/one-victoria-new-town/hero.webp" },
  { name: "One Prime Residential", city: "New Town, Kolkata", type: "Residential", status: "Ongoing", url: "/projects/one-prime-residential", img: "/projects/one-prime-residential/card.webp" },
  { name: "Oscar Billionaires", city: "Indore", type: "Township", status: "Ready to Move", url: "/oscar-indore", img: "assets/projects/oscar-billionaires.webp" },
  { name: "Active Acres", city: "Kolkata", type: "Residential", status: "Ready to Move", url: "/active-acres-angelica", img: "assets/projects/active-acres.webp" },
  { name: "One Rajarhat", city: "Rajarhat Â· Kolkata", type: "Residential", status: "Ready to Move", url: "/one-rajarhat", img: "assets/projects/one-rajarhat.webp" },
  { name: "Active Business Park", city: "Kolkata", type: "Commercial", status: "Ready to Move", url: "/active-business-park", img: "assets/projects/active-business-park.webp" },
  { name: "Active Greens", city: "Kolkata", type: "Residential", status: "Ready to Move", url: "/active-greens", img: "assets/projects/active-green.webp" },
  { name: "Oscar Pride", city: "Indore", type: "Township", status: "Ready to Move", url: "/projects/oscar-pride-indore", img: "/projects/oscar-pride-indore/hero.jpg" },
  { name: "Saatvik Vihar", city: "Mangliya Sadak, Indore", type: "Township", status: "Ready to Move", url: "/projects/saatvik-vihar-indore", img: "/projects/saatvik-vihar-indore/hero.webp" },
  { name: "Ruchi Lifescapes", city: "Jhalariya, Indore", type: "Township", status: "Ready to Move", url: "/projects/ruchi-lifescapes-indore-project", img: "/projects/ruchi-lifescapes-indore-project/hero.webp" },
  { name: "Saatvik Green", city: "Rahukhedi, Mangliya, Indore", type: "Township", status: "Ready to Move", url: "/projects/saatvikgreen-indore", img: "/projects/saatvikgreen-indore/hero.webp" },
  { name: "Anand Vihar", city: "Morod, Indore", type: "Township", status: "Ready to Move", url: "/projects/anand-vihar-indore", img: "/projects/anand-vihar-indore/hero.webp" },
  { name: "Ruchi Lifescapes", city: "Bhopal, Madhya Pradesh", type: "Residential", status: "Ready to Move", url: "/projects/lifescapes-bhopal", img: "/projects/lifescapes-bhopal/card.webp" },
  { name: "Active Acres Angelica", city: "Active Acres Â· Kolkata", type: "Residential", status: "Ongoing", url: "/active-acres-angelica", img: "https://ruchirealty.com/active-acres-angelica/images/angelica-hero.webp" },
  { name: "Oscar Fort", city: "Indore", type: "Township", status: "Ongoing", url: "/projects/oscar-fort-indore", img: "/projects/oscar-fort-indore/hero.jpg" },
  { name: "Oscar Sanctuary", city: "Indore", type: "Township", status: "Ongoing", url: "/projects/oscar-sanctuary-indore", img: "/projects/oscar-sanctuary-indore/hero.webp" },
  { name: "Oscar Palace", city: "Indore", type: "Township", status: "Upcoming", url: "/projects/oscar-palace", img: "/projects/oscar-palace/hero.jpg", mediaBadge: "Video" },
  { name: "Ruchi Enclave", city: "Indore", type: "Township", status: "Upcoming", url: "/projects/ruchi-enclave-indore", img: "/projects/ruchi-enclave-indore/hero.webp" },
  { name: "Ruchi Hills", city: "Indore", type: "Residential", status: "Upcoming", img: "assets/projects/ruchi-hills.webp" },
];

export const PROJECT_OPTIONS = [
  "One Victoria â€” New Town, Kolkata",
  "One Rajarhat â€” Kolkata",
  "Active Acres â€” Kolkata",
  "Active Acres Angelica â€” Kolkata",
  "Active Greens â€” Kolkata",
  "One Prime Residential - New Town, Kolkata",
  "Oscar Billionaires â€” Indore",
  "Oscar Pride â€” Indore",
  "Oscar Fort â€” Indore",
  "Ruchi Lifescapes â€” Bhopal",
  "Another project / Not sure yet",
];

if (typeof window !== 'undefined') {
  window.PROJECTS = PROJECTS;
}
