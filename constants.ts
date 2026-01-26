
import { Creator } from './types';

export const COLORS = {
  maroon: '#800000',
  gold: '#D4AF37',
  goldLight: '#F3E5AB',
  white: '#FFFFFF',
  black: '#1A1A1A'
};

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' }
];

export const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Elena Rivers',
    username: 'elenastudios',
    bio: 'Digital artist creating ethereal landscapes and character designs.',
    avatar: 'https://picsum.photos/seed/elena/200',
    coverImage: 'https://picsum.photos/seed/cover1/1200/400',
    niche: 'Digital Art',
    totalRaised: 12450.50,
    currency: 'USD',
    stats: { supporters: 1240, views: 45600 },
    activeGoal: {
      id: 'g1',
      title: 'New Studio Equipment',
      targetAmount: 15000,
      currentAmount: 12450.50,
      description: 'Upgrading my digital tablet and monitor for better color accuracy in my paintings.'
    },
    tiers: [
      { id: 't1', amount: 5, title: 'Supporter', description: 'Your name in my monthly newsletter and a digital wallpaper.' },
      { id: 't2', amount: 25, title: 'Art Lover', description: 'Early access to all new sketches and process videos.' },
      { id: 't3', amount: 100, title: 'Patron', description: 'A signed high-quality mini print sent to you every quarter.', isPremium: true }
    ],
    feed: [
      { id: 'f1', title: 'New Sketch!', content: 'Just finished the lines for my next big project. Can you guess the theme?', image: 'https://picsum.photos/seed/sketch/600/400', timestamp: '2 hours ago', likes: 142 },
      { id: 'f2', title: 'Studio Update', content: 'Cleaning up for the new equipment. So excited!', timestamp: 'Yesterday', likes: 89 }
    ]
  },
  {
    id: '11',
    name: 'Leo Chen',
    username: 'leo_codes_14',
    bio: '14-year-old student learning Python and building mini-games. Funding my first laptop through community tips!',
    avatar: 'https://picsum.photos/seed/student_leo/200',
    coverImage: 'https://picsum.photos/seed/coding_desk/1200/400',
    niche: 'Student / Coding',
    totalRaised: 450.00,
    currency: 'USD',
    stats: { supporters: 62, views: 2400 },
    activeGoal: {
      id: 'g11',
      title: 'First Coding Laptop',
      targetAmount: 800,
      currentAmount: 450,
      description: 'Currently using an old shared family computer. Your help gets me my own portable workstation!'
    },
    tiers: [
      { id: 't24', amount: 2, title: 'Study Buddy', description: 'Weekly updates on my coding progress and game screenshots.' },
      { id: 't25', amount: 10, title: 'Alpha Tester', description: 'Access to download and play all the mini-games I build.', isPremium: true }
    ]
  },
  {
    id: '9',
    name: 'Professor Arthur Thorne',
    username: 'history_with_arthur',
    bio: 'Retired History Professor sharing deep dives into ancient civilizations and forgotten narratives.',
    avatar: 'https://picsum.photos/seed/teacher/200',
    coverImage: 'https://picsum.photos/seed/history/1200/400',
    niche: 'Education (Retiree)',
    totalRaised: 4800.00,
    currency: 'USD',
    stats: { supporters: 340, views: 15600 },
    activeGoal: {
      id: 'g9',
      title: 'Historical Archive Access',
      targetAmount: 6000,
      currentAmount: 4800,
      description: 'Funding premium access to digital historical archives to bring you better researched content.'
    },
    tiers: [
      { id: 't20', amount: 5, title: 'Student', description: 'Monthly history trivia and reading recommendations.' },
      { id: 't21', amount: 20, title: 'Scholar', description: 'Exclusive access to my raw research notes and bibliographies.', isPremium: true }
    ]
  },
  {
    id: '10',
    name: 'Coach Marcus Bell',
    username: 'bell_athletics',
    bio: 'Former professional athlete and retired coach providing mentorship for young stars.',
    avatar: 'https://picsum.photos/seed/athlete/200',
    coverImage: 'https://picsum.photos/seed/sports/1200/400',
    niche: 'Sports Mentorship',
    totalRaised: 2900.00,
    currency: 'EUR',
    stats: { supporters: 155, views: 7800 },
    activeGoal: {
      id: 'g10',
      title: 'Equipment for Local Youth',
      targetAmount: 5000,
      currentAmount: 2900,
      description: 'Providing professional-grade training equipment to kids who cannot afford it.'
    },
    tiers: [
      { id: 't22', amount: 15, title: 'Teammate', description: 'Weekly mindset tips and training drills.' },
      { id: 't23', amount: 75, title: 'MVP', description: 'A monthly 1-on-1 video call to discuss your progress.', isPremium: true }
    ]
  },
  {
    id: '7',
    name: 'Carlos Mendez',
    username: 'carlos_design',
    bio: 'Freelance graphic designer specializing in minimalist brand identities for startups.',
    avatar: 'https://picsum.photos/seed/carlos/200',
    coverImage: 'https://picsum.photos/seed/design/1200/400',
    niche: 'Freelance Design',
    totalRaised: 5600.00,
    currency: 'BRL',
    stats: { supporters: 210, views: 8900 },
    activeGoal: {
      id: 'g7',
      title: 'Workstation Upgrade',
      targetAmount: 10000,
      currentAmount: 5600,
      description: 'As a freelancer, my tools are my life. This goal helps me provide better quality to my clients.'
    },
    tiers: [
      { id: 't16', amount: 50, title: 'Design Tip', description: 'Access to my curated design assets and fonts.' },
      { id: 't17', amount: 250, title: 'Collaborator', description: 'One 30-minute design review session per month.', isPremium: true }
    ]
  },
  {
    id: '5',
    name: 'Alex Turner',
    username: 'alex_voices',
    bio: 'Visually impaired storyteller and voice actor using technology to share epic fantasies.',
    avatar: 'https://picsum.photos/seed/alex/200',
    coverImage: 'https://picsum.photos/seed/audio/1200/400',
    niche: 'Audio Storytelling',
    totalRaised: 3100.00,
    currency: 'GBP',
    stats: { supporters: 420, views: 12000 },
    isAccessible: true,
    activeGoal: {
      id: 'g5',
      title: 'Pro Braille Display',
      targetAmount: 5000,
      currentAmount: 3100,
      description: 'Helping me read and edit my scripts more efficiently with specialized hardware.'
    },
    tiers: [
      { id: 't12', amount: 5, title: 'Listener', description: 'Access to my monthly audio diary and behind-the-scenes recordings.' },
      { id: 't13', amount: 20, title: 'Protagonist', description: 'I will name a character after you in my next audio drama series.', isPremium: true }
    ],
    feed: [
      { id: 'f11', title: 'New Chapter Drop!', content: 'The latest episode of "The Whispering Woods" is live. Recorded entirely with my new mic!', timestamp: '1 day ago', likes: 156 }
    ]
  }
];

export const PAYMENT_PROVIDERS = {
  banks: ['Chase', 'HSBC', 'DBS', 'Barclays', 'Santander', 'Bank of America', 'Bank Jago'],
  eWallets: ['PayPal', 'Venmo', 'CashApp', 'GrabPay', 'GoPay', 'Alipay', 'Apple Pay', 'OVO', 'Dana']
};
