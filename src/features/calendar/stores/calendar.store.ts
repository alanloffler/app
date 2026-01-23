import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { TView } from "@calendar/interfaces/calendar-view.type";

interface CalendarState {
  selectedDate: Date;
  selectedView: TView;
  setSelectedDate: (date: Date) => void;
  setSelectedView: (view: TView) => void;
}

export const useCalendarStore = create(
  persist<CalendarState>(
    (set) => ({
      selectedDate: new Date(),
      selectedView: "week",
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedView: (view) => set({ selectedView: view }),
    }),
    {
      name: "calendar",
      storage: createJSONStorage(() => sessionStorage),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as CalendarState),
        selectedDate: (persistedState as CalendarState)?.selectedDate
          ? new Date((persistedState as CalendarState).selectedDate)
          : currentState.selectedDate,
      }),
    },
  ),
);
