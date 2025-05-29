
import { useResources } from "../contexts/ResourceContext";
import ResourceCard from "../components/ResourceCard";
import { Loader2, Users } from "lucide-react";

const HomePage = () => {
  const { resources, loading, error } = useResources();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading resources</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Users className="w-8 h-8 mr-3 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Team Resources</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover and connect with talented team members across departments. 
          Click on any card to view detailed profiles and expertise.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource._id} resource={resource} />
        ))}
      </div>
      
      {resources.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No resources found</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
