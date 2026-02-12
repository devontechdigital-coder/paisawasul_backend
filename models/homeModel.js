import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
    {
        meta_title: {
            type: String,
            default: ""
        },
        meta_description: {
            type: String,
            default: ""
        },
        meta_head: {
            type: String,
            default: ""
        },
        meta_logo: {
            type: String,
            default: ""
        },
        meta_favicon: {
            type: String,
            default: ""
        },
        header: {
            type: Object,
            default: {}
        },
        footer: {
            type: Object,
            default: {}
        },
        footer_credit: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        cash: {
            type: String,
            default: ""
        },
        razorpay: {
            type: String,
            default: ""
        },
        shareAmt: {
         type: Number,
        default:0
        },
         withdrawalAmt: {
         type: Number,
        default:0
        },
        commission: {
         type: Number,
        default:0
        },
        ios : {
          type: String,
            default: ""
        },
        android: {
          type: String,
            default: ""
        },
        roundOffTime: {
          type: String,
            default: ""
        },
 startingHour: {
         type: Number,
        default:0
        },
 timeGap: {
         type: Number,
        default:0
        },
 noOfDays: {
         type: Number,
        default:0
        },
    startTime: {
          type: String,
            default: ""
        },
     endTime: {
          type: String,
            default: ""
        },
           keyId: {
          type: String,
            default: ""
        },
          keySecret: {
          type: String,
            default: ""
        },
        recommended_user: {
            type: Array,
            default: ""
        },  gst: {
          type: String,
            default: ""
        },
         startNightTime: {
          type: String,
            default: ""
        },
         endingNightTime: {
          type: String,
            default: ""
        },
         nightCharges: {
          type: Number,
       
        },
        
    },
    { timestamps: true }
);

const homeModel = mongoose.model("home", homeSchema);

// Check if data exists, if not, create a new document with default values
const checkOrCreateDefaultData = async () => {
    try {
        const result = await homeModel.findOne({});
        if (!result) {
            // No document found, create a new one with default values
            const newData = new homeModel();
            await newData.save();
            console.log("Blank home data created successfully.");
        }
    } catch (error) {
        console.error("Error checking or creating home data:", error);
    }
};

checkOrCreateDefaultData();

export default homeModel;
