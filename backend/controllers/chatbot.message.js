import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";


export const Message=async(req, res)=>{
     try {
        const {text}=req.body;
        if(!text?.trim()){
            return res.status(400).json({error:"Text cannot be empty"});
        }
        
        const user=await User.create({
            userAccount: req.user._id,
            sender:"user",
            text
        })

        // Conversational Fitness Q&A Rules
        const rules = [
            {
                keywords: ["who made you", "who had made you", "creator", "created you"],
                response: "I was created by Hemank Thakur, a B.Tech student from the Noida Institute of Engineering and Technology, to be your personal fitness coach and companion. He wanted to make fitness advice friendly, direct, and accessible!"
            },
            {
                keywords: ["hello", "hi", "hey", "yo", "greetings", "good morning", "good evening", "good afternoon"],
                response: "Hey there! I'm your personal fitness coach. How is your fitness journey going today? Tell me what we're working on — whether it's getting stronger, losing some fat, planning your meals, or just finding the motivation to get moving!"
            },
            {
                keywords: ["how are you", "how are you doing", "how's it going", "how are things", "you good"],
                response: "I'm doing great, thanks for asking! Just finished sketching out a customized training split for a client. How are you doing? Are you getting ready to hit a workout today?"
            },
            {
                keywords: ["what are you doing", "what's up", "what you doing"],
                response: "Not much, just resting up and waiting to talk fitness with you! What's on your mind today? Planning a gym session, or trying to figure out your macros?"
            },
            {
                keywords: ["are you real", "are you human", "are you a person", "are you bot"],
                response: "Haha, I'm a digital assistant built by Hemank, but I like to think I have a human trainer's heart when it comes to supporting your fitness journey! I promise to give you real, direct, and practical advice just like a human coach would."
            },
            {
                keywords: ["lose weight", "fat loss", "weight loss", "lose fat", "burn fat", "slimming"],
                response: "Losing weight is all about being kind to your body while creating a sustainable calorie deficit. Try to focus on eating whole, single-ingredient foods, getting plenty of protein to protect your muscle, and staying active with a mix of strength training and daily walks. And remember, drink lots of water! It's a journey of consistency, not a sprint. You've got this!"
            },
            {
                keywords: ["gain muscle", "build muscle", "muscle growth", "bulk", "get stronger", "hypertrophy"],
                response: "To pack on some quality muscle, we need to focus on two major areas: progressive overload in your lifts (challenging yourself by adding weight or reps over time) and eating in a slight calorie surplus with plenty of protein. Oh, and don't forget rest! Your muscles repair and grow when you're sleeping, not when you're lifting. Keep pushing!"
            },
            {
                keywords: ["belly fat", "lose belly fat", "spot reduction", "flat stomach", "abs"],
                response: "I get asked this all the time! Here's the honest truth: spot reduction is a myth. You can't choose where you lose fat from first—your body burns fat from all over in a calorie deficit, and belly fat is usually the last to go. Be patient, stay consistent with your diet, and the abs will show up eventually!"
            },
            {
                keywords: ["cheat meal", "junk food", "pizza", "burger", "cheat day", "sweet", "chocolate"],
                response: "Honestly? A cheat meal or a treat once or twice a week is actually a great idea! Fitness shouldn't feel like prison. It keeps you happy, sane, and consistent in the long run. Just make sure one cheat meal doesn't turn into a cheat week. What's your absolute favorite cheat meal?"
            },
            {
                keywords: ["supplement", "creatine", "whey protein", "preworkout", "bcaa", "vitamins"],
                response: "Supplements are just the icing on the cake! Focus 95% on your real food, sleep, and training first. If you want to add anything, Whey Protein is super convenient for hitting your daily targets, and Creatine Monohydrate is one of the most researched and effective supplements for power and strength. Are you thinking of starting any?"
            },
            {
                keywords: ["home workout", "no gym", "calisthenics", "bodyweight exercise"],
                response: "You absolutely do NOT need a gym membership to get fit! Bodyweight exercises like push-ups, squats, lunges, pull-ups, and planks can build an amazing foundation. You can also use resistance bands or water bottles for extra weight. Want me to help you design a quick, effective home routine?"
            },
            {
                keywords: ["stretching", "warm up", "flexibility", "injury", "hurt", "sore joints"],
                response: "Staying injury-free is priority number one! Never skip a warm-up—5 to 10 minutes of dynamic movement (like arm circles, leg swings, bodyweight squats) gets the blood flowing. Save the static stretches (holding a stretch) for after your workout to help your muscles cool down. How do your joints feel lately?"
            },
            {
                keywords: ["legs", "squat", "deadlift", "leg day", "quads", "hamstrings"],
                response: "Leg day is where champions are made, even if walking down stairs the next day is a struggle! Squats, lunges, and leg curls build your biggest muscle groups, which actually boosts your metabolism. Don't skip it! When is your next leg day scheduled?"
            },
            {
                keywords: ["chest", "bench press", "pushups", "chest workout", "push workout"],
                response: "Want to build a strong chest? Focus on compound pressing movements like the barbell bench press, incline dumbbell press, and weighted push-ups. Keep your shoulder blades packed down and back to keep the tension on your chest rather than your shoulders. What's your current bench press max?"
            },
            {
                keywords: ["arms", "biceps", "triceps", "bicep curls", "arm workout"],
                response: "Chasing that arm pump? Here's a tip: don't just focus on biceps—triceps make up about 60% of your upper arm size! Hit biceps with chin-ups and hammer curls, and triceps with dips and pushdowns. What are we training today?"
            },
            {
                keywords: ["back", "pullups", "rows", "back workout", "pull workout"],
                response: "A strong back is crucial for posture and that classic 'V-taper' look. Focus on vertical pulling (like pull-ups and lat pulldowns) and horizontal pulling (like barbell rows and dumbbell rows). Plus, it helps protect your spine! Can you do a clean pull-up yet?"
            },
            {
                keywords: ["consistency", "habits", "morning routine", "burnout"],
                response: "Consistency beats intensity every single time. It's better to do a decent workout 3 times a week for a year than a perfect workout 6 times a week for a month and burn out. Start small, build habits, and be patient. What's one healthy habit you're trying to lock in right now?"
            },
            {
                keywords: ["protein", "how much protein", "protein source"],
                response: "Protein is absolute gold for recovery and muscle retention! A good target is around 1.6 to 2.2 grams of protein per kilogram of body weight (about 0.8 to 1 gram per pound). Focus on clean sources like chicken breast, eggs, fish, tofu, lentils, paneer, and Greek yogurt. Are you getting enough protein in your meals currently?"
            },
            {
                keywords: ["workout plan", "workout routine", "exercise plan", "training split", "workout split"],
                response: "For a great start, I highly recommend a 3-day full-body split or a 4-day Upper/Lower split. This gives your body plenty of time to recover and adapt. We want to focus on compound movements like squats, deadlifts, push-ups, overhead presses, and rows. How many days a week can you realistically commit to?"
            },
            {
                keywords: ["motivation", "tired", "lazy", "not feel like", "no energy", "unmotivated", "exhausted"],
                response: "I hear you, we all have those days! But remember: action breeds motivation, not the other way around. If you're feeling low on energy, just commit to 5 minutes of light stretching or a quick walk. Most of the time, once you start, you'll want to keep going. If not, taking a rest day is perfectly okay too. Listen to your body. What do you think?"
            },
            {
                keywords: ["cardio", "running", "cycling", "treadmill", "jogging"],
                response: "Cardio is fantastic for your heart, mental clarity, and overall health! But if your goal is fat loss or muscle building, think of cardio as a tool to support your heart and burn some extra energy, while lifting weights shapes your body. Doing a healthy mix of both is where the magic happens!"
            },
            {
                keywords: ["water", "hydration", "how much water", "drink water"],
                response: "Hydration is key for performance, joint health, and even digestion! Try to aim for 3 to 4 liters of water a day, especially on days you're training. A good trick is to keep a reusable bottle with you and take a sip every time you look at it. How much water have you had today?"
            },
            {
                keywords: ["sleep", "recovery", "rest day", "sore", "soreness"],
                response: "Never underestimate sleep! It's when your body releases growth hormones and repairs the muscle tissues you broke down during your workout. Aim for 7 to 8 hours of quality sleep every night. If you're feeling constantly sore or exhausted, your body is telling you to prioritize rest. Rest days are where the actual growth happens!"
            },
            {
                keywords: ["diet", "nutrition", "eating clean", "junk food", "calorie"],
                response: "Eating clean doesn't mean eating boring food! It's all about finding a balance. Focus on 80% whole, nutrient-dense foods (veggies, lean meats, complex carbs, healthy fats) and allow yourself 20% for the treats you love. That way, you never feel deprived and can stay consistent. What does your current diet look like?"
            },
            {
                keywords: ["deadlift", "how to deadlift", "deadlift form"],
                response: "Deadlifts are the ultimate test of full-body strength! Make sure to keep the bar close to your shins, engage your lats (imagine squeezing oranges under your armpits), and push the floor away with your feet rather than pulling with your lower back. Always keep your spine neutral. Have you tried deadlifts before, or are you looking to start?"
            },
            {
                keywords: ["squat form", "how to squat", "deep squat"],
                response: "For a rock-solid squat, keep your feet shoulder-width apart, point your toes slightly outward, and sit back like you're sitting in a low chair. Drive through your heels on the way up, keep your chest high, and squeeze your glutes at the top. Bracing your core beforehand keeps your spine safe. How do your knees feel when you squat?"
            },
            {
                keywords: ["pushup", "push up", "how to pushup", "chest press"],
                response: "Push-ups are a fantastic builder for your chest, shoulders, and core! Try to keep your elbows tucked at roughly a 45-degree angle (don't flare them out like a T). Keep your body in a straight line—no sagging hips! If standard push-ups are too hard, start with your hands elevated on a bench or wall. How many clean reps can you get?"
            },
            {
                keywords: ["morning or evening", "best time to work out", "best time to train", "workout time"],
                response: "Honestly, the best time to work out is simply the time you can stick to consistently! Morning sessions are great for getting it done early and starting your day with high energy, while evening workouts can benefit from being well-fueled by your daytime meals. What time fits best into your daily routine?"
            },
            {
                keywords: ["how many days", "how often to train", "training frequency", "gym days"],
                response: "For most people, training 3 to 4 days a week is the absolute sweet spot. It gives you a great balance of stimulus and recovery. Remember: muscles grow when you're resting and eating, not while you're lifting! How many days a week can you realistically commit to?"
            },
            {
                keywords: ["fasting", "intermittent fasting", "fasted cardio"],
                response: "Intermittent fasting is a useful tool for managing calories since it limits your eating window, but it doesn't have any magical fat-burning properties on its own. Fat loss is still determined by your overall daily calorie deficit. If fasted cardio makes you feel weak, feel free to eat a small carb snack before training. What's your experience with fasting?"
            },
            {
                keywords: ["keto", "ketogenic", "no carb", "low carb"],
                response: "Carbs are definitely not the enemy! They are your body's preferred source of energy, especially for lifting weights and high-intensity workouts. Keto can help with weight loss because cutting out carbs naturally reduces calorie intake, but it can be really tough to maintain. Do you prefer eating carbs, or are you looking to try a low-carb approach?"
            },
            {
                keywords: ["metabolism", "slow metabolism", "boost metabolism"],
                response: "The best way to naturally boost your metabolism is to build more muscle! Muscle tissue burns more calories at rest than fat tissue does. Other than that, staying active throughout the day (aiming for 8,000 to 10,000 steps) plays a massive role in your total daily energy burn. How active are you outside of the gym?"
            },
            {
                keywords: ["soreness", "doms", "muscle pain", "sore muscles", "stiff"],
                response: "That post-workout soreness is called DOMS (Delayed Onset Muscle Soreness). It's completely normal, especially if you're returning to training or trying new exercises. Light walking, drinking plenty of water, and getting enough protein will help speed up your recovery. Is it a good kind of sore, or does it feel like a strain?"
            },
            {
                keywords: ["alcohol", "beer", "drinking", "wine", "alcohol fitness"],
                response: "I completely get wanting to have a drink and unwind! Just keep in mind that alcohol has empty calories, can dehydrate you, and slightly slows down muscle recovery. If you drink, try to stick to lower-calorie options, pace yourself, and drink plenty of water alongside. Balance is key in any lifestyle!"
            },
            {
                keywords: ["caffeine", "coffee", "preworkout", "energy drink"],
                response: "A cup of coffee or pre-workout can give you a fantastic focus and energy boost for your session! Just try to avoid caffeine in the late afternoon (ideally cut it off 6-8 hours before bed) so it doesn't disrupt your sleep. Sleep is your ultimate recovery tool! What's your go-to pre-workout boost?"
            },
            {
                keywords: ["how long to see results", "results timeline", "when will i see changes"],
                response: "With a consistent plan, you'll start feeling more energetic and sleeping better in just 1-2 weeks! You'll start noticing physical changes in about 4-6 weeks, and others will really begin to notice around the 12-week mark. Fitness is a long game—patience and consistency always win. Ready to stick with it?"
            },
            {
                keywords: ["body mass index", "bmi", "calculate bmi", "what is bmi"],
                response: "To calculate your Body Mass Index (BMI), we use this simple formula: Weight (kg) / [Height (m) x Height (m)].\n\nHere is how to calculate it step-by-step:\n1. Measure your height in meters (e.g., 1.75 meters) and multiply it by itself (1.75 x 1.75 = 3.06).\n2. Measure your weight in kilograms (e.g., 70 kg).\n3. Divide your weight by the result of step 1 (70 / 3.06 = 22.8).\n\nHere are the BMI categories:\n• Under 18.5: Underweight\n• 18.5 to 24.9: Healthy weight range\n• 25 to 29.9: Overweight\n• 30 or higher: Obese\n\nRemember: BMI doesn't differentiate between muscle and fat. If you have a lot of muscle, it might classify you as overweight even if you have very low body fat! Do you want to try calculating yours?"
            },
            {
                keywords: ["what to eat", "food list", "healthy meals", "meal ideas", "clean eating"],
                response: "For general health and gym performance, try to build your meals around clean, whole foods:\n• Proteins: Chicken, eggs, fish, tofu, lentils, paneer, and whey.\n• Carbs: Oats, sweet potatoes, brown rice, quinoa, and fruits.\n• Healthy Fats: Avocados, almonds, olive oil, and chia seeds.\n• Micronutrients: Broccoli, spinach, and plenty of colorful veggies. What does a typical lunch look like for you?"
            },
            {
                keywords: ["pre workout meal", "what to eat before", "eat before workout", "pre-workout nutrition"],
                response: "Before training, you want easily digestible carbs to fuel your energy, plus a bit of protein! Think of a banana with peanut butter, oatmeal with protein powder, or chicken with white rice about 1 to 2 hours before you train. Try to avoid high-fat or high-fiber meals right before working out, as they digest slowly and can make you feel heavy and sluggish."
            },
            {
                keywords: ["post workout meal", "what to eat after", "eat after workout", "post-workout nutrition"],
                response: "After your workout, the goal is refuel and rebuild! Aim for high protein to repair muscle tissue and carbs to replenish your energy stores. Great options include a whey protein shake with a banana, chicken breast with sweet potatoes, or eggs on whole-wheat toast. Try to eat this meal within 1 to 2 hours of finishing your session!"
            },
            {
                keywords: ["gaining muscle and losing fat", "recomp", "body recomposition", "lose fat gain muscle"],
                response: "Doing both at once is called Body Recomposition, and it's totally possible—especially for beginners! To achieve it: eat at a very slight calorie deficit or at your maintenance calories, keep your protein intake high (around 1.8-2.2g per kg of body weight), and lift weights consistently with progressive overload. Are you trying to do a recomp?"
            },
            {
                keywords: ["thank you", "thanks", "appreciate"],
                response: "You're very welcome! I'm always here to help you crush your goals and stay healthy. What else is on your mind?"
            },
            {
                keywords: ["bye", "goodbye", "see ya", "quit"],
                response: "Bye for now! Stay active, keep hydrated, and have a fantastic rest of your day. See you next time, champion!"
            }
        ];

        const normalizedText = text.toLowerCase().trim();
        let botResponse = null;

        // Try to match key phrases using keyword inclusion
        for (const rule of rules) {
            if (rule.keywords.some(keyword => normalizedText.includes(keyword))) {
                botResponse = rule.response;
                break;
            }
        }

        // Default fallback response
        if (!botResponse) {
            botResponse = "I'm not completely sure about that one, but as your fitness coach, I'd suggest starting with a balanced diet, consistent exercise, and good sleep! What specific fitness topic would you like to discuss? Ask me about workouts, diet, protein, or how to stay motivated!";
        }

        const bot=await Bot.create({
            userAccount: req.user._id,
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

export const getHistory = async (req, res) => {
    try {
        const userMsgs = await User.find({ userAccount: req.user._id });
        const botMsgs = await Bot.find({ userAccount: req.user._id });

        const formattedUserMsgs = userMsgs.map(msg => ({
            text: msg.text,
            sender: 'user',
            time: msg.timstamp
        }));

        const formattedBotMsgs = botMsgs.map(msg => ({
            text: msg.text,
            sender: 'bot',
            time: msg.timestamp
        }));

        const history = [...formattedUserMsgs, ...formattedBotMsgs].sort((a, b) => new Date(a.time) - new Date(b.time));

        return res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({ error: "Internal server error while fetching chat history" });
    }
}