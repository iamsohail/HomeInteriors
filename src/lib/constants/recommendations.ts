export interface RecommendationData {
  category: string;
  options: {
    tier: "Budget" | "Mid-range" | "Premium";
    vendor: string;
    product: string;
    priceRange: string;
    priceMin: number;
    priceMax: number;
    pros: string[];
    cons: string[];
  }[];
  tips: string[];
  gotchas: string[];
}

export const BANGALORE_RECOMMENDATIONS: RecommendationData[] = [
  {
    category: "Kitchen",
    options: [
      {
        tier: "Budget",
        vendor: "Local carpenter + Hettich hardware",
        product: "Custom plywood kitchen with laminate finish",
        priceRange: "₹1.5L – ₹2.5L",
        priceMin: 150000,
        priceMax: 250000,
        pros: ["Cheapest", "Fully customizable", "Quick turnaround"],
        cons: ["Quality varies", "No warranty", "Finish not as refined"],
      },
      {
        tier: "Mid-range",
        vendor: "IKEA Bangalore (Nagasandra)",
        product: "METOD modular kitchen + RINGHULT/BODARP doors",
        priceRange: "₹3L – ₹5L",
        priceMin: 300000,
        priceMax: 500000,
        pros: ["Reliable quality", "No-cost EMI", "Easy to reconfigure", "Self-assembly saves labor"],
        cons: ["Limited sizes", "Assembly needed", "Delivery time 2-4 weeks"],
      },
      {
        tier: "Premium",
        vendor: "Livspace / HomeLane",
        product: "Full modular kitchen with design consultation",
        priceRange: "₹5L – ₹10L",
        priceMin: 500000,
        priceMax: 1000000,
        pros: ["End-to-end design", "Premium finishes", "10-year warranty", "Installation included"],
        cons: ["Expensive", "Long lead time", "Less flexibility post-design"],
      },
    ],
    tips: [
      "Always get a 3D render before finalizing",
      "Check if chimney/hob cutouts are included in the quote",
      "IKEA METOD frames are 80cm height — check if 60cm or 80cm fits your slab height",
    ],
    gotchas: [
      "IKEA delivery to apartments can take 2+ weeks during peak season",
      "Local carpenters may not include hardware cost in quote",
      "Livspace/HomeLane quotes often balloon 20-30% from initial estimate",
    ],
  },
  {
    category: "Electrical",
    options: [
      {
        tier: "Budget",
        vendor: "Local electrician + Anchor/Havells",
        product: "Standard switches, wiring, MCBs",
        priceRange: "₹30K – ₹60K",
        priceMin: 30000,
        priceMax: 60000,
        pros: ["Affordable", "Easy to find spares"],
        cons: ["Basic aesthetics", "Manual supervision needed"],
      },
      {
        tier: "Mid-range",
        vendor: "Legrand / Schneider authorized dealer",
        product: "Modular switches, concealed wiring, LED panels",
        priceRange: "₹60K – ₹1.2L",
        priceMin: 60000,
        priceMax: 120000,
        pros: ["Better finish", "Warranty", "Good switch feel"],
        cons: ["Higher cost per point"],
      },
      {
        tier: "Premium",
        vendor: "Smart home + Legrand Arteor / Crabtree",
        product: "Smart switches, scene controllers, automated lighting",
        priceRange: "₹1.2L – ₹3L",
        priceMin: 120000,
        priceMax: 300000,
        pros: ["App control", "Scenes", "Energy saving", "Premium feel"],
        cons: ["Very expensive", "Needs Wi-Fi", "Complex setup"],
      },
    ],
    tips: [
      "Plan extra switch points now — adding later means breaking walls",
      "Keep 5A sockets for lights, 15A for AC/geyser",
      "Add USB charging points in bedrooms and kitchen",
    ],
    gotchas: [
      "IKEA TRADFRI smart lights need DIRIGERA hub separately",
      "Don't forget to plan for CCTV and intercom wiring",
    ],
  },
  {
    category: "Painting",
    options: [
      {
        tier: "Budget",
        vendor: "Local painter + Asian Paints Tractor",
        product: "Tractor Emulsion (interior) + Apex (exterior areas)",
        priceRange: "₹40K – ₹70K",
        priceMin: 40000,
        priceMax: 70000,
        pros: ["Cheapest", "Wide color range"],
        cons: ["Basic finish", "Not washable", "Fades faster"],
      },
      {
        tier: "Mid-range",
        vendor: "Asian Paints / Berger authorized",
        product: "Royale Matt / Berger Silk Luxury",
        priceRange: "₹70K – ₹1.2L",
        priceMin: 70000,
        priceMax: 120000,
        pros: ["Washable", "Low VOC", "Smooth finish", "10-year durability"],
        cons: ["Higher material cost"],
      },
      {
        tier: "Premium",
        vendor: "Asian Paints Royale Play / Texture",
        product: "Textured walls, accent walls, stencil work",
        priceRange: "₹1L – ₹2L",
        priceMin: 100000,
        priceMax: 200000,
        pros: ["Stunning look", "Unique textures", "Premium feel"],
        cons: ["Expensive per sqft", "Hard to repaint/touch up"],
      },
    ],
    tips: [
      "2 coats putty + 1 primer + 2 paint coats is standard",
      "Use Asian Paints Safe Painting Service for warranty",
      "Get paint quantity calculated at the store — saves 10-15%",
    ],
    gotchas: [
      "Painter may underquote and add material costs later",
      "Dark accent walls need 3-4 coats minimum",
      "Ensure ceiling paint is separate from wall paint",
    ],
  },
  {
    category: "Flooring",
    options: [
      {
        tier: "Budget",
        vendor: "Kajaria / Somany dealer",
        product: "Vitrified tiles 2x2 / 2x4",
        priceRange: "₹40K – ₹80K",
        priceMin: 40000,
        priceMax: 80000,
        pros: ["Durable", "Easy maintenance", "Huge variety"],
        cons: ["Cold underfoot", "Grout lines"],
      },
      {
        tier: "Mid-range",
        vendor: "RAK / Johnson / imported",
        product: "Large format tiles 4x2 / wood-look tiles",
        priceRange: "₹80K – ₹1.5L",
        priceMin: 80000,
        priceMax: 150000,
        pros: ["Fewer grout lines", "Premium look", "Wood look without maintenance"],
        cons: ["Higher laying cost", "Needs experienced tiler"],
      },
      {
        tier: "Premium",
        vendor: "Pergo / QuickStep / Italian marble",
        product: "Engineered wood / Italian marble flooring",
        priceRange: "₹1.5L – ₹4L",
        priceMin: 150000,
        priceMax: 400000,
        pros: ["Luxurious feel", "Warm underfoot", "Timeless"],
        cons: ["Expensive", "Marble needs sealing", "Wood scratches"],
      },
    ],
    tips: [
      "Buy 10% extra tiles for wastage and future repairs",
      "Large format tiles look better in open areas",
      "Check tile PEI rating — 3+ for living areas, 4+ for kitchen",
    ],
    gotchas: [
      "Laying cost for large tiles is 2x regular tiles",
      "Builder flooring may have height differences — check before overlay",
    ],
  },
  {
    category: "HVAC/AC",
    options: [
      {
        tier: "Budget",
        vendor: "Voltas / Lloyd / Blue Star",
        product: "1.5 ton 3-star split AC",
        priceRange: "₹30K – ₹40K per unit",
        priceMin: 30000,
        priceMax: 40000,
        pros: ["Affordable", "Decent cooling"],
        cons: ["Higher electricity bill", "Noisier"],
      },
      {
        tier: "Mid-range",
        vendor: "Daikin / Hitachi",
        product: "1.5 ton 5-star inverter split AC",
        priceRange: "₹45K – ₹65K per unit",
        priceMin: 45000,
        priceMax: 65000,
        pros: ["Energy efficient", "Quiet", "Longer compressor life"],
        cons: ["Higher upfront cost"],
      },
      {
        tier: "Premium",
        vendor: "Daikin / Mitsubishi",
        product: "1.5 ton inverter with air purifier / Wi-Fi",
        priceRange: "₹65K – ₹1L per unit",
        priceMin: 65000,
        priceMax: 100000,
        pros: ["Lowest bills", "Smart features", "Best air quality"],
        cons: ["Expensive", "Overkill for Bangalore weather"],
      },
    ],
    tips: [
      "Bangalore barely needs AC 6 months — 3-star may suffice",
      "Get copper piping done during electrical phase to hide it in walls",
      "Keep outdoor units accessible for maintenance",
    ],
    gotchas: [
      "Society may have restrictions on outdoor unit placement",
      "Don't skip drain line for indoor unit — causes water damage",
    ],
  },
  {
    category: "Furniture",
    options: [
      {
        tier: "Budget",
        vendor: "Pepperfry / Urban Ladder / IKEA",
        product: "Ready-made furniture",
        priceRange: "₹1L – ₹2L (basic set)",
        priceMin: 100000,
        priceMax: 200000,
        pros: ["Immediate delivery", "Easy returns", "No waiting"],
        cons: ["Standard sizes", "May not fit perfectly"],
      },
      {
        tier: "Mid-range",
        vendor: "Local carpenter + plywood",
        product: "Custom furniture (wardrobe, TV unit, shoe rack)",
        priceRange: "₹2L – ₹4L",
        priceMin: 200000,
        priceMax: 400000,
        pros: ["Perfect fit", "Custom design", "Good materials"],
        cons: ["Takes 3-6 weeks", "Quality depends on carpenter"],
      },
      {
        tier: "Premium",
        vendor: "HomeLane / Livspace / boutique studios",
        product: "Designer furniture with premium materials",
        priceRange: "₹4L – ₹8L",
        priceMin: 400000,
        priceMax: 800000,
        pros: ["Premium quality", "Professional design", "Warranty"],
        cons: ["Expensive", "Long lead times"],
      },
    ],
    tips: [
      "Measure door width before ordering large furniture",
      "IKEA PAX wardrobes are great value for bedrooms",
      "Check sofa dimensions against your elevator — Bangalore lifts are tiny",
    ],
    gotchas: [
      "Pepperfry/Urban Ladder assembly quality is hit-or-miss",
      "Carpenter quotes often exclude hardware/handles",
    ],
  },
  {
    category: "Curtains/Blinds",
    options: [
      {
        tier: "Budget",
        vendor: "D'Decor / local tailor + Chickpet fabric market",
        product: "Basic curtains with rod",
        priceRange: "₹20K – ₹40K",
        priceMin: 20000,
        priceMax: 40000,
        pros: ["Cheapest", "Good fabric variety at Chickpet"],
        cons: ["Basic rods", "DIY measuring"],
      },
      {
        tier: "Mid-range",
        vendor: "IKEA / Curtain Studio",
        product: "IKEA curtains + tracks or motorized blinds",
        priceRange: "₹40K – ₹80K",
        priceMin: 40000,
        priceMax: 80000,
        pros: ["Good quality", "Nice tracks", "Blackout options"],
        cons: ["Limited IKEA fabric styles"],
      },
      {
        tier: "Premium",
        vendor: "Window Magic / Hunter Douglas",
        product: "Motorized roller blinds + sheer curtains",
        priceRange: "₹80K – ₹1.5L",
        priceMin: 80000,
        priceMax: 150000,
        pros: ["Motorized", "Clean look", "Excellent light control"],
        cons: ["Expensive", "Needs electrician for wiring"],
      },
    ],
    tips: [
      "Blackout curtains for bedrooms, sheers for living room",
      "Measure ceiling to floor, not window to floor",
      "Curtain rod should extend 15-20cm beyond window on each side",
    ],
    gotchas: [
      "Chickpet closes early on Sundays",
      "Motorized blinds need power points near window — plan during electrical phase",
    ],
  },
  {
    category: "Appliances",
    options: [
      {
        tier: "Budget",
        vendor: "Flipkart / Amazon",
        product: "LG/Samsung basic models",
        priceRange: "₹80K – ₹1.2L (full set)",
        priceMin: 80000,
        priceMax: 120000,
        pros: ["Online deals", "Easy delivery"],
        cons: ["Basic features"],
      },
      {
        tier: "Mid-range",
        vendor: "Croma / Reliance Digital",
        product: "Samsung/LG/Bosch mid-range",
        priceRange: "₹1.2L – ₹2L",
        priceMin: 120000,
        priceMax: 200000,
        pros: ["Touch and try", "Extended warranty", "Installation support"],
        cons: ["Higher price than online"],
      },
      {
        tier: "Premium",
        vendor: "Bosch / Miele / Samsung Bespoke",
        product: "Premium appliances with smart features",
        priceRange: "₹2L – ₹4L",
        priceMin: 200000,
        priceMax: 400000,
        pros: ["Quiet", "Energy efficient", "Longer life", "Smart features"],
        cons: ["Very expensive", "Repairs costly"],
      },
    ],
    tips: [
      "Buy during sale seasons (Diwali, Republic Day) for 20-30% off",
      "Water purifier: Kent/Livpure RO+UV for Bangalore water",
      "Get a voltage stabilizer for AC and refrigerator",
    ],
    gotchas: [
      "Front-load washers need a drain point — check with plumber",
      "Built-in microwave needs specific cabinet dimensions",
    ],
  },
];
