
import React, { createContext, useContext, useState, useEffect } from "react";
import { Resource } from "../types/Resource";
import { BASE_URL, API_HEADERS } from "../constants/api";
import { toast } from "@/hooks/use-toast";

interface ResourceContextType {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  getResourceById: (id: string) => Resource | undefined;
  refetchResources: () => void;
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResources must be used within a ResourceProvider");
  }
  return context;
};

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/resources`, {
        headers: API_HEADERS,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }

      const data = await response.json();
      setResources(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch resources";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const getResourceById = (id: string) => {
    return resources.find(resource => resource._id === id);
  };

  const refetchResources = () => {
    fetchResources();
  };

  return (
    <ResourceContext.Provider 
      value={{ 
        resources, 
        loading, 
        error, 
        getResourceById, 
        refetchResources 
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};
