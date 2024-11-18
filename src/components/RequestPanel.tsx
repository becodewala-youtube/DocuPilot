import React, { useState } from 'react';
import { Send, Plus, Trash2 } from 'lucide-react';
import type { ApiRequest, Parameter } from '../types/api';

interface RequestPanelProps {
  onSubmit: (request: ApiRequest) => void;
}

export const RequestPanel: React.FC<RequestPanelProps> = ({ onSubmit }) => {
  const [request, setRequest] = useState<ApiRequest>({
    baseUrl: '',
    method: 'GET',
    headers: [],
    queryParams: [],
    body: '',
  });

  const addParameter = (type: 'headers' | 'queryParams') => {
    setRequest(prev => ({
      ...prev,
      [type]: [...prev[type], { key: '', value: '' }],
    }));
  };

  const removeParameter = (type: 'headers' | 'queryParams', index: number) => {
    setRequest(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const updateParameter = (
    type: 'headers' | 'queryParams',
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setRequest(prev => ({
      ...prev,
      [type]: prev[type].map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }));
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="space-y-4">
        <div className="flex gap-4">
          <select
            value={request.method}
            onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value as ApiRequest['method'] }))}
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 outline-none"
          >
            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <input
            type="text"
            value={request.baseUrl}
            onChange={(e) => setRequest(prev => ({ ...prev, baseUrl: e.target.value }))}
            placeholder="Enter API URL"
            className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 outline-none"
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Headers</h3>
              <button
                onClick={() => addParameter('headers')}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
              >
                <Plus size={16} /> Add Header
              </button>
            </div>
            {request.headers.map((header, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateParameter('headers', index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 outline-none"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateParameter('headers', index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 outline-none"
                />
                <button
                  onClick={() => removeParameter('headers', index)}
                  className="p-2 text-red-600 dark:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Query Parameters</h3>
              <button
                onClick={() => addParameter('queryParams')}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
              >
                <Plus size={16} /> Add Parameter
              </button>
            </div>
            {request.queryParams.map((param, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => updateParameter('queryParams', index, 'key', e.target.value)}
                  placeholder="Key"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 outline-none"
                />
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => updateParameter('queryParams', index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 outline-none"
                />
                <button
                  onClick={() => removeParameter('queryParams', index)}
                  className="p-2 text-red-600 dark:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {request.method !== 'GET' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Request Body</h3>
              <textarea
                value={request.body}
                onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Enter request body (JSON)"
                className="w-full h-32 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 outline-none"
              />
            </div>
          )}
        </div>

        <button
          onClick={() => onSubmit(request)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Send size={16} /> Send Request
        </button>
      </div>
    </div>
  );
};