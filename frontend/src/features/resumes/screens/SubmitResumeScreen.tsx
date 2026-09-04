import dynamic from 'next/dynamic'


const SubmitResumeForm = dynamic(
    () => import('@/features/resumes/components/SubmitResumeForm'),
    {
        loading: () => (
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Submit Your Resume</h1>
                <p className="text-lg text-gray-700 mb-6">Loading form...</p>
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
            </div>
        ),
    }
)


const SubmitResumePage = () => {
    return <SubmitResumeForm />
}


export default SubmitResumePage
