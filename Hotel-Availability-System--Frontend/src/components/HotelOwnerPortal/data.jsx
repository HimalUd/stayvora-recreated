import {
  AnalyticsIcon,
  GlobeIcon,
  CalendarIcon,
  RevenueIcon,
  ShieldIcon,
  BellIcon,
  StatRevenueIcon,
  StatBookingsIcon,
  StatRatingIcon,
} from './icons';

export const features = [
  {
    icon: AnalyticsIcon,
    bg: '#F3E8FF',
    title: 'Real-Time Analytics',
    desc: 'Track bookings, revenue, and performance metrics in real-time with detailed analytics dashboard',
  },
  {
    icon: GlobeIcon,
    bg: '#DBEAFE',
    title: 'Global Reach',
    desc: 'Connect with travelers from around the world and expand your customer base instantly',
  },
  {
    icon: CalendarIcon,
    bg: '#DCFCE7',
    title: 'Booking Management',
    desc: 'Manage all your reservations in one place with powerful filtering and search capabilities',
  },
  {
    icon: RevenueIcon,
    bg: '#FFEDD4',
    title: 'Revenue Tracking',
    desc: 'Monitor your earnings, track payment status, and generate financial reports effortlessly',
  },
  {
    icon: ShieldIcon,
    bg: '#FCE7F3',
    title: 'Secure Platform',
    desc: "Bank-level security to protect your data and your guests' information",
  },
  {
    icon: BellIcon,
    bg: '#E0E7FF',
    title: 'Instant Notifications',
    desc: 'Get notified immediately when new bookings arrive or guests check in',
  },
];

export const steps = [
  {
    num: '1',
    bg: '#F5A623',
    title: 'Register Your Hotel',
    desc: 'Fill in your hotel details, amenities, and upload photos. Takes less than 10 minutes.',
  },
  {
    num: '2',
    bg: '#155DFC',
    title: 'Get Discovered',
    desc: 'Your hotel appears in search results for travelers looking in your area.',
  },
  {
    num: '3',
    bg: '#00A63E',
    title: 'Manage & Grow',
    desc: 'Receive bookings, manage reservations, and watch your business grow.',
  },
];

export const stats = [
  { value: '500+', label: 'Partner Hotels' },
  { value: '50K+', label: 'Bookings Monthly' },
  { value: '$2M+', label: 'Revenue Generated' },
  { value: '4.9★', label: 'Average Rating' },
];

export const heroStats = [
  {
    label: 'Monthly Revenue',
    value: '$45,280',
    valueClass: 'hop-stat-value-blue',
    boxClass: 'hop-stat-purple',
    icon: StatRevenueIcon,
  },
  {
    label: 'Total Bookings',
    value: '187',
    valueClass: 'hop-stat-value-gold',
    boxClass: 'hop-stat-yellow',
    icon: StatBookingsIcon,
  },
  {
    label: 'Guest Satisfaction',
    value: '4.8',
    valueClass: 'hop-stat-value-blue',
    boxClass: 'hop-stat-blue',
    icon: StatRatingIcon,
    stars: true,
  },
];

export const testimonials = [
  {
    text: '"Since joining this platform, our bookings have increased by 150%. The dashboard makes it so easy to manage everything in one place."',
    name: 'Nuwan Perera',
    hotel: 'Sunset Villa - Mirissa',
    iconBg: '#F3E8FF',
    iconColor: '#9810FA',
  },
  {
    text: '"The real-time analytics help us make better business decisions. We can track everything from revenue to guest satisfaction effortlessly."',
    name: 'Chamari Silva',
    hotel: 'Ocean Pearl - Galle',
    iconBg: '#DBEAFE',
    iconColor: '#155DFC',
  },
  {
    text: '"Simple to use, powerful features, and excellent support. This platform has transformed how we manage our hotel business."',
    name: 'Kasun Fernando',
    hotel: 'Ella Rock Retreat',
    iconBg: '#DCFCE7',
    iconColor: '#00A63E',
  },
];
