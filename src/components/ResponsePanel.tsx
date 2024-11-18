import React from 'react';
import { Clock, Download } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { ApiResponse } from '../types/api';

SyntaxHighlighter.registerLanguage('json', json);

interface ResponsePanelProps {
  response: ApiResponse | null;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({ response }) => {
  if (!response) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
        <p className="text-gray-500 dark:text-gray-400">Send a request to see the response</p>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status < 300) return 'text-green-600 dark:text-green-400';
    if (status < 400) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const downloadResponse = () => {
    const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'response.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className={`text-lg font-bold ${getStatusColor(response.status)}`}>
            {response.status} {response.statusText}
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Clock size={16} />
            {response.time}ms
          </span>
        </div>
        <button
          onClick={downloadResponse}
          className="flex items-center gap-2 px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
        >
          <Download size={16} /> Download
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Response Headers</h3>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium">{key}:</span>
              <span className="text-gray-600 dark:text-gray-400">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Response Body</h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
          <SyntaxHighlighter
            language="json"
            style={docco}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              color: 'white'
            }}
          >
            {JSON.stringify(response.data, null, 2)}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};