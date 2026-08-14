# Renert Bright Minds Static Site

A responsive static website for Renert Bright Minds, an after-school math and writing enrichment program for students ages 5 and up.

The site presents enrollment messaging, program details, parent testimonials, results, and contact information for the Renert School campus in Calgary.

## Preview

![Inquire page long form](./Inquire%20Page%20-%20Long%20Forms.png)

## Project Structure

```text
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── scripts.js
├── assets/
│   ├── icons/
│   └── images/
└── Inquire Page - Long Forms.png
```

## Features

- Static, dependency-free HTML/CSS/JavaScript implementation
- Responsive navigation with a mobile menu toggle
- Hero section with enrollment call to action
- Program overview for Singapore Math, Russian Mathematics, Harvard Math Circle, and writing enrichment
- Parent testimonial cards with expandable review text
- Results section highlighting student impact and family reach
- Footer with social links and Renert School campus address

## Running Locally

Open `index.html` directly in a browser, or serve the project with a local static server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Notes

All visual assets are stored locally in `assets/`, with the inquiry page screenshot kept at the repository root for README preview purposes.
