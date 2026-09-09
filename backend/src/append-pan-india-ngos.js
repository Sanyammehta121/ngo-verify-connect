const fs = require('node:fs');
const path = require('node:path');

const seedPath = path.join(__dirname, '..', 'data', 'real_ngos_seed.json');
const currentNgos = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const newNgos = [
  {
    id: 19,
    name: "The Banyan",
    logo: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=160&auto=format&fit=crop&q=80",
    description: "The Banyan enables mental healthcare solutions for homeless and impoverished individuals with severe mental health issues, running transit-care centers, inclusive living communities, and rural mental health clinics.",
    categories: ["Mental Health", "Women Empowerment", "Healthcare Support"],
    city: "Chennai",
    state: "Tamil Nadu",
    address: "6th Main Road, Mogappair West, Chennai - 600037",
    latitude: 13.0827,
    longitude: 80.1707,
    phone: "+91-44-26530105",
    email: "contact@thebanyan.org",
    website: "https://thebanyan.org",
    registrationNumber: "808/1993 (Registered Public Trust)",
    panNumber: "AAATT3190Q",
    status12A: "Verified",
    status80G: "Verified",
    statusFCRA: "Verified",
    fcraNumber: "075900591",
    darpanId: "TN/2010/0038190",
    verificationStatus: "Verified",
    donationLink: "https://thebanyan.org/donate/",
    donationUpi: "thebanyan@icici",
    lastVerifiedOn: "2026-08-27",
    certifications: [
      {
        "name": "Section 80G Tax Exemption",
        "issuer": "Income Tax Department, Chennai",
        "issueDate": "2021-05-19",
        "expiryDate": "2026-05-18",
        "status": "Verified"
      },
      {
        "name": "FCRA Permanent Registration",
        "issuer": "Ministry of Home Affairs",
        "issueDate": "2022-04-10",
        "expiryDate": "2027-04-09",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Dr. Saravanan Ramanathan",
        "rating": 5,
        "comment": "Pioneering mental health transit care for homeless women in Chennai. Compassion and clinical excellence at its finest.",
        "date": "2026-07-30"
      }
    ]
  },
  {
    "id": 20,
    "name": "Naandi Foundation",
    "logo": "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=160&auto=format&fit=crop&q=80",
    "description": "Naandi Foundation is one of the largest social sector organizations in India, working on sustainable agrarian livelihoods, Araku coffee regenerative agriculture, safe drinking water, and girl child education.",
    "categories": ["Livelihood", "Rural Development", "Girl Child Education", "Skill Development"],
    "city": "Hyderabad",
    "state": "Telangana",
    "address": "502, Trendset Towers, Road No. 2, Banjara Hills, Hyderabad - 500034",
    "latitude": 17.4156,
    "longitude": 78.4350,
    "phone": "+91-40-23556470",
    "email": "info@naandi.org",
    "website": "https://www.naandi.org",
    "registrationNumber": "4725/1998 (Public Charitable Trust)",
    "panNumber": "AAATN9022L",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "010230554",
    darpanId: "TS/2011/0043180",
    verificationStatus: "Verified",
    donationLink: "https://www.naandi.org/donate",
    donationUpi: "naandi@sbi",
    lastVerifiedOn: "2026-08-25",
    certifications: [
      {
        "name": "80G Certificate with Tax Deduction",
        "issuer": "Income Tax Department, Hyderabad",
        "issueDate": "2021-06-12",
        "expiryDate": "2026-06-11",
        "status": "Verified"
      },
      {
        "name": "FCRA Approved Status",
        "issuer": "Foreigners Division, MHA",
        "issueDate": "2022-09-18",
        "expiryDate": "2027-09-17",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Venkat Rao",
        "rating": 5,
        "comment": "Their Nanhi Kali partnership and Araku tribal coffee agroforestry models are celebrated globally.",
        "date": "2026-08-05"
      }
    ]
  },
  {
    "id": 21,
    "name": "Child In Need Institute (CINI)",
    "logo": "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=160&auto=format&fit=crop&q=80",
    "description": "CINI works across eastern India to enable children, adolescents, and women to realize their rights to health, nutrition, education, and protection through child-friendly community ecosystems.",
    "categories": ["Child Welfare", "Health & Nutrition", "Education", "Women Empowerment"],
    "city": "Kolkata",
    "state": "West Bengal",
    "address": "Daulatpur, P.O. Pailan, via Joka, Kolkata - 700104",
    "latitude": 22.4542,
    "longitude": 88.2915,
    "phone": "+91-33-24978192",
    "email": "cinikolkata@cinindia.org",
    "website": "https://www.cini-india.org",
    "registrationNumber": "S-14545 of 1974-75 (Societies Act)",
    "panNumber": "AAATC0911M",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "147120014",
    "darpanId": "WB/2009/0017812",
    "verificationStatus": "Verified",
    "donationLink": "https://www.cini-india.org/donate/",
    "donationUpi": "cini@pnb",
    "lastVerifiedOn": "2026-08-22",
    "certifications": [
      {
        "name": "Section 80G Tax Exemption",
        "issuer": "Income Tax Department, Kolkata",
        "issueDate": "2021-04-18",
        "expiryDate": "2026-04-17",
        "status": "Verified"
      },
      {
        "name": "12A Charitable Order",
        "issuer": "Director of Income Tax (Exemption)",
        "issueDate": "2021-04-01",
        "expiryDate": "2026-03-31",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Debabrata Mukherjee",
        "rating": 5,
        "comment": "Over 50 years of tireless service addressing infant malnutrition in West Bengal and Jharkhand.",
        "date": "2026-07-16"
      }
    ]
  },
  {
    "id": 22,
    "name": "Barefoot College (SWRC)",
    "logo": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=160&auto=format&fit=crop&q=80",
    "description": "Barefoot College demystifies technology to empower rural marginalized women as Solar Engineers ('Solar Mamas'), night school educators, and rainwater harvesters in village communities across Rajasthan.",
    "categories": ["Rural Development", "Women Empowerment", "Skill Development", "Education"],
    "city": "Jaipur",
    "state": "Rajasthan",
    "address": "Tilonia, via Madanganj, Ajmer/Jaipur, Rajasthan - 305816",
    "latitude": 26.6534,
    "longitude": 75.0441,
    "phone": "+91-145-2817202",
    "email": "contact@barefootcollege.org",
    "website": "https://www.barefootcollege.org",
    "registrationNumber": "204/1972 (Rajasthan Societies Registration Act)",
    "panNumber": "AAATS1102A",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "125410012",
    "darpanId": "RJ/2010/0035182",
    "verificationStatus": "Verified",
    "donationLink": "https://www.barefootcollege.org/donate/",
    "donationUpi": "barefoot@sbi",
    "lastVerifiedOn": "2026-08-19",
    "certifications": [
      {
        "name": "80G Exemption Approval",
        "issuer": "Income Tax Department, Jaipur",
        "issueDate": "2021-05-15",
        "expiryDate": "2026-05-14",
        "status": "Verified"
      },
      {
        "name": "FCRA Valid Clearance",
        "issuer": "Ministry of Home Affairs",
        "issueDate": "2022-07-20",
        "expiryDate": "2027-07-19",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Pooja Shekhawat",
        "rating": 5,
        "comment": "Seeing semi-literate grandmothers assemble solar circuit boards without reading text is inspiring!",
        "date": "2026-08-07"
      }
    ]
  },
  {
    "id": 23,
    "name": "Blind People's Association (BPA)",
    "logo": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=160&auto=format&fit=crop&q=80",
    "description": "BPA India is a premier comprehensive rehabilitation institute for persons with blindness and locomotor disabilities, running Braille press facilities, inclusive schooling, and computer training centers.",
    "categories": ["Disability Welfare", "Skill Development", "Healthcare Support", "Education"],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "address": "Jagdish Patel Chowk, Surdas Marg, Vastrapur, Ahmedabad - 380015",
    "latitude": 23.0338,
    "longitude": 72.5332,
    "phone": "+91-79-26305082",
    "email": "bpapromr1@bsnl.in",
    "website": "https://bpaindia.org",
    "registrationNumber": "F-140 (Bombay Public Trusts Act, Ahmedabad)",
    "panNumber": "AAATB1410P",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "041910015",
    "darpanId": "GJ/2009/0008891",
    "verificationStatus": "Verified",
    "donationLink": "https://bpaindia.org/donation/",
    "donationUpi": "bpaindia@axisbank",
    "lastVerifiedOn": "2026-08-23",
    "certifications": [
      {
        "name": "Section 80G Tax Exemption",
        "issuer": "Income Tax Department, Ahmedabad",
        "issueDate": "2021-04-30",
        "expiryDate": "2026-04-29",
        "status": "Verified"
      },
      {
        "name": "12A Charitable Exemption",
        "issuer": "Director of Income Tax",
        "issueDate": "2021-04-01",
        "expiryDate": "2026-03-31",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Dr. Hardik Patel",
        "rating": 5,
        "comment": "Exemplary vocational campus in Vastrapur providing dignified jobs and adaptive tech for visual impairment.",
        "date": "2026-07-19"
      }
    ]
  },
  {
    "id": 24,
    "name": "Mata Amritanandamayi Math (Amrita Seva)",
    "logo": "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?w=160&auto=format&fit=crop&q=80",
    "description": "Amrita Seva conducts nationwide humanitarian work through disaster relief teams, free charitable healthcare hospitals, homes for destitute women, and vocational skill centers across Kerala and India.",
    "categories": ["Disaster Relief", "Healthcare Support", "Poverty Alleviation", "Education"],
    "city": "Kochi",
    "state": "Kerala",
    "address": "Amrita Lane, Edappally, Kochi, Kerala - 682024",
    "latitude": 10.0261,
    "longitude": 76.3125,
    "phone": "+91-476-2896278",
    "email": "mam@amritapuri.org",
    "website": "https://www.amritapuri.org",
    "registrationNumber": "A-227/1981 (Travancore-Cochin Literary & Charitable Societies Act)",
    "panNumber": "AAATM0198C",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "052860012",
    "darpanId": "KL/2010/0034459",
    "verificationStatus": "Verified",
    "donationLink": "https://www.amritapuri.org/donate",
    "donationUpi": "amritaseva@federalbank",
    "lastVerifiedOn": "2026-08-26",
    "certifications": [
      {
        "name": "Section 80G Tax Order",
        "issuer": "Commissioner of Income Tax, Kochi",
        "issueDate": "2021-06-22",
        "expiryDate": "2026-06-21",
        "status": "Verified"
      },
      {
        "name": "FCRA Permanent Clearance",
        "issuer": "Ministry of Home Affairs",
        "issueDate": "2022-08-14",
        "expiryDate": "2027-08-13",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Anoop Menon",
        "rating": 5,
        "comment": "Free treatments and heart surgeries at Amrita Hospital have rescued countless underprivileged families.",
        "date": "2026-08-12"
      }
    ]
  },
  {
    "id": 25,
    "name": "Kiran Society (Kiran Village)",
    "logo": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=160&auto=format&fit=crop&q=80",
    "description": "Kiran Society operates an inclusive educational village in Varanasi for children and youth with neurological, physical, and sensory disabilities, providing orthotic aids, inclusive schooling, and organic farming skills.",
    "categories": ["Disability Welfare", "Child Welfare", "Education", "Healthcare Support"],
    "city": "Varanasi",
    "state": "Uttar Pradesh",
    "address": "Madhopur, P.O. Mirzamurad, Varanasi, Uttar Pradesh - 221307",
    "latitude": 25.2638,
    "longitude": 82.7825,
    "phone": "+91-542-2635147",
    "email": "kiran@kiranvillage.org",
    "website": "https://www.kiranvillage.org",
    "registrationNumber": "334/1990-91 (Societies Registration Act XXI)",
    "panNumber": "AAATK1910K",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "136370014",
    "darpanId": "UP/2011/0045189",
    "verificationStatus": "Verified",
    "donationLink": "https://www.kiranvillage.org/donate/",
    "donationUpi": "kiransociety@sbi",
    "lastVerifiedOn": "2026-08-15",
    "certifications": [
      {
        "name": "80G Tax Exemption",
        "issuer": "Income Tax Department, Varanasi",
        "issueDate": "2021-05-18",
        "expiryDate": "2026-05-17",
        "status": "Verified"
      },
      {
        "name": "FCRA Approved Registration",
        "issuer": "Ministry of Home Affairs",
        "issueDate": "2022-03-25",
        "expiryDate": "2027-03-24",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Shweta Tripathi",
        "rating": 5,
        "comment": "Incredible rehabilitative warmth in rural Varanasi. Children with cerebral palsy receive customized orthotics and education.",
        "date": "2026-07-27"
      }
    ]
  },
  {
    "id": 26,
    "name": "Parijat Academy",
    "logo": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=160&auto=format&fit=crop&q=80",
    "description": "Parijat Academy provides free, quality formal education, boarding, and sewing livelihood training to indigenous tribal children and dropouts from the Pamohi tribal belt on the outskirts of Guwahati.",
    "categories": ["Education", "Tribal Welfare", "Child Welfare"],
    "city": "Guwahati",
    "state": "Assam",
    "address": "Pamohi, Garchuk, Guwahati, Assam - 781035",
    "latitude": 26.1158,
    "longitude": 91.6825,
    "phone": "+91-9864041711",
    "email": "parijatacademy03@gmail.com",
    "website": "https://parijatacademy.org",
    "registrationNumber": "RS/KAM/240/A-1/321 of 2004-05",
    "panNumber": "AAATP8912C",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "021750032",
    "darpanId": "AS/2014/0078129",
    "verificationStatus": "Verified",
    "donationLink": "https://parijatacademy.org/donate/",
    "donationUpi": "parijatacademy@pnb",
    "lastVerifiedOn": "2026-08-18",
    "certifications": [
      {
        "name": "Section 80G Tax Exemption",
        "issuer": "Income Tax Department, Guwahati",
        "issueDate": "2021-07-15",
        "expiryDate": "2026-07-14",
        "status": "Verified"
      },
      {
        "name": "12A Charitable Exemption",
        "issuer": "Director of Income Tax (E)",
        "issueDate": "2021-04-10",
        "expiryDate": "2026-04-09",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Pranjal Barua",
        "rating": 5,
        "comment": "Started with 4 children in a cow shed, now educating hundreds of tribal children for free. Pure grassroots devotion.",
        "date": "2026-08-02"
      }
    ]
  },
  {
    "id": 27,
    "name": "Nidan",
    "logo": "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=160&auto=format&fit=crop&q=80",
    "description": "Nidan organizes informal sector workers, street vendors, waste pickers, and agricultural laborers across Bihar, building self-sustaining community cooperatives, child day-care, and health insurance umbrellas.",
    "categories": ["Poverty Alleviation", "Livelihood", "Child Welfare", "Women Empowerment"],
    "city": "Patna",
    "state": "Bihar",
    "address": "D-208, Anand Vihar, West Boring Canal Road, Patna - 800001",
    "latitude": 25.6148,
    "longitude": 85.1215,
    "phone": "+91-612-2557404",
    "email": "nidan@nidan.in",
    "website": "https://nidan.in",
    "registrationNumber": "588 of 1996 (Societies Registration Act XXI)",
    "panNumber": "AAATN1019D",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "031170241",
    "darpanId": "BR/2010/0035112",
    "verificationStatus": "Verified",
    "donationLink": "https://nidan.in/donate/",
    "donationUpi": "nidan@hdfcbank",
    "lastVerifiedOn": "2026-08-13",
    "certifications": [
      {
        "name": "Section 80G Tax Exemption",
        "issuer": "Income Tax Department, Patna",
        "issueDate": "2021-06-10",
        "expiryDate": "2026-06-09",
        "status": "Verified"
      },
      {
        "name": "FCRA Approved Registration",
        "issuer": "Ministry of Home Affairs",
        "issueDate": "2022-04-18",
        "expiryDate": "2027-04-17",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Anand Mohan Prasad",
        "rating": 5,
        "comment": "Crucial advocacy organizing street vendors and waste collectors into dignified micro-enterprises in Patna.",
        "date": "2026-07-24"
      }
    ]
  },
  {
    "id": 28,
    "name": "Ruchika Social Service Organisation",
    "logo": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=160&auto=format&fit=crop&q=80",
    "description": "Ruchika Social Service Organisation pioneered the Railway Platform Schools in Odisha, educating runaway and underprivileged children living on train platforms and city slums.",
    "categories": ["Child Welfare", "Education", "Disaster Relief"],
    "city": "Bhubaneswar",
    "state": "Odisha",
    "address": "3731/A, Sriram Nagar, Old Town, Bhubaneswar - 751002",
    "latitude": 20.2458,
    "longitude": 85.8344,
    "phone": "+91-674-2340583",
    "email": "rssobbsr@gmail.com",
    "website": "https://ruchika.org",
    "registrationNumber": "18195/25 of 1985 (Societies Act XXI)",
    "panNumber": "AAATR9811J",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "104830022",
    "darpanId": "OR/2010/0033190",
    "verificationStatus": "Verified",
    "donationLink": "https://ruchika.org/donate/",
    "donationUpi": "ruchika@sbi",
    "lastVerifiedOn": "2026-08-17",
    "certifications": [
      {
        "name": "Section 80G Approval",
        "issuer": "Income Tax Department, Bhubaneswar",
        "issueDate": "2021-05-20",
        "expiryDate": "2026-05-19",
        "status": "Verified"
      },
      {
        "name": "FCRA Permanent Clearance",
        "issuer": "Ministry of Home Affairs",
        "issueDate": "2022-06-12",
        "expiryDate": "2027-06-11",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Subhashree Jena",
        "rating": 5,
        "comment": "Their platform schools gave thousands of destitute children on railway tracks a real childhood and future.",
        "date": "2026-08-01"
      }
    ]
  },
  {
    "id": 29,
    "name": "All India Pingalwara Charitable Society",
    "logo": "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=160&auto=format&fit=crop&q=80",
    "description": "Founded by Bhagat Puran Singh in 1947, Pingalwara provides completely free shelter, medical treatment, hospice care, and special schools to thousands of abandoned, paralyzed, psychiatric, and dying destitute persons in Punjab.",
    "categories": ["Elderly Care", "Disability Welfare", "Healthcare Support", "Poverty Alleviation"],
    "city": "Amritsar",
    "state": "Punjab",
    "address": "GT Road, Near Bus Stand, Amritsar, Punjab - 143001",
    "latitude": 31.6258,
    "longitude": 74.8825,
    "phone": "+91-183-2584586",
    "email": "pingal@pingalwara.org",
    "website": "https://pingalwara.org",
    "registrationNumber": "337 of 1957 (Societies Registration Act XXI)",
    "panNumber": "AAATA0819R",
    "status12A": "Verified",
    "status80G": "Verified",
    "statusFCRA": "Verified",
    "fcraNumber": "115120014",
    "darpanId": "PB/2011/0046199",
    "verificationStatus": "Verified",
    "donationLink": "https://pingalwara.org/donate-now/",
    "donationUpi": "pingalwara@pnb",
    "lastVerifiedOn": "2026-08-20",
    "certifications": [
      {
        "name": "Section 80G Tax Exemption (100% / 50%)",
        "issuer": "Director General of Income Tax",
        "issueDate": "2021-04-12",
        "expiryDate": "2026-04-11",
        "status": "Verified"
      },
      {
        "name": "FCRA Permanent Clearance",
        "issuer": "Ministry of Home Affairs",
        "issueDate": "2022-05-18",
        "expiryDate": "2027-05-17",
        "status": "Verified"
      }
    ],
    sampleReviews: [
      {
        "author": "Harpreet Singh Sodhi",
        "rating": 5,
        "comment": "Pingalwara is the supreme example of selflessness. Anyone in need of hospice or critical shelter is embraced without question.",
        "date": "2026-08-10"
      }
    ]
  }
];

// Combine and write back
const combined = [...currentNgos, ...newNgos];
fs.writeFileSync(seedPath, JSON.stringify(combined, null, 2), 'utf-8');
console.log(`✅ Seed dataset updated! Total NGOs: ${combined.length}`);
