import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, AlertTriangle, FileText, User, Briefcase, ClipboardList } from 'lucide-react';

export function RequestDetails({ request }) {
  const { interventionRequest } = request;
  const { report } = interventionRequest;
  
  // Function to render the priority badge
  const renderPriorityBadge = (priority) => {
    const priorityStyles = {
      HIGH: "bg-red-100 text-red-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      LOW: "bg-green-100 text-green-800",
    };
    
    return (
      <Badge className={priorityStyles[priority]}>
        {priority}
      </Badge>
    );
  };

  // Function to render the status badge
  const renderStatusBadge = (status) => {
    const statusStyles = {
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      OVERDUE: "bg-red-100 text-red-800",
    };
    
    return (
      <Badge className={statusStyles[status]}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  // Function to render the operation type badge
  const renderOperationTypeBadge = (type) => {
    const typeStyles = {
      CORRECTIVE: "bg-purple-100 text-purple-800",
      PREVENTIVE: "bg-blue-100 text-blue-800",
    };
    
    return (
      <Badge className={typeStyles[type]}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{interventionRequest.title}</h2>
          <p className="text-sm text-muted-foreground">ID: #{interventionRequest.id}</p>
        </div>
        <div className="flex space-x-2">
          {renderPriorityBadge(report.priority)}
          {renderStatusBadge(interventionRequest.status)}
          {renderOperationTypeBadge(report.type)}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" /> Request Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Status</span>
                <span>{renderStatusBadge(interventionRequest.status)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Priority</span>
                <span>{renderPriorityBadge(report.priority)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Type</span>
                <span>{renderOperationTypeBadge(report.type)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Created by</span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {interventionRequest.creator?.name || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Created at</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(interventionRequest.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Deadline</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(interventionRequest.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Report Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Report ID</span>
                <span>#{report.id}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Reporter</span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {report.reporter?.name || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Report Date</span>
                <span>{new Date(report.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Report Status</span>
                <span>{report.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          <p className="text-base">{report.description || "No description provided."}</p>
        </CardContent>
      </Card>
      
      {report.asset && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Briefcase className="mr-2 h-5 w-5" /> Asset Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Asset Name</span>
                <span>{report.asset.name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Inventory Code</span>
                <span>{report.asset.inventoryCode}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b">
                <span className="text-muted-foreground">Asset Type</span>
                <span>{report.asset.type}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Status</span>
                <span>{report.asset.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {report.imageUrl && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Attached Image</h3>
            <div className="relative h-64 w-full">
              <Image 
                src={report.imageUrl} 
                alt="Report image" 
                fill 
                className="object-contain rounded-md" 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {request.details && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Assignment Details
            </h3>
            <p className="text-base">{request.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
