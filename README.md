# 🚋 Kolkata Alive | Immersive Cultural Preservation Platform

> "Experience Kolkata Beyond Maps."
> A premium, cinematic, "Netflix meets editorial museum" preservation layer for the streets, tramways, historical landmarks, literature, and living community memories of Kolkata.

---

## 🎨 Creative Theme & Aesthetic Design
Kolkata Alive was designed from the ground up to feel emotionally connected to Bengali heritage, moving away from generic dashboards:
*   **Warm Cream Paper Backgrounds** (`#FAF7F2`) reminiscent of vintage books and historical manuscripts.
*   **Ink-Black Charcoal Typography** (`#141312`) to emulate classic printing processes.
*   **Faded Postbox Red Accents** (`#B93C2A`) and **Tram Green Details** (`#1B4332`) representing standard city markers.
*   **Victorian Gold Frames & Postcard Stamp Details** to bring a premium, high-end editorial atmosphere.
*   **Animated Grain & Sitar Soundscape Overlays** which can be toggled in the corner-docked **Interactive Tram Control Tower Widget**.

---

## 🏗️ Project Architecture & Main Pages
Built on **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**:

1.  **Immersive Landing Page (`/`):** Cinematic full-bleed hero parallax sections, live "AI Storytelling Sandbox" RAG simulation block, "Boi Para bookshelf" referencing literature, and vintage testimonials.
2.  **Heritage Explorer Directory (`/explorer`):** Searchable landmark index utilizing simulated ticket-punch category selectors, instant filters, dynamic local saves, and bottom-docked speech consoles.
3.  **Location Detail Panel (`/location/[id]`):** Parallax visual plates, bilingual narrative translation toggles (Bengali ↔ English), dynamic scroll timeline logs, and crowdsourced bulletin memory nodes.
4.  **Smart Cultural Map (`/map`):** Thematic trail mapping (Food walks, Tramways, Literature, Puja pandal hops) with interactive pin selections, drawers, and path visualizations.
5.  **Community Memory Scrapbook (`/memory`):** Polaroid-style community boards, comments/likes modules, and hand-written memoir submissions decorated with celebratory confettis.
6.  **Admin Control Terminal (`/admin`):** Statistical charts, data indexes, and moderation approvals queues.
7.  **Archivist Profile & Login (`/login`):** Supabase-style login forms and profile progress ledger lists.

---

## 🛠️ Installation & Setup

1.  **Open Workspace:**
    We recommend setting the workspace directory as:
    ```bash
    C:\Users\mohit\.gemini\antigravity-ide\scratch\kolkata-alive
    ```

2.  **Install Node Modules:**
    (Already completed during bootstrap setup)
    ```bash
    npm install
    ```

3.  **Configure Environment Credentials (`.env.local`):**
    Create a `.env.local` file in the root of the project to enable live cognitive integrations:
    ```env
    # Hugging Face Access Token for live RAG storytelling (Open-source Mistral-7B model)
    HF_TOKEN=your_huggingface_access_token

    # ElevenLabs API Key for live text-to-speech voice narrations
    ELEVENLABS_API_KEY=your_elevenlabs_api_key

    # Mapbox Public Access Token for map layouts
    NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
    ```
    *Note: The platform features **robust, beautiful, and fully interactive simulated fallback engines** out-of-the-box, ensuring zero-latency operations even if credentials are not configured!*

4.  **Launch Local Dev Server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` inside your browser to start your heritage journey.

5.  **Compile Production Bundles:**
    ```bash
    npm run build
    ```

---

## 🔮 Cognitive API Integrations & Fallbacks
To maximize developer ease and preserve rate quotas, the codebase features premium fallback solutions:
*   **Hugging Face Proxy (`/api/story`):** Direct proxy to Mistral-7B creative instruction models. Falls back elegantly to pre-cached bilingual stories from local databases if the key is empty.
*   **ElevenLabs Proxy (`/api/voice`):** Streams synthesized MP3 array buffers. If the API key is not supplied, it instructs the client browser to trigger WebSpeech local synthesis, continuing voice plays seamlessly.
*   **RAG Semantic Search (`/api/rag`):** Simulates a structured Vector store, using term weighted frequencies and category bounds to generate pseudo-cosine similarity ratings (e.g. `Similarity: 98%`).
