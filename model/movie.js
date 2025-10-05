const mongoose = require("mongoose");

// const expenseSchema = new mongoose.Schema(
//   {
//     itemName: { type: String, required: true },
//     category: {
//       type: String,
//       enum: ["equipment", "props", "transport", "crew", "misc"],
//       default: "misc",
//     },
//     cost: { type: Number, required: true },
//     vendor: String,
//     purchaseDate: { type: Date, default: Date.now },
//     billUrl: String,
//   },
//   { timestamps: true }
// );

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    daysLeft: { type: Number },
    people: { type: String },
    infiniteCanvasUrl: String,
    chatUrl: String,
    currentStage: {
      type: String,
      enum: ["Pre-Production", "Production", "Post-Production"],
      default: "Pre-Production",
    },
    budget: {
      totalBudget: { type: Number, default: 0 },
      usedBudget: { type: Number, default: 0 },

      expenses: [
        {
          item: { type: String, required: true },
          cost: { type: Number, required: true },
          rent: { type: Boolean, required: true },
          category: {
            type: String,
            enum: [
              "Equipment",
              "Location",
              "Cast",
              "Crew",
              "Post-Production",
              "Other",
            ],
            default: "Other",
          },
          billUrl: String,
          date: { type: Date, default: Date.now },
        },
      ],
    },

    shootSchedule: [
      {
        sceneTitle: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String },

        attendees: [String],
        attendance: [String],

        budgetAllocated: { type: Number, default: 0 },
        expenses: [
          {
            item: { type: String },
            cost: { type: Number },
            billUrl: { type: String },
          },
        ],

        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
