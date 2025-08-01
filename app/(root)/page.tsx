import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { dummyInterviews } from '@/constants';
import InterviewCard from '@/components/InterviewCard';
const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className='text-primary-100'>Get Interview Ready with AI-powered practice and Feedback</h2>
          <p>
            Practice job interviews with AI and get personalized feedback to
            improve your performance. Sign up now to start your journey towards
            interview success!
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
            {/**
             * Basically, here the styles of button 
             * are going to be applied to the Link component. 
             */}
          </Button>
        </div>
        <Image src='/robot.png' alt='Robot Illustration' width={400} height={4} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8">
          <h2>Your Interviews</h2>
          <div className="interviews-section">
              {dummyInterviews.map(interview => (
                <InterviewCard {...interview} key={interview.id}/>
                )
              )}
          </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
          <h2>Take an Interview</h2>
          <div className="interviews-section">
              {dummyInterviews.map(interview => (
                  <InterviewCard {...interview} key={interview.id}/>
                ))}

              <p>You haven't taken any interviews yet.</p>
          </div>
      </section>
    </>
  )
}

export default page