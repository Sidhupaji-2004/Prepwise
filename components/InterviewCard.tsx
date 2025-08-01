import dayjs from 'dayjs';
const InterviewCard = ({interviewId, userId, role, type, techstack, createdAt} : InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback ?. createdAt || createdAt || Date.now()).format('MMM D, YYYY');
    /**
     * lOOK, this is null now ik, but please treat this variable as type null or Feedback
     */
    return (
        <div>InterviewCard</div>
    )
}

export default InterviewCard