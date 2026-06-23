import NutritionLog from '../models/nutritionLog.model.js';

// @desc    Log a new meal
// @route   POST /nutrition/log
// @access  Private
export const createLog = async (req, res) => {
    try {
        const { foodName, mealType, calories, protein } = req.body;

        if (!foodName || !mealType || calories === undefined || protein === undefined) {
            return res.status(400).json({ error: "Please provide food name, meal type, calories, and protein" });
        }

        const log = await NutritionLog.create({
            userAccount: req.user._id,
            foodName,
            mealType,
            calories: Number(calories),
            protein: Number(protein)
        });

        return res.status(201).json(log);
    } catch (error) {
        console.error("Error creating nutrition log:", error);
        return res.status(500).json({ error: "Internal server error while logging meal" });
    }
};

// @desc    Get user's meal logs
// @route   GET /nutrition/logs
// @access  Private
export const getLogs = async (req, res) => {
    try {
        // Fetch logs for logged-in user, sorted by newest first
        const logs = await NutritionLog.find({ userAccount: req.user._id }).sort({ timestamp: -1 });
        return res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching nutrition logs:", error);
        return res.status(500).json({ error: "Internal server error while fetching logs" });
    }
};

// @desc    Delete a logged meal
// @route   DELETE /nutrition/log/:id
// @access  Private
export const deleteLog = async (req, res) => {
    try {
        const log = await NutritionLog.findOne({ _id: req.params.id, userAccount: req.user._id });
        
        if (!log) {
            return res.status(404).json({ error: "Log not found or unauthorized" });
        }

        await log.deleteOne();
        return res.status(200).json({ message: "Log removed successfully" });
    } catch (error) {
        console.error("Error deleting nutrition log:", error);
        return res.status(500).json({ error: "Internal server error while deleting log" });
    }
};
