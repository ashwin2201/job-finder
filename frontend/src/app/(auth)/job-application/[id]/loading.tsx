const JobApplicationLoading = () => {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
            <p className="text-sm text-gray-600">Loading job application...</p>
        </div>
    );
};


export default JobApplicationLoading;
