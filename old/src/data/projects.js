const projects = [
  {
    name: 'Canny Edge Detection GUI',
    tech: 'Python & OpenCV',
    summary: 'Implemented Canny Edge Detection from scratch in Python (Sobel, NMS, double-threshold, hysteresis). Built a Tkinter GUI to load images, tune blur, and visualize each stage with OpenCV. Shipped a reproducible project (NumPy/OpenCV, requirements, usage docs). Wrote clean, readable code with clear error handling and step-by-step visualization.'
  },
  {
    name: 'Love Fortune Card App',
    tech: '.NET & MongoDB',
    summary: 'Built a C# app that shuffles cards and uses partner name length to craft love fortunes. Implemented dynamic shuffling and pile distribution with interactive card selection. Leveraged MongoDB and async operations to store and retrieve cards and fortunes.'
  },
  {
    name: 'Real-Time Earthquake Map',
    tech: 'Python & Streamlit',
    summary: 'Built a Streamlit app to stream real-time earthquake data from EMSC via WebSocket. Processed 24-hour earthquake records and laid groundwork for interactive folium map. Implemented periodic refresh, timezone-safe DataFrame transformations and persistence.'
  },
  {
    name: 'User Data Test Site',
    tech: 'Node.js/Express & MongoDB',
    summary: 'Built a Node/Express app where users submit names; stored and retrieved via MongoDB. Implemented Mongoose models and simple validation; displayed entries with EJS templates. Configured routes for submission and display; styled with Bootstrap for responsive UI.'
  }
];

export default projects;
