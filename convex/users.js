import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateUser=mutation({
    args:{
        name:v.string(),
        email:v.string(),
    },
    handler:async(ctx,args)=>{
        // If user already exist
        const userData=await ctx.db.query('users')
        .filter(q=>q.eq(q.field('email'),args.email))
        .collect();

        // If not Then add new user
        if(userData?.length==0)
        {
            const data={
                name:args.name,
                email:args.email,
                credits:120
            }
            const result=await ctx.db.insert('users',{
                ...data
            });
            return data;
        }
        return userData[0];
    }
})


export const UpdateUserToken = mutation({
    args:{
        id:v.id('users'),
        credits:v.number()
    },
    handler:async(ctx,args)=>{
        // Read current user to validate and avoid negative credits
        const user = await ctx.db.get(args.id);
        if(!user){
            throw new Error('User not found');
        }

        // Ensure credits never go below 0
        const newCredits = Math.max(0, Number(args.credits));

        await ctx.db.patch(args.id,{
            credits:newCredits
        })

        // Return the new credits value so clients can react accordingly
        return { credits: newCredits };
    }
})

export const UpdateUserStreak = mutation({
    args: {
        id: v.id('users'),
        todayDateStr: v.string() // Format: YYYY-MM-DD
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) throw new Error('User not found');

        const lastActive = user.lastActiveDate;
        let streak = user.streakCount || 0;

        if (lastActive === args.todayDateStr) {
            // Already active today, streak remains same
        } else {
            // Check if last active was yesterday
            if (lastActive) {
                const lastDate = new Date(lastActive);
                const todayDate = new Date(args.todayDateStr);
                const diffTime = Math.abs(todayDate - lastDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    streak += 1;
                } else if (diffDays > 1) {
                    streak = 1; // Reset streak since they missed a day
                }
            } else {
                streak = 1; // First time activity
            }
        }

        // Auto unlock daily streak badges!
        let badges = user.unlockedBadges || [];
        if (streak >= 5 && !badges.includes("DailyStreak5")) {
            badges.push("DailyStreak5");
        }
        if (streak >= 15 && !badges.includes("DailyStreak15")) {
            badges.push("DailyStreak15");
        }

        await ctx.db.patch(args.id, {
            streakCount: streak,
            lastActiveDate: args.todayDateStr,
            unlockedBadges: badges
        });

        return { streakCount: streak, unlockedBadges: badges };
    }
})

export const AddSpeakingMinutes = mutation({
    args: {
        id: v.id('users'),
        minutes: v.number()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id);
        if (!user) throw new Error('User not found');

        const newMinutes = (user.totalSpeakingMinutes || 0) + args.minutes;
        let badges = user.unlockedBadges || [];

        // Unlock minutes milestone badges!
        if (newMinutes >= 10 && !badges.includes("Talkative")) {
            badges.push("Talkative");
        }
        if (newMinutes >= 60 && !badges.includes("VocalMaster")) {
            badges.push("VocalMaster");
        }

        await ctx.db.patch(args.id, {
            totalSpeakingMinutes: newMinutes,
            unlockedBadges: badges
        });

        return { totalSpeakingMinutes: newMinutes, unlockedBadges: badges };
    }
})