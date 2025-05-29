
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";
import { useResources } from "../contexts/ResourceContext";

interface MarkdownViewProps {
  md: string;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ md }) => {
  const { getResourceById } = useResources();

  // Process contributor tags
  const processContributorTags = (content: string) => {
    const contributorRegex = /<contributor id="([^"]+)">([^<]+)<\/contributor>/g;
    
    return content.replace(contributorRegex, (match, id, label) => {
      const resource = getResourceById(id);
      if (resource) {
        return `[${label}](/users/${id})`;
      }
      // If resource not found, return plain text
      return label;
    });
  };

  const processedMarkdown = processContributorTags(md);

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom link renderer to use React Router
          a: ({ node, href, children, ...props }) => {
            if (href?.startsWith('/users/')) {
              return (
                <Link 
                  to={href} 
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                  {...props}
                >
                  {children}
                </Link>
              );
            }
            return (
              <a 
                href={href} 
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank" 
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          // Style other elements
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="mb-2 pl-4 list-disc">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 pl-4 list-decimal">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">{children}</code>;
            }
            return <code className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto">{children}</code>;
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-medium text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-2 py-1">
              {children}
            </td>
          ),
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
