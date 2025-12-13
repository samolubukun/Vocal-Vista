import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveScanProductRecommendations = mutation({
    args: {
        scanId: v.id('skinScans'),
        products: v.array(v.object({
            name: v.string(),
            url: v.string(),
            price: v.union(v.string(), v.null()),
            source: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        // Clean up products - convert null prices to undefined for storage
        const cleanedProducts = args.products.map(p => ({
            name: p.name,
            url: p.url,
            price: p.price ?? undefined,
            source: p.source,
        }));

        // Check if already exists
        const existing = await ctx.db
            .query('scanProductRecommendations')
            .withIndex('by_scan', (q) => q.eq('scanId', args.scanId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                products: cleanedProducts,
            });
            return existing._id;
        }

        return await ctx.db.insert('scanProductRecommendations', {
            scanId: args.scanId,
            products: cleanedProducts,
        });
    }
});

export const getScanProductRecommendations = query({
    args: {
        scanId: v.id('skinScans'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('scanProductRecommendations')
            .withIndex('by_scan', (q) => q.eq('scanId', args.scanId))
            .first();
        return result;
    }
});

export const saveProductUsageGuide = mutation({
    args: {
        scanId: v.id('skinScans'),
        guide: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if already exists
        const existing = await ctx.db
            .query('productUsageGuides')
            .withIndex('by_scan', (q) => q.eq('scanId', args.scanId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                guide: args.guide,
            });
            return existing._id;
        }

        return await ctx.db.insert('productUsageGuides', {
            scanId: args.scanId,
            guide: args.guide,
        });
    }
});

export const getProductUsageGuide = query({
    args: {
        scanId: v.id('skinScans'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('productUsageGuides')
            .withIndex('by_scan', (q) => q.eq('scanId', args.scanId))
            .first();
        return result;
    }
});
