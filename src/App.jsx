import { useState } from "react";
import "./App.css";
import axios from "axios";
import { saveAs } from "file-saver";
import toast, { Toaster } from "react-hot-toast";

import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button,
  IconButton,
  Stack,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8081/api/email/generate",
        {
          emailContent,
          tone,
        }
      );

      const reply =
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data);

      setGeneratedReply(reply);

      setHistory((prev) => {
        const updated = [reply, ...prev];
        return updated.slice(0, 5);
      });

      toast.success("Reply Generated Successfully!");
    } catch (error) {
      setError("Failed to generate Email reply. Please try again.");
      toast.error("Failed to Generate Reply");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyReply = () => {
    navigator.clipboard.writeText(generatedReply);
    toast.success("Copied to Clipboard!");
  };

  const downloadReply = () => {
    const blob = new Blob([generatedReply], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, "EmailReply.txt");
    toast.success("Downloaded Successfully!");
  };

  const bgGradient = darkMode
    ? "linear-gradient(135deg,#0f172a,#1e293b)"
    : "linear-gradient(135deg,#667eea,#764ba2)";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bgGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Toaster position="top-right" />

      <Container maxWidth="md">
        <Box
          sx={{
            background: darkMode
              ? "rgba(30,41,59,0.75)"
              : "rgba(255,255,255,0.18)",

            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.2)",

            p: { xs: 3, md: 5 },

            borderRadius: 5,

            boxShadow:
              "0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          {/* Dark Mode Toggle */}

          <Box sx={{ textAlign: "right" }}>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <LightModeIcon
                  sx={{ color: "#fff" }}
                />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </Box>

          {/* Header */}

          <Typography
            variant="h3"
            align="center"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
              color: darkMode
                ? "#fff"
                : "#1f2937",
              mb: 1,
            }}
          >
            <AutoAwesomeIcon
              sx={{
                fontSize: 45,
                color: "#fbbf24",
              }}
            />

            Email Reply Generator
          </Typography>

          <Typography
            align="center"
            sx={{
              color: darkMode
                ? "#cbcce1"
                : "#e7c20a",
              mb: 4,
            }}
          >
            Generate professional email
            responses instantly using AI
          </Typography>

          {/* Email Content */}

          <TextField
            fullWidth
            multiline
            rows={8}
            variant="outlined"
            label="Original Email Content"
            placeholder="Paste your email content here..."
            value={emailContent}
            onChange={(e) =>
              setEmailContent(e.target.value)
            }
            sx={{
              mb: 1,

              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: darkMode
                  ? "#334155"
                  : "#fff",
              },

              "& .MuiInputLabel-root": {
                color: darkMode
                  ? "#e2e8f0"
                  : undefined,
              },
            }}
          />

          {/* Character Counter */}

          <Typography
            sx={{
              textAlign: "right",
              color: darkMode
                ? "#cbd5e1"
                : "#6b7280",
              mb: 3,
              fontSize: "0.9rem",
            }}
          >
            {emailContent.length} Characters
          </Typography>

          {/* Tone Selector */}

          <FormControl
            fullWidth
            sx={{
              mb: 3,

              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: darkMode
                  ? "#334155"
                  : "#fff",
              },
            }}
          >
            <InputLabel>
              Tone (Optional)
            </InputLabel>

            <Select
              value={tone}
              label="Tone (Optional)"
              onChange={(e) =>
                setTone(e.target.value)
              }
            >
              <MenuItem value="">
                None
              </MenuItem>

              <MenuItem value="professional">
                Professional
              </MenuItem>

              <MenuItem value="friendly">
                Friendly
              </MenuItem>

              <MenuItem value="casual">
                Casual
              </MenuItem>
            </Select>
          </FormControl>

          {/* Generate Button */}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            sx={{
              py: 1.8,
              borderRadius: 3,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",

              background:
                "linear-gradient(135deg,#667eea,#764ba2)",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#5a67d8,#6b46c1)",

                transform:
                  "translateY(-2px)",

                boxShadow:
                  "0 10px 20px rgba(102,126,234,0.4)",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{ color: "#fff" }}
              />
            ) : (
              "Generate Reply"
            )}
          </Button>

          {/* Error */}

          {error && (
            <Typography
              color="error"
              sx={{
                mt: 2,
                textAlign: "center",
              }}
            >
              {error}
            </Typography>
          )}

          {/* Generated Reply */}

          {generatedReply && (
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,

                backgroundColor: darkMode
                  ? "#1e293b"
                  : "#f8fafc",

                border:
                  "1px solid rgba(203,213,225,0.4)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: darkMode
                    ? "#fff"
                    : "#374151",
                }}
              >
                Generated Reply
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={8}
                value={generatedReply}
                inputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: darkMode
                      ? "#334155"
                      : "#fff",
                  },
                }}
              />

              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Button
                  variant="contained"
                  startIcon={
                    <ContentCopyIcon />
                  }
                  onClick={copyReply}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Copy
                </Button>

                <Button
                  variant="outlined"
                  startIcon={
                    <DownloadIcon />
                  }
                  onClick={downloadReply}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                  }}
                >
                  Download
                </Button>
              </Stack>
            </Box>
          )}

          {/* Reply History */}

          {history.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: darkMode
                    ? "#fff"
                    : "#1f2937",
                }}
              >
                Recent History
              </Typography>

              {history.map(
                (item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,

                      backgroundColor:
                        darkMode
                          ? "#334155"
                          : "#f8fafc",

                      border:
                        "1px solid rgba(203,213,225,0.5)",

                      maxHeight:
                        index === 0
                          ? "none"
                          : "100px",

                      overflow: "hidden",

                      color: darkMode
                        ? "#e2e8f0"
                        : "#374151",
                    }}
                  >
                    {item}
                  </Box>
                )
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default App;