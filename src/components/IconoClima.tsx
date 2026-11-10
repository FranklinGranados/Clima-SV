/**
 * Icono del estado del clima de OpenWeather (servidor o cliente: no usa hooks).
 * El dominio está permitido en next.config.ts (images.remotePatterns).
 */
import Image from "next/image";

interface IconoClimaProps {
  /** Código de OpenWeather, ej. "04d". */
  icono: string;
  /** Descripción en español; se usa como texto alternativo. */
  descripcion: string;
  /** Tamaño en píxeles (ancho = alto). */
  tamano?: number;
}

export default function IconoClima({ icono, descripcion, tamano = 64 }: IconoClimaProps) {
  return (
    <Image
      src={`https://openweathermap.org/img/wn/${icono}@2x.png`}
      alt={descripcion}
      width={tamano}
      height={tamano}
      sizes={`${tamano}px`}
      className="shrink-0"
    />
  );
}
