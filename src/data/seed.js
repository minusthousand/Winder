function img(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
}

export const SEED_PROFILES = [
  {
    id: 1,
    name: 'Aria',
    age: 26,
    likesYou: true,
    job: 'UX Designer at Northwind',
    location: 'Brooklyn, NY',
    distance: 3,
    bio: "Plant mom 🌿, weekend hiker, and serial brunch enthusiast. I make a playlist for every mood and I will absolutely beat you at Mario Kart. Looking for someone to lose track of time with.",
    interests: ['Hiking', 'Coffee', 'Pottery', 'Indie films'],
    images: [img('1494790108377-be9c29b29330'), img('1517841905240-472988babdf9'), img('1524504388940-b1c1722653e1')],
  },
  {
    id: 2,
    name: 'Marcus',
    age: 29,
    likesYou: false,
    job: 'Software Engineer at Drift',
    location: 'Austin, TX',
    distance: 7,
    bio: "Amateur chef who will absolutely judge your pizza order (pineapple is fine, fight me). Dog dad to a very dramatic golden retriever named Biscuit. Always up for a spontaneous road trip.",
    interests: ['Cooking', 'Dogs', 'Climbing', 'Vinyl'],
    images: [img('1500648767791-00dcc994a43e'), img('1507003211169-0a1dd7228f2d'), img('1488161628813-04466f872be2')],
  },
  {
    id: 3,
    name: 'Priya',
    age: 24,
    likesYou: true,
    job: 'Marketing Lead at Bloom',
    location: 'San Francisco, CA',
    distance: 5,
    bio: "Museum hopper, matcha addict, and aspiring novelist (three chapters in, very committed). Tell me your most unpopular opinion and I'll tell you mine. Sucker for golden hour and good bookstores.",
    interests: ['Art', 'Reading', 'Yoga', 'Travel'],
    images: [img('1438761681033-6461ffad8d80'), img('1544005313-94ddf0286df2'), img('1534528741775-53994a69daeb')],
  },
  {
    id: 4,
    name: 'Diego',
    age: 31,
    likesYou: false,
    job: 'Architect at Foundry',
    location: 'Miami, FL',
    distance: 12,
    bio: "Salsa dancer by night, architect by day. I make a mean negroni and even better playlists. Believer in long dinners, short coffees, and saying yes to the adventure.",
    interests: ['Dancing', 'Design', 'Travel', 'Wine'],
    images: [img('1539571696357-5a69c17a67c6'), img('1506794778202-cad84cf45f1d'), img('1492562080023-ab3db95bfbce')],
  },
];

export function distLabel(d) {
  if (d === null || d === undefined || d === '') return 'Nearby';
  if (typeof d === 'number') return `${d} km away`;
  const s = String(d);
  return /km|mi|away|nearby/i.test(s) ? s : `${s} km away`;
}
