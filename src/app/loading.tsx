/** Estado de carga entre páginas: esqueleto con la forma del contenido. */
export default function Loading() {
  return (
    <div className="container-x min-h-[100svh] pt-28 pb-20 md:pt-36" role="status" aria-label="Cargando página">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton mt-6 h-14 w-full max-w-2xl" />
      <div className="skeleton mt-4 h-14 w-2/3 max-w-xl" />
      <div className="skeleton mt-8 h-5 w-full max-w-lg" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <div className="skeleton h-64 rounded-[20px] md:col-span-2" />
        <div className="skeleton h-64 rounded-[20px]" />
      </div>
    </div>
  );
}
