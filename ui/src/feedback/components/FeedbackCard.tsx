import {  useEffect, useState } from 'react'
import { Feedback } from '../../interface/feedback'

interface IFeedbackCardProps {
    feedback: Feedback
}
const FeedbackCard = ({feedback}:IFeedbackCardProps) => {
  const storageKey = `feedback-${feedback.id}-open`
  const [isFeedbacksOpen,setIsFeedbacksOpen] = useState<boolean>(() => {
        const stored = localStorage.getItem(storageKey)
        return stored ? JSON.parse(stored) : false
    })
  useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(isFeedbacksOpen))
    }, [isFeedbacksOpen, storageKey])
    
  return (
    <div className="feedback-card">
        <button key={feedback.id} className='w-full ' onClick={() => setIsFeedbacksOpen(!isFeedbacksOpen) } >
          <p className="text-red-300 text-left">{feedback.text}</p>
        </button>
        {isFeedbacksOpen &&
          <div>
              {feedback.highlights && feedback.highlights.map(highlight =>(
              <div className='pl-3 border-l-2 border-green-500 mt-2'>
              <p className="text-green-300">{highlight.quote}</p>
              <p className="text-gray-400">{highlight.summary}</p>
              </div>
            ))}
          </div>
        }
    </div>
  )
}

export default FeedbackCard