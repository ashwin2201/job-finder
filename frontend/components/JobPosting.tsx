import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Job } from "@/types/Job";
import Link from 'next/link';

type JobPostingProps = {
    job: Job;
}

const JobPosting = ({ job } : JobPostingProps ) => {
  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
            <CardDescription>
                <strong>{job.company}s: </strong> {job.location ? job.location : "Location not specified"}
            </CardDescription>
            <Button>
              <Link href={`/job-application/${job.id}`}>
                Apply
              </Link>
            </Button>
        </CardContent>
    </Card>
  )
}

export default JobPosting