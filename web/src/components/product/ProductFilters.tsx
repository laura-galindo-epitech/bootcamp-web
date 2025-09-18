'use client';

type Filters = { gender?: string }

const genders = [
    { key: 'men', label: 'Homme' },
    { key: 'women', label: 'Femme' },
    { key: 'kids', label: 'Enfant' },
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
        </div>
    )
}