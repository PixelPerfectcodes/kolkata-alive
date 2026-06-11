export interface Location {
  id: string;
  name: string;
  bengaliName: string;
  coordinates: { lat: number; lng: number };
  category: 'literature' | 'food' | 'architecture' | 'festivals' | 'history';
  shortDescription: string;
  storyEn: string;
  storyBn: string;
  timeline: { year: string; title: string; description: string }[];
  literatureReferences: { title: string; author: string; description: string }[];
  imageUrl: string;
  gallery: string[];
  audioUrlEn: string;
  audioUrlBn: string;
  tags: string[];
}

export interface Memory {
  id: string;
  title: string;
  story: string;
  userName: string;
  userAvatar: string;
  photoUrl: string;
  audioUrl?: string;
  locationId?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface Trail {
  id: string;
  name: string;
  bengaliName: string;
  description: string;
  type: 'food' | 'tram' | 'literature' | 'durga_puja' | 'hidden_gems';
  color: string;
  locations: string[]; // List of location IDs
  pathCoordinates: { lat: number; lng: number }[];
}

export const mockLocations: Location[] = [
  {
    id: "college-street",
    name: "College Street (Boi Para)",
    bengaliName: "কলেজ স্ট্রিট",
    coordinates: { lat: 22.5744, lng: 88.3629 },
    category: "literature",
    shortDescription: "The legendary intellectual heart of Kolkata, home to the largest second-hand book market in the world and the iconic Indian Coffee House.",
    storyEn: "College Street, or 'Boi Para' (Book Town), is a unique cultural biosphere where books aren't just bought and sold; they are breathed, argued over, and preserved. Spanning a mile of absolute sensory overload, the street is lined with hundreds of tiny wooden bookstalls containing rare first-editions, classical texts, and modern novels stacked up to the ceilings. In the center of this academic universe stands the iconic Indian Coffee House, a high-ceilinged hall where generations of Nobel laureates, poets, revolutionaries, and students have gathered for 'adda' (intellectual banter) over steaming cups of infusion and mutton cutlets. To walk through College Street is to walk through two centuries of Bengal's intellectual renaissance, where every corner smells of old paper, fresh ink, and unfiltered nostalgia.",
    storyBn: "কলেজ স্ট্রিট, বা 'বই পাড়া', একটি অনন্য সাংস্কৃতিক ক্ষেত্র যেখানে বই শুধুমাত্র কেনাবেচা হয় না; এখানে বইকে ঘিরে মানুষ বাঁচে, তর্ক করে এবং ঐতিহ্যকে সংরক্ষণ করে। এক মাইলের এই এলাকা জুড়ে রয়েছে শত শত ছোট কাঠের বইয়ের দোকান, যেখানে বিরল প্রথম সংস্করণ থেকে শুরু করে আধুনিক বইয়ের এক বিশাল ভাণ্ডার ঠাসা আছে। এই বিদগ্ধ ব্রহ্মাণ্ডের কেন্দ্রে রয়েছে ঐতিহাসিক ইন্ডিয়ান কফি হাউস, যেখানে নোবেলজয়ী থেকে শুরু করে কবি, বিপ্লবী ও ছাত্রদল বহু প্রজন্ম ধরে ধোঁয়া ওঠা কফি আর কাটলেট সহযোগে জমিয়ে 'আড্ডা' দিয়েছেন। কলেজ স্ট্রিটের মধ্য দিয়ে হাঁটা মানে বাংলার দুই শতাব্দীর বুদ্ধিবৃত্তিক নবজাগরণের ইতিহাসের মধ্য দিয়ে হেঁটে যাওয়া।",
    timeline: [
      { year: "1817", title: "Foundation of Hindu College", description: "Presidency University was established as Hindu College, sparking the Bengal Renaissance." },
      { year: "1876", title: "Opening of Albert Hall", description: "The building that would later house the Indian Coffee House was opened as Albert Hall." },
      { year: "1942", title: "The Birth of the Coffee House", description: "The Coffee Board transformed Albert Hall into a public coffee house, establishing it as the hub of Bengali 'Adda'." },
      { year: "2000s", title: "World's Largest Book Bazaar", description: "Recognized internationally as the world's largest second-hand book market." }
    ],
    literatureReferences: [
      { title: "The Namesake", author: "Jhumpa Lahiri", description: "Depicts the intellectual roots of Ashoke Ganguli, who frequented the bookstalls of Boi Para." },
      { title: "Selected Poems of Sunil Gangopadhyay", author: "Sunil Gangopadhyay", description: "Evokes the passionate debates and bohemian lifestyle of the 1960s Coffee House era." },
      { title: "The Shadow Lines", author: "Amitav Ghosh", description: "Reflects on the complex post-colonial identities formed in Kolkata's university corridors." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1000&auto=format&fit=crop", // Vintage books / library
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop"
    ],
    audioUrlEn: "/assets/samples/college_street_en.mp3",
    audioUrlBn: "/assets/samples/college_street_bn.mp3",
    tags: ["Boi Para", "Indian Coffee House", "Bengal Renaissance", "Adda", "Presidency College"]
  },
  {
    id: "victoria-memorial",
    name: "Victoria Memorial Hall",
    bengaliName: "ভিক্টোরিয়া মেমোরিয়াল",
    coordinates: { lat: 22.5448, lng: 88.3426 },
    category: "architecture",
    shortDescription: "A magnificent white Makrana marble monument, blending Indo-Saracenic and British architecture, dedicated to the memory of Queen Victoria.",
    storyEn: "Surrounded by 64 acres of lush gardens and reflective pools, the Victoria Memorial is Kolkata's most dramatic architectural masterpiece. Built between 1906 and 1921 using the same white Makrana marble as the Taj Mahal, its design is an ornate blend of classical European architecture with Mughal and Deccani domes. Atop the central dome stands the rotating bronze 'Angel of Victory,' which catches the first light of the Kolkata dawn. The museum inside contains rare colonial treasures, treaties, and paintings, while the vast green grounds act as a sanctuary where lovers walk, families gather, and children play. When illuminated at twilight, the monument glows with an ethereal, pearlescent white, casting a long, cinematic shadow across the Maidan, symbolizing a bridge between the imperial past and the modern Bengali soul.",
    storyBn: "ভিক্টোরিয়া মেমোরিয়াল হল কলকাতার একটি অন্যতম দৃশ্যমান স্থাপত্যকীর্তি। ১৯০৬ থেকে ১৯২১ সালের মধ্যে তাজমহলের মতো একই মাকরানা মার্বেল দিয়ে তৈরি এই স্মৃতিসৌধটি ইন্দো-সারাসেনিক ও ব্রিটিশ রাজকীয় স্থাপত্যের এক দুর্দান্ত মেলবন্ধন। এর মাথায় ঘূর্ণায়মান ব্রোঞ্জের 'বিজয়ের দেবদূত' (Angel of Victory) কলকাতার ভোরের আলোয় জ্বলজ্বল করে ওঠে। এর বিশাল সবুজ চত্বর আজ কলকাতার মানুষের কাছে এক শান্তির আশ্রয়স্থল।",
    timeline: [
      { year: "1901", title: "Death of Queen Victoria", description: "Lord Curzon proposed the construction of a grand memorial museum." },
      { year: "1906", title: "Foundation Stone Laid", description: "The Prince of Wales (later King George V) laid the foundation stone." },
      { year: "1921", title: "Grand Opening", description: "Opened to the public, instantly becoming the prime landmark of Calcutta." },
      { year: "2015", title: "Smart Heritage Project", description: "Introduction of modern visual projections and digital conservation archives." }
    ],
    literatureReferences: [
      { title: "Calcutta: Two Years in the City", author: "Amit Chaudhuri", description: "An elegant memoir capturing the emotional and aesthetic weight of colonial monuments on contemporary residents." },
      { title: "The Calcutta Chromosome", author: "Amitav Ghosh", description: "Blends historical research with sci-fi mystery, highlighting the secrets hidden in Calcutta's historic structures." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=1000&auto=format&fit=crop", // Victoria Memorial
    gallery: [
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop"
    ],
    audioUrlEn: "/assets/samples/victoria_en.mp3",
    audioUrlBn: "/assets/samples/victoria_bn.mp3",
    tags: ["White Marble", "Colonial History", "Maidan", "Indo-Saracenic", "Angel of Victory"]
  },
  {
    id: "kumartuli",
    name: "Kumartuli (Clay Artisans' Quarter)",
    bengaliName: "কুমারটুলি",
    coordinates: { lat: 22.6015, lng: 88.3619 },
    category: "festivals",
    shortDescription: "A centuries-old traditional potters' quarter in Northern Kolkata where generations of sculptors clay-craft beautiful idols of Goddess Durga.",
    storyEn: "Kumartuli is a maze of narrow, dark alleys in North Kolkata, filled with the aroma of wet Hooghly river clay, straw, and drying wood. Here, for over 250 years, families of traditional sculptors have painstakingly breathed life into straw-and-mud frameworks to create the magnificent, high-art idols of Goddess Durga and other deities. The process is a spiritual and artistic ritual: clay is gathered from the banks of the Ganges and mixed with organic binders, while the final, magical touch—the 'Chokkhudaan' (painting of the Goddess's eyes)—is performed by master craftsmen in absolute silence. As the autumn breeze (Shiuli-hawai) begins to blow, these narrow alleys buzz with intense creative energy, serving as the birthplace of the massive Durga Puja carnival, which has been recognized as a UNESCO Intangible Cultural Heritage.",
    storyBn: "কুমারটুলি উত্তর কলকাতার একটি শতাব্দী প্রাচীন ঐতিহ্যবাহী এলাকা যেখানে মাটি দিয়ে দেবদেবীর প্রতিমা তৈরি করা হয়। ২৫০ বছরেরও বেশি সময় ধরে প্রতিমা শিল্পীদের পরিবারগুলি গঙ্গার পলিমাটি এবং খড় দিয়ে মা দুর্গার অপরূপ মূর্তি তৈরি করে চলেছেন। মহালয়ার ভোরে প্রতিমার চোখ আঁকা বা 'চক্ষুদান' এক অপরূপ আধ্যাত্মিক মুহূর্ত। শরৎকালের শুরুতে এই গলির ব্যস্ততা দেখার মতো হয়, যা ইউনেস্কো হেরিটেজ দুর্গাপূজার মূল স্পন্দন।",
    timeline: [
      { year: "1757", title: "Artisans Settle in Kumartuli", description: "East India Company allocates quarters to clay potters and weavers in North Calcutta." },
      { year: "1930s", title: "Durga Puja Goes Public", description: "Community pujas (Sarbojonin) expand, creating huge demand for artistic, custom clay idols." },
      { year: "2021", title: "UNESCO Heritage Recognition", description: "Kolkata's Durga Puja is added to the UNESCO Representative List of the Intangible Cultural Heritage of Humanity." }
    ],
    literatureReferences: [
      { title: "Chokher Bali", author: "Rabindranath Tagore", description: "Captures the atmosphere of North Kolkata mansions and traditional artisan aesthetics." },
      { title: "The Clay Goddess", author: "Sanjib Chattopadhyay", description: "A touching Bengali novel describing the life struggles, devotion, and artistic pride of Kumartuli's potters." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000&auto=format&fit=crop", // Kumartuli idol crafting
    gallery: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop"
    ],
    audioUrlEn: "/assets/samples/kumartuli_en.mp3",
    audioUrlBn: "/assets/samples/kumartuli_bn.mp3",
    tags: ["Clay Artisans", "Durga Puja", "UNESCO", "North Kolkata", "Chokkhudaan"]
  },
  {
    id: "flurys-park-street",
    name: "Flurys & Park Street",
    bengaliName: "ফ্লুরিজ ও পার্ক স্ট্রিট",
    coordinates: { lat: 22.5487, lng: 88.3533 },
    category: "food",
    shortDescription: "The iconic tea-room founded in 1927, representing Kolkata's rich Anglo-Indian heritage and the sparkling, jazzy lifestyle of Park Street.",
    storyEn: "Established in 1927 by Mr. and Mrs. J. Flury, Flurys was once the elegant meeting ground of wealthy British administrators, Bengali royalty, and international travelers. Famed for its English breakfast, rum balls, and single-origin Darjeeling tea served in porcelain pots, this legendary tea-room is a time machine that preserves the sophisticated lifestyle of early 20th-century Calcutta. Step outside and you are on Park Street, the legendary 'street that never sleeps.' During the 1960s and 70s, Park Street was the epicenter of India's live jazz and nightlife scene, where legendary performers like Usha Uthup and Pam Crain sang to packed audiences at Trincas and Mocambo. Today, it remains the ultimate culinary walk, blending vintage tearoom elegance, legendary restaurants, and brilliant lighting festivals during Christmas.",
    storyBn: "১৯২৭ সালে প্রতিষ্ঠিত ফ্লুরিজ কলকাতার অ্যাংলো-ইন্ডিয়ান খাদ্যসংস্কৃতি এবং পার্ক স্ট্রিটের জাঁকজমকপূর্ণ জীবনযাত্রার এক পরম প্রতীক। এর অনন্য রাম বল, পেস্ট্রি এবং ঐতিহ্যবাহী ইংরেজ প্রাতঃরাশ কলকাতার মানুষের কাছে অত্যন্ত আবেগপূর্ণ। আশির দশকে পার্ক স্ট্রিট ছিল ভারতের লাইভ জ্যাজ মিউজিক এবং ক্যাবারে সংস্কৃতির প্রাণকেন্দ্র। বড়দিনের সময় পার্ক স্ট্রিটের আলোকসজ্জা জগৎবিখ্যাত।",
    timeline: [
      { year: "1927", title: "Flurys Opens", description: "A classic Swiss-confectionery tea room opens at 18 Park Street." },
      { year: "1960s", title: "The Golden Era of Jazz", description: "Park Street restaurants like Trincas host live jazz revolutions, changing India's night culture." },
      { year: "2013", title: "Heritage Award Status", description: "Awarded national heritage recognitions as a historic culinary landmark of India." }
    ],
    literatureReferences: [
      { title: "Calcutta Nights", author: "Hemendra Kumar Roy", description: "A translation of a 1923 book depicting the mysterious and glamorous nightlife of Kolkata streets." },
      { title: "Midnight's Children", author: "Salman Rushdie", description: "Mentions Calcutta's high society, tea-room gatherings, and colonial remnants." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop", // Bakery / Tea Room
    gallery: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop"
    ],
    audioUrlEn: "/assets/samples/flurys_en.mp3",
    audioUrlBn: "/assets/samples/flurys_bn.mp3",
    tags: ["Anglo-Indian", "Tea Room", "Jazz", "Trincas", "Park Street", "Rum Ball"]
  },
  {
    id: "howrah-bridge",
    name: "Howrah Bridge (Rabindra Setu)",
    bengaliName: "হাওড়া ব্রিজ",
    coordinates: { lat: 22.5851, lng: 88.3468 },
    category: "history",
    shortDescription: "An engineering marvel of the world, this massive balanced cantilever bridge across the Hooghly river has become the definitive emblem of Kolkata.",
    storyEn: "Completed in 1943 during the height of World War II, the Howrah Bridge is a structural masterpiece made of 26,500 tons of high-tensile steel, held together entirely by rivets with absolutely no nuts, bolts, or supporting pillars in the river bed. Connecting the twin cities of Howrah and Kolkata, it spans 1,500 feet over the Hooghly River, carrying over 150,000 vehicles and 4 million pedestrians daily. In the early mist of dawn, the bridge appears like a massive, metallic titan floating in the sky, while the bustling flower market at its base explodes with vibrant orange marigolds and jasmine. It has been immortalized in countless classic films, from Satyajit Ray’s masterpieces to modern Bollywood blockbusters, standing as a living, metallic artery that pulses with the sheer weight of Kolkata’s daily dreams, struggles, and history.",
    storyBn: "১৯৪৩ সালে তৈরি হাওড়া ব্রিজ কোনো নাট-বল্টু ছাড়াই শুধুমাত্র রিভেটের সাহায্যে তৈরি এক অদ্ভুত প্রকৌশল বিস্ময়। হুগলি নদীর ওপর কোনো পিলারের সাহায্য ছাড়াই এটি দাঁড়িয়ে আছে এবং হাওড়া ও কলকাতা শহরের প্রধান সংযোগকারী ধমনী হিসেবে কাজ করছে। সত্যজিৎ রায়ের চলচ্চিত্র থেকে শুরু করে মৃণাল সেনের ফ্রেমে এটি বারবার ধরা পড়েছে। এই সেতুর নিচের ফুলের বাজারটি কলকাতার অন্যতম আকর্ষণ।",
    timeline: [
      { year: "1936", title: "Construction Begins", description: "Design completed by Rendel, Palmer & Tritton and built by Cleveland Bridge Co." },
      { year: "1943", title: "Silent Opening", description: "Opened quietly at midnight during WWII to avoid Japanese air-strike targeting." },
      { year: "1965", title: "Renamed Rabindra Setu", description: "Renamed in honor of Nobel Laureate Rabindranath Tagore, although popularly called Howrah Bridge." }
    ],
    literatureReferences: [
      { title: "City of Joy", author: "Dominique Lapierre", description: "Captures the human struggle, migration, and raw emotion of crossing the bridge to enter Kolkata." },
      { title: "Calcutta Diary", author: "Ashok Mitra", description: "Reflects on the political and socio-economic life blood surrounding the Howrah crossing." }
    ],
    imageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop", // Howrah Bridge
    gallery: [
      "https://images.unsplash.com/photo-1616853689405-b040bf56f2ec?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607548766155-900539c3e414?q=80&w=600&auto=format&fit=crop"
    ],
    audioUrlEn: "/assets/samples/howrah_en.mp3",
    audioUrlBn: "/assets/samples/howrah_bn.mp3",
    tags: ["Cantilever Bridge", "Hooghly River", "Flower Market", "Satyajit Ray", "Steel Giant"]
  }
];

export const mockMemories: Memory[] = [
  {
    id: "mem-1",
    title: "Catching the Last Tram in the Monsoon Rain",
    story: "It was July 1989, and the rain was falling like sheets of glass over College Street. I had just purchased a copy of Tagore's 'Gitanjali' from a small street vendor. Running through the puddles, my leather sandals slick with mud, I heard the iconic 'tring-tring' of the approaching wooden tram. Jumping onto the slowly moving steel coach, the smell of damp jute and sparks from the overhead electric wire created an unforgettable, electric smell. I sat by the window, the soft wind spraying cool river mist onto my face as we rattled towards Esplanade. That 20-paise ticket felt like a pass to heaven.",
    userName: "Soumitra Chatterjee (Community Elder)",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=600&auto=format&fit=crop", // Old tram
    likesCount: 142,
    commentsCount: 18,
    createdAt: "2026-05-10T14:30:00Z"
  },
  {
    id: "mem-2",
    title: "Adda sessions at Coffee House (1975)",
    story: "In our university days, the Coffee House was not just a cafe; it was a mini parliament. Over unlimited cups of 'Infusion' (black coffee) and shared cheap cigarettes, we argued about French New Wave cinema, Marx, Rabindrasangeet, and the local football derby between Mohun Bagan and East Bengal. The waiters in their starch-white turbans and uniforms drifted around like ghosts of the British era. We would enter at 2 PM and emerge at 8 PM, penniless but mentally richer.",
    userName: "Ananya Sen",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop", // Cafe / Adda
    likesCount: 98,
    commentsCount: 12,
    createdAt: "2026-05-15T09:15:00Z"
  },
  {
    id: "mem-3",
    title: "Birendra Krishna Bhadra's voice on Mahalaya",
    story: "Every year on Mahalaya morning at 4 AM, the entire neighborhood would wake up to the crackling sound of old radio transistors playing Birendra Krishna Bhadra chanting 'Mahishasura Mardini'. The cold autumn air, the sweet scent of Shiuli flowers falling on dew-wet grass, and that booming, emotional voice declaring the arrival of the Mother Goddess—it was pure magic. No modern sound system or digital stream can ever match the crackle of that old Valve radio.",
    userName: "Pradip Mukherjee",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=600&auto=format&fit=crop", // Vintage Radio
    likesCount: 215,
    commentsCount: 34,
    createdAt: "2026-05-20T04:00:00Z"
  }
];

export const mockTrails: Trail[] = [
  {
    id: "trail-food",
    name: "Classic Cabin & Sweet Trail",
    bengaliName: "ঐতিহাসিক কেবিন ও মিষ্টির হাঁটা পথ",
    description: "Explore Kolkata's century-old culinary secrets, from legendary 'cabins' serving mutton cutlets to iconic sweet shops.",
    type: "food",
    color: "#B93C2A",
    locations: ["flurys-park-street", "college-street"],
    pathCoordinates: [
      { lat: 22.5487, lng: 88.3533 }, // Park Street
      { lat: 22.5650, lng: 88.3550 }, // Midway Esplanade
      { lat: 22.5744, lng: 88.3629 }  // College Street
    ]
  },
  {
    id: "trail-tram",
    name: "Tram Route 36 Ride",
    bengaliName: "৩৬ নম্বর ট্রাম রুট",
    description: "Hop on the slow track through British-era Calcutta, connecting the historic Maidan to the bustling streets of North Kolkata.",
    type: "tram",
    color: "#1B4332",
    locations: ["victoria-memorial", "howrah-bridge", "college-street"],
    pathCoordinates: [
      { lat: 22.5448, lng: 88.3426 }, // Victoria
      { lat: 22.5615, lng: 88.3480 }, // Esplanade Tram depot
      { lat: 22.5744, lng: 88.3629 }, // College Street
      { lat: 22.5851, lng: 88.3468 }  // Howrah Bridge
    ]
  },
  {
    id: "trail-literature",
    name: "Renaissance Literature Walk",
    bengaliName: "নবজাগরণ সাহিত্যিক হাঁটা পথ",
    description: "Walk the paths frequented by Tagore, Bankim Chandra, and the pioneering spirits of the Bengal Renaissance.",
    type: "literature",
    color: "#C59B27",
    locations: ["college-street", "kumartuli"],
    pathCoordinates: [
      { lat: 22.5744, lng: 88.3629 }, // College Street
      { lat: 22.5890, lng: 88.3590 }, // Jorasanko (Tagore House)
      { lat: 22.6015, lng: 88.3619 }  // Kumartuli
    ]
  }
];
