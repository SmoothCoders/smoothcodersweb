import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  // Site Identity
  siteName: {
    type: String,
    default: 'SmoothCoders'
  },
  siteTagline: {
    type: String,
    default: 'Digital Excellence'
  },
  headerLogoUrl: {
    type: String,
    default: ''
  },
  headerLogoWidth: {
    type: Number,
    default: 180
  },
  footerLogoUrl: {
    type: String,
    default: ''
  },
  footerLogoWidth: {
    type: Number,
    default: 180
  },
  faviconUrl: {
    type: String,
    default: ''
  },

  // Contact Information
  contactEmail: {
    type: String,
    default: 'contact@smoothcoders.com'
  },
  contactPhone: {
    type: String,
    default: '+91 9021311559'
  },
  contactAddress: {
    type: String,
    default: 'Vaijapur, Maharashtra, India'
  },
  businessHours: {
    type: String,
    default: 'Mon-Sat: 9AM-6PM'
  },

  // Social Media Links
  socialMedia: {
    facebook: {
      type: String,
      default: 'https://facebook.com'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com'
    },
    instagram: {
      type: String,
      default: 'https://instagram.com'
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com'
    },
    youtube: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    }
  },

  // Payment Gateways
  razorpay: {
    enabled: {
      type: Boolean,
      default: false
    },
    keyId: {
      type: String,
      default: ''
    },
    keySecret: {
      type: String,
      default: ''
    }
  },

  // SEO & Analytics
  googleAnalytics: {
    enabled: {
      type: Boolean,
      default: false
    },
    measurementId: {
      type: String,
      default: ''
    }
  },
  googleSearchConsole: {
    enabled: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      default: ''
    }
  },
  facebookPixel: {
    enabled: {
      type: Boolean,
      default: false
    },
    pixelId: {
      type: String,
      default: ''
    }
  },

  // SMTP Email Settings
  smtp: {
    enabled: {
      type: Boolean,
      default: false
    },
    host: {
      type: String,
      default: ''
    },
    port: {
      type: Number,
      default: 587
    },
    secure: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    fromEmail: {
      type: String,
      default: ''
    },
    fromName: {
      type: String,
      default: 'SmoothCoders'
    }
  },

  // Twilio SMS Settings
  twilio: {
    enabled: {
      type: Boolean,
      default: false
    },
    accountSid: {
      type: String,
      default: ''
    },
    authToken: {
      type: String,
      default: ''
    },
    phoneNumber: {
      type: String,
      default: ''
    }
  },

  // WhatsApp Business API
  whatsapp: {
    enabled: {
      type: Boolean,
      default: false
    },
    businessNumber: {
      type: String,
      default: ''
    },
    apiKey: {
      type: String,
      default: ''
    }
  },

  // Site Features
  features: {
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    allowRegistration: {
      type: Boolean,
      default: true
    },
    enableBlog: {
      type: Boolean,
      default: true
    },
    enablePortfolio: {
      type: Boolean,
      default: true
    },
    enableTestimonials: {
      type: Boolean,
      default: true
    }
  },

  // Metadata
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
SettingsSchema.index({ _id: 1 }, { unique: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
