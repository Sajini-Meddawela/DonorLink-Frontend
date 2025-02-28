import React from 'react';
import { Settings, Trash } from 'lucide-react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

function Table<T extends { [key: string]: any }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete 
}: TableProps<T>): JSX.Element {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-sky-400 text-white">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="py-3 px-4 text-left font-medium"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="py-3 px-4 text-center font-medium">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`border-b hover:bg-gray-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="py-3 px-4">
                  {typeof column.accessor === 'function' 
                    ? column.accessor(item) 
                    : item[column.accessor]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(item)} 
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <Settings size={18} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(item)} 
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash size={18} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;