import React, { useState } from 'react';
import { Send, Code, Save, Moon, Sun } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { RequestPanel } from './components/RequestPanel';
import { ResponsePanel } from './components/ResponsePanel';
import { CodeSnippet } from './components/CodeSnippet';
import { Tabs } from './components/Tabs';
import { SavedConfigs } from './components/SavedConfigs';
import type { ApiRequest, ApiResponse, SavedConfig } from './types/api';

const STORAGE_KEY = 'api-configs';

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('request');
  const [request, setRequest] = useState<ApiRequest>({
    baseUrl: '',
    method: 'GET',
    headers: [],
    queryParams: [],
    body: '',
  });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [configs, setConfigs] = useState<SavedConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const handleRequest = async (req: ApiRequest) => {
    setRequest(req);
    try {
      const startTime = Date.now();
      const queryString = req.queryParams
        .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      const url = `${req.baseUrl}${queryString ? `?${queryString}` : ''}`;
      const headers = req.headers.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

      const { data, status, statusText, headers: responseHeaders } = await axios({
        method: req.method,
        url,
        headers,
        data: req.method !== 'GET' ? JSON.parse(req.body || '{}') : undefined,
      });

      setResponse({
        status,
        statusText,
        headers: responseHeaders,
        data,
        time: Date.now() - startTime,
      });
      setActiveTab('response');
    } catch (error: any) {
      toast.error(error.message);
      if (error.response) {
        setResponse({
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: error.response.data,
          time: 0,
        });
        setActiveTab('response');
      }
    }
  };

  const saveConfig = () => {
    const name = prompt('Enter a name for this configuration:');
    if (name) {
      const newConfig: SavedConfig = {
        id: Date.now().toString(),
        name,
        request,
      };
      const updatedConfigs = [...configs, newConfig];
      setConfigs(updatedConfigs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
      toast.success('Configuration saved!');
    }
  };

  const loadConfig = (config: SavedConfig) => {
    setRequest(config.request);
    toast.success('Configuration loaded!');
  };

  const deleteConfig = (id: string) => {
    const updatedConfigs = configs.filter((config) => config.id !== id);
    setConfigs(updatedConfigs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
    toast.success('Configuration deleted!');
  };

  const tabs = [
    { id: 'request', label: 'Request', icon: <Send size={16} /> },
    { id: 'response', label: 'Response', icon: <Code size={16} /> },
    { id: 'saved', label: 'Saved', icon: <Save size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">API Documentation Viewer</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="p-6">
            {activeTab === 'request' && (
              <div className="space-y-6">
                <RequestPanel onSubmit={handleRequest} />
                <div className="flex justify-end">
                  <button
                    onClick={saveConfig}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} /> Save Configuration
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'response' && response && (
              <div className="space-y-6">
                <ResponsePanel response={response} />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Code Snippets</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="font-medium">JavaScript (Axios)</h4>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                        <CodeSnippet request={request} language="javascript" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Python (Requests)</h4>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                        <CodeSnippet request={request} language="python" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">cURL</h4>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                        <CodeSnippet request={request} language="curl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <SavedConfigs
                configs={configs}
                onLoad={loadConfig}
                onDelete={deleteConfig}
              />
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWrapper;