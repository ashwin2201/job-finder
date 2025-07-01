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

type JobPostingProps = {
    job: Job;
}

const JobPosting = ({ job } : JobPostingProps ) => {
  return (
    <Card className="w-1/3">
        <CardHeader>
            <CardTitle>{job.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between">
            <CardDescription>
                <strong>{job.company}: </strong> {job.location ? job.location : "Location not specified"}
            </CardDescription>
            <Button>Apply</Button>
        </CardContent>
    </Card>
  )
}

export default JobPosting