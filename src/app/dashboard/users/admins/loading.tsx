export default function Loading() {
    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
                ))}
            </div>
        </div>
    );
}
