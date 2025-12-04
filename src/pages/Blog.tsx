import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import ficusPlant from "@/assets/ficus-plant.jpg";
import gardenFlowers from "@/assets/garden-flowers.jpg";
import plantPot from "@/assets/plant-pot.jpg";
import womanPlant from "@/assets/woman-plant.jpg";
import hangingPlants from "@/assets/hanging-plants.jpg";
import bluePot from "@/assets/blue-pot.jpg";

export const blogPosts = [
  {
    id: 1,
    title: "10 Best Indoor Plants for Dubai Climate",
    excerpt: "Discover the perfect plants that thrive in UAE's unique weather conditions and add greenery to your home.",
    content: `Indoor plants can transform your Dubai home into a lush oasis, but choosing the right ones is crucial for success in the UAE's unique climate.

**1. Snake Plant (Sansevieria)**
The ultimate low-maintenance plant, snake plants thrive in Dubai's air-conditioned interiors and tolerate low light conditions.

**2. Pothos**
This trailing beauty is perfect for shelves and hangers, requiring minimal water and adapting well to various light conditions.

**3. ZZ Plant**
Extremely drought-tolerant, the ZZ plant is ideal for those who travel frequently or forget to water.

**4. Peace Lily**
Adds elegance while purifying air. Keep away from direct sunlight and water when soil is dry.

**5. Rubber Plant**
A striking addition that loves bright, indirect light and occasional misting.

**6. Monstera Deliciosa**
The Instagram favorite that thrives in humid conditions - perfect for Dubai bathrooms.

**7. Spider Plant**
Easy to propagate and maintain, spider plants are great for beginners.

**8. Aloe Vera**
Practical and beautiful, aloe vera loves the warmth and requires minimal watering.

**9. Dracaena**
Various species available, all tolerant of low light and irregular watering.

**10. Ficus Benjamina**
A classic choice that adds a tree-like presence to any room.

Remember to consider your home's specific conditions - light levels, humidity, and temperature fluctuations from AC use - when selecting your plants.`,
    image: ficusPlant,
    author: "Green Grass Team",
    date: "Nov 28, 2024",
    category: "Plant Care"
  },
  {
    id: 2,
    title: "How to Choose the Right Pot for Your Plant",
    excerpt: "Learn about drainage, materials, and sizing to ensure your plants have the perfect home.",
    content: `Selecting the right pot is just as important as choosing the right plant. Here's your comprehensive guide to pot selection.

**Material Matters**

*Terracotta*
- Porous, allows soil to breathe
- Great for plants that prefer dry conditions
- Can dry out quickly in Dubai's heat

*Ceramic*
- Beautiful and decorative
- Retains moisture well
- Heavier, more stable

*Plastic*
- Lightweight and affordable
- Retains moisture
- Good for humidity-loving plants

*Fiber/Composite*
- Durable and lightweight
- Weather-resistant
- Great for outdoor use

**Size Guidelines**
- Repot to a container 1-2 inches larger than current pot
- Too large a pot can lead to overwatering issues
- Small pots may restrict growth

**Drainage is Essential**
Always choose pots with drainage holes. Standing water leads to root rot, the #1 killer of houseplants.

**Style Tips**
- Match pot style to your interior design
- Consider plant color and texture
- Group pots of varying heights for visual interest

Visit our store to explore our extensive collection of pots in various materials, sizes, and styles.`,
    image: gardenFlowers,
    author: "Sarah Ahmed",
    date: "Nov 25, 2024",
    category: "Tips & Tricks"
  },
  {
    id: 3,
    title: "Creating a Balcony Garden in Your Apartment",
    excerpt: "Transform your small balcony into a lush green oasis with our expert tips and product recommendations.",
    content: `Living in a Dubai apartment doesn't mean you can't enjoy gardening. Here's how to create a stunning balcony garden.

**Assess Your Space**
- Measure your balcony dimensions
- Note sun exposure (morning vs afternoon sun)
- Consider wind exposure
- Check building regulations

**Choose the Right Plants**
For sunny balconies:
- Bougainvillea
- Lantana
- Herbs (rosemary, basil, mint)
- Succulents

For shaded balconies:
- Ferns
- Peace lilies
- Pothos
- Snake plants

**Vertical Gardening**
Maximize space with:
- Wall-mounted planters
- Hanging baskets
- Trellis systems
- Tiered plant stands

**Container Selection**
- Use lightweight containers
- Ensure adequate drainage
- Consider self-watering options
- Match containers to your style

**Maintenance Tips**
- Water early morning or evening
- Use mulch to retain moisture
- Feed plants regularly
- Protect from afternoon sun in summer

**Create Ambiance**
- Add outdoor lighting
- Include a small water feature
- Place a comfortable chair
- Use decorative pebbles

Transform your balcony into your personal green retreat today!`,
    image: plantPot,
    author: "Mohammed Ali",
    date: "Nov 22, 2024",
    category: "Inspiration"
  },
  {
    id: 4,
    title: "Plant Care During Dubai Summer",
    excerpt: "Essential tips to keep your plants alive and thriving during the hot summer months.",
    content: `Dubai summers can be brutal for plants. Here's how to protect your green friends during the hottest months.

**Watering Strategy**
- Water early morning (before 7 AM) or evening (after 6 PM)
- Never water in midday heat
- Increase frequency but not amount
- Check soil moisture regularly

**Shade Protection**
- Move sensitive plants away from direct afternoon sun
- Use shade cloth for outdoor plants
- Keep indoor plants away from hot windows
- Consider UV-filtering window films

**Humidity Management**
- Group plants together
- Use pebble trays with water
- Mist tropical plants regularly
- Consider a humidifier

**Soil Care**
- Add mulch to retain moisture
- Check for salt buildup from hard water
- Flush soil monthly
- Use well-draining potting mix

**Signs of Heat Stress**
- Wilting despite wet soil
- Brown leaf edges
- Leaf drop
- Faded colors

**Recovery Tips**
- Move affected plants to shade immediately
- Don't over-water stressed plants
- Trim damaged leaves
- Be patient - recovery takes time

Your plants can survive and even thrive during Dubai summer with proper care!`,
    image: womanPlant,
    author: "Green Grass Team",
    date: "Nov 18, 2024",
    category: "Plant Care"
  },
  {
    id: 5,
    title: "Trending: Hanging Plants for Modern Homes",
    excerpt: "Explore the latest trends in hanging plants and how to incorporate them into your interior design.",
    content: `Hanging plants are having a major moment in interior design. Here's everything you need to know about this trending style.

**Why Hanging Plants?**
- Save floor space
- Add visual interest at eye level
- Create natural room dividers
- Perfect for small apartments

**Best Plants for Hanging**
*Trailing Plants*
- String of Pearls
- Pothos varieties
- Philodendron Brasil
- String of Hearts

*Cascading Beauties*
- Boston Fern
- Spider Plant
- English Ivy
- Lipstick Plant

**Placement Ideas**
- Corners near windows
- Above kitchen sinks
- Bathroom windows
- Bedroom corners
- Living room focal points

**Hanger Styles**
- Macramé hangers (boho style)
- Minimalist metal hooks
- Ceiling-mounted systems
- Wall-mounted brackets
- Geometric holders

**Care Tips**
- Use lightweight pots
- Choose pots with attached saucers
- Water carefully to avoid drips
- Rotate for even growth
- Consider water indicators

**Safety Considerations**
- Check ceiling/wall weight capacity
- Use secure mounting hardware
- Keep away from high traffic areas
- Consider pet accessibility

Elevate your space literally with beautiful hanging plants!`,
    image: hangingPlants,
    author: "Sarah Ahmed",
    date: "Nov 15, 2024",
    category: "Inspiration"
  },
  {
    id: 6,
    title: "Gift Ideas: Plants for Every Occasion",
    excerpt: "From housewarmings to birthdays, discover the perfect plant gift for any celebration.",
    content: `Plants make wonderful gifts that keep giving. Here's your guide to choosing the perfect plant for every occasion.

**Housewarming**
- Snake Plant (for luck and protection)
- Money Tree (prosperity)
- Peace Lily (elegance)
- Potted herbs (practical and fragrant)

**Birthday**
- Flowering plants matching their birth month
- Orchids (luxury)
- Colorful planters with succulents
- Air plants (unique and low-maintenance)

**Wedding/Anniversary**
- Romantic roses in pots
- Heart-shaped Hoya
- Matching pair of plants
- Elegant orchid arrangement

**Get Well Soon**
- Lavender (calming)
- Aloe Vera (healing)
- Peace Lily (air purifying)
- Low-maintenance succulents

**Thank You**
- Flowering kalanchoe
- Beautiful planter with herbs
- Decorative terrarium
- Gift card for plant shopping

**Corporate Gifts**
- Branded planters
- Low-maintenance options
- Desk-friendly sizes
- Gift sets with care instructions

**Presentation Tips**
- Choose decorative pots
- Include care instructions
- Add a handwritten note
- Consider gift wrapping

Make your gift memorable and lasting with plants from Green Grass!`,
    image: bluePot,
    author: "Mohammed Ali",
    date: "Nov 10, 2024",
    category: "Gift Guide"
  }
];

const categories = ["All", "Plant Care", "Tips & Tricks", "Inspiration", "Gift Guide"];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#2d5a3d] to-[#1a3d28] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-serif font-bold mb-4"
            >
              Our Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 max-w-2xl mx-auto text-lg"
            >
              Tips, inspiration, and guides for plant lovers
            </motion.p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === "All" 
                    ? "bg-[#2d5a3d] text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100"
              >
                <Link to={`/blog/${post.id}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#2d5a3d] text-white text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#2d5a3d] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="text-sm font-medium text-[#2d5a3d] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
