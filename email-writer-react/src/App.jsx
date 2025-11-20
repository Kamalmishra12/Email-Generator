import React, { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from '@mui/material'
import axios from 'axios'

// 👉 yahan base URL env se le rahe hain
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!emailContent.trim()) return

    setLoading(true)
    setError('')
    setGeneratedReply('')

    try {
    
      const response = await axios.post(
        `${API_URL}/api/email/generate`,
        {
          emailContent,
          tone,
        }
      )

      const data = response?.data
      if (typeof data === 'string') {
        setGeneratedReply(data)
      } else if (data?.reply) {
        setGeneratedReply(data.reply)
      } else {
        setGeneratedReply(JSON.stringify(data, null, 2))
      }
    } catch (err) {
      console.error(err)
      setError('⚠️ Failed to generate email reply. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        📧 Email Reply Generator
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2, backgroundColor: '#fafafa' }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Original Email Content"
          placeholder="Paste the email content here..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="tone-label">Tone (Optional)</InputLabel>
          <Select
            labelId="tone-label"
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{ py: 1.8, fontSize: 16 }}
          onClick={handleSubmit}
          disabled={!emailContent || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
        </Button>

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Paper sx={{ mt: 4, p: 3, borderRadius: 2, backgroundColor: '#f7f7f7' }}>
            <Typography variant="h6" gutterBottom>
              Generated Reply:
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={6}
              value={generatedReply}
              InputProps={{ readOnly: true }}
            />

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              📋 Copy to Clipboard
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  )
}
