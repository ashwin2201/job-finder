export type Job = {
    id: number;
    title: string;
    company: string;
    location?: string; // Optional field for location
    description?: string; // Optional field for job description
    datePosted?: string; // Optional field for the date the job was posted
}