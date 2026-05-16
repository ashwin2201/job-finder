"use client"

import { useState, useEffect } from "react"

const ResumeView = () => {
    const [generatedResume, setGeneratedResume] = useState<string | null>(null);

    const fetchData = async () => {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/generate-resume', { method: 'GET' });
        const data = await res.json();
        setGeneratedResume(data.resume_jp);
    };

    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            console.error("Error fetching resume:", error);
        }
    }, []);

    return (
        <div>
            <h1>Your Generated Resume</h1>
            <p>Here you can view and download your resume.</p>
            {generatedResume && (
                <div>
                    <h2>Resume Details:</h2>
                    <p>{generatedResume}</p>
                </div>
            )}
            <button>Download resume</button>
        </div>
    )
}

export default ResumeView;