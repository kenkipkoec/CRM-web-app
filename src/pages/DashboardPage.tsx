import { useEffect, useState } from "react";
import { Paper, Typography, Box, Grid, Avatar } from "@mui/material";
import { Task } from "../types/task";
import { apiFetch } from "../utils/api";

type UserProfile = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  password?: string;
};

interface DashboardPageProps {
  user: string;
}

function normalizeTask(task: unknown): Task {
  if (typeof task === "object" && task !== null && "_id" in task) {
    const t = task as { _id: string } & Partial<Task>;
    return { ...t, id: t._id } as Task;
  }
  throw new Error("Invalid task object");
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfileAndCounts() {
      try {
        const profile = await apiFetch("/auth/me");
        setProfile(profile);

        const tasks: Task[] = (await apiFetch("/tasks")).map(normalizeTask);
        setTaskCount(tasks.length);
        setCompletedCount(tasks.filter((t: Task) => t.completed).length);

        const contacts = await apiFetch("/contacts");
        setContactCount(contacts.length);
      } catch {
        // Optionally handle error
      }
    }
    fetchProfileAndCounts();
  }, [user]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f5f6fa 60%, #e3f0ff 100%)"
            : "linear-gradient(135deg, #181c24 60%, #22334d 100%)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          backdropFilter: "blur(16px)",
          background: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.7)"
              : "rgba(40,44,52,0.92)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 8px 32px 0 rgba(31, 38, 135, 0.15)"
              : "0 8px 32px 0 rgba(0,0,0,0.45)",
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {profile && (
          <Box display="flex" alignItems="center" mb={4} gap={2}>
            <Avatar sx={{ width: 56, height: 56 }}>
              {profile.firstName?.[0]?.toUpperCase() ||
                profile.username?.[0]?.toUpperCase() ||
                "U"}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Username: {profile.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {profile.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contact: {profile.contact}
              </Typography>
            </Box>
          </Box>
        )}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total Tasks</Typography>
            <Typography variant="h3" color="primary">
              {taskCount}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Completed Tasks</Typography>
            <Typography variant="h3" color="success.main">
              {completedCount}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Contacts</Typography>
            <Typography variant="h3" color="secondary">
              {contactCount}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}