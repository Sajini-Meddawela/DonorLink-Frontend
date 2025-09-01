import React, { useState, useRef } from "react";
import { X, Download } from "lucide-react";
import Papa from "papaparse";

interface CSVImportModalProps {
  onImport: (items: any[]) => void;
  onCancel: () => void;
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({
  onImport,
  onCancel,
}) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        const validationErrors = validateCSVData(data);

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        } else {
          // Convert numeric fields to numbers
          const convertedData = data.map((item) => ({
            ...item,
            stockLevel: Number(item.stockLevel),
            reorderLevel: Number(item.reorderLevel),
          }));
          setErrors([]);
          setCsvData(convertedData);
        }
      },
      error: (error) => {
        setErrors([`Error parsing CSV: ${error.message}`]);
      },
    });
  };

  const validateCSVData = (data: any[]): string[] => {
    const errors: string[] = [];

    if (data.length === 0) {
      errors.push("CSV file is empty");
      return errors;
    }

    data.forEach((item, index) => {
      if (!item.itemName)
        errors.push(`Row ${index + 1}: Item name is required`);
      if (!item.category) errors.push(`Row ${index + 1}: Category is required`);
      if (!item.unit) errors.push(`Row ${index + 1}: Unit is required`);

      if (!item.stockLevel) {
        errors.push(`Row ${index + 1}: Stock level is required`);
      } else if (isNaN(Number(item.stockLevel))) {
        errors.push(`Row ${index + 1}: Stock level must be a number`);
      }

      if (!item.reorderLevel) {
        errors.push(`Row ${index + 1}: Reorder level is required`);
      } else if (isNaN(Number(item.reorderLevel))) {
        errors.push(`Row ${index + 1}: Reorder level must be a number`);
      }
    });

    return errors;
  };

  const handleImport = () => {
    if (errors.length === 0 && csvData.length > 0) {
      onImport(csvData);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        itemName: "Rice",
        category: "Food",
        stockLevel: 100,
        reorderLevel: 20,
        unit: "kilograms",
        itemDescription: "Basmati rice",
      },
      {
        itemName: "Soap",
        category: "Hygiene",
        stockLevel: 50,
        reorderLevel: 10,
        unit: "pieces",
        itemDescription: "Antibacterial soap",
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Import Inventory from CSV</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-[#63C6F7] text-white rounded-md hover:bg-[#52b0e0] flex items-center mb-2"
          >
            <Download size={18} className="mr-2" />
            Download Template
          </button>
          <p className="text-sm text-gray-600 mb-4">
            Download the template and fill it with your inventory data. Then
            upload it here.
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="w-full p-2 border rounded"
          />
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-bold mb-2">Errors found in CSV:</h3>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {csvData.length > 0 && errors.length === 0 && (
          <div className="mb-4">
            <h3 className="font-bold mb-2">
              Preview ({csvData.length} items):
            </h3>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-1 text-left">Item Name</th>
                    <th className="p-1 text-left">Category</th>
                    <th className="p-1 text-left">Stock</th>
                    <th className="p-1 text-left">Reorder</th>
                    <th className="p-1 text-left">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((item, index) => (
                    <tr key={index}>
                      <td className="p-1">{item.itemName}</td>
                      <td className="p-1">{item.category}</td>
                      <td className="p-1">{item.stockLevel}</td>
                      <td className="p-1">{item.reorderLevel}</td>
                      <td className="p-1">{item.unit}</td>
                    </tr>
                  ))}
                  {csvData.length > 5 && (
                    <tr>
                      <td colSpan={5} className="p-1 text-center">
                        ... and {csvData.length - 5} more items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={errors.length > 0 || csvData.length === 0}
            className="px-4 py-2 bg-[#63C6F7] text-white rounded-full hover:bg-[#52b0e0] disabled:bg-gray-400"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;
