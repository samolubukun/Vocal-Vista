import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDailyLog = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        // Check if log for this date already exists
        const existingLog = await ctx.db
            .query('dailyLogs')
            .withIndex("by_user_date", (q) => q.eq("uid", args.uid).eq("date", args.date))
            .first();
        
        if (existingLog) {
            // Update existing log
            await ctx.db.patch(existingLog._id, {
                productsUsed: args.productsUsed,
                habits: args.habits,
                skinFeeling: args.skinFeeling,
                notes: args.notes,
            });
            return existingLog._id;
        }
        
        const result = await ctx.db.insert('dailyLogs', {
            uid: args.uid,
            date: args.date,
            productsUsed: args.productsUsed,
            habits: args.habits,
            skinFeeling: args.skinFeeling,
            notes: args.notes,
        });
        return result;
    }
});

export const getDailyLogs = query({
    args: {
        uid: v.id('users'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('dailyLogs')
            .withIndex("by_user", (q) => q.eq("uid", args.uid))
            .order('desc')
            .collect();
        return result;
    }
});

export const getDailyLogByDate = query({
    args: {
        uid: v.id('users'),
        date: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('dailyLogs')
            .withIndex("by_user_date", (q) => q.eq("uid", args.uid).eq("date", args.date))
            .first();
        return result;
    }
});

export const getRecentLogs = query({
    args: {
        uid: v.id('users'),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('dailyLogs')
            .withIndex("by_user", (q) => q.eq("uid", args.uid))
            .order('desc')
            .take(args.limit || 7);
        return result;
    }
});

export const deleteDailyLog = mutation({
    args: {
        id: v.id('dailyLogs'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const updateDailyLog = mutation({
    args: {
        id: v.id('dailyLogs'),
        productsUsed: v.optional(v.array(v.object({
            name: v.string(),
            type: v.string(),
            timeOfDay: v.string(),
        }))),
        habits: v.optional(v.object({
            waterIntake: v.optional(v.number()),
            sleepHours: v.optional(v.number()),
            stressLevel: v.optional(v.string()),
            diet: v.optional(v.string()),
        })),
        skinFeeling: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updateFields } = args;
        const filteredFields = Object.fromEntries(
            Object.entries(updateFields).filter(([_, value]) => value !== undefined)
        );
        await ctx.db.patch(id, filteredFields);
    }
});
