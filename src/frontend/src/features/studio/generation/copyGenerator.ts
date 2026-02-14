import type { CopyVariant } from '../state/studioTypes';

type Tone = 'professional' | 'friendly' | 'bold';
type Length = 'short' | 'medium' | 'long';

const TEMPLATES = {
  professional: {
    short: {
      headlines: [
        'Elevate Your Experience',
        'Innovation Meets Excellence',
        'Transform Your Business',
      ],
      bodies: [
        'Discover cutting-edge solutions designed for modern professionals.',
        'Experience unparalleled quality and performance.',
        'Join industry leaders who trust our expertise.',
      ],
      ctas: ['Learn More', 'Get Started Today', 'Request a Demo'],
    },
    medium: {
      headlines: [
        'Unlock New Possibilities',
        'Your Success, Our Priority',
        'Excellence in Every Detail',
      ],
      bodies: [
        'We combine innovation with reliability to deliver solutions that exceed expectations. Our commitment to quality ensures your success.',
        'Partner with us to achieve your goals. Our proven track record speaks for itself, with thousands of satisfied clients worldwide.',
        'Experience the difference that professional expertise makes. We deliver results that matter to your bottom line.',
      ],
      ctas: ['Schedule Consultation', 'View Our Solutions', 'Contact Our Team'],
    },
    long: {
      headlines: [
        'Redefining Industry Standards',
        'Your Partner in Growth',
        'Building Tomorrow, Today',
      ],
      bodies: [
        'In today\'s competitive landscape, you need a partner who understands your challenges and delivers innovative solutions. Our comprehensive approach combines cutting-edge technology with proven methodologies to drive measurable results for your organization.',
        'We believe in building lasting relationships through exceptional service and unwavering commitment to excellence. Our team of experts brings decades of combined experience to help you navigate complex challenges and seize new opportunities in your market.',
        'Success requires more than just good intentions—it demands strategic thinking, flawless execution, and continuous innovation. That\'s exactly what we deliver, day in and day out, helping businesses like yours achieve sustainable growth and competitive advantage.',
      ],
      ctas: ['Start Your Journey', 'Explore Our Approach', 'Partner With Us'],
    },
  },
  friendly: {
    short: {
      headlines: [
        'Hey There! 👋',
        'We\'ve Got Something Special',
        'You\'re Gonna Love This',
      ],
      bodies: [
        'Check out what we\'ve been working on just for you!',
        'Something amazing is waiting for you.',
        'Your new favorite thing is here!',
      ],
      ctas: ['Check It Out', 'Let\'s Go!', 'Show Me More'],
    },
    medium: {
      headlines: [
        'Ready for Something Amazing?',
        'We Can\'t Wait to Share This',
        'Your Next Favorite Thing',
      ],
      bodies: [
        'We\'ve been working hard to create something truly special, and we think you\'re going to absolutely love it. Come see what all the excitement is about!',
        'Life\'s too short for boring stuff. That\'s why we made this just for people like you who appreciate quality and style. Trust us, you won\'t be disappointed!',
        'Sometimes the best things come from listening to what people really want. We heard you, and we delivered. Ready to see what we\'ve created together?',
      ],
      ctas: ['See What\'s New', 'Join the Fun', 'Get Yours Now'],
    },
    long: {
      headlines: [
        'Let\'s Make Something Great Together',
        'Your Journey Starts Here',
        'Welcome to Your New Favorite Place',
      ],
      bodies: [
        'We believe that the best experiences come from genuine connections and real understanding. That\'s why we\'ve built something that feels less like a product and more like a friend—always there when you need it, making your life easier and more enjoyable every single day. We can\'t wait for you to try it!',
        'You know that feeling when you find something that just gets you? That\'s what we\'re all about. We\'ve poured our hearts into creating an experience that feels personal, authentic, and genuinely helpful. Because at the end of the day, we\'re not just building products—we\'re building relationships with amazing people like you.',
        'Here\'s the thing: we\'re not your typical company. We actually care about making your day better, your life easier, and your experience unforgettable. Every detail has been thoughtfully designed with you in mind, because you deserve nothing less than exceptional. Ready to see what we mean?',
      ],
      ctas: ['Join Our Community', 'Start Your Adventure', 'Let\'s Connect'],
    },
  },
  bold: {
    short: {
      headlines: [
        'Game Changer Alert 🔥',
        'This Changes Everything',
        'The Future Is Here',
      ],
      bodies: [
        'Revolutionary. Powerful. Unmissable.',
        'Break free from the ordinary.',
        'Dare to be different.',
      ],
      ctas: ['Claim Yours', 'Join the Revolution', 'Take Action'],
    },
    medium: {
      headlines: [
        'Stop Settling. Start Winning.',
        'Unleash Your Potential',
        'No Limits. No Excuses.',
      ],
      bodies: [
        'The competition is fierce, but you\'re fiercer. It\'s time to stop playing it safe and start dominating your space. Are you ready to make your move?',
        'Average is the enemy of great. We don\'t do average, and neither should you. This is your moment to break through barriers and achieve what others only dream about.',
        'While others hesitate, winners take action. This isn\'t for everyone—it\'s for those who refuse to accept anything less than extraordinary. Is that you?',
      ],
      ctas: ['Seize the Moment', 'Dominate Now', 'Unlock Your Power'],
    },
    long: {
      headlines: [
        'Rewrite the Rules. Own Your Future.',
        'For Those Who Refuse to Settle',
        'This Is Your Moment of Truth',
      ],
      bodies: [
        'Let\'s be real: the world doesn\'t reward the timid. It rewards the bold, the brave, and the relentless. You didn\'t come this far to play small. You came to make an impact, to leave your mark, to show everyone what you\'re truly capable of. This is your chance to prove it. No more excuses. No more waiting. The time is NOW.',
        'Success isn\'t given—it\'s taken. By those who have the courage to step up when others step back. By those who see obstacles as opportunities and challenges as fuel. You have what it takes. You\'ve always had it. Now it\'s time to unleash it and show the world what real power looks like. Are you ready to rise?',
        'History remembers the bold. The ones who dared to be different, who refused to follow the crowd, who had the guts to forge their own path. This is your defining moment. The choice is yours: blend in with the masses or stand out as a leader. We know which one you\'ll choose. Let\'s make it happen.',
      ],
      ctas: ['Claim Your Victory', 'Rise to the Top', 'Unleash Greatness'],
    },
  },
};

const HASHTAG_TEMPLATES = {
  professional: ['#Innovation', '#Excellence', '#Leadership', '#Success'],
  friendly: ['#Community', '#Together', '#Awesome', '#LoveIt'],
  bold: ['#GameChanger', '#Unstoppable', '#NoLimits', '#Victory'],
};

export function generateCopyVariants(
  brief: string,
  tone: Tone,
  length: Length
): CopyVariant[] {
  const templates = TEMPLATES[tone][length];
  const hashtags = HASHTAG_TEMPLATES[tone];

  // Generate 3 variants
  return templates.headlines.map((headline, index) => ({
    headline,
    body: templates.bodies[index],
    cta: templates.ctas[index],
    hashtags: hashtags.slice(0, 3).join(' '),
  }));
}
