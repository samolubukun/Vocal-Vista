import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createChatSession = mutation({
    args: {
        uid: v.id('users'),
        topic: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('chatHistory', {
            uid: args.uid,
            messages: [],
            topic: args.topic,
        });
        return result;
    }
});

export const addMessage = mutation({
    args: {
        id: v.id('chatHistory'),
        message: v.object({
            role: v.string(),
            content: v.string(),
            timestamp: v.number(),
        }),
    },
    handler: async (ctx, args) => {
        const chat = await ctx.db.get(args.id);
        if (!chat) {
            throw new Error('Chat session not found');
        }
        
        const updatedMessages = [...chat.messages, args.message];
        await ctx.db.patch(args.id, {
            messages: updatedMessages,
        });
        return updatedMessages;
    }
});

export const getChatSession = query({
    args: {
        id: v.id('chatHistory'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
});

export const getChatSessions = query({
    args: {
        uid: v.id('users'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('chatHistory')
            .withIndex("by_user", (q) => q.eq("uid", args.uid))
            .order('desc')
            .collect();
        // Filter out empty chats (no messages)
        return result.filter(session => session.messages && session.messages.length > 0);
    }
});

export const getLatestChatSession = query({
    args: {
        uid: v.id('users'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db
            .query('chatHistory')
            .withIndex("by_user", (q) => q.eq("uid", args.uid))
            .order('desc')
            .first();
        return result;
    }
});

export const deleteChatSession = mutation({
    args: {
        id: v.id('chatHistory'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const clearChatMessages = mutation({
    args: {
        id: v.id('chatHistory'),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            messages: [],
        });
    }
});

export const updateChatTopic = mutation({
    args: {
        id: v.id('chatHistory'),
        topic: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            topic: args.topic,
        });
    }
});
