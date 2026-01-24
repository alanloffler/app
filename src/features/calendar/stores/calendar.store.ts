import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { IUser } from "@users/interfaces/user.interface";
import type { TView } from "@calendar/interfaces/calendar-view.type";

interface CalendarState {
  selectedDate: Date;
  selectedProfessional: IUser | null;
  selectedView: TView;
  setSelectedDate: (date: Date) => void;
  setSelectedProfessional: (user: IUser) => void;
  setSelectedView: (view: TView) => void;
}

export const useCalendarStore = create(
  persist<CalendarState>(
    (set) => ({
      selectedDate: new Date(),
      selectedProfessional: null,
      selectedView: "week",
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedProfessional: (user) => set({ selectedProfessional: user }),
      setSelectedView: (view) => set({ selectedView: view }),
    }),
    {
      name: "app-calendar",
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
