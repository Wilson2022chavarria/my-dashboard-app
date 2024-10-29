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
    { title: "Solicitudes de Voluntariado", icon: '👥', value: solicitudesPorTipo.Voluntariado.length, description: "Solicitudes activas" },
    { title: "Donaciones Recibidas", icon: '💰', value: solicitudesPorTipo.Donación.length, description: "Solicitudes de donación" },
    { title: "Nuevos Asociados", icon: '🤝', value: solicitudesPorTipo.Asociación.length, description: "Solicitudes de asociación" },
    { title: "Adultos Mayores Registrados", icon: '👵', value: solicitudesPorTipo.RegistrarAdultoMayor.length, description: "Nuevos registros" },
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