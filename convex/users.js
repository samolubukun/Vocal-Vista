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