import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  return (
    <div className="space-y-6 p-6">
        <div>My jobs</div>
        <div>My resume</div>
        <div>My profile</div>
        <Button asChild>
          <Link href="/submit-resume" prefetch>
            Submit Resume
          </Link>
        </Button>
    </div>
  )
}

export default Dashboard
