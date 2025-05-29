
import { useParams, useNavigate } from "react-router-dom";
import { useResources } from "../contexts/ResourceContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Building, 
  User, 
  Zap, 
  Clock,
  UserCheck
} from "lucide-react";

const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getResourceById, loading } = useResources();

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Invalid user ID</p>
      </div>
    );
  }

  const resource = getResourceById(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">User not found</p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Expert":
        return "bg-emerald-500 text-white";
      case "Advanced":
        return "bg-blue-500 text-white";
      case "Intermediate":
        return "bg-yellow-500 text-white";
      case "Beginner":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          onClick={() => navigate("/")} 
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Button>
      </div>

      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{resource.name}</h1>
              <div className="flex items-center text-lg text-blue-600 mb-3">
                <User className="w-5 h-5 mr-2" />
                {resource.role}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {resource.email}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {resource.location}
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {resource.department}
                </div>
                <div className="flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Manager: {resource.managerName}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <Badge 
                className={`text-sm px-4 py-2 ${
                  resource.availabilityStatus === "Available" 
                    ? "bg-green-100 text-green-700 border-green-200" 
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
                variant="outline"
              >
                {resource.availabilityStatus}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {resource.availableCapacity}% Capacity
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      {resource.profile_summary && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <User className="w-5 h-5 mr-2" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{resource.profile_summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resource.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <Badge className={getProficiencyColor(skill.proficiency)}>
                  {skill.proficiency}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Manager Email:</span>
              <p className="text-gray-900">{resource.managerEmail}</p>
            </div>
            {resource.github_username && (
              <div>
                <span className="text-sm font-medium text-gray-600">GitHub:</span>
                <p className="text-gray-900">@{resource.github_username}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-600">External System ID:</span>
              <p className="text-gray-900">{resource.externalSystemId}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <p className={`font-medium ${
                resource.availabilityStatus === "Available" ? "text-green-600" : "text-red-600"
              }`}>
                {resource.availabilityStatus}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Available Capacity:</span>
              <p className="text-gray-900">{resource.availableCapacity}%</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Projects:</span>
              <p className="text-gray-900">
                {resource.projects.length > 0 ? resource.projects.join(", ") : "No active projects"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPage;
