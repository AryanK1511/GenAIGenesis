"use client"

import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ChatBot from './chatbot/page';

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080'); 

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data); 
      if (data.action === 'start') {
        setMessage('start');
      } else if (data.action === 'click') {
        setMessage('click');
      } else if (data.action === 'process') {
        setMessage('process');
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 4 }}>
          Notebook Scanner Platform
        </Typography>
        <main style={{ width: '100%', flexGrow: 1 }}>
          <ChatBot />
          {message === 'start' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <CircularProgress />
              <Typography variant="h6">Loading Image</Typography>
            </Box>
          )}
          {message === 'click' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <CircularProgress />
              <Typography variant="h6">Processing</Typography>
            </Box>
          )}
          {message === 'process' && <ChatBot />}
        </main>
      </Container>
      <footer style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f1f1f1' }}>
        <Typography variant="body2" color="textSecondary">
          © 2025 Notebook Scanner Platform
        </Typography>
      </footer>
    </div>
  );
}
