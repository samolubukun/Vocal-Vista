"use client"

import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { Sparkles, Loader2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices'
import { toast } from 'sonner'

function SummaryBox({ summery, coachingOption, conversation, roomid }) {
  const [generating, setGenerating] = useState(false)
  const updateSummary = useMutation(api.DiscussionRoom.UpdateSummery)
  const [currentSummary, setCurrentSummary] = useState(summery)

  const handleGenerate = async () => {
    if (!conversation || conversation.length === 0) {
      toast.error("No dialogue transcript available to analyze.");
      return;
    }
    setGenerating(true);
    try {
      const result = await AIModelToGenerateFeedbackAndNotes(coachingOption, conversation);
      await updateSummary({
        id: roomid,
        summery: result.content
      });
      setCurrentSummary(result.content);
      toast.success("AI Coach Summary successfully generated!");
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  const activeSummary = currentSummary || summery;

  if (!activeSummary) {
    return (
      <div className='bg-card border border-border rounded-3xl p-8 shadow-sm h-[65vh] flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-b from-card to-muted/5'>
        <div className='w-16 h-16 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center shadow-sm animate-pulse'>
          <Sparkles className='w-8 h-8 text-primary' />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className='text-xl font-bold text-foreground'>No Coach Analysis Generated</h3>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            We have your full dialogue transcript saved. Let's run our expert Gemini AI coach analysis to compile your speech summary, preparation report, and interactive metrics.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className='cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md font-bold text-sm disabled:opacity-50'
        >
          {generating ? (
            <>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span>Analyzing Speech...</span>
            </>
          ) : (
            <>
              <Sparkles className='w-4 h-4' />
              <span>Generate AI Coach Analysis</span>
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className='bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm h-[65vh] overflow-y-auto custom-scrollbar bg-gradient-to-b from-card to-muted/5'>
      <div className="prose max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4 
        [&>h1]:text-2xl [&>h1]:font-extrabold [&>h1]:text-foreground [&>h1]:mt-6 [&>h1]:mb-3
        [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mt-6 [&>h2]:mb-3
        [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-foreground [&>h3]:mt-5 [&>h3]:mb-2
        [&>p]:leading-relaxed [&>p]:mb-4
        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:my-4
        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:my-4
        [&>li]:text-sm [&>li]:text-muted-foreground
        [&>strong]:text-foreground [&>strong]:font-bold [&>strong]:bg-primary/5 [&>strong]:px-1.5 [&>strong]:py-0.5 [&>strong]:rounded"
      >
        <Markdown>{activeSummary}</Markdown>
      </div>
    </div>
  )
}

export default SummaryBox