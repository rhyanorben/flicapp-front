import { CalendarView } from "./_components/calendar-view";
import { AppointmentsList } from "./_components/appointments-list";

export default function AgendaPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos e visualize sua agenda mensal
          </p>
        </div>
        <CalendarView />
        <AppointmentsList />
      </div>
    </div>
  );
}
