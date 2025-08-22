import { useState, useEffect } from "react"

const ResumeView = () => {
    const [generatedResume, setGeneratedResume] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/resume');
            const data = await res.json();
            setGeneratedResume(data);
        };

        fetchData();
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
        </div>
    )
}

export default ResumeView;