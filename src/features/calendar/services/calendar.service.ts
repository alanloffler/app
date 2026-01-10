import type { IApiResponse } from "@core/interfaces/api-response.interface";
import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
// import { apiClient } from "@core/client/client";

class CalendarModuleService {
  private static instance: CalendarModuleService;

  public static getInstance(): CalendarModuleService {
    if (!CalendarModuleService.instance) {
      CalendarModuleService.instance = new CalendarModuleService();
    }

    return CalendarModuleService.instance;
  }

  public async findAll(): Promise<IApiResponse<ICalendarEvent[]>> {
    const events: ICalendarEvent[] = [
      {
        id: 0,
        title: "Event 1",
        start: new Date("2026-01-07T10:00:00"),
        end: new Date("2026-01-07T10:30:00"),
        resourceId: 1,
        userId: "439a4db0-d527-473e-9566-27aee5fcbd35",
      },
      {
        id: 1,
        title: "Event 2",
        start: new Date("2026-01-07T10:30:00"),
        end: new Date("2026-01-07T11:00:00"),
        resourceId: 2,
        userId: "439a4db0-d527-473e-9566-27aee5fcbd35",
      },
      {
        id: 2,
        title: "Event 3",
        start: new Date("2026-01-08T10:00:00"),
        end: new Date("2026-01-08T10:30:00"),
        resourceId: 3,
        userId: "439a4db0-d527-473e-9566-27aee5fcbd35",
      },
      {
        id: 3,
        title: "Event 4",
        start: new Date("2026-01-08T11:00:00"),
        end: new Date("2026-01-08T11:30:00"),
        resourceId: 4,
        userId: "439a4db0-d527-473e-9566-27aee5fcbd35",
      },
      {
        id: 4,
        title: "Event 5",
        start: new Date("2026-01-08T11:30:00"),
        end: new Date("2026-01-08T12:00:00"),
        resourceId: 5,
        userId: "439a4db0-d527-473e-9566-27aee5fcbd35",
      },
      {
        id: 5,
        title: "Event 6",
        start: new Date("2026-01-08T13:00:00"),
        end: new Date("2026-01-08T13:30:00"),
        resourceId: 6,
        userId: "439a4db0-d527-473e-9566-27aee5fcbd35",
      },
    ];

    return { message: "Eventos encontrados", statusCode: 200, data: events };
  }
}

export const CalendarService = CalendarModuleService.getInstance();
