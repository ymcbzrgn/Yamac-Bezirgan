import React, { useState, useEffect } from 'react';

const contact = {
  name: 'Yamaç BEZİRGAN',
  email: 'contact@yamacbezirgan.com',
  website: 'www.yamacbezirgan.com',
  phone: '+90 507 835 6555',
  github: 'github.com/ymcbzrgn',
  linkedin: 'linkedin.com/in/yamacbezirgan'
};

const sections = {
  about: `A focused computer engineering graduate with hands-on full-stack experience, building end-to-end, user-centric products. I blend strong technical rigor with a creative, product mindset to deliver reliable, innovative software. With a growing focus on AI, I'm ready to contribute to impactful projects in dynamic, collaborative teams. Born on 22.10.2002.`,
  experience: [
    {
      role: 'ML & AI Automation Intern',
      company: 'Arketic AI',
      date: 'June 2025 - Present',
      bullets: [
        'Delivered tailored automation solutions for enterprise clients across sectors and regions.',
        'Served as Lead Developer for the company\'s official platform, overseeing E2E delivery.',
        'Contributed to AI model training and data pipelines for the company\'s core platform.',
        'Gained recognition for innovative problem-solving in diverse industry projects.'
      ]
    },
    {
      role: 'Freelance Developer',
      company: '',
      date: 'September 2020 - Present',
      bullets: [
        'Designed and deployed dynamic web applications for small and midsize clients, end to end.',
        'Partnered with clients to elicit requirements and deliver scope-aligned outcomes.',
        'Developed cross-platform mobile apps with Expo, from prototype to app store release.',
        'Designed and implemented efficient APIs to optimize app performance and scalability.'
      ]
    },
    {
      role: 'Software Development Intern',
      company: 'Exagate',
      date: 'August 2023 - September 2023',
      bullets: [
        'Contributed to front-end delivery and Node.js web projects, from design to launch.',
        'Enhanced UI responsiveness and scalability via optimized React patterns and state.',
        'Authored process documentation to enable reuse and scale across future projects.',
        'Collaborated closely with cross-functional teams to ensure seamless project integration.'
      ]
    }
  ],
  projects: [
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
  ],
  education: [
    {
      school: 'Altınbaş University',
      degree: 'Computer Engineering',
      date: '2020 - 2025',
      details: 'Relevant Courses: Data Structures, Algorithms, Artificial Intelligence, Image Processing Techniques, Database Management Systems, and more...'
    },
    {
      school: 'Università degli Studi di Milano',
      degree: 'Erasmus+ Exchange Program',
      date: '2022 - 2023',
      details: 'Focus: Advanced software development and artificial intelligence, with a solid performance in both undergraduate and graduate courses. Selected Courses: Intelligent Systems, Real-Time Graphics Programming, Natural Interaction, and more...'
    }
  ],
  skills: ['Python', 'TypeScript', 'React', 'Next.js', 'Node.js', 'REST APIs', 'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'OAuth/JWT', 'CI/CD', 'Solution Architecture', 'API Architecture & Standards', 'Workflow Orchestration (n8n)', 'LLM Systems Orchestration', 'Prompt Engineering & Evaluation', 'Agile Delivery (Scrum/Kanban)', 'Automated Testing (Unit/Integration)', 'Requirements Analysis'],
  certificates: ['Introduction to Big Data / BTK Academia', 'CEO Career Summit / Youthall', 'Preparing to My New Job / Kodluyoruz', '18.MÜYAK / Endüstri ve Verimlilik Kulübü']
};


import Header from './Header';
import Footer from './Footer';
import Skills from './Skills';
import Education from './Education';
import Experience from './Experience';
import Projects from './Projects';
import GithubProjects from './GithubProjects';
import Section from './Section';
import About from './About';
import Contact from './Contact';
import CertificatesReferences from './CertificatesReferences';

export default function App() {
  const [theme, setTheme] = useState('minimal');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  return (
    <div className="screen">
      <Header contact={contact} onThemeChange={handleThemeChange} />

      <main className="container">
        <div className="left">
          <About contact={contact} about={sections.about} />
          <div className="card">
            <div className="cta">
              <a className="btn primary" href="/YAMAÇ_BEZİRGAN.pdf" download>Download Resume</a>
              <a className="btn" href={`mailto:${contact.email}`}>Contact</a>
            </div>
          </div>
          <Skills skills={sections.skills} />
          <Education education={sections.education} />
        </div>

        <div className="right">
          <Experience experience={sections.experience} />
          {/* Local projects removed to avoid duplication with GitHub projects */}
          <div className="card">
            <h3 className="section-title">Selected GitHub Projects</h3>
            <GithubProjects username="ymcbzrgn" limit={4} preferred={[
              'CannyEdgeDetection',
              'cardFortune',
              'emsc_earthquake_map',
              'imdb-clone'
            ]} />
          </div>
          <CertificatesReferences certificates={sections.certificates} />
          <Contact contact={contact} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
