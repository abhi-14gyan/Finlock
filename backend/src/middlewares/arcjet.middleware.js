// middlewares/arcjet.middleware.js

let ajInstance = null;
let arcjetLib = null;
let isSpoofedBot = null;

// Helper function to dynamically import Arcjet if it hasn't been loaded yet
const getArcjetInstance = async () => {
  if (!ajInstance) {
    // Dynamically import the ES module packages inside CommonJS
    const arcjetModule = await import("@arcjet/node");
    const inspectModule = await import("@arcjet/inspect");
    arcjetLib = arcjetModule;
    isSpoofedBot = inspectModule.isSpoofedBot;
    
    const arcjet = arcjetModule.default;
    const { shield, detectBot, tokenBucket } = arcjetModule;

    ajInstance = arcjet({
      key: process.env.ARCJET_API_KEY,
      characteristics: ["ip.src"],
      rules: [
        shield({ mode: "LIVE" }),
        detectBot({
          mode: "LIVE",
          allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
        tokenBucket({
          mode: "LIVE",
          refillRate: 50, 
          interval: 3600, 
          capacity: 50,
        }),
      ],
    });
  }
  return { aj: ajInstance, isSpoofedBot };
};

// Middleware for rate-limiting + bot detection
const rateLimiter = async (req, res, next) => {
  try {
    // 🚀 Retrieve our dynamically loaded Arcjet instance safely
    const { aj, isSpoofedBot } = await getArcjetInstance();

    const userId = req.user?._id?.toString() || req.ip;

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests. Try again Later" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bots not allowed" });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({ error: "Spoofed bot detected" });
    }

    next();
  } catch (err) {
    console.error("Arcjet error:", err);
    res.status(500).json({ error: "Arcjet internal error" });
  }
};

module.exports = { rateLimiter };