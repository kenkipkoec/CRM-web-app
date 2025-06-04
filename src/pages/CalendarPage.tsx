import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Task } from "../types/task";
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import dayjs from "dayjs";
import EventIcon from "@mui/icons-material/Event";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    apiFetch("/tasks").then((data) => setTasks(data));
  }, []);

  // Highlight dates with tasks
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      if (
        selectedDate &&
        dayjs(date).isSame(dayjs(selectedDate), "day") &&
        !dayjs(date).isSame(dayjs(), "day")
      ) {
        return "custom-selected-date";
      }
    }
    return "";
  };

  // Get tasks for selected date
  const tasksForDate = selectedDate
    ? tasks.filter(
        (t) =>
          t.dueDate &&
          dayjs(t.dueDate).format("YYYY-MM-DD") ===
            dayjs(selectedDate).format("YYYY-MM-DD")
      )
    : [];

  // Hide overflow days (from prev/next month)
  function tileDisabled({ date, view }: { date: Date; view: string }) {
    if (view === "month") {
      return (
        date.getMonth() !== activeStartDate.getMonth() ||
        date.getFullYear() !== activeStartDate.getFullYear()
      );
    }
    return false;
  }

  const hasTask = (date: Date) =>
    tasks.some(
      (task) => task.dueDate && dayjs(task.dueDate).isSame(dayjs(date), "day")
    );

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #e3f0ff 60%, #f5f6fa 100%)"
            : "linear-gradient(135deg, #181c24 60%, #22334d 100%)",
        px: { xs: 0, sm: 2 },
        py: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          mt: { xs: 2, sm: 8 },
          width: "100%",
          maxWidth: { xs: "100%", sm: 500 },
          mx: "auto",
          borderRadius: { xs: 2, sm: 6 },
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.95)"
              : "rgba(40,44,52,0.98)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.20)"
              : "0 8px 32px 0 rgba(0,0,0,0.55)",
          overflowX: "auto",
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <EventIcon />
          </Avatar>
          <Typography variant="h4" fontWeight={700}>
            Calendar
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            display: "flex",
            justifyContent: "center",
            mb: 3,
            "& .react-calendar": {
              border: "none",
              borderRadius: 4,
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 2px 8px 0 rgba(31,38,135,0.08)"
                  : "0 2px 8px 0 rgba(0,0,0,0.18)",
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "#f9fafc"
                  : "#23283a",
              p: 2,
              width: "100%",
              minWidth: 0,
              maxWidth: 400,
            },
            "& .react-calendar__navigation": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
              gap: 8,
            },
            "& .react-calendar__navigation__label": {
              flex: 1,
              textAlign: "center",
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: 1,
              padding: 0,
              margin: 0,
            },
            "& .react-calendar__navigation button": {
              color: "#005478 !important",
              fontSize: "1.3em !important",
              minWidth: "32px",
              minHeight: "32px",
              width: "32px",
              height: "32px",
              border: "none",
              background: "none !important",
              boxShadow: "none",
              margin: "0 4px",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .react-calendar__navigation button:disabled": {
              opacity: 0.5,
            },
            "& .react-calendar__tile--now": {
              background: "#1976d2 !important",
              color: "#fff !important",
              borderRadius: "50%",
            },
            "& .task-date": {
              background: "#005478 !important",
              color: "#fff !important",
              borderRadius: "50%",
            },
            "& .react-calendar__month-view__days__day--neighboringMonth": {
              visibility: "hidden",
              pointerEvents: "none",
              height: 0,
              padding: 0,
              margin: 0,
            },
          }}
        >
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) =>
              setActiveStartDate(activeStartDate as Date)
            }
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
            tileContent={({ date, view }) =>
              view === "month" && hasTask(date) ? (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: "#1976d2",
                    borderRadius: "50%",
                    margin: "0 auto",
                    marginTop: 2,
                  }}
                />
              ) : null
            }
            prevLabel={<ArrowBackIosNewIcon fontSize="small" />}
            nextLabel={<ArrowForwardIosIcon fontSize="small" />}
            formatMonthYear={(_, date) => dayjs(date).format("MMMM YYYY")}
            showNeighboringMonth={false}
          />
        </Box>
        {selectedDate && (
          <>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Tasks for {dayjs(selectedDate).format("MMM D, YYYY")}
            </Typography>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <List>
                {tasksForDate.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No tasks for this date." />
                  </ListItem>
                )}
                {tasksForDate.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                    }}
                  >
                    <ListItemText
                      primary={task.description}
                      secondary={
                        task.dueDate
                          ? `Due: ${dayjs(task.dueDate).format("HH:mm")}`
                          : ""
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}
      </Paper>
      <style>
        {`
  /* Make all days (including weekends) the same color */
  .react-calendar__month-view__days__day {
    color: #213547 !important; /* dark text for all days */
    font-weight: 500;
    background: none;
  }
  [data-theme="dark"] .react-calendar__month-view__days__day {
    color: #fff !important;
  }
  /* Remove red color from weekends */
  .react-calendar__month-view__days__day--weekend {
    color: #213547 !important;
  }
  [data-theme="dark"] .react-calendar__month-view__days__day--weekend {
    color: #fff !important;
  }

  /* Blue border for selected date (not today) */
  .react-calendar__tile.custom-selected-date {
    border: 2px solid #1976d2 !important;
    border-radius: 50% !important;
    background: none !important;
    color: #1976d2 !important;
    font-weight: 700;
  }

  /* Remove highlight from "today" if it's not in the current month */
  .react-calendar__month-view__days__day--now:not(.react-calendar__tile--active),
  .react-calendar__month-view__days__day--now:not(.react-calendar__tile--active):not([aria-selected="true"]) {
    background: none !important;
    color: #213547 !important;
  }
  [data-theme="dark"] .react-calendar__month-view__days__day--now:not(.react-calendar__tile--active),
  [data-theme="dark"] .react-calendar__month-view__days__day--now:not(.react-calendar__tile--active):not([aria-selected="true"]) {
    color: #fff !important;
  }
`}
      </style>
    </Box>
  );
}