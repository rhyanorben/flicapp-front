"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppointments } from "@/hooks/use-appointments";

interface TransformedAppointment {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string;
  status:
    | "agendado"
    | "confirmado"
    | "em_andamento"
    | "concluido"
    | "cancelado";
  originalAppointment: Record<string, unknown>;
}

// Map database status to display status
const mapStatus = (
  status: string
): "agendado" | "confirmado" | "em_andamento" | "concluido" | "cancelado" => {
  const statusMap: Record<
    string,
    "agendado" | "confirmado" | "em_andamento" | "concluido" | "cancelado"
  > = {
    matching: "agendado",
    await_cpf: "agendado",
    await_provider: "agendado",
    accepted: "confirmado",
    in_progress: "em_andamento",
    completed: "concluido",
    cancelled: "cancelado",
  };
  return statusMap[status] || "agendado";
};

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    data: appointments,
    isLoading,
    error,
  } = useAppointments("todos", "todos");

  // Transform appointments for display
  const transformedAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments.map((appointment, index) => ({
      id: appointment.id || `appointment-${index}-${Date.now()}`, // Generate unique ID if missing
      date: appointment.slotStart
        ? new Date(appointment.slotStart).toISOString().split("T")[0]
        : new Date(appointment.createdAt).toISOString().split("T")[0],
      time: appointment.slotStart
        ? new Date(appointment.slotStart).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Não agendado",
      client: appointment.client?.name || "Não informado",
      service: appointment.category?.name || "Não especificado",
      status: mapStatus(appointment.status),
      originalAppointment: appointment,
    }));
  }, [appointments]);

  const getStatusIcon = (status: TransformedAppointment["status"]) => {
    const statusConfig = {
      agendado: { icon: Clock, color: "text-primary" },
      confirmado: { icon: CheckCircle, color: "text-accent" },
      em_andamento: { icon: AlertCircle, color: "text-blue-500" },
      concluido: { icon: CheckCircle, color: "text-green-500" },
      cancelado: { icon: XCircle, color: "text-destructive" },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent className={`h-3 w-3 ${config.color}`} />;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Adicionar dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Adicionar dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return transformedAppointments.filter((apt) => apt.date === dateStr);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const days = getDaysInMonth(currentDate);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendário de Agendamentos
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="h-24 border border-border bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendário de Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Erro ao carregar agendamentos. Tente novamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendário de Agendamentos
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div key={index} className="h-24 border border-border"></div>
              );
            }

            const dayAppointments = getAppointmentsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={day.toISOString()}
                className={`h-24 border border-border p-1 ${
                  isToday ? "bg-accent/10 border-accent" : "bg-card"
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday ? "text-accent-foreground" : "text-foreground"
                  }`}
                >
                  {day.getDate()}
                </div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <Badge
                      key={appointment.id}
                      variant={
                        appointment.status === "agendado"
                          ? "secondary"
                          : appointment.status === "confirmado" ||
                            appointment.status === "em_andamento" ||
                            appointment.status === "concluido"
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs p-1 h-auto truncate"
                      title={`${appointment.time} - ${appointment.client} - ${appointment.service}`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(appointment.status)}
                        <span className="truncate">{appointment.time}</span>
                      </div>
                    </Badge>
                  ))}

                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayAppointments.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span>Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span>Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span>Cancelado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
