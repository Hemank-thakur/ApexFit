import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
    userAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },
    foodName: {
        type: String,
        required: true,
        trim: true
    },
    mealType: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack']
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    protein: {
        type: Number,
        required: true,
        min: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);
export default NutritionLog;
