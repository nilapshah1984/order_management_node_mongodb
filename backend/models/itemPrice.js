import mongoose from "mongoose";

const itemPrice = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  qty: {
    // type: String,
    type: Number,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
});
export default mongoose.model("Itemprice", itemPrice);



// import mongoose from "mongoose";

// const itemPrice = new mongoose.Schema({
//   itemName: {
//     type: String,
//     required: true,
//     trim: true,
//   }, //new Changes
//   item: {
//     type: mongoose.Schema.Types.ObjectId, //new Changes
//     ref: "Item",
//     required: true,
//   },
//   price: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   qty: {
//     type: Number,
//     trim: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//     trim: true,
//   },
//   stock: {
//     type: Number,
//     default: 0,
//   },
// });
// export default mongoose.model("Itemprice", itemPrice);
