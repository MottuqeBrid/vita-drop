const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Constants
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const USER_ROLES = ["admin", "donor", "hospital", "volunteer", "guest"];
const GENDERS = ["male", "female", "other"];
const DONATION_INTERVAL_MONTHS = {
  male: 3,
  female: 4,
  other: 3,
};

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters long"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return EMAIL_REGEX.test(email);
        },
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (phone) {
          return !phone || /^[+]?[\d\s\-\(\)]{10,15}$/.test(phone);
        },
        message: "Please enter a valid phone number",
      },
    },

    otp: [
      {
        code: { type: String },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 300,
        },
      },
    ],

    dateOfBirth: {
      type: Date,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: {
        values: GENDERS,
        message: "Gender must be one of: " + GENDERS.join(", "),
      },
      default: "other",
    },

    // User Role and Permissions
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: "Role must be one of: " + USER_ROLES.join(", "),
      },
      default: "donor",
    },

    // Medical Information
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUPS,
        message: "Blood group must be one of: " + BLOOD_GROUPS.join(", "),
      },
    },

    // Location Information
    location: {
      presentAddress: {
        type: String,
        trim: true,
      },
      permanentAddress: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: "Bangladesh",
      },
      postalCode: {
        type: String,
        trim: true,
      },
    },

    // Profile Photos
    photo: {
      profilePhoto: {
        type: String,
        trim: true,
      },
      coverPhoto: {
        type: String,
        trim: true,
      },
    },

    // Donor Specific Fields
    isAvailable: {
      type: Boolean,
      default: true,
    },

    lastDonationDate: {
      place: {
        type: String,
        trim: true,
      },
      date: {
        type: Date,
      },
      bloodGroup: {
        type: String,
        enum: {
          values: BLOOD_GROUPS,
          message: "Blood group must be one of: " + BLOOD_GROUPS.join(", "),
        },
      },
      verificationDocument: {
        type: String,
        trim: true,
      },
    },

    isEligible: {
      type: Boolean,
      default: true,
    },

    nextDonationDate: {
      type: Date,
    },

    willingToDonate: {
      type: Boolean,
      default: false,
    },

    // Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
    },

    numberOfDonations: {
      type: Number,
      default: 0,
    },

    donationHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donate",
      },
    ],

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    weight: {
      type: Number,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },
    termsConditions: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ bloodGroup: 1, isAvailable: 1, isEligible: 1 });
userSchema.index({ "location.city": 1, "location.state": 1 });
userSchema.index({ role: 1 });

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  try {
    // Hash password if it's modified
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Calculate age from date of birth
    if (this.isModified("dateOfBirth") && this.dateOfBirth) {
      const today = new Date();
      let age = today.getFullYear() - this.dateOfBirth.getFullYear();
      const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())
      ) {
        age--;
      }
      this.age = age;
    }

    // Calculate next donation date and eligibility for donors
    if (
      this.role === "donor" &&
      (this.isNew ||
        this.isModified("lastDonationDate") ||
        this.isModified("gender"))
    ) {
      this.calculateNextDonationDate();
      this.isEligible = this.checkEligibility();
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to calculate next donation date
userSchema.methods.calculateNextDonationDate = function () {
  if (this.lastDonationDate?.date) {
    const nextDate = new Date(this.lastDonationDate.date);
    const monthGap =
      DONATION_INTERVAL_MONTHS[this.gender] || DONATION_INTERVAL_MONTHS.other;
    nextDate.setMonth(nextDate.getMonth() + monthGap);
    this.nextDonationDate = nextDate;
  } else {
    this.nextDonationDate = null;
  }
};

// Method to check donor eligibility
userSchema.methods.checkEligibility = function () {
  // Basic eligibility checks
  if ((this.gender === "female" && this.weight < 45) || !this.willingToDonate) {
    return false;
  }
  if (
    ((this.gender === "male" || this.gender === "other") && this.weight < 48) ||
    !this.willingToDonate
  ) {
    return false;
  }
  if (this.age < 18 || this.age > 65) return false;

  // Last donation date check
  if (!this.lastDonationDate?.date) return true;

  const today = new Date();
  return this.nextDonationDate ? today >= this.nextDonationDate : true;
};

// Method to update last donation
userSchema.methods.updateLastDonation = async function (donationData) {
  this.lastDonationDate = {
    place: donationData.place,
    date: donationData.date || new Date(),
    bloodGroup: donationData.bloodGroup || this.bloodGroup,
    verificationDocument: donationData.verificationDocument,
  };
  this.numberOfDonations += 1;
  this.calculateNextDonationDate();
  this.isEligible = this.checkEligibility();

  return this.save();
};

module.exports = mongoose.model("User", userSchema);
