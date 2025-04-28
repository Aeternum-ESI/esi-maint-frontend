import { cancelReport, fetchReportById } from "@/app/actions/reports.action";
import { Report, ReportStatus, Priority, OperationType, InterventionRequestStatus, Technician } from "@/lib/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { AssignTechnician } from "../components/assign-technician";
import { $fetch } from "@/app/fetch";
import { getToken } from "@/app/getToken";

const statusColors = {
    [ReportStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [ReportStatus.ASSIGNED]: "bg-blue-100 text-blue-800",
    [ReportStatus.CANCELED]: "bg-red-100 text-red-800",
    [ReportStatus.TREATED]: "bg-green-100 text-green-800",
};

const priorityColors = {
    [Priority.LOW]: "bg-green-100 text-green-800",
    [Priority.MEDIUM]: "bg-yellow-100 text-yellow-800",
    [Priority.HIGH]: "bg-red-100 text-red-800",
};

const operationTypeLabels = {
    [OperationType.CORRECTIVE]: "Corrective",
    [OperationType.PREVENTIVE]: "Preventive",
};

const ReportDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    var report: Report | null = null; // Initialize report variable
    try {
        // Fetch the report details using the ID
        const response = await fetchReportById(id);
        report = response; // Assign the fetched report to the variable
    } catch (error) {
        console.error("Error fetching report details:", error);
        return <div className="p-6 text-center text-red-500">Error fetching report details</div>;
    }

    if (!report) {
        return <div className="p-6 text-center">Report not found</div>;
    }

    const response = await $fetch("/technicians", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        auth: await getToken(),
    });

    const technicians: Technician[] = response.data?.data; // Assuming the response contains a list of technicians

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-100 p-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">Report Details</h1>
                    <div className="flex items-center  gap-2">
                        {report.status !== ReportStatus.CANCELED && report.status !== ReportStatus.TREATED && (
                            <>
                                <form
                                    action={cancelReport.bind(null, report.id)}
                                    className="flex items-center space-x-2"
                                >
                                    <button className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg">
                                        cancel Report
                                    </button>
                                </form>
                                {/* Can assign if not canceled and is pending */}
                                {report.status === ReportStatus.PENDING && (
                                    <AssignTechnician reportId={report.id} technicians={technicians} />
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {`${new Date(report.createdAt)
                                    .getFullYear()
                                    .toString()
                                    .slice(2, 4)}-${operationTypeLabels[report.type].toUpperCase().slice(0, 3)}-${
                                    report.id
                                }`}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Created {formatDistanceToNow(new Date(report.createdAt))} ago
                            </p>
                        </div>
                        <div className="space-x-2">
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    statusColors[report.status]
                                }`}
                            >
                                {report.status}
                            </span>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                    priorityColors[report.priority]
                                }`}
                            >
                                {report.priority} Priority
                            </span>
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                                {operationTypeLabels[report.type]}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Reporter Info */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Reporter Information</h2>
                    <div className="flex items-center">
                        {report.reporter?.avatarUrl && (
                            <div className="mr-4">
                                <Image
                                    src={report.reporter.avatarUrl}
                                    alt="Reporter Avatar"
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                />
                            </div>
                        )}
                        <div>
                            <p className="font-medium">{report.reporter?.name || "Unknown"}</p>
                            <p className="text-gray-600 text-sm">{report.reporter?.email || "No email available"}</p>
                            <p className="text-gray-600 text-sm">Role: {report.reporter?.role || "Unknown"}</p>
                        </div>
                    </div>
                </div>

                {/* Asset Info */}
                {report.asset && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Asset Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm">Name</p>
                                <p className="font-medium">{report.asset.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Inventory Code</p>
                                <p className="font-medium">{report.asset.inventoryCode}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Type</p>
                                <p className="font-medium">{report.asset.type}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Status</p>
                                <p className="font-medium">{report.asset.status}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Category Info */}
                {report.category && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm">Name</p>
                                <p className="font-medium">{report.category.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Description</p>
                                <p className="font-medium">{report.category.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">
                        {report.description || "No description provided"}
                    </p>
                </div>

                {/* Image */}
                {report.imageUrl && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Attached Image</h2>
                        <div className="relative h-64 w-full">
                            <Image
                                src={report.imageUrl}
                                alt="Report Image"
                                fill
                                className="object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {/* Display assignees of report.interventionRequests.assignedTo */}

                {report.interventionRequests && report.interventionRequests.length > 0 && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Technicians</h2>
                        <ul className="space-y-4">
                            {report.interventionRequests.map((request) => (
                                // Display the assignedTo for each intervention request
                                <li
                                    key={request.id}
                                    className="border p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {request.title || "Intervention Request"}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                request.status === InterventionRequestStatus.OVERDUE
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : request.status === InterventionRequestStatus.IN_PROGRESS
                                                    ? "bg-blue-100 text-blue-800"
                                                    : request.status === InterventionRequestStatus.COMPLETED
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {request.status}
                                        </span>
                                    </div>

                                    {request.deadline && (
                                        <div className="mb-3 text-sm text-gray-600">
                                            <span className="inline-flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Deadline: {new Date(request.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}

                                    {request.assignedTo && request.assignedTo.length > 0 ? (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Assigned Technicians
                                            </h4>
                                            <div className="space-y-2">
                                                {request.assignedTo.map((technician) => (
                                                    <div className="flex flex-col spay-4" key={technician.id}>
                                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0">
                                                                    {technician.technician?.user?.avatarUrl ? (
                                                                        <Image
                                                                            src={technician.technician.user.avatarUrl}
                                                                            alt="Technician"
                                                                            width={40}
                                                                            height={40}
                                                                            className="rounded-full border-2 border-gray-200"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                                                                            {technician.technician?.user?.name?.charAt(
                                                                                0
                                                                            ) || "?"}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {technician.technician?.user?.name || "Unknown"}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {technician.technician?.user?.email || ""}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span
                                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                    technician.completed
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                            >
                                                                {technician.completed ? "Completed" : "Pending"}
                                                            </span>
                                                        </div>
                                                        {/* Display action done if completed */}
                                                        {technician.completed && (
                                                            <div className="flex gap-2 items-center p-4">
                                                                <p className="text-sm text-gray-700">Action Taken:</p>
                                                                <span className="text-xs text-gray-500 ml-2">
                                                                    {
                                                                        request.Interventions?.find(
                                                                            (i) =>
                                                                                i.technicianId ==
                                                                                technician.technicianId
                                                                        )?.description
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-gray-500 bg-gray-50 p-2 rounded">
                                            No technicians assigned yet.
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportDetail;
