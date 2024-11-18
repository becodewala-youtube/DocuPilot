import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import type { SavedConfig } from '../types/api';

interface SavedConfigsProps {
  configs: SavedConfig[];
  onLoad: (config: SavedConfig) => void;
  onDelete: (id: string) => void;
}

export const SavedConfigs: React.FC<SavedConfigsProps> = ({
  configs,
  onLoad,
  onDelete,
}) => {
  if (configs.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 dark:text-gray-400">
        No saved configurations
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {configs.map((config) => (
        <div
          key={config.id}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md"
        >
          <span className="font-medium">{config.name}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onLoad(config)}
              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              aria-label="Load configuration"
            >
              <Save size={16} />
            </button>
            <button
              onClick={() => onDelete(config.id)}
              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              aria-label="Delete configuration"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};