import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProduct = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('products', args);
        return result;
    }
});

export const getProducts = query({
    args: {},
    handler: async (ctx) => {
        const result = await ctx.db.query('products').collect();
        return result;
    }
});

export const getProductsByType = query({
    args: {
        type: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('products')
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .collect();
        return result;
    }
});

export const getProduct = query({
    args: {
        id: v.id('products'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
});

export const getRecommendedProducts = query({
    args: {
        skinType: v.optional(v.string()),
        concerns: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        let products = await ctx.db.query('products').collect();
        
        if (args.skinType) {
            products = products.filter(p => 
                p.skinTypes.includes(args.skinType) || p.skinTypes.includes('all')
            );
        }
        
        if (args.concerns && args.concerns.length > 0) {
            products = products.filter(p =>
                p.concerns.some(c => args.concerns.includes(c))
            );
        }
        
        // Sort by rating
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        return products;
    }
});

export const updateProduct = mutation({
    args: {
        id: v.id('products'),
        name: v.optional(v.string()),
        brand: v.optional(v.string()),
        type: v.optional(v.string()),
        description: v.optional(v.string()),
        ingredients: v.optional(v.array(v.string())),
        skinTypes: v.optional(v.array(v.string())),
        concerns: v.optional(v.array(v.string())),
        price: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        rating: v.optional(v.number()),
        purchaseUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updateFields } = args;
        const filteredFields = Object.fromEntries(
            Object.entries(updateFields).filter(([_, value]) => value !== undefined)
        );
        await ctx.db.patch(id, filteredFields);
    }
});

export const deleteProduct = mutation({
    args: {
        id: v.id('products'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});
