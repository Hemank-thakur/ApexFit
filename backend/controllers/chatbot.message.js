import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";


export const Message=async(req, res)=>{
     try {
        const {text}=req.body;
        if(!text?.trim()){
            return res.status(400).json({error:"Text cannot be empty"});
        }
        
        const user=await User.create({
            sender:"user",
            text
        })

        //data
        const botResponses={
            "who had made you":"Hemank thakur a b.tech final year student from noida institute of engineering and technology",
             "hello": "Hi, How I can help you!!",
            "can we become friend": "Yes",
            "how are you": "I'm just a bot, but I'm doing great! How about you?",
            "what is your name": "I’m ChatBot, your virtual assistant.",
            "who made you": "I was created by developers to help answer your questions.",
  "tell me a joke": "Why don’t skeletons fight each other? They don’t have the guts!",
  "what is the time": "I can’t see a clock, but your device should know.",
  "bye": "Goodbye! Have a great day.",
  "thank you": "You’re welcome!",
  "i love you": "That’s sweet! I’m here to help you anytime.",
  "where are you from": "I live in the cloud — no rent, no bills!",
  "what can you do": "I can chat with you, answer questions, and keep you company.",

 "what is python": "Python is a high-level, interpreted programming language known for simplicity and versatility.\n• Easy to read/write due to clean syntax (similar to English)\n• Dynamically typed and supports multiple paradigms (OOP, functional, procedural)\n• Extensive libraries for AI, data science, web, automation\n• Example: Used in Google, YouTube, Instagram, and machine learning applications",

"what is java?": "Java is a platform-independent, object-oriented programming language.\n• Famous for 'Write Once, Run Anywhere' due to JVM (Java Virtual Machine)\n• Used in enterprise systems, Android development, cloud apps\n• Provides features like garbage collection, strong memory management\n• Example: Banking systems, Android apps, large-scale enterprise applications",

"what is recursion": "Recursion is when a function calls itself to solve smaller parts of a problem.\n• Useful for problems that can be divided into subproblems (divide-and-conquer)\n• Requires a **base condition** to stop infinite looping\n• Commonly used in: factorial calculation, Fibonacci sequence, tree/graph traversal\n• Example in coding interview: 'Write a recursive function to reverse a linked list'",

"who is prime minister of india?": "Narendra Modi is the Prime Minister of India since May 2014.\n• Belongs to Bharatiya Janata Party (BJP)\n• Represents Varanasi constituency\n• Key initiatives: Digital India, Startup India, Swachh Bharat, Make in India\n• Interview Tip: Link to governance or technology (e.g., Digital India impact on IT industry)",

"what is g20": "The G20 (Group of Twenty) is an intergovernmental forum of 19 countries + the European Union.\n• Founded in 1999 to address global financial stability\n• Members include India, USA, China, Japan, EU, etc.\n• Discusses economic growth, climate change, sustainable development\n• Recent: India hosted G20 summit in 2023",

"tell me about yourself": "This is usually the first interview question.\nStructure:\n• Start with a brief intro (name, background, education/work)\n• Highlight your skills (technical + soft skills)\n• Share achievements (projects, internships, leadership roles)\n• Conclude with why you’re excited about this role\nExample: 'I am a Computer Science graduate skilled in Python and SQL. I completed an internship at XYZ where I optimized a database query, improving performance by 30%. I’m passionate about problem-solving and eager to contribute to your team’s success.'",

"why should we hire you": "HR wants to see your value-add.\n• Emphasize skills that match job requirements\n• Show enthusiasm and cultural fit\n• Example: 'I bring strong coding skills in Python and SQL, along with problem-solving ability proven through hackathons. I am also a quick learner and adapt well to team environments. I believe I can contribute to both technical delivery and innovative ideas.'",

"what is leadership": "Leadership is the ability to inspire and guide others toward achieving goals.\n• Key traits: vision, communication, accountability, decision-making\n• Example in interview: 'I led a college project team of 4, where I divided tasks, coordinated communication, and ensured deadlines. We successfully delivered a working prototype before schedule.'",

"who is virat kohli": "Virat Kohli is one of India’s greatest batsmen and former captain.\n• Known for consistency, fitness, and aggressive play\n• Holds record for fastest century in ODIs for India\n• Nicknamed 'Chase Master' for his performance in run-chases\n• Interview Tip: If asked about sports management, relate his discipline & fitness to leadership skills",

"what is ipl": "The Indian Premier League (IPL) is a professional T20 cricket league started in 2008.\n• Played annually in India, franchise-based teams\n• Combines cricket + entertainment (biggest sports league in India)\n• Significant for sports business, sponsorships, brand endorsements\n• Example: Chennai Super Kings (CSK) & Mumbai Indians (MI) are top teams",


  "what is artificial intelligence": "Artificial Intelligence (AI) is the simulation of human intelligence in machines.\n• Capabilities: learning, reasoning, problem-solving, decision-making\n• Branches: Machine Learning, Deep Learning, NLP, Robotics\n• Examples: ChatGPT, self-driving cars, recommendation systems",

  "what is machine learning": "Machine Learning (ML) is a subset of AI that enables systems to learn from data.\n• Types: Supervised, Unsupervised, Reinforcement\n• Used in spam detection, fraud detection, recommendation engines\n• Example: Netflix suggesting movies based on your watch history",

  "what is cloud computing": "Cloud computing delivers computing services (servers, storage, databases, networking, software) over the internet.\n• Providers: AWS, Azure, Google Cloud\n• Advantages: scalability, cost-effectiveness, accessibility\n• Example: Using Google Drive to store files online",

  "what is sql": "SQL (Structured Query Language) is used to manage and query relational databases.\n• Commands: SELECT, INSERT, UPDATE, DELETE\n• Example: SELECT * FROM users WHERE age > 21;\n• Widely used in backend development and data analysis",

  "what is html": "HTML (HyperText Markup Language) is the standard language for creating webpages.\n• Structures content using tags (<p>, <h1>, <a>, etc.)\n• Works with CSS (styling) and JavaScript (interactivity)\n• Example: <h1>Hello World!</h1>",

  "what is css": "CSS (Cascading Style Sheets) is used to style HTML elements.\n• Controls layout, colors, fonts, responsiveness\n• Example: h1 { color: blue; font-size: 24px; }\n• Variants: SCSS, Tailwind CSS",

  "what is javascript": "JavaScript is a programming language for web interactivity.\n• Runs in browsers and servers (Node.js)\n• Used in frontend frameworks (React, Angular, Vue)\n• Example: Form validation, animations, dynamic content",

  "what is react": "React.js is a JavaScript library for building user interfaces.\n• Developed by Facebook\n• Component-based architecture\n• Features: Virtual DOM, reusability, fast rendering\n• Example: Used in Facebook, Instagram, WhatsApp web",

  "what is node.js": "Node.js is a JavaScript runtime built on Chrome's V8 engine.\n• Enables running JS outside the browser\n• Popular for building APIs, servers, real-time apps\n• Example: Backend for chat applications, e-commerce websites",

  "what is mongodb": "MongoDB is a NoSQL, document-oriented database.\n• Stores data in JSON-like documents\n• Scalable, flexible schema\n• Example: Used in chatbots, real-time apps, IoT systems",

  "what is operating system": "An Operating System (OS) manages computer hardware and software.\n• Functions: process management, memory management, file system, security\n• Examples: Windows, Linux, macOS, Android",

  "who is elon musk": "Elon Musk is a billionaire entrepreneur.\n• CEO of Tesla, SpaceX, Neuralink, and founder of X (formerly Twitter)\n• Known for electric cars, reusable rockets, and AI discussions\n• Fun fact: Wants to colonize Mars",

  "who is bill gates": "Bill Gates is the co-founder of Microsoft.\n• Philanthropist through Bill & Melinda Gates Foundation\n• Key figure in the personal computer revolution\n• Fun fact: World's richest person in the 1990s & 2000s",

  "what is cryptocurrency": "Cryptocurrency is a digital currency secured by cryptography.\n• Examples: Bitcoin, Ethereum, Dogecoin\n• Works on blockchain (decentralized ledger)\n• Used for trading, payments, and smart contracts",

  "what is blockchain": "Blockchain is a distributed, immutable ledger for recording transactions.\n• Transparent, secure, decentralized\n• Applications: cryptocurrency, supply chain, voting systems\n• Example: Bitcoin blockchain records transactions",

  "what is internet of things": "IoT (Internet of Things) is a network of physical devices connected to the internet.\n• Examples: smart home devices, wearables, industrial sensors\n• Enables automation and real-time data sharing\n• Used in healthcare, agriculture, transport",

  "what is 5g": "5G is the 5th generation of mobile network technology.\n• Faster internet, low latency, supports IoT\n• Enables AR/VR, self-driving cars, remote surgery\n• Speed: Up to 10 Gbps",

  "what is data science": "Data Science combines statistics, computer science, and domain knowledge to extract insights from data.\n• Steps: Data collection, cleaning, analysis, visualization, prediction\n• Tools: Python, R, SQL, Tableau\n• Example: Predicting customer churn",

  "what is big data": "Big Data refers to extremely large datasets that traditional databases cannot handle.\n• Characteristics: Volume, Velocity, Variety, Veracity\n• Tools: Hadoop, Spark\n• Example: Social media analytics, financial fraud detection",

  "tell me a fun fact": "Did you know? Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs, and it was still edible!"




        }

        const normalizedText=text.toLowerCase().trim();

        const botResponse=botResponses[normalizedText] || "Sorry, I don,t understand that!";

        const bot=await Bot.create({
            text: botResponse
        })

        return res.status(200).json({
            userMessage:user.text,
            botMessage:bot.text,
        })

     } catch (error) {
            console.log("error in message controller: ", error);
            return res.status(500).json({error:"Internal server error"});
     }
}