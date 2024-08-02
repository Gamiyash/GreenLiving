const express = require('express');
const router = express.Router();
const events = require('../models/event');

router.get('/event/:id', async (req, res) => {
    if (req.session.user) {
    try {
      const eventId = req.params.id;
      console.log('Event ID:', eventId); // Add this line to log the event ID
  
      const event = await events.findById(eventId);
  
      if (event) {
        res.render('event', { event });
        
      } else {
        res.status(404).render('error', { message: 'Event not found' });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).render('error', { message: 'Internal Server Error' });
    }
}else{
    
        res.redirect('/auth/login');
      
}
  });
  

module.exports = router;
