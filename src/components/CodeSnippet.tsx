import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { ApiRequest } from '../types/api';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);

interface CodeSnippetProps {
  request: ApiRequest;
  language: 'javascript' | 'python' | 'curl';
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ request, language }) => {
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    const queryString = request.queryParams
      .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const url = `${request.baseUrl}${queryString ? `?${queryString}` : ''}`;
    const headers = request.headers.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

    switch (language) {
      case 'javascript':
        return `import axios from 'axios';

const config = {
  method: '${request.method}',
  url: '${url}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${request.method !== 'GET' ? `data: ${request.body || '{}'}` : ''}
};

axios(config)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });`;

      case 'python':
        return `import requests

url = '${url}'
headers = ${JSON.stringify(headers, null, 2)}
${request.method !== 'GET' ? `payload = ${request.body || '{}'}` : ''}

response = requests.${request.method.toLowerCase()}(
    url,
    headers=headers${request.method !== 'GET' ? ',\n    json=payload' : ''}
)

print(response.json())`;

      case 'curl':
        return `curl -X ${request.method} '${url}' \\
${Object.entries(headers)
  .map(([key, value]) => `  -H '${key}: ${value}' \\`)
  .join('\n')}${
          request.method !== 'GET' && request.body
            ? `\n  -d '${request.body.replace(/'/g, "\\'")}'`
            : ''
        }`;

      default:
        return '';
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language === 'curl' ? 'bash' : language}
        style={docco}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
          color: 'white'
        }}
      >
        {generateCode()}
      </SyntaxHighlighter>
    </div>
  );
};