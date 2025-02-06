import {  useState } from 'react'
import { Feedback } from '../../interface/feedback'

interface IFeedbackCardProps {
    feedback: Feedback
}
const FeedbackCard = ({feedback}:IFeedbackCardProps) => {
  const [isFeedbacksOpen,setIsFeedbacksOpen] = useState<boolean>(false)
  return (
    <div className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left">
        <button key={feedback.id}  onClick={() => setIsFeedbacksOpen(!isFeedbacksOpen)}>
          <p className="text-red-300">{feedback.text}</p>
        </button>
        {isFeedbacksOpen &&
          <div>
              {feedback.highlights && feedback.highlights.map(highlight =>(
              <>
              <p className="text-yellow-300">{highlight.quote}</p>
              <p className="text-yellow-300">{highlight.summary}</p>
              </>
            ))}
          </div>
        }
    </div>
  )
}

export default FeedbackCard