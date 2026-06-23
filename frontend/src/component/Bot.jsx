import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { 
  FaUserCircle, 
  FaDumbbell, 
  FaCalculator, 
  FaFire, 
  FaWater, 
  FaCheckCircle, 
  FaUndo, 
  FaPaperPlane, 
  FaRunning, 
  FaHeartbeat, 
  FaCompass, 
  FaChartLine, 
  FaCog,
  FaSearch,
  FaPlus,
  FaTrash,
  FaAppleAlt
} from 'react-icons/fa'

const initialExercises = [
    { name: "Squats", muscle: "Legs", difficulty: "Beginner", tips: "Keep feet shoulder-width apart, sit back like sitting in a chair, drive through heels." },
    { name: "Bench Press", muscle: "Chest", difficulty: "Intermediate", tips: "Keep shoulder blades packed down, touch barbell to lower chest, brace abs." },
    { name: "Deadlifts", muscle: "Back", difficulty: "Advanced", tips: "Keep the bar close to your shins, pull shoulder blades back, push through feet." },
    { name: "Pull-Ups", muscle: "Back", difficulty: "Intermediate", tips: "Pull your chest toward the bar, engage lats, slowly lower yourself down." },
    { name: "Bicep Curls", muscle: "Arms", difficulty: "Beginner", tips: "Keep elbows pinned to ribs, avoid rocking your torso, squeeze biceps at the top." },
    { name: "Plank", muscle: "Core", difficulty: "Beginner", tips: "Align body in a straight line, brace abs and glutes, do not let hips sag." },
    { name: "Lunges", muscle: "Legs", difficulty: "Beginner", tips: "Step forward, drop back knee close to the ground, push off front heel." },
    { name: "Tricep Dips", muscle: "Arms", difficulty: "Intermediate", tips: "Keep back close to the bench, lower hips to 90 degrees, press straight up." },
    { name: "Overhead Press", muscle: "Shoulders", difficulty: "Intermediate", tips: "Brace glutes, press barbell straight up overhead, lock out elbows." },
    { name: "Lateral Raises", muscle: "Shoulders", difficulty: "Beginner", tips: "Lean forward slightly, lead with elbows up to shoulder height, slow release." }
];

function Bot({ user, token, onLogout }) {
    const [activeTab, setActiveTab] = useState("dashboard") // dashboard, exercises, nutrition, settings
    
    // Chat States
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    // Daily Custom Targets (loaded from localStorage or defaults)
    const [targetWater, setTargetWater] = useState(() => parseFloat(localStorage.getItem("targetWater")) || 4.0)
    const [targetCalories, setTargetCalories] = useState(() => parseInt(localStorage.getItem("targetCalories")) || 2000)
    const [targetSteps, setTargetSteps] = useState(() => parseInt(localStorage.getItem("targetSteps")) || 10000)
    const [targetProtein, setTargetProtein] = useState(() => parseInt(localStorage.getItem("targetProtein")) || 150)
    const [coachLevel, setCoachLevel] = useState(() => localStorage.getItem("coachLevel") || "Beginner")

    // Interactive Widget States (local session storage)
    const [weight, setWeight] = useState("")
    const [height, setHeight] = useState("")
    const [bmiResult, setBmiResult] = useState(null)
    const [bmiCategory, setBmiCategory] = useState("")
    const [waterGlasses, setWaterGlasses] = useState(0)
    const [steps, setSteps] = useState(4800)
    const [workoutCompleted, setWorkoutCompleted] = useState(false)
    const [workoutCalories, setWorkoutCalories] = useState(0)

    // Exercise Tab States
    const [exerciseSearch, setExerciseSearch] = useState("")
    const [selectedMuscle, setSelectedMuscle] = useState("All")
    const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null)
    const [completedExercises, setCompletedExercises] = useState([])

    // Nutrition Tab States
    const [nutritionLogs, setNutritionLogs] = useState([])
    const [foodName, setFoodName] = useState("")
    const [mealType, setMealType] = useState("Breakfast")
    const [mealCalories, setMealCalories] = useState("")
    const [mealProtein, setMealProtein] = useState("")
    const [nutritionLoading, setNutritionLoading] = useState(false)

    // Settings Feedback
    const [settingsSuccess, setSettingsSuccess] = useState(false)

    // Chat History Opt-in States
    const [showHistoryPrompt, setShowHistoryPrompt] = useState(false)
    const [pendingMessages, setPendingMessages] = useState([])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    // Fetch nutrition logs from MongoDB
    const fetchNutritionLogs = async () => {
        setNutritionLoading(true);
        try {
            const res = await axios.get("http://localhost:4002/nutrition/v1/logs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                setNutritionLogs(res.data);
            }
        } catch (err) {
            console.error("Error fetching logs:", err);
        }
        setNutritionLoading(false);
    }

    const fetchChatHistory = async () => {
        try {
            const res = await axios.get("http://localhost:4002/bot/v1/history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200 && res.data.length > 0) {
                setPendingMessages(res.data);
                setShowHistoryPrompt(true);
            }
        } catch (err) {
            console.error("Error fetching chat history:", err);
        }
    }

    useEffect(() => {
        if (token) {
            fetchNutritionLogs();
            fetchChatHistory();
        }
    }, [token])

    // Calculate dynamic totals for macro indicators
    const totalCaloriesConsumed = nutritionLogs.reduce((sum, item) => sum + item.calories, 0);
    const totalProteinConsumed = nutritionLogs.reduce((sum, item) => sum + item.protein, 0);

    const handleSendMessage = async (customText = "") => {
        const textToSend = customText || input;
        if (!textToSend.trim()) return;

        setLoading(true);
        const userMsg = { text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        
        if (!customText) setInput("");

        try {
            const res = await axios.post("http://localhost:4002/bot/v1/message", {
                text: textToSend
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 200) {
                setMessages(prev => [...prev, { text: res.data.botMessage, sender: 'bot' }]);
            }
        } catch (error) {
            console.log("Error sending message:", error);
            setMessages(prev => [...prev, { text: "Sorry, I had trouble reaching the coaching server. Please make sure the backend is running on port 4002!", sender: 'bot' }]);
        }
        setLoading(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage()
    }

    // BMI Calculator
    const calculateBMI = (e) => {
        e.preventDefault();
        const w = parseFloat(weight)
        const h = parseFloat(height) / 100
        if (!w || !h) return;
        const bmi = parseFloat((w / (h * h)).toFixed(1))
        setBmiResult(bmi)
        if (bmi < 18.5) setBmiCategory("Underweight")
        else if (bmi >= 18.5 && bmi < 25) setBmiCategory("Healthy weight")
        else if (bmi >= 25 && bmi < 30) setBmiCategory("Overweight")
        else setBmiCategory("Obese")
    }

    const resetBMI = () => {
        setWeight("");
        setHeight("");
        setBmiResult(null);
        setBmiCategory("");
    }

    // Hydration increments
    const glassesGoal = Math.ceil(targetWater / 0.4);
    const incrementWater = () => {
        if (waterGlasses < glassesGoal) setWaterGlasses(prev => prev + 1);
    }
    const resetWater = () => {
        setWaterGlasses(0);
    }

    // Daily Steps Increment
    const incrementSteps = () => {
        setSteps(prev => prev + 1000);
    }

    const handleWorkoutCheck = () => {
        setWorkoutCompleted(prev => !prev);
        setWorkoutCalories(prev => workoutCompleted ? 0 : 250);
    }

    // Save customized goals
    const handleSaveSettings = (e) => {
        e.preventDefault();
        localStorage.setItem("targetWater", targetWater.toString());
        localStorage.setItem("targetCalories", targetCalories.toString());
        localStorage.setItem("targetSteps", targetSteps.toString());
        localStorage.setItem("targetProtein", targetProtein.toString());
        localStorage.setItem("coachLevel", coachLevel);
        
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
    }

    // Add meal log to DB
    const handleLogMeal = async (e) => {
        e.preventDefault();
        if (!foodName.trim() || !mealCalories || !mealProtein) return;
        try {
            const res = await axios.post("http://localhost:4002/nutrition/v1/log", {
                foodName,
                mealType,
                calories: Number(mealCalories),
                protein: Number(mealProtein)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 201) {
                setNutritionLogs(prev => [res.data, ...prev]);
                setFoodName("");
                setMealCalories("");
                setMealProtein("");
            }
        } catch (err) {
            console.error("Error logging meal:", err);
        }
    }

    // Delete meal log from DB
    const handleDeleteMeal = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:4002/nutrition/v1/log/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                setNutritionLogs(prev => prev.filter(log => log._id !== id));
            }
        } catch (err) {
            console.error("Error deleting log:", err);
        }
    }

    // Add exercise to completed list
    const logExerciseActivity = (exerciseName) => {
        if (!completedExercises.includes(exerciseName)) {
            setCompletedExercises(prev => [...prev, exerciseName]);
            setWorkoutCalories(prev => prev + 120);
        }
    }

    // Filtered exercises list
    const filteredExercises = initialExercises.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) || 
                              ex.muscle.toLowerCase().includes(exerciseSearch.toLowerCase());
        const matchesMuscle = selectedMuscle === "All" || ex.muscle === selectedMuscle;
        return matchesSearch && matchesMuscle;
    });

    const getGreeting = () => {
        const hrs = new Date().getHours();
        const name = user?.username ? `, ${user.username}` : "";
        if (hrs < 12) return `Good morning${name}!`;
        if (hrs < 18) return `Good afternoon${name}!`;
        return `Good evening${name}!`;
    }

    const quickChips = [
        "How can I lose weight?",
        "Give me a workout plan",
        "What should I eat before workout?",
        "How do I build muscle?",
        "How much protein do I need?"
    ];

    // Compute dynamic dashboard vitals
    const totalDailyCaloriesBurned = workoutCalories + Math.round(steps * 0.04);

    return (
        <div className="flex h-screen bg-[#070708] text-[#e4e4e7] font-sans overflow-hidden">
            {/* SIDEBAR PANEL */}
            <aside className="w-64 bg-[#0c0c0e] border-r border-[#1f1f23] flex flex-col justify-between py-6 px-4 shrink-0 hidden md:flex animate-fadeIn">
                <div className="space-y-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-gradient-to-tr from-[#39ff14] to-emerald-500 p-2.5 rounded-xl text-black font-bold">
                            <FaDumbbell size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white leading-none">ApexFit</h2>
                            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Coaching OS</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1.5 pt-4">
                        <button 
                            onClick={() => setActiveTab("dashboard")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                activeTab === "dashboard"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                        >
                            <FaChartLine size={16} />
                            <span>Dashboard</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab("exercises")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                activeTab === "exercises"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                        >
                            <FaCompass size={16} />
                            <span>Exercise Library</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab("nutrition")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                activeTab === "nutrition"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                        >
                            <FaHeartbeat size={16} />
                            <span>Nutrition Logs</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab("settings")}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                activeTab === "settings"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                            }`}
                        >
                            <FaCog size={16} />
                            <span>Settings</span>
                        </button>
                    </nav>
                </div>

                {/* User Profile Card */}
                <div className="p-3 bg-[#141417] border border-[#232329] rounded-xl flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                        <FaUserCircle size={32} className="text-emerald-500/80 shrink-0" />
                        <div className="overflow-hidden flex-1">
                            <h4 className="text-xs font-semibold text-white truncate">{user?.username}</h4>
                            <span className="text-[10px] text-emerald-400 font-medium">Member Account</span>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 transition-all cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* HEADER */}
                <header className="h-16 border-b border-[#1f1f23] bg-[#0c0c0e]/80 backdrop-blur-md px-6 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3 md:hidden">
                        <FaDumbbell className="text-emerald-400" size={20} />
                        <h1 className="text-lg font-bold text-white">ApexFit</h1>
                    </div>
                    <div className="hidden md:block">
                        <h2 className="text-sm font-semibold text-white">{getGreeting()}</h2>
                        <p className="text-[11px] text-gray-400">Welcome to your high-performance command center</p>
                    </div>
                    
                    {/* Responsive Tab Toggle for Mobile */}
                    <div className="flex md:hidden bg-[#141417] p-1 border border-[#1f1f23] rounded-lg">
                        <button onClick={() => setActiveTab("dashboard")} className={`px-2.5 py-1 text-xs rounded transition-all ${activeTab === "dashboard" ? "bg-emerald-500 text-black font-semibold" : "text-gray-400"}`}>Chat</button>
                        <button onClick={() => setActiveTab("exercises")} className={`px-2.5 py-1 text-xs rounded transition-all ${activeTab === "exercises" ? "bg-emerald-500 text-black font-semibold" : "text-gray-400"}`}>Lib</button>
                        <button onClick={() => setActiveTab("nutrition")} className={`px-2.5 py-1 text-xs rounded transition-all ${activeTab === "nutrition" ? "bg-emerald-500 text-black font-semibold" : "text-gray-400"}`}>Nutri</button>
                        <button onClick={() => setActiveTab("settings")} className={`px-2.5 py-1 text-xs rounded transition-all ${activeTab === "settings" ? "bg-emerald-500 text-black font-semibold" : "text-gray-400"}`}>Set</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#141417] border border-[#1f1f23] rounded-full text-xs font-medium text-emerald-400">
                            <FaRunning className="animate-bounce" />
                            <span>Active Protocol</span>
                        </div>
                        <button onClick={onLogout} className="md:hidden text-xs text-red-400 font-semibold uppercase">Exit</button>
                    </div>
                </header>

                {/* CONTAINER PANE */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* RENDER ACTIVE TAB */}
                    
                    {/* 1. CHAT DASHBOARD */}
                    {activeTab === "dashboard" && (
                        <main className="flex-1 flex flex-col bg-[#070708] overflow-hidden animate-fadeIn">
                            {/* Messages Log */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                                {showHistoryPrompt ? (
                                    <div className="h-full flex items-center justify-center max-w-md mx-auto">
                                        <div className="bg-[#141417] border border-[#232329] rounded-2xl p-6 text-center space-y-5 shadow-2xl animate-fadeIn">
                                            <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                                                <FaUndo size={18} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <h3 className="text-base font-bold text-white uppercase tracking-wider">Restore Chat History?</h3>
                                                <p className="text-xs text-gray-400 leading-relaxed">
                                                    We found a previous coaching session in your account. Would you like to restore your conversation history?
                                                </p>
                                            </div>
                                            <div className="flex gap-2.5 pt-1">
                                                <button
                                                    onClick={() => {
                                                        setMessages(pendingMessages);
                                                        setShowHistoryPrompt(false);
                                                    }}
                                                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all cursor-pointer"
                                                >
                                                    Yes, Restore
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setPendingMessages([]);
                                                        setShowHistoryPrompt(false);
                                                    }}
                                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-[#232329] transition-all cursor-pointer"
                                                >
                                                    Start Fresh
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-6">
                                        <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 animate-pulse">
                                            <FaDumbbell size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-white">Meet your AI Strength Coach</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Ask me anything about starting a workout, optimal protein needs, form tips, or how to calculate your body mass index.
                                            </p>
                                        </div>

                                        {/* Quickstart suggestions */}
                                        <div className="w-full space-y-2.5">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Suggested Questions</p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {quickChips.map((chip, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSendMessage(chip)}
                                                        className="px-3.5 py-2 rounded-lg text-xs font-medium bg-[#141417] hover:bg-[#1a1a1f] text-gray-300 hover:text-emerald-400 border border-[#232329] hover:border-emerald-500/40 transition-all duration-200 cursor-pointer"
                                                    >
                                                        {chip}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-3xl mx-auto space-y-4">
                                        {messages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-md ${
                                                    msg.sender === 'user'
                                                        ? 'bg-emerald-500 text-black font-medium rounded-tr-none'
                                                        : 'bg-[#141417] border border-[#232329] text-gray-100 rounded-tl-none'
                                                }`}>
                                                    {msg.text.split('\n').map((line, lIdx) => (
                                                        <p key={lIdx} className={line.trim() ? "mb-1.5 last:mb-0" : "h-2"} >
                                                            {line}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {loading && (
                                            <div className="flex justify-start">
                                                <div className="bg-[#141417] border border-[#232329] text-gray-400 px-4 py-3 rounded-2xl rounded-tl-none text-sm flex items-center gap-2">
                                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                    <span>Coach is thinking...</span>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Input Footer */}
                            <div className="p-4 border-t border-[#1f1f23] bg-[#0c0c0e]">
                                <div className="max-w-3xl mx-auto flex items-center gap-2 bg-[#141417] border border-[#232329] rounded-xl px-4 py-2 focus-within:border-emerald-500/50 transition-colors">
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-500"
                                        placeholder="Ask ApexFit anything (e.g. 'how to calculate BMI', 'healthy meals')..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        disabled={loading}
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={loading || !input.trim()}
                                        className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 text-black rounded-lg transition-colors cursor-pointer"
                                    >
                                        <FaPaperPlane size={14} />
                                    </button>
                                </div>
                            </div>
                        </main>
                    )}

                    {/* 2. EXERCISE LIBRARY TAB */}
                    {activeTab === "exercises" && (
                        <main className="flex-1 flex flex-col bg-[#070708] p-6 overflow-y-auto animate-fadeIn space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1f1f23] pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Exercise Guide</h3>
                                    <p className="text-xs text-gray-400">Search and discover correct execution forms.</p>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto bg-[#141417] border border-[#232329] px-3.5 py-2 rounded-xl">
                                    <FaSearch className="text-gray-500" size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="Search exercise..."
                                        value={exerciseSearch}
                                        onChange={(e) => setExerciseSearch(e.target.value)}
                                        className="bg-transparent outline-none text-xs text-white placeholder-gray-600 w-full sm:w-48"
                                    />
                                </div>
                            </div>

                            {/* Muscle filters */}
                            <div className="flex flex-wrap gap-2">
                                {["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"].map((muscle) => (
                                    <button
                                        key={muscle}
                                        onClick={() => setSelectedMuscle(muscle)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            selectedMuscle === muscle
                                                ? "bg-emerald-500 text-black"
                                                : "bg-[#141417] text-gray-400 border border-[#232329] hover:text-white"
                                        }`}
                                    >
                                        {muscle}
                                    </button>
                                ))}
                            </div>

                            {/* Exercises Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredExercises.map((ex, idx) => (
                                    <div 
                                        key={idx}
                                        className="bg-[#141417] border border-[#232329] rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-base font-bold text-white">{ex.name}</h4>
                                                <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
                                                    {ex.muscle}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-semibold uppercase block mt-1">Difficulty: {ex.difficulty}</span>
                                            <p className="text-xs text-gray-300 mt-3 bg-[#0c0c0e] p-2.5 rounded-lg border border-[#1f1f23]">{ex.tips}</p>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    logExerciseActivity(ex.name);
                                                    alert(`Logged ${ex.name} to daily session! Added 120 kcal burn.`);
                                                }}
                                                className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <FaPlus size={10} /> Add to Session
                                            </button>
                                            <button
                                                onClick={() => handleSendMessage(`Tell me how to do ${ex.name}`)}
                                                className="px-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold rounded-lg border border-[#232329] transition-all cursor-pointer"
                                            >
                                                Ask Form
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>
                    )}

                    {/* 3. NUTRITION LOGS TAB */}
                    {activeTab === "nutrition" && (
                        <main className="flex-1 flex flex-col bg-[#070708] p-6 overflow-y-auto animate-fadeIn space-y-6">
                            <div className="border-b border-[#1f1f23] pb-4">
                                <h3 className="text-xl font-bold text-white">Nutrition Command Center</h3>
                                <p className="text-xs text-gray-400">Log meals to track calories and macronutrients.</p>
                            </div>

                            {/* Macro Target Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#141417] border border-[#232329] rounded-xl p-4 space-y-2.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <FaFire className="text-orange-500" /> Calories Consumed
                                        </span>
                                        <span className="font-bold text-white">{totalCaloriesConsumed} / {targetCalories} kcal</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                                            style={{ width: `${Math.min(100, (totalCaloriesConsumed / targetCalories) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="bg-[#141417] border border-[#232329] rounded-xl p-4 space-y-2.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <FaAppleAlt className="text-emerald-400" /> Protein Consumed
                                        </span>
                                        <span className="font-bold text-white">{totalProteinConsumed}g / {targetProtein}g</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                                            style={{ width: `${Math.min(100, (totalProteinConsumed / targetProtein) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Log Meal Form */}
                                <div className="bg-[#141417] border border-[#232329] rounded-xl p-5 space-y-4 lg:col-span-1">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <FaPlus /> Log Daily Meal
                                    </h4>
                                    <form onSubmit={handleLogMeal} className="space-y-3">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Food Name</label>
                                            <input 
                                                type="text"
                                                placeholder="e.g. Chicken breast, banana"
                                                value={foodName}
                                                onChange={(e) => setFoodName(e.target.value)}
                                                className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Meal Type</label>
                                            <select
                                                value={mealType}
                                                onChange={(e) => setMealType(e.target.value)}
                                                className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                            >
                                                <option value="Breakfast">Breakfast</option>
                                                <option value="Lunch">Lunch</option>
                                                <option value="Dinner">Dinner</option>
                                                <option value="Snack">Snack</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Calories (kcal)</label>
                                                <input 
                                                    type="number"
                                                    placeholder="300"
                                                    value={mealCalories}
                                                    onChange={(e) => setMealCalories(e.target.value)}
                                                    className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Protein (g)</label>
                                                <input 
                                                    type="number"
                                                    placeholder="25"
                                                    value={mealProtein}
                                                    onChange={(e) => setMealProtein(e.target.value)}
                                                    className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer mt-2"
                                        >
                                            Save Meal Log
                                        </button>
                                    </form>
                                </div>

                                {/* Logs list */}
                                <div className="bg-[#141417] border border-[#232329] rounded-xl p-5 space-y-4 lg:col-span-2">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Logged Meals</h4>
                                    
                                    {nutritionLoading ? (
                                        <p className="text-xs text-gray-500">Loading daily meals...</p>
                                    ) : nutritionLogs.length === 0 ? (
                                        <p className="text-xs text-gray-500 italic">No food logged today. Start logging to fuel your stats!</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead>
                                                    <tr className="border-b border-[#1f1f23] text-gray-500 uppercase text-[9px] tracking-wider">
                                                        <th className="py-2.5">Food</th>
                                                        <th className="py-2.5">Category</th>
                                                        <th className="py-2.5">Calories</th>
                                                        <th className="py-2.5">Protein</th>
                                                        <th className="py-2.5 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#1f1f23]">
                                                    {nutritionLogs.map((log) => (
                                                        <tr key={log._id} className="text-gray-300">
                                                            <td className="py-3 font-semibold text-white">{log.foodName}</td>
                                                            <td className="py-3">{log.mealType}</td>
                                                            <td className="py-3 text-orange-400">{log.calories} kcal</td>
                                                            <td className="py-3 text-emerald-400">{log.protein}g</td>
                                                            <td className="py-3 text-right">
                                                                <button 
                                                                    onClick={() => handleDeleteMeal(log._id)}
                                                                    className="p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-colors cursor-pointer"
                                                                >
                                                                    <FaTrash size={10} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>
                    )}

                    {/* 4. SETTINGS TAB */}
                    {activeTab === "settings" && (
                        <main className="flex-1 flex flex-col bg-[#070708] p-6 overflow-y-auto animate-fadeIn space-y-6">
                            <div className="border-b border-[#1f1f23] pb-4">
                                <h3 className="text-xl font-bold text-white">Coaching Preferences</h3>
                                <p className="text-xs text-gray-400">Configure targets to direct your coaching recommendations.</p>
                            </div>

                            {settingsSuccess && (
                                <div className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold">
                                    Targets saved successfully! Updates loaded into trackers.
                                </div>
                            )}

                            <div className="bg-[#141417] border border-[#232329] rounded-xl p-5 max-w-xl">
                                <form onSubmit={handleSaveSettings} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Daily Calories Goal (kcal)</label>
                                            <input 
                                                type="number"
                                                value={targetCalories}
                                                onChange={(e) => setTargetCalories(Number(e.target.value))}
                                                className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Daily Protein Goal (g)</label>
                                            <input 
                                                type="number"
                                                value={targetProtein}
                                                onChange={(e) => setTargetProtein(Number(e.target.value))}
                                                className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Daily Water Goal (Liters)</label>
                                            <input 
                                                type="number"
                                                step="0.1"
                                                value={targetWater}
                                                onChange={(e) => setTargetWater(Number(e.target.value))}
                                                className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Daily Steps Target</label>
                                            <input 
                                                type="number"
                                                value={targetSteps}
                                                onChange={(e) => setTargetSteps(Number(e.target.value))}
                                                className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/40"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Fitness Experience Level</label>
                                        <select
                                            value={coachLevel}
                                            onChange={(e) => setCoachLevel(e.target.value)}
                                            className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/40 font-semibold"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer mt-4"
                                    >
                                        Save Targets
                                    </button>
                                </form>
                            </div>
                        </main>
                    )}

                    {/* RIGHT WIDGET PANEL (shared across tabs except settings) */}
                    {activeTab !== "settings" && (
                        <aside className="w-80 bg-[#0c0c0e] border-l border-[#1f1f23] overflow-y-auto p-5 space-y-6 hidden lg:block">
                            
                            {/* Steps & Energy Burn Vitals */}
                            <div className="bg-[#141417] border border-[#232329] rounded-xl p-4 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                    <FaRunning className="text-emerald-400" /> Daily Vitals Tracker
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#0c0c0e] border border-[#1f1f23] p-3 rounded-lg text-center">
                                        <span className="text-[10px] text-gray-500 font-semibold block uppercase">Steps</span>
                                        <span className="text-lg font-bold text-white">{steps.toLocaleString()}</span>
                                        <span className="text-[9px] text-gray-400 block mt-0.5">Target: {targetSteps.toLocaleString()}</span>
                                    </div>
                                    <div className="bg-[#0c0c0e] border border-[#1f1f23] p-3 rounded-lg text-center">
                                        <span className="text-[10px] text-gray-500 font-semibold block uppercase">Burned</span>
                                        <span className="text-lg font-bold text-emerald-400">{totalDailyCaloriesBurned} kcal</span>
                                        <span className="text-[9px] text-gray-400 block mt-0.5">Basal + Active</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={incrementSteps}
                                        disabled={steps >= targetSteps}
                                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold border border-[#232329] transition-colors cursor-pointer"
                                    >
                                        + 1K Steps
                                    </button>
                                    <button
                                        onClick={handleWorkoutCheck}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                            workoutCompleted 
                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                                : 'bg-white/5 hover:bg-white/10 border-[#232329] text-white'
                                        }`}
                                    >
                                        <FaCheckCircle />
                                        <span>{workoutCompleted ? "Done" : "Workout"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Interactive BMI Calculator */}
                            <div className="bg-[#141417] border border-[#232329] rounded-xl p-4 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                    <FaCalculator className="text-emerald-400" /> BMI Calculator
                                </h3>

                                <form onSubmit={calculateBMI} className="space-y-3">
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g. 70"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/40"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Height (cm)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 175"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/40"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            type="submit"
                                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                        >
                                            Calculate
                                        </button>
                                        {bmiResult && (
                                            <button
                                                type="button"
                                                onClick={resetBMI}
                                                className="px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-[#232329] transition-colors cursor-pointer"
                                            >
                                                <FaUndo size={10} />
                                            </button>
                                        )}
                                    </div>
                                </form>

                                {bmiResult && (
                                    <div className="mt-3 p-3 bg-[#0c0c0e] border border-[#1f1f23] rounded-lg space-y-2 animate-fadeIn">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] text-gray-400">Your BMI:</span>
                                            <span className="text-base font-bold text-white">{bmiResult}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] text-gray-400">Status:</span>
                                            <span className={`text-xs font-bold uppercase ${
                                                bmiCategory === "Healthy weight" 
                                                    ? "text-emerald-400" 
                                                    : bmiCategory === "Overweight" 
                                                        ? "text-yellow-400" 
                                                        : "text-red-400"
                                            }`}>{bmiCategory}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-1 flex">
                                            <div className="h-full bg-blue-400 flex-1" title="Underweight"></div>
                                            <div className="h-full bg-emerald-400 flex-1" title="Normal"></div>
                                            <div className="h-full bg-yellow-400 flex-1" title="Overweight"></div>
                                            <div className="h-full bg-red-400 flex-1" title="Obese"></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Water Intake Tracker */}
                            <div className="bg-[#141417] border border-[#232329] rounded-xl p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                        <FaWater className="text-emerald-400" /> Hydration log
                                    </h3>
                                    <button 
                                        onClick={resetWater}
                                        className="text-[10px] text-gray-500 hover:text-white transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] text-gray-400">Water target achieved:</span>
                                        <span className="text-sm font-bold text-white">{(waterGlasses * 0.4).toFixed(1)}L <span className="text-xs text-gray-500">/ {targetWater.toFixed(1)}L</span></span>
                                    </div>

                                    {/* Dynamic cups row */}
                                    <div className="flex flex-wrap gap-2">
                                        {[...Array(glassesGoal)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-9 w-9 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                                                    i < waterGlasses 
                                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                                                        : 'bg-[#0c0c0e] border-[#1f1f23] text-gray-600'
                                                }`}
                                            >
                                                <FaWater size={14} />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={incrementWater}
                                        disabled={waterGlasses >= glassesGoal}
                                        className="w-full py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-white border border-[#232329] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                    >
                                        {waterGlasses >= glassesGoal ? "Target Complete! 🎯" : "+ Add Glass (400ml)"}
                                    </button>
                                </div>
                            </div>

                            {/* Coach Quote Card */}
                            <div className="bg-gradient-to-tr from-emerald-500/10 to-[#39ff14]/5 border border-emerald-500/20 rounded-xl p-4 text-center">
                                <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold">Trainer Tip of the Day</span>
                                <blockquote className="text-xs text-gray-300 mt-2 italic leading-relaxed">
                                    "Your body can stand almost anything. It's your mind that you have to convince. Keep pushing forward."
                                </blockquote>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Bot
