import { FavoritesGrid } from "./_components/favorites-grid";

export default function FavoritosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favoritos</h1>
          <p className="text-muted-foreground">
            Seus prestadores de serviço favoritos
          </p>
        </div>
        <FavoritesGrid />
      </div>
    </div>
  );
}
