import { useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import './Personal.css'

type PersonalProps = {
  onBack: () => void
}

type Person = {
  id: string
  nombre: string
  primer_apellido: string
  segundo_apellido: string
  dni_documento: string
  email: string
  direccion_personal: string
  telefono_personal: string
  telefono_trabajo: string
  cargo: string
  estado: 'Activo' | 'Inactivo'
  fecha_alta: string
  fecha_baja: string
}

type ImportRow = Omit<Person, 'id'>

const cargoCatalog = [
  ['CAR000001', 'Responsable de Explotación'],
  ['CAR000002', 'Jefe de Planta'],
  ['CAR000003', 'Jefe de Mantenimiento'],
  ['CAR000004', 'Ingeniero de Procesos'],
  ['CAR000005', 'Jefe de Turno'],
  ['CAR000006', 'Operador de Planta'],
  ['CAR000007', 'Oficial'],
  ['CAR000008', 'Peón Especialista'],
  ['CAR000009', 'Responsable de Laboratorio'],
  ['CAR000010', 'Técnico de Laboratorio'],
  ['CAR000011', 'Técnico Electromecánico'],
  ['CAR000012', 'Técnico de Instrumentación y Control'],
  ['CAR000013', 'Técnico de PRL y Medio Ambiente'],
  ['CAR000014', 'Administrativo'],
  ['CAR000015', 'Técnico de Redes y Saneamiento'],
  ['CAR000016', 'Director Técnico'],
] as const

const personHeaders = [
  'nombre',
  'primer_apellido',
  'segundo_apellido',
  'dni_documento',
  'email',
  'direccion_personal',
  'telefono_personal',
  'telefono_trabajo',
  'cargo',
  'estado',
  'fecha_alta',
  'fecha_baja',
]

const emptyPerson: ImportRow = {
  nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  dni_documento: '',
  email: '',
  direccion_personal: '',
  telefono_personal: '',
  telefono_trabajo: '',
  cargo: '',
  estado: 'Activo',
  fecha_alta: '',
  fecha_baja: '',
}

function loadPeople(): Person[] {
  try {
    const stored = window.localStorage.getItem('albura-personal')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function savePeople(people: Person[]) {
  window.localStorage.setItem('albura-personal', JSON.stringify(people))
}

function normalize(value: unknown) {
  return String(value ?? '').trim().toLocaleLowerCase('es-ES')
}

function nextPersonId(people: Person[]) {
  const highest = people.reduce((max, person) => {
    const match = person.id.match(/PER(\d+)/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)

  return `PER${String(highest + 1).padStart(6, '0')}`
}

function downloadTemplate() {
  const workbook = XLSX.utils.book_new()
  const rows = [
    personHeaders,
    ['Ejemplo', 'Persona', 'Prueba', '12345678A', 'ejemplo@empresa.com', 'Calle Ejemplo 1, Santander', '600000000', '942000000', 'Jefe de Planta', 'Activo', '08/09/2026', ''],
  ]
  const sheet = XLSX.utils.aoa_to_sheet(rows)
  sheet['!cols'] = [22, 24, 24, 20, 32, 42, 20, 20, 40, 14, 16, 16].map((wch) => ({ wch }))
  XLSX.utils.book_append_sheet(workbook, sheet, 'PERSONAS')

  const readme = XLSX.utils.aoa_to_sheet([
    ['ALBURA', 'Plantilla de importación masiva de Personal'],
    ['Instrucción', 'Rellena la hoja PERSONAS. No modifiques las cabeceras.'],
    ['Cargo', 'Selecciona el nombre del cargo. ALBURA gestionará internamente su identificador.'],
    ['Fechas', 'Introduce las fechas manualmente con formato dd/mm/aaaa.'],
    ['Importación', 'ALBURA validará los datos antes de realizar la carga.'],
  ])
  readme['!cols'] = [{ wch: 20 }, { wch: 100 }]
  XLSX.utils.book_append_sheet(workbook, readme, 'README')

  const lists = XLSX.utils.aoa_to_sheet([
    ['id_cargo', 'nombre'],
    ...cargoCatalog,
  ])
  XLSX.utils.book_append_sheet(workbook, lists, 'LISTAS')

  XLSX.writeFile(workbook, 'ALBURA_Plantilla_Importacion_Personal.xlsx')
}

function validateRow(row: ImportRow, existing: Person[], imported: ImportRow[]) {
  const errors: string[] = []

  if (!row.nombre) errors.push('Falta el nombre')
  if (!row.primer_apellido) errors.push('Falta el primer apellido')
  if (!row.cargo) errors.push('Falta el cargo')
  if (!row.fecha_alta) errors.push('Falta la fecha de alta')
  if (row.estado !== 'Activo' && row.estado !== 'Inactivo') errors.push('Estado no válido')

  const cargo = cargoCatalog.find((item) => normalize(item[1]) === normalize(row.cargo))
  if (!cargo) errors.push('El cargo no existe en el catálogo actual')

  const identity = normalize(row.dni_documento)
  if (identity) {
    if (existing.some((person) => normalize(person.dni_documento) === identity)) errors.push('El DNI/documento ya existe')
    if (imported.filter((item) => normalize(item.dni_documento) === identity).length > 1) errors.push('DNI/documento duplicado en el archivo')
  }

  return errors
}

function Personal({ onBack }: PersonalProps) {
  const [people, setPeople] = useState<Person[]>(loadPeople)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ImportRow>(emptyPerson)
  const [importOpen, setImportOpen] = useState(false)
  const [importRows, setImportRows] = useState<ImportRow[]>([])
  const [importErrors, setImportErrors] = useState<string[][]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const filteredPeople = useMemo(() => {
    const query = normalize(search)
    return people.filter((person) => {
      const matchesSearch = !query || normalize(`${person.nombre} ${person.primer_apellido} ${person.segundo_apellido} ${person.dni_documento}`).includes(query)
      const matchesStatus = statusFilter === 'Todos' || person.estado === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [people, search, statusFilter])

  const updateForm = (field: keyof ImportRow, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const addPerson = () => {
    const errors = validateRow(form, people, [])
    if (errors.length) {
      window.alert(`No se puede guardar la persona:\n\n• ${errors.join('\n• ')}`)
      return
    }

    const newPerson: Person = { ...form, id: nextPersonId(people) }
    const nextPeople = [...people, newPerson]
    setPeople(nextPeople)
    savePeople(nextPeople)
    setForm(emptyPerson)
    setShowForm(false)
  }

  const handleImport = async (file: File) => {
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array', cellDates: true })
      const sheet = workbook.Sheets['PERSONAS'] ?? workbook.Sheets[workbook.SheetNames[0]]
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false })
      const rows = rawRows.filter((row) => Object.values(row).some((value) => String(value).trim() !== '')) as Record<string, string>[]

      const normalizedRows: ImportRow[] = rows
        .filter((row) => normalize(row.nombre) !== 'ejemplo')
        .map((row) => ({
          nombre: String(row.nombre ?? '').trim(),
          primer_apellido: String(row.primer_apellido ?? '').trim(),
          segundo_apellido: String(row.segundo_apellido ?? '').trim(),
          dni_documento: String(row.dni_documento ?? '').trim(),
          email: String(row.email ?? '').trim(),
          direccion_personal: String(row.direccion_personal ?? '').trim(),
          telefono_personal: String(row.telefono_personal ?? '').trim(),
          telefono_trabajo: String(row.telefono_trabajo ?? '').trim(),
          cargo: String(row.cargo ?? '').trim(),
          estado: String(row.estado ?? '').trim() as ImportRow['estado'],
          fecha_alta: String(row.fecha_alta ?? '').trim(),
          fecha_baja: String(row.fecha_baja ?? '').trim(),
        }))

      const errors = normalizedRows.map((row) => validateRow(row, people, normalizedRows))
      setImportRows(normalizedRows)
      setImportErrors(errors)
      setImportOpen(true)
    } catch {
      window.alert('No se ha podido leer el archivo Excel.')
    }
  }

  const confirmImport = () => {
    if (!importRows.length || importErrors.some((errors) => errors.length)) return

    const importedPeople = importRows.map((row, index) => ({
      ...row,
      id: `PER${String(people.length + index + 1).padStart(6, '0')}`,
    }))
    const nextPeople = [...people, ...importedPeople]
    setPeople(nextPeople)
    savePeople(nextPeople)
    setImportRows([])
    setImportErrors([])
    setImportOpen(false)
  }

  return (
    <div className="personal-app">
      <header className="personal-header">
        <button className="personal-back" onClick={onBack}>← Inicio</button>
        <div className="personal-title">
          <span className="personal-kicker">ALBURA · PERSONAL</span>
          <h1>Personal</h1>
          <p>Personas, permisos y jornada</p>
        </div>
      </header>

      <main className="personal-content">
        <nav className="personal-nav" aria-label="Secciones de Personal">
          <button className="personal-nav-item active">Personal</button>
          <button className="personal-nav-item">Jornada</button>
          <button className="personal-nav-item">Vacaciones</button>
          <button className="personal-nav-item">Horas extra</button>
          <button className="personal-nav-item">Ausencias</button>
        </nav>

        <section className="people-section">
          <div className="people-heading">
            <div>
              <span className="personal-kicker">PERSONAL</span>
              <h2>Personas</h2>
              <p>Gestiona las personas que forman parte de ALBURA.</p>
            </div>
            <div className="people-actions">
              <button className="secondary-action" onClick={downloadTemplate}>↓ Plantilla Excel</button>
              <button className="secondary-action" onClick={() => fileRef.current?.click()}>↑ Importar Excel</button>
              <button className="add-person-button" onClick={() => setShowForm(true)}>+ Añadir persona</button>
              <input
                ref={fileRef}
                className="hidden-file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) void handleImport(file)
                  event.target.value = ''
                }}
              />
            </div>
          </div>

          <div className="people-toolbar">
            <label className="people-search">
              <span>⌕</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar persona..." />
            </label>
            <select className="filter-button" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
              <option>Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>

          {people.length === 0 ? (
            <div className="people-empty">
              <div className="people-empty-icon">●</div>
              <h3>Aún no hay personas cargadas</h3>
              <p>Empieza con una alta individual o importa varias personas desde Excel.</p>
              <div className="empty-actions">
                <button className="secondary-action" onClick={() => fileRef.current?.click()}>Importar Excel</button>
                <button className="empty-action" onClick={() => setShowForm(true)}>Añadir primera persona</button>
              </div>
            </div>
          ) : (
            <div className="people-table-wrap">
              <table className="people-table">
                <thead><tr><th>Persona</th><th>DNI / documento</th><th>Cargo</th><th>Estado</th><th>Fecha de alta</th></tr></thead>
                <tbody>
                  {filteredPeople.map((person) => (
                    <tr key={person.id}>
                      <td><strong>{person.nombre} {person.primer_apellido} {person.segundo_apellido}</strong><span>{person.email}</span></td>
                      <td>{person.dni_documento || '—'}</td>
                      <td>{person.cargo}</td>
                      <td><span className={`person-status ${normalize(person.estado)}`}>{person.estado}</span></td>
                      <td>{person.fecha_alta || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div className="personal-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(false)}>
          <section className="personal-modal" role="dialog" aria-modal="true" aria-labelledby="add-person-title">
            <div className="modal-header"><div><span className="personal-kicker">NUEVA PERSONA</span><h2 id="add-person-title">Añadir persona</h2></div><button className="modal-close" onClick={() => setShowForm(false)}>×</button></div>
            <div className="person-form">
              <label>Nombre<input value={form.nombre} onChange={(e) => updateForm('nombre', e.target.value)} /></label>
              <label>Primer apellido<input value={form.primer_apellido} onChange={(e) => updateForm('primer_apellido', e.target.value)} /></label>
              <label>Segundo apellido<input value={form.segundo_apellido} onChange={(e) => updateForm('segundo_apellido', e.target.value)} /></label>
              <label>DNI / documento<input value={form.dni_documento} onChange={(e) => updateForm('dni_documento', e.target.value)} /></label>
              <label>Email<input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} /></label>
              <label>Dirección personal<input value={form.direccion_personal} onChange={(e) => updateForm('direccion_personal', e.target.value)} /></label>
              <label>Teléfono personal<input value={form.telefono_personal} onChange={(e) => updateForm('telefono_personal', e.target.value)} /></label>
              <label>Teléfono de trabajo<input value={form.telefono_trabajo} onChange={(e) => updateForm('telefono_trabajo', e.target.value)} /></label>
              <label>Cargo<select value={form.cargo} onChange={(e) => updateForm('cargo', e.target.value)}><option value="">Seleccionar cargo</option>{cargoCatalog.filter((cargo) => cargo[0] === 'CAR000002' || cargo[0] === 'CAR000007' || cargo[0] === 'CAR000008').map((cargo) => <option key={cargo[0]}>{cargo[1]}</option>)}</select></label>
              <label>Estado<select value={form.estado} onChange={(e) => updateForm('estado', e.target.value)}><option>Activo</option><option>Inactivo</option></select></label>
              <label>Fecha de alta<input value={form.fecha_alta} onChange={(e) => updateForm('fecha_alta', e.target.value)} placeholder="dd/mm/aaaa" /></label>
              <label>Fecha de baja<input value={form.fecha_baja} onChange={(e) => updateForm('fecha_baja', e.target.value)} placeholder="dd/mm/aaaa" /></label>
            </div>
            <div className="modal-actions"><button className="secondary-action" onClick={() => setShowForm(false)}>Cancelar</button><button className="add-person-button" onClick={addPerson}>Guardar persona</button></div>
          </section>
        </div>
      )}

      {importOpen && (
        <div className="personal-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setImportOpen(false)}>
          <section className="personal-modal import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
            <div className="modal-header"><div><span className="personal-kicker">IMPORTACIÓN</span><h2 id="import-title">Revisar personas</h2></div><button className="modal-close" onClick={() => setImportOpen(false)}>×</button></div>
            <p className="import-summary">{importRows.length} registro(s) detectado(s). {importErrors.filter((errors) => errors.length === 0).length} correcto(s) y {importErrors.filter((errors) => errors.length > 0).length} con errores.</p>
            <div className="import-results">
              {importRows.map((row, index) => (
                <div className={`import-row ${importErrors[index].length ? 'has-error' : 'valid'}`} key={`${row.dni_documento}-${index}`}>
                  <div><strong>{row.nombre} {row.primer_apellido} {row.segundo_apellido}</strong><span>{row.cargo} · {row.dni_documento || 'sin DNI/documento'}</span></div>
                  {importErrors[index].length ? <div className="import-errors">{importErrors[index].map((error) => <span key={error}>⚠ {error}</span>)}</div> : <span className="import-ok">✓ Correcto</span>}
                </div>
              ))}
            </div>
            <div className="modal-actions"><button className="secondary-action" onClick={() => setImportOpen(false)}>Cancelar</button><button className="add-person-button" disabled={importErrors.some((errors) => errors.length) || !importRows.length} onClick={confirmImport}>Confirmar carga</button></div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Personal
