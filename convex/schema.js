import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        credits: v.number(),
        subscriptionId: v.optional(v.string()),
        skinType: v.optional(v.string()),
        skinConcerns: v.optional(v.array(v.string())),
        profileCompleted: v.optional(v.boolean()),
    }),

    skinScans: defineTable({
        uid: v.id('users'),
        imageUrl: v.string(),
        analysis: v.object({
            overallScore: v.number(),
            conditions: v.array(v.object({
                name: v.string(),
                severity: v.string(),
                confidence: v.number(),
            })),
            recommendations: v.array(v.string()),
            skinType: v.optional(v.string()),
            detailedAnalysis: v.optional(v.string()),
        }),
        notes: v.optional(v.string()),
    }).index("by_user", ["uid"]),

    dailyLogs: defineTable({
        uid: v.id('users'),
        date: v.string(),
        productsUsed: v.array(v.object({
            name: v.string(),
            type: v.string(),
            timeOfDay: v.string(),
        })),
        habits: v.object({
            waterIntake: v.optional(v.number()),
            sleepHours: v.optional(v.number()),
            stressLevel: v.optional(v.string()),
            diet: v.optional(v.string()),
        }),
        skinFeeling: v.optional(v.string()),
        notes: v.optional(v.string()),
    }).index("by_user", ["uid"]).index("by_user_date", ["uid", "date"]),

    chatHistory: defineTable({
        uid: v.id('users'),
        messages: v.array(v.object({
            role: v.string(),
            content: v.string(),
            timestamp: v.number(),
        })),
        topic: v.optional(v.string()),
    }).index("by_user", ["uid"]),

    products: defineTable({
        name: v.string(),
        brand: v.string(),
        type: v.string(),
        description: v.string(),
        ingredients: v.array(v.string()),
        skinTypes: v.array(v.string()),
        concerns: v.array(v.string()),
        price: v.number(),
        imageUrl: v.optional(v.string()),
        rating: v.optional(v.number()),
        purchaseUrl: v.optional(v.string()),
    }).index("by_type", ["type"]).index("by_concern", ["concerns"]),

    scanProductRecommendations: defineTable({
        scanId: v.id('skinScans'),
        products: v.array(v.object({
            name: v.string(),
            url: v.string(),
            price: v.optional(v.string()),
            source: v.string(),
        })),
    }).index("by_scan", ["scanId"]),

    productUsageGuides: defineTable({
        scanId: v.id('skinScans'),
        guide: v.string(),
    }).index("by_scan", ["scanId"]),
});