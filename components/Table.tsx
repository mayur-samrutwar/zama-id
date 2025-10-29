type Column<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  empty?: React.ReactNode;
};

export default function Table<T>({ columns, data, empty }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-zinc-300 p-10 text-sm text-zinc-600">
        {empty ?? "No data"}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200">
        <thead className="bg-zinc-50">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={"px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-600 " + (col.className ?? "")}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-zinc-50/70">
              {columns.map((col, i) => (
                <td key={i} className={"px-4 py-3 text-sm text-zinc-800 " + (col.className ?? "")}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


