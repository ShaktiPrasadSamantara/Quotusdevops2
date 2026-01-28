import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Link,
} from '@mui/material';
import axios from 'axios';

const typeColor = (type) => {
  if (type === 'policy') return 'info';
  if (type === 'helpline') return 'success';
  return 'default';
};

const AwarenessHubPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAwareness = async () => {
      try {
        const res = await axios.get('http://13.205.179.91:5000/api/awareness');
        setItems(res.data.data);
      } catch (error) {
        console.error('Error fetching awareness', error.message);
      }
    };

    fetchAwareness();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Awareness Hub
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Campus policies, helpline contacts, and safety tips to promote a culture of trust and safety.
      </Typography>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Paper sx={{ p: 3 }}>
              <Chip
                label={item.type.toUpperCase()}
                color={typeColor(item.type)}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                {item.content}
              </Typography>
              {item.link && (
                <Link href={item.link} target="_blank" rel="noopener">
                  Learn more
                </Link>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AwarenessHubPage;
