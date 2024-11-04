import { Solicitud } from '../types'

type OverviewGridProps = {
  solicitudesPorTipo: {
    Voluntariado: Solicitud[];
    Donación: Solicitud[];
    Asociación: Solicitud[];
    RegistrarAdultoMayor: Solicitud[];
  }
  
}

export default function OverviewGrid({ solicitudesPorTipo }: OverviewGridProps) {
  const overviewItems = [
    { title: "Solicitudes de Voluntariado", icon: '👥', value: solicitudesPorTipo.Voluntariado.length, description: "Solicitud/es" },
    { title: "Solicitudes de Donaciones", icon: '💰', value: solicitudesPorTipo.Donación.length, description: "Solicitud/es" },
    { title: "Solicitudes de Asociados", icon: '🤝', value: solicitudesPorTipo.Asociación.length, description: "Solicitud/es" },
    { title: "Solicitudes de Adultos Mayores ", icon: '👵', value: solicitudesPorTipo.RegistrarAdultoMayor.length, description: "Solicitud/es" },
  ]

  return (
    <div className="overview-grid">
      {overviewItems.map((item, index) => (
        <div key={index} className="card">
          <div className="card-header">
            <h3 className="card-title">{item.title}</h3>
            <span className="icon">{item.icon}</span>
          </div>
          <div className="card-content">
            <div className="card-value">{item.value}</div>
            <p className="card-description">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}