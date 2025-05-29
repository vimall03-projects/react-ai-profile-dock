
import { Resource } from "../types/Resource";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MapPin, User, Zap } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

const getProficiencyColor = (proficiency: string) => {
  switch (proficiency) {
    case "Expert":
      return "bg-emerald-500 hover:bg-emerald-600";
    case "Advanced":
      return "bg-blue-500 hover:bg-blue-600";
    case "Intermediate":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "Beginner":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/users/${resource._id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md bg-white/80 backdrop-blur-sm"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">{resource.name}</h3>
            <div className="flex items-center text-sm text-blue-600 mb-2">
              <User className="w-4 h-4 mr-1" />
              {resource.role}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {resource.location}
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${
              resource.availabilityStatus === "Available" 
                ? "border-green-200 text-green-700 bg-green-50" 
                : "border-red-200 text-red-700 bg-red-50"
            }`}
          >
            {resource.availabilityStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 mr-1 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {resource.skills.map((skill, index) => (
                <Badge 
                  key={index}
                  className={`text-white text-xs px-2 py-1 ${getProficiencyColor(skill.proficiency)}`}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Capacity: {resource.availableCapacity}% • {resource.department}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
