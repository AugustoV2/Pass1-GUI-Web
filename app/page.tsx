"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [srccode, setSrcCode] = useState('');
  const [optab, setOptab] = useState('');

  interface ResultType {
    intermediate_file: string[];
    symtab: Record<string, any>;
    program_size: number;
  }

  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const srcCodeArray = srccode.split('\n').map(line => line.trim()).filter(Boolean);
      const optabObject = optab.split('\n').reduce<Record<string, string>>((acc, line) => {
        const [opcode, machineCode] = line.split(/\s+/);
        if (opcode && machineCode) {
          acc[opcode.trim()] = machineCode.trim();
        }
        return acc;
      }, {});

      const payload = {
        srccode: srcCodeArray,
        optab: optabObject
      };

      const response = await axios.post('http://127.0.0.1:5000/', payload);
      setResult(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to process the input. Please check your data.');
      setResult(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">Blaaa's Pass1 Processor</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-6 rounded-lg shadow-md">
          <label htmlFor="srccode" className="block text-xl font-semibold mb-4 text-gray-200">Source Code:</label>
          <textarea
            id="srccode"
            value={srccode}
            onChange={(e) => setSrcCode(e.target.value)}
            rows={12}
            className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={`e.g.\nLABEL START 1000\nLABEL1 LDA ALPHA\nSTA BETA`}
            required
          />
        </div>

        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-6 rounded-lg shadow-md">
          <label htmlFor="optab" className="block text-xl font-semibold mb-4 text-gray-200">Opcode Table:</label>
          <textarea
            id="optab"
            value={optab}
            onChange={(e) => setOptab(e.target.value)}
            rows={6}
            className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg shadow-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={`e.g.\nLDA 00\nSTA 0C\nADD 18`}
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-gray-100 font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Process Code
        </button>
      </form>

      {error && (
        <p className="mt-6 text-red-400 font-medium text-center">{error}</p>
      )}

      {result && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">Result</h2>
          
          <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">Intermediate File:</h3>
            <pre className="p-4 bg-gray-900 border border-gray-600 rounded-lg overflow-x-auto text-gray-100">
              {result.intermediate_file.join('\n')}
            </pre>
          </div>

          <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">Symbol Table:</h3>
            <pre className="p-4 bg-gray-900 border border-gray-600 rounded-lg overflow-x-auto text-gray-100">
              {JSON.stringify(result.symtab, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
