"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dados mockados - em produção viria da API
  const appointments: Appointment[] = [
    {
      id: "APT-001",
      date: "2024-01-15",
      time: "09:00",
      client: "Ana Silva",
      service: "Limpeza Residencial",
      status: "confirmado",
    },
    {
      id: "APT-002",
      date: "2024-01-15",
      time: "14:00",
      client: "João Santos",
      service: "Manutenção AC",
      status: "agendado",
    },
    {
      id: "APT-003",
      date: "2024-01-16",
      time: "10:30",
      client: "Maria Costa",
      service: "Instalação Ventilador",
      status: "concluido",
    },
    {
      id: "APT-004",
      date: "2024-01-18",
      time: "16:00",
      client: "Pedro Oliveira",
      service: "Consultoria Organização",
      status: "cancelado",
    },
    {
      id: "APT-005",
      date: "2024-01-20",
      time: "08:00",
      client: "Carla Mendes",
      service: "Reparo Eletrodoméstico",
      status: "agendado",
    },
  ];

  const getStatusIcon = (status: Appointment["status"]) => {
    const statusConfig = {
      agendado: { icon: Clock, color: "text-primary" },
      confirmado: { icon: CheckCircle, color: "text-accent" },
      concluido: { icon: CheckCircle, color: "text-accent" },
      cancelado: { icon: XCircle, color: "text-destructive" },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent className={`h-3 w-3 ${config.color}`} />;
  };

  const getStatusColor = (status: Appointment["status"]) => {
    const statusConfig = {
      agendado: "bg-muted text-foreground",
      confirmado: "bg-accent text-accent-foreground",
      concluido: "bg-accent text-accent-foreground",
      cancelado: "bg-destructive/10 text-destructive",
    };

    return statusConfig[status];
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
    return appointments.filter((apt) => apt.date === dateStr);
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
            <CheckCircle className="h-4 w-4 text-accent" />
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
