import type { IconType } from "react-icons";

export interface IPlugin {
  path: string;                                                       // ruta del plugin
  component: () => Promise<{ default: React.ComponentType }>;         // componente lazy loaded
  name: string;                                                       // nombre visible
  icon: IconType;                                                     // icono de react-icons
  category?: string;                                                  // opcional: categoría (ej: developer, utils)
  description?: string;                                               // opcional: descripción corta
  tags?: string[];                                                    // opcional: etiquetas para buscador o filtrado
}