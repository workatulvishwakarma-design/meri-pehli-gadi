// ─── Export Utilities ─────────────────────────────────────────────────
// Client-side export helpers for PDF, Excel, CSV

// CSV Export
export function exportToCSV(data: Record<string, unknown>[], filename: string, columns?: { key: string; label: string }[]) {
  if (!data.length) return

  const cols = columns || Object.keys(data[0]).map(k => ({ key: k, label: k }))
  const headers = cols.map(c => c.label).join(',')
  const rows = data.map(row =>
    cols.map(c => {
      const val = row[c.key]
      const str = val === null || val === undefined ? '' : String(val)
      // Escape commas and quotes
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }).join(',')
  )

  const csv = [headers, ...rows].join('\n')
  downloadFile(csv, `${filename}.csv`, 'text/csv')
}

// Excel Export (uses xlsx)
export async function exportToExcel(data: Record<string, unknown>[], filename: string, sheetName = 'Sheet1') {
  try {
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, `${filename}.xlsx`)
  } catch (err) {
    console.error('Excel export failed:', err)
    // Fallback to CSV
    exportToCSV(data, filename)
  }
}

// PDF Export (simple table PDF using browser print)
export function exportToPDF(title: string, columns: string[], rows: string[][], filename: string) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const tableRows = rows.map(row =>
    `<tr>${row.map(cell => `<td style="padding:6px 10px;border:1px solid #ddd;font-size:12px">${cell}</td>`).join('')}</tr>`
  ).join('')

  const html = `
    <!DOCTYPE html>
    <html><head><title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { font-size: 18px; color: #0a1628; margin-bottom: 4px; }
      h2 { font-size: 12px; color: #64748b; font-weight: normal; margin-bottom: 16px; }
      table { border-collapse: collapse; width: 100%; }
      th { background: #0a1628; color: white; padding: 8px 10px; text-align: left; font-size: 12px; }
      @media print { body { padding: 0; } }
    </style>
    </head><body>
      <h1>${title}</h1>
      <h2>Generated on ${new Date().toLocaleDateString('en-IN')} by MeriPehli Gadi</h2>
      <table>
        <thead><tr>${columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body></html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
  setTimeout(() => {
    printWindow.print()
  }, 500)
}

// CSV Import parser
export async function parseCSV(file: File): Promise<Record<string, string>[]> {
  const Papa = await import('papaparse')
  return new Promise((resolve, reject) => {
    Papa.default.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as Record<string, string>[])
      },
      error: (err: Error) => reject(err),
    })
  })
}

// Import validation for cars
export interface ImportValidationResult {
  valid: Record<string, string>[]
  errors: { row: number; field: string; message: string }[]
  duplicates: { row: number; title: string }[]
}

export function validateCarImport(
  rows: Record<string, string>[],
  existingTitles: string[],
  assamCitySlugs: string[]
): ImportValidationResult {
  const valid: Record<string, string>[] = []
  const errors: { row: number; field: string; message: string }[] = []
  const duplicates: { row: number; title: string }[] = []

  const seenTitles = new Set(existingTitles.map(t => t.toLowerCase()))

  rows.forEach((row, i) => {
    const rowNum = i + 2 // +2 for header row and 0-indexing
    let hasError = false

    // Required fields
    const required = ['title', 'brandId', 'modelId', 'year', 'price', 'kmDriven']
    for (const field of required) {
      if (!row[field] || row[field].trim() === '') {
        errors.push({ row: rowNum, field, message: `${field} is required` })
        hasError = true
      }
    }

    // Duplicate check
    if (row.title && seenTitles.has(row.title.toLowerCase())) {
      duplicates.push({ row: rowNum, title: row.title })
    } else if (row.title) {
      seenTitles.add(row.title.toLowerCase())
    }

    // City must be Assam
    if (row.city && !assamCitySlugs.includes(row.city.toLowerCase())) {
      errors.push({ row: rowNum, field: 'city', message: `City "${row.city}" is not an Assam city. Only Assam cities allowed.` })
      hasError = true
    }

    // Price must be positive number
    if (row.price && (isNaN(Number(row.price)) || Number(row.price) <= 0)) {
      errors.push({ row: rowNum, field: 'price', message: 'Price must be a positive number' })
      hasError = true
    }

    // Year validation
    if (row.year) {
      const year = parseInt(row.year)
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 1) {
        errors.push({ row: rowNum, field: 'year', message: 'Year must be between 1990 and current year' })
        hasError = true
      }
    }

    if (!hasError) {
      valid.push(row)
    }
  })

  return { valid, errors, duplicates }
}

// Download helper
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
