'use client'

type Filters = { gender?: string; category?: string }

const genders = [
    { key: 'men', label: 'Homme' },
    { key: 'women', label: 'Femme' },
    { key: 'kids', label: 'Enfant' },
]

const categories = [
    { key: 'running', label: 'Running' },
    { key: 'sneakers', label: 'Lifestyle' },
    { key: 'basketball', label: 'Basketball' },
]

export default function ProductFilters({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
                {genders.map(g => (
                    <button
                        key={g.key}
                        onClick={() => onChange({ ...value, gender: value.gender === g.key ? undefined : g.key })}
                        className={`rounded-full border px-4 py-1.5 text-sm ${value.gender===g.key ? 'bg-black text-white' : 'hover:bg-zinc-50'}`}
                    >{g.label}</button>
                ))}
            </div>
            <div className="h-6 w-px bg-zinc-200" />
            <select
                value={value.category || ''}
                onChange={e => onChange({ ...value, category: e.target.value || undefined })}
                className="rounded-full border px-3 py-1.5 text-sm bg-white"
            >
                <option value="">Toutes catégories</option>
                {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
        </div>
    )
}