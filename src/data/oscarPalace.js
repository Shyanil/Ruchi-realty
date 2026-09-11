const OSCAR_PALACE_REAL_PHOTOS = [
  "437a3792-hdr", "437a3799-hdr", "437a3806-hdr", "437a3809", "437a3817-hdr",
  "437a3831", "437a3848", "437a3856", "437a3865-hdr", "437a3871-hdr",
  "437a3877", "437a3880", "437a3885", "437a3899", "437a3901", "437a3905",
  "437a3915-hdr", "437a3927-hdr", "437a3939-hdr", "437a3948-hdr", "437a3949-hdr",
  "437a3958-hdr", "437a3959-hdr", "437a3983-hdr", "437a3993-hdr", "437a4004-hdr",
  "437a4007", "437a4016", "437a4019", "437a4022-hdr", "437a4027-hdr", "437a4030-hdr",
  "437a4033-hdr", "437a4040-hdr", "437a4041-hdr", "437a4045-hdr", "437a4048-hdr",
  "437a4052-hdr", "437a4059-hdr", "non-ps-437a3839-hdr", "non-ps-437a3975",
  "non-ps-437a3992-hdr", "non-ps-437a3999-hdr",
];

export const OSCAR_PALACE_FALLBACK = {
  heroTitle: "Oscar Palace", heroTagline: "Royally Yours", heroLogo: "/projects/oscar-palace/logo.webp", heroBg: "/projects/oscar-palace/real-437a3939-hdr.webp",
  heroMobileUrl: "/projects/oscar-palace/hero-real-mobile.webp",
  overviewImage: "/projects/oscar-palace/real-437a3792-hdr.webp",
  overviewParagraphs: ["A royal estate for your palatial abode. An estate that radiates luxury and becomes a statement of your stature for others. Oscar Palace is conceived to transform residential living into a royal experience. Unique location, palace-like entrance, multiple themed gardens, baradaris and walkways, wide internal roads with palace inspired installations, and fort like boundary wall, it is an oasis of luxury.", "In the tradition of other Oscar developments, the master planning of Oscar Palace is driven by the thought of making everyday living a royal experience.", "Oscar Palace is a tribute to your taste and vision. It is royally yours!"],
  overviewHighlights: [{ label: "Area", desc: "60+ acres", icon: "infrastructure" }, { label: "Location", desc: "Hingoniya, Off Indore Nagpur Highway", icon: "location" }, { label: "Plot Size", desc: "3,500 to 20,000 sq ft", icon: "size" }],
  amenities: [{ name: "Tennis & Basketball Court", icon: "tennis" }, { name: "Kids Play Area", icon: "playground" }, { name: "Temple", icon: "temple" }, { name: "Water Fountains", icon: "garden" }, { name: "Yoga & Meditation Spaces", icon: "yoga" }, { name: "Baradaris, Chhatris & Gazebos", icon: "club" }, { name: "Senior Citizen Park", icon: "garden" }, { name: "Open Gym", icon: "gym" }, { name: "Watch Tower", icon: "security" }, { name: "Airwalk Way", icon: "jogging" }],
  specifications: [{ title: "Key Location", desc: "The 60+ acres expanse of Oscar Palace gives you the freedom of choice. With plot sizes ranging from 325 to 1,858 sq mtr (3,500 to 20,000 sq ft), you may build a palatial house or a modern villa, whatever suits your lifestyle." }, { title: "Project Details", desc: "Hingoniya, Off Indore Nagpur Highway, Besides Ruchi Lifescapes, Jhalariya, Indore - 452016, Madhya Pradesh. Registration ID: P-IND-24-4828. Phone: +91 89292 25275. Email: emarketing@ruchirealty.com" }, { title: "__floor_plans__", desc: JSON.stringify([{ title: "Layout Plan", desc: "/projects/oscar-palace/plan.webp" }]) }, { title: "__video_section__", desc: JSON.stringify({ enabled: true, title: "Layout Walkthrough", videoUrl: "https://www.youtube.com/watch?v=0E0QQrL3ZyE", thumbnailUrl: "/projects/oscar-palace/walkthrough-thumb.webp" }) }],
  locationImage: "/projects/oscar-palace/loc-1.webp", locationMapEmbed: "", locationDestinations: [{ name: "Hingoniya", dist: "Off Indore Nagpur Highway" }, { name: "Ruchi Lifescapes, Jhalariya", dist: "Besides project" }, { name: "Registration ID", dist: "P-IND-24-4828" }],
  galleryImages: [
    ...[1, 2, 3, 4, 5].map((n) => ({ src: `/projects/oscar-palace/gallery-g-${n}.webp`, alt: `Oscar Palace gallery image ${n}` })),
    ...OSCAR_PALACE_REAL_PHOTOS.map((name, index) => ({ src: `/projects/oscar-palace/real-${name}.webp`, alt: `Oscar Palace real site photograph ${index + 1}` })),
  ], brochureUrl: "", metaTitle: "Oscar Palace Indore - Ruchi Realty", metaDescription: "Oscar Palace is a 60+ acre premium plotted residential development at Hingoniya, off Indore Nagpur Highway, offering 3,500 to 20,000 sq ft plots, palace-inspired landscapes, themed gardens, wide internal roads, and royal estate living.",
};
