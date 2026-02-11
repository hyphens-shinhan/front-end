import { create } from 'zustand';
import type {
  MaintenanceDashboard,
  VolunteerActivity,
  EventAttendanceStatus,
  VolunteerTracking,
  EventTracking,
  IncomeTracking,
  GpaTracking,
  CreditTracking,
} from '@/types/maintenance';
import { getMaintenanceDashboard } from '@/data/mock-maintenance';

function cloneDashboard(): MaintenanceDashboard {
  return JSON.parse(JSON.stringify(getMaintenanceDashboard()));
}

function criterionStatus(current: number, required: number): '충족' | '주의' | '위험' | '미달' {
  if (current >= required) return '충족';
  const pct = (current / required) * 100;
  if (pct >= 80) return '주의';
  if (pct >= 50) return '위험';
  return '미달';
}

interface MaintenanceState {
  dashboard: MaintenanceDashboard;
  setDashboard: (d: MaintenanceDashboard) => void;
  updateGpa: (current: number) => void;
  updateCredits: (current: number) => void;
  updateVolunteerHours: (current: number) => void;
  updateEventsAttended: (attended: number) => void;
  /** Add a volunteer activity and recompute current/status/progress */
  addVolunteerActivity: (activity: Omit<VolunteerActivity, 'id' | 'status'>) => void;
  /** Set event attendance (e.g. submit proof -> attended) */
  setEventAttendance: (eventId: string, status: EventAttendanceStatus) => void;
  /** Add an income document (pending) */
  addIncomeDocument: (name: string, file?: File) => void;
  /** Reset to initial mock data */
  reset: () => void;
}

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  dashboard: cloneDashboard(),

  setDashboard: (d) => set({ dashboard: d }),

  updateGpa: (current) => {
    const { dashboard } = get();
    const gpa: GpaTracking = {
      ...dashboard.criteria.gpa,
      current: Math.min(current, dashboard.criteria.gpa.maxGpa),
      status: criterionStatus(current, dashboard.criteria.gpa.required),
    };
    set({
      dashboard: {
        ...dashboard,
        criteria: { ...dashboard.criteria, gpa },
      },
    });
  },

  updateCredits: (current) => {
    const { dashboard } = get();
    const c = dashboard.criteria.credits;
    const credits: CreditTracking = {
      ...c,
      current,
      progressPercentage: Math.min(100, (current / c.required) * 100),
      status: criterionStatus(current, c.required),
    };
    set({
      dashboard: {
        ...dashboard,
        criteria: { ...dashboard.criteria, credits },
      },
    });
  },

  updateVolunteerHours: (current) => {
    const { dashboard } = get();
    const vol = dashboard.criteria.volunteer;
    const newVolunteer: VolunteerTracking = {
      ...vol,
      current,
      progressPercentage: Math.min(100, (current / vol.required) * 100),
      status: criterionStatus(current, vol.required),
    };
    set({
      dashboard: {
        ...dashboard,
        criteria: { ...dashboard.criteria, volunteer: newVolunteer },
      },
    });
  },

  updateEventsAttended: (attended) => {
    const { dashboard } = get();
    const ev = dashboard.criteria.events;
    const required = ev.required;
    const newEventTracking: EventTracking = {
      ...ev,
      attended: Math.min(attended, ev.events.length),
      status: criterionStatus(Math.min(attended, ev.events.length), required),
    };
    set({
      dashboard: {
        ...dashboard,
        criteria: { ...dashboard.criteria, events: newEventTracking },
      },
    });
  },

  addVolunteerActivity: (activity) => {
    const { dashboard } = get();
    const vol = dashboard.criteria.volunteer;
    const newActivity: VolunteerActivity = {
      ...activity,
      id: `v-${Date.now()}`,
      status: 'approved', // optimistic: show as approved so user sees updated hours
    };
    const newActivities = [...vol.activities, newActivity];
    const approvedHours = newActivities
      .filter((a) => a.status === 'approved')
      .reduce((s, a) => s + a.hours, 0);
    const pendingHours = newActivities
      .filter((a) => a.status === 'pending')
      .reduce((s, a) => s + a.hours, 0);
    const newVolunteer: VolunteerTracking = {
      ...vol,
      activities: newActivities,
      current: approvedHours,
      pending: pendingHours,
      progressPercentage: Math.min(100, (approvedHours / vol.required) * 100),
      status: approvedHours >= vol.required ? '충족' : approvedHours >= vol.required * 0.8 ? '주의' : '미달',
    };
    set({
      dashboard: {
        ...dashboard,
        criteria: { ...dashboard.criteria, volunteer: newVolunteer },
      },
    });
  },

  setEventAttendance: (eventId, status) => {
    const { dashboard } = get();
    const ev = dashboard.criteria.events;
    const newEvents = ev.events.map((e) =>
      e.id === eventId ? { ...e, attendanceStatus: status } : e,
    );
    const attended = newEvents.filter((e) => e.attendanceStatus === 'attended').length;
    const missed = newEvents.filter((e) => e.attendanceStatus === 'missed').length;
    const upcoming = newEvents.filter((e) => e.attendanceStatus === 'upcoming').length;
    const nextEvent = newEvents.find((e) => e.attendanceStatus === 'upcoming');
    const newEventTracking: EventTracking = {
      ...ev,
      events: newEvents,
      attended,
      missed,
      upcoming,
      nextEvent,
      status: attended >= ev.required ? '충족' : attended >= ev.required * 0.5 ? '주의' : '미달',
    };
    set({
      dashboard: {
        ...dashboard,
        criteria: { ...dashboard.criteria, events: newEventTracking },
      },
    });
  },

  addIncomeDocument: (name, file) => {
    const { dashboard } = get();
    const income: IncomeTracking = dashboard.criteria.income;
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file?.name ?? name,
      type: 'other',
      uploadedDate: new Date().toISOString().slice(0, 10),
      status: 'pending' as const,
    };
    const documents = [...(income.documents ?? []), newDoc];
    set({
      dashboard: {
        ...dashboard,
        criteria: {
          ...dashboard.criteria,
          income: { ...income, documents },
        },
      },
    });
  },

  reset: () => set({ dashboard: cloneDashboard() }),
}));
