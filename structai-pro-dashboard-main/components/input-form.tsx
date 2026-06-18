"use client"

type Field = {
  id: string
  label: string
  value: string
  unit: string
}

type Section = {
  title: string
  fields: Field[]
}

const sections: Section[] = [
  {
    title: "Géométrie de la section",
    fields: [
      { id: "b", label: "Largeur b", value: "300", unit: "mm" },
      { id: "h", label: "Hauteur h", value: "550", unit: "mm" },
      { id: "d", label: "Hauteur utile d", value: "500", unit: "mm" },
      { id: "L", label: "Portée L", value: "6.00", unit: "m" },
    ],
  },
  {
    title: "Matériaux",
    fields: [
      { id: "fck", label: "Béton fck", value: "25", unit: "MPa" },
      { id: "fyk", label: "Acier fyk", value: "500", unit: "MPa" },
    ],
  },
  {
    title: "Sollicitations (ELU)",
    fields: [
      { id: "med", label: "Moment Med", value: "186.2", unit: "kN·m" },
      { id: "ved", label: "Tranchant Ved", value: "271.4", unit: "kN" },
    ],
  },
]

function InputField({ field }: { field: Field }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.id} className="text-xs font-medium text-muted-foreground">
        {field.label}
      </label>
      <div className="flex items-center rounded-md border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
        <input
          id={field.id}
          defaultValue={field.value}
          inputMode="decimal"
          className="w-full bg-transparent px-3 py-2 font-mono text-sm tabular-nums text-foreground outline-none"
        />
        <span className="border-l border-border px-2.5 py-2 text-xs text-muted-foreground">{field.unit}</span>
      </div>
    </div>
  )
}

export function InputForm() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Données d&apos;entrée</h2>
        <p className="text-xs text-muted-foreground">Section rectangulaire en béton armé</p>
      </div>
      <div className="flex flex-col gap-6 p-5">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {section.fields.map((field) => (
                <InputField key={field.id} field={field} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
