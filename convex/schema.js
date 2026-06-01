import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        credits: v.number(),
        subscriptionId: v.optional(v.string()),
        streakCount: v.optional(v.number()),
        lastActiveDate: v.optional(v.string()),
        totalSpeakingMinutes: v.optional(v.number()),
        unlockedBadges: v.optional(v.array(v.string())),
    }),

    DiscussionRoom:defineTable({
        coachingOption:v.string(),
        topic:v.string(),
        expertName:v.string(),
        conversation:v.optional(v.any()),
        summery:v.optional(v.any()),
        uid:v.optional(v.id('users')),
        isChallenge: v.optional(v.boolean()),
        challengeTopic: v.optional(v.string()),
        challengeTimeLimit: v.optional(v.number()),
        customScenario: v.optional(v.object({
            jobTitle: v.string(),
            companyName: v.optional(v.string()),
            focusPoints: v.optional(v.array(v.string())),
        })),
        analytics: v.optional(v.object({
            wpm: v.number(),
            fillerWordCount: v.number(),
            fillerWordsList: v.array(v.string()),
            vocalPacingScore: v.number(),
        })),
    })
});