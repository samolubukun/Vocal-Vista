import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Credits from './Credits'
  

function ProfileDailog({children}) {
    return (
        <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">My Profile & Billing</DialogTitle>
            <DialogDescription asChild>
                <Credits />
            </DialogDescription>
        </DialogHeader>
    </DialogContent>
</Dialog>
  )
}

export default ProfileDailog