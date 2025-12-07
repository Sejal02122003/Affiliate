import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'chart' | 'list';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const pulse = 'animate-pulse';

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`bg-gray-200 dark:bg-gray-700 rounded-lg h-24 ${pulse}`} />
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className={`bg-gray-200 dark:bg-gray-700 rounded h-10 flex-1 ${pulse}`} />
            <div className={`bg-gray-200 dark:bg-gray-700 rounded h-10 flex-1 ${pulse}`} />
            <div className={`bg-gray-200 dark:bg-gray-700 rounded h-10 flex-1 ${pulse}`} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg h-64 ${pulse}`} />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-gray-200 dark:bg-gray-700 rounded h-4 ${pulse}`} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
