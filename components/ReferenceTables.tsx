import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Database } from 'lucide-react';
import { ReferenceTable } from '../types';

interface ReferenceTablesProps {
  tables: ReferenceTable[];
  onImport: (table: ReferenceTable) => void;
}

const ReferenceTables: React.FC<ReferenceTablesProps> = ({ tables, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<'SINAPI' | 'TCPO' | 'OWN' | null>(null);

  const handleImportClick = (type: 'SINAPI' | 'TCPO' | 'OWN') => {
    setImportType(type);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input to allow re-selection
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && importType) {
      // Simulate file processing and import
      const newTable: ReferenceTable = {
        id: `t-${Date.now()}`,
        name: file.name.split('.')[0], // Use filename as table name
        type: importType,
        region: 'São Paulo', // Default region for simulation
        date: new Date().toISOString()
      };
      onImport(newTable);
    }
    setImportType(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Tabelas de Referência</h1>
      <p className="text-slate-500 mb-8">Gerencie suas bases de dados SINAPI, TCPO e próprias.</p>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".xlsx,.xls,.csv,.xml,.zip" 
        onChange={handleFileChange}
      />

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Importar SINAPI</h3>
          <p className="text-sm text-slate-500 mb-4">Baixe automaticamente a última versão da CAIXA.</p>
          <button onClick={() => handleImportClick('SINAPI')} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Importar SINAPI
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Database className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Importar TCPO</h3>
          <p className="text-sm text-slate-500 mb-4">Conecte com sua base PINI ou arquivo digital.</p>
          <button onClick={() => handleImportClick('TCPO')} className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
            Importar TCPO
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Tabela Própria (Excel)</h3>
          <p className="text-sm text-slate-500 mb-4">Importe sua planilha de composições personalizada.</p>
          <button onClick={() => handleImportClick('OWN')} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Upload .XLSX
          </button>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Tabelas Ativas</h2>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Nome</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Região</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tables.map((table) => (
              <tr key={table.id}>
                <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                   <FileText className="w-4 h-4 text-slate-400" />
                   {table.name}
                </td>
                <td className="p-4">
                   <span className={`px-2 py-1 rounded text-xs font-medium ${
                     table.type === 'SINAPI' ? 'bg-blue-100 text-blue-700' : 
                     table.type === 'TCPO' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                   }`}>
                     {table.type}
                   </span>
                </td>
                <td className="p-4 text-sm text-slate-600">{table.region}</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> Ativa
                  </span>
                </td>
              </tr>
            ))}
            {tables.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  Nenhuma tabela importada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferenceTables;