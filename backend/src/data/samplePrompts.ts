export interface SamplePrompt {
  title: string;
  content: string;
  complexity: number;
  tags: string[];
}

export const samplePrompts: SamplePrompt[] = [
  {
    title: 'Neon Street Samurai',
    content:
      'Create a cinematic portrait of a cyberpunk street samurai standing in the rain, illuminated by neon signs, with dramatic rim lighting and reflections on wet pavement.',
    complexity: 8,
    tags: ['cyberpunk', 'portrait', 'rain']
  },
  {
    title: 'Minimal Product Shot',
    content:
      'Generate a clean studio product image for a premium ceramic mug on a soft beige backdrop with subtle shadowing, elegant composition, and natural light.',
    complexity: 4,
    tags: ['product', 'minimal', 'studio']
  },
  {
    title: 'Floating Mountain Temple',
    content:
      'Design an epic fantasy landscape showing a floating mountain temple above a sea of clouds at sunrise, with ancient stone bridges, glowing runes, and atmospheric depth.',
    complexity: 9,
    tags: ['fantasy', 'landscape', 'sunrise']
  },
  {
    title: 'Retro Travel Poster',
    content:
      'Illustrate a retro travel poster for a coastal city with warm sunset colors, bold shapes, vintage typography, and a nostalgic mid-century style.',
    complexity: 6,
    tags: ['retro', 'poster', 'illustration']
  },
  {
    title: 'Astronaut Tea Ceremony',
    content:
      'Create a surreal scene of an astronaut performing a tea ceremony inside a glass dome on Mars, with red dust, soft lantern light, and reflective metallic details.',
    complexity: 7,
    tags: ['surreal', 'space', 'ceremony']
  },
  {
    title: 'Botanical Notebook Spread',
    content:
      'Design a flat-lay editorial image of a botanical notebook spread with pressed flowers, ink sketches, a fountain pen, and warm morning light.',
    complexity: 5,
    tags: ['editorial', 'botanical', 'flatlay']
  },
  {
    title: 'Underwater Library',
    content:
      'Illustrate an underwater library with towering bookshelves, floating paper lanterns, schools of fish, and beams of light cutting through the water.',
    complexity: 8,
    tags: ['fantasy', 'underwater', 'library']
  },
  {
    title: 'Noir Detective Office',
    content:
      'Generate a moody noir detective office at night with venetian blinds, cigarette smoke, rain on the window, and a single desk lamp as the main light source.',
    complexity: 6,
    tags: ['noir', 'interior', 'cinematic']
  }
];