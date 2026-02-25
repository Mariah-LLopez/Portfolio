# Mariah Lopez | Portfolio

A complete static portfolio website for Mariah Lopez, Web UX/UI Strategist & UX Architecture Lead. Built with plain HTML, CSS, and JavaScript

---

## 💻 Local Development

The site uses `fetch()` to load `data/projects.json`, which requires a local HTTP server (browsers block `fetch()` on `file://` URLs).

**Option 1 — Python (no install required):**
```bash
cd /path/to/portfolio
python3 -m http.server 8080
# Open http://localhost:8080
```

**Option 2 — VS Code Live Server:**
Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right-click `index.html`, and choose **Open with Live Server**.

**Option 3 — Node.js:**
```bash
npx serve .
```

---

## ✏️ Updating Content

### Edit projects
All project data lives in one place:

```
data/projects.json
```

Open the file and edit any field. Changes are reflected immediately on Projects, Case Study, and the homepage Featured Work section.

### Add a new project
Copy the template below and append it to the array in `data/projects.json`:

```json
{
  "title": "Your Project Title",
  "slug": "your-project-title",
  "strategicSummary": "One-sentence summary for project cards.",
  "role": "Your Role",
  "responsibilities": ["Responsibility one", "Responsibility two"],
  "tags": ["UX Strategy", "Information Architecture"],
  "tools": ["Figma", "Miro"],
  "heroImage": "assets/placeholder.svg",
  "galleryImages": [
    {"src": "assets/placeholder.svg", "alt": "Description of image"}
  ],
  "externalLinks": [{"label": "View Project", "url": "#"}],
  "videoEmbed": "",
  "overview": "Overview paragraph...",
  "problemAndGoals": "Problem and goals paragraph...",
  "myRole": "My role paragraph...",
  "discoveryAndConstraints": "Discovery paragraph...",
  "informationArchitecture": "IA paragraph...",
  "userFlows": "User flows paragraph...",
  "wireframesAndPrototypes": "Wireframes paragraph...",
  "requirementsAndCriteria": "Requirements paragraph...",
  "qaAndIteration": "QA paragraph...",
  "outcomesAndNextSteps": "Outcomes paragraph..."
}
```

The `slug` must be unique and URL-safe (lowercase, hyphens only). Links to the case study use the format: `case-study.html?slug=your-project-title`.

### Update resume PDF
Replace the file at:
```
assets/resume.pdf
```
The Download Resume buttons throughout the site link to this path automatically.

### Embed a video in a case study
In `data/projects.json`, set the `videoEmbed` field to a YouTube or Vimeo URL:

```json
"videoEmbed": "https://www.youtube.com/watch?v=XXXXXXXXXXX"
```

The JavaScript will automatically convert it to an embedded player. Supported formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://vimeo.com/VIDEO_ID`

Leave the field as an empty string `""` to omit the video section.

---

## 📁 File Structure

```
Portfolio/
├── index.html              # Homepage (hero, strategy highlights, featured projects)
├── about.html              # About page
├── resume.html             # Resume with skills, experience, education
├── projects.html           # All projects with tag filtering
├── case-study.html         # Dynamic case study template (reads ?slug= param)
├── contact.html            # Contact form + social links
├── css/
│   └── styles.css          # All styles (custom properties, responsive, print)
├── js/
│   └── main.js             # All JavaScript (nav, project loader, case study, form)
├── data/
│   └── projects.json       # All project data — edit this to update content
├── assets/
│   ├── placeholder.svg     # Default project image
│   └── resume.pdf          # (Add your resume PDF here)
├── .gitignore
└── README.md
```

---

## ♿ Accessibility

- WCAG 2.1 AA target throughout
- Skip-to-main-content link on every page
- Visible focus indicators on all interactive elements
- Semantic HTML landmarks (`header`, `main`, `nav`, `footer`, `section`, `article`)
- `aria-label`, `aria-current`, `aria-expanded`, `aria-live`, `aria-required` used throughout
- All images have descriptive `alt` text
- Color contrast meets AA minimums
- Form validation errors announced via `role="alert"`
