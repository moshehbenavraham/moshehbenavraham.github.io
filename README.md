# moshehbenavraham.github.io

Max aka Mosheh's Sandbox - A collection of projects, experiments, and creative explorations.

**Live Site:** [https://moshehbenavraham.github.io](https://moshehbenavraham.github.io)

## Structure

```
/
├── projects/           # Main projects with their own folders
│   ├── harmonic-dissolution/
│   └── kanban-board/
├── demos/             # Quick one-off experiments
│   ├── liminal-geometry/
│   └── cosmic-vista/
└── assets/            # Shared CSS/JS/images
```

## Projects

### [Harmonic Dissolution](https://moshehbenavraham.github.io/projects/harmonic-dissolution/)
An interactive visualization exploring harmonic dissolution patterns.

### [Kanban Board](https://moshehbenavraham.github.io/projects/kanban-board/dist/)
A production-quality project management tool built with React, TypeScript, and Vite.

**Features:**
- Drag-and-drop task management
- Priority badges and status tracking
- Dark mode support
- localStorage persistence
- Modern UI with shadcn/ui components

**Building the Kanban Board:**
```bash
cd projects/kanban-board
pnpm install
pnpm build
```

**Important:** The built files are in `dist/` and are committed to the repository for GitHub Pages deployment. The Vite config uses `base: '/projects/kanban-board/dist/'` to ensure correct asset paths.

## Demos & Experiments

### [Liminal Geometry](https://moshehbenavraham.github.io/demos/liminal-geometry/)
Visual art exploring threshold states through geometric precision and mathematical convergence.

### [Cosmic Vista](https://moshehbenavraham.github.io/demos/cosmic-vista/)
Photorealistic volumetric rendering of cosmic phenomena with nebula fields and atmospheric light scattering.

## Tech Stack

- **Kanban Board:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI
- **Harmonic Dissolution:** HTML5 Canvas, JavaScript
- **Visual Demos:** HTML5, CSS3, JavaScript

## Development Notes

### GitHub Pages Configuration
- Built files for React projects are committed to support GitHub Pages deployment
- The root `.gitignore` includes an exception for `projects/kanban-board/dist/`
- Vite projects require proper `base` configuration for correct asset paths

### Links
- **Website:** [AIwithApex.com](https://AIwithApex.com)
- **GitHub:** [moshehbenavraham](https://github.com/moshehbenavraham) | [LuminariMUD](https://github.com/LuminariMUD)
- **Community:** [AI with Apex (Skool)](https://www.skool.com/ai-with-apex/about)
