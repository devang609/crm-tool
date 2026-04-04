'use client'

export interface TableColumn<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  loading = false,
}: {
  columns: TableColumn<T>[]
  data: T[]
  onSort?: (key: string) => void
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-600">No data available</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto card">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort?.(String(col.key))}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && <span className="cursor-pointer">⇅</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-4 text-sm">
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
