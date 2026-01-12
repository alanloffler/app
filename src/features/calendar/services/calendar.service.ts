import type z from "zod";

import type { IApiResponse } from "@core/interfaces/api-response.interface";
import type { ICalendarEvent } from "@calendar/interfaces/calendar-event.interface";
import type { eventSchema } from "@calendar/schemas/event.schema";
import { apiClient } from "@core/client/client";

class CalendarModuleService {
  private static instance: CalendarModuleService;

  public static getInstance(): CalendarModuleService {
    if (!CalendarModuleService.instance) {
      CalendarModuleService.instance = new CalendarModuleService();
    }

    return CalendarModuleService.instance;
  }

  public async create(data: z.infer<typeof eventSchema>): Promise<IApiResponse<ICalendarEvent>> {
    const response = await apiClient.post("/events", data);
    return response.data;
  }

  public async findAll(): Promise<IApiResponse<ICalendarEvent[]>> {
    const response = await apiClient.get("/events");
    const data = response.data;
    if (!data.data) return data;

    return { ...data, data: this.toDate(data.data) };
  }

  private toDate(events: ICalendarEvent[]) {
    if (events) {
      return events.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
    }

    return events;
  }

  public async remove(id: string): Promise<IApiResponse<ICalendarEvent>> {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  }
}

export const CalendarService = CalendarModuleService.getInstance();
