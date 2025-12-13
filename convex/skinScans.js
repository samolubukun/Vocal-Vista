import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSkinScan = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('skinScans', {
            uid: args.uid,
            imageUrl: args.imageUrl,
            analysis: args.analysis,
            notes: args.notes,
        });
        return result;
    }
});

export const getSkinScans = query({
    args: {
        uid: v.id('users'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('skinScans')
            .withIndex("by_user", (q) => q.eq("uid", args.uid))
            .order('desc')
            .collect();
        return result;
    }
});

export const getSkinScan = query({
    args: {
        id: v.id('skinScans'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
});

export const getLatestSkinScan = query({
    args: {
        uid: v.id('users'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('skinScans')
            .withIndex("by_user", (q) => q.eq("uid", args.uid))
            .order('desc')
            .first();
        return result;
    }
});

export const deleteSkinScan = mutation({
    args: {
        id: v.id('skinScans'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const updateSkinScanNotes = mutation({
    args: {
        id: v.id('skinScans'),
        notes: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            notes: args.notes,
        });
    }
});
