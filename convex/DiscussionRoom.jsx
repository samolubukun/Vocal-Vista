import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewRoom = mutation({
    args:{
        coachingOption:v.string(),
        topic:v.string(),
        expertName:v.string(),
        uid:v.optional(v.id('users')),
        isChallenge:v.optional(v.boolean()),
        challengeTopic:v.optional(v.string()),
        challengeTimeLimit:v.optional(v.number()),
        customScenario:v.optional(v.object({
            jobTitle:v.string(),
            companyName:v.optional(v.string()),
            focusPoints:v.optional(v.array(v.string()))
        }))
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.insert('DiscussionRoom',{
            coachingOption:args.coachingOption,
            topic:args.topic,
            expertName:args.expertName,
            uid:args?.uid,
            isChallenge:args?.isChallenge,
            challengeTopic:args?.challengeTopic,
            challengeTimeLimit:args?.challengeTimeLimit,
            customScenario:args?.customScenario
        });

        return result;
    }
})

export const GetDiscussionRoom=query({
    args:{
        id:v.id('DiscussionRoom')
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.get(args.id);
        return result;
    }
})

export const UpdateConversation=mutation({
    args:{
        id:v.id('DiscussionRoom'),
        conversation:v.any()
    },
    handler:async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            conversation:args.conversation
        })
    }
})

export const UpdateSummery=mutation({
    args:{
        id:v.id('DiscussionRoom'),
        summery:v.any()
    },
    handler:async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            summery:args.summery
        })
    }
})

export const GetAllDiscussionRoom=query({
    args:{
        uid:v.id('users')
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.query('DiscussionRoom')
            .filter(q=>q.eq(q.field('uid'),args.uid))
            .order('desc')
            .collect();
        return result;
    }
})

export const DeleteDiscussionRoom = mutation({
    args:{
        id:v.id('DiscussionRoom')
    },
    handler:async(ctx,args)=>{
        await ctx.db.delete(args.id);
    }
})

export const UpdateAnalytics = mutation({
    args:{
        id:v.id('DiscussionRoom'),
        analytics:v.object({
            wpm:v.number(),
            fillerWordCount:v.number(),
            fillerWordsList:v.array(v.string()),
            vocalPacingScore:v.number()
        })
    },
    handler:async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            analytics:args.analytics
        })
    }
})