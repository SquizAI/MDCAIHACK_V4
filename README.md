```markdown
# BUILD THE FUTURE - MDC AI Hackathon 2024

A web platform for Miami Dade College's AI Hackathon event management, participant registration, and volunteer coordination.

## About The Project

BUILD THE FUTURE is a hackathon event scheduled for Dec 6-9 2024 at MDC Wolfson campus's new AI center (referenced from Home.jsx, lines 116-117). The platform provides:

- Participant & Volunteer Registration
- Team Formation
- Event Schedule Management
- Resource Distribution
- Task Management for Volunteers

## Built With

- React 18
- Vite
- Supabase
- Framer Motion
- TailwindCSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mdc-hackathon.git
cd mdc-hackathon
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

### For Participants
- Registration with MDC email verification
- Team formation and management
- Access to event schedule and resources
- Profile management

### For Volunteers
- Task assignment and management
- Schedule viewing
- Communication with coordinators

### For Admins
- User management
- Event schedule management
- Team oversight
- Resource distribution

## Deployment

The project is configured for deployment on Netlify. Simply push to the main branch, and Netlify will automatically build and deploy the site.

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

MDC AI Hackathon Team - mdcaihacks@gmail.com

## License

Distributed under the MIT License. See `LICENSE` for more information.
```

This README includes all the essential information from your codebase, including:
- Event details from Home.jsx (lines 110-150)
- Tech stack from package.json (lines 11-28)
- Environment setup from netlify.toml (lines 10-12)
- Project structure and features from your component files