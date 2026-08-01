export const mockUsers = [
  {
    _id: "60c72b2f9b1d8b2bad000001",
    name: "Alice Smith",
    email: "alice@example.com",
    location: "San Francisco, CA",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alice%20Smith",
  },
  {
    _id: "60c72b2f9b1d8b2bad000002",
    name: "Bob Jones",
    email: "bob@example.com",
    location: "Seattle, WA",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bob%20Jones",
  },
  {
    _id: "60c72b2f9b1d8b2bad000003",
    name: "Clara Davis",
    email: "clara@example.com",
    location: "Austin, TX",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Clara%20Davis",
  }
];

export const mockItems = [
  {
    _id: "60c72b2f9b1d8b2bad000011",
    title: "iPad Pro 11-inch (M1, 128GB)",
    description: "In perfect working condition. Comes with original box and USB-C charger. Looking to trade for a mirrorless camera or a decent mechanical keyboard + monitor setup.",
    category: "Electronics",
    condition: "Like New",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop"],
    owner: {
      _id: "60c72b2f9b1d8b2bad000001",
      name: "Alice Smith",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alice%20Smith",
      location: "San Francisco, CA"
    },
    status: "Available"
  },
  {
    _id: "60c72b2f9b1d8b2bad000012",
    title: "Vintage Brown Leather Bomber Jacket",
    description: "Genuine leather bomber jacket from the 90s. Soft leather, fits size L. A few minor scuffs which add to the vintage character. Looking for a warm winter coat or wool sweater.",
    category: "Fashion",
    condition: "Good",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop"],
    owner: {
      _id: "60c72b2f9b1d8b2bad000003",
      name: "Clara Davis",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Clara%20Davis",
      location: "Austin, TX"
    },
    status: "Available"
  },
  {
    _id: "60c72b2f9b1d8b2bad000013",
    title: "Fuji X-T20 Mirrorless Camera (Body Only)",
    description: "Compact mirrorless camera. Minor wear on the body, sensor is clean, and dials work perfectly. Includes two batteries and charger. Open to trades for tablets or guitar equipment.",
    category: "Electronics",
    condition: "Good",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop"],
    owner: {
      _id: "60c72b2f9b1d8b2bad000002",
      name: "Bob Jones",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bob%20Jones",
      location: "Seattle, WA"
    },
    status: "Available"
  },
  {
    _id: "60c72b2f9b1d8b2bad000014",
    title: "Chef's Knife & Wooden Cutting Board Set",
    description: "High-carbon stainless steel 8-inch chef's knife. Very sharp. The cutting board is solid maple, pre-oiled. Swapping because I received duplicates as gifts. Looking for baking pans or kitchen scales.",
    category: "Home & Kitchen",
    condition: "New",
    images: ["https://images.unsplash.com/photo-1594385208974-2e75f9d8a81a?w=600&auto=format&fit=crop"],
    owner: {
      _id: "60c72b2f9b1d8b2bad000001",
      name: "Alice Smith",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alice%20Smith",
      location: "San Francisco, CA"
    },
    status: "Available"
  },
  {
    _id: "60c72b2f9b1d8b2bad000015",
    title: "The Catcher in the Rye & 1984 Books",
    description: "Two classic novels in paperback. Standard reading wear on the covers, pages are clean without highlights. Looking for sci-fi or fantasy books.",
    category: "Books",
    condition: "Fair",
    images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop"],
    owner: {
      _id: "60c72b2f9b1d8b2bad000002",
      name: "Bob Jones",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bob%20Jones",
      location: "Seattle, WA"
    },
    status: "Available"
  },
  {
    _id: "60c72b2f9b1d8b2bad000016",
    title: "Premium Yoga Mat (5mm thick)",
    description: "Eco-friendly non-slip yoga mat. Used only a couple of times. Comes with carrying strap. Swap for dumbbells or kettlebell.",
    category: "Sports & Outdoors",
    condition: "Like New",
    images: ["https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop"],
    owner: {
      _id: "60c72b2f9b1d8b2bad000003",
      name: "Clara Davis",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Clara%20Davis",
      location: "Austin, TX"
    },
    status: "Available"
  }
];
