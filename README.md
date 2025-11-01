🧠 NeuroScope.ai

Intelligence Evolved.
NeuroScope.ai builds next-generation autonomous systems that learn, adapt, and evolve — combining design, cognition, and automation into one intelligent digital framework.

⚙️ Overview

This repository powers the official NeuroScope.ai website — an adaptive, AI-generated landing experience created and maintained through Base44 and n8n automation.
Each update dynamically rebuilds the site using OpenAI-driven content, ensuring it evolves with every deployment.

🧩 System Architecture

Workflow Chain:

Trigger → OpenAI Node (Generate HTML/CSS)  
        → Base64 Encoder (Prepare GitHub Push)  
        → GitHub Node (Commit index.html)  
        → Visual Assets (Neural Mesh / Animations)  
        → Optional Notification Node (Slack / Email)


Deployment:

GitHub Pages: https://mujtabataimur.github.io/neuroscope.ai/

Optional Netlify Sync: Continuous redeploy after every commit

🧠 Design Language
Element	Spec
Theme	Dark minimalism / Neural gradient glow
Fonts	Sora (headlines), Inter (body)
Colors	Base #0f0f14 · Accent #2b59ff · Glow #7b3eff
Motion	Subtle neural pulse and light drift
🧠 Core Pages

Home.html — Hero landing page (“Intelligence Evolved”)

About.html — Vision, team, and philosophy

Solutions.html — AI systems overview

Pricing.html — Tiers and SumUp integration

Contact.html — Secure waitlist form

Blog.html — AI-generated articles and updates

🔒 Paywall / Subscription Model

Defined in Subscription.json

{
  "tier": "free | one_time | monthly",
  "status": "active | expired | cancelled",
  "amount_paid": 0
}


Integrated with SumUp Checkout and optional PayPal fallback.

🧠 Automation Summary

AI Writer: Regenerates copy and SEO metadata automatically.

n8n Workflow: Pushes new site builds to GitHub on trigger.

Base44 Firewall: Restricts premium content until verified payment.

🚀 Setup

Fork or clone this repo.

Enable GitHub Pages → Settings → Pages → Source: main branch.

Connect to Base44/n8n using your credentials:

OPENAI_API_KEY

GITHUB_TOKEN

(Optional) SUMUP_API_KEY

Run workflow → site regenerates and deploys automatically.

📡 Future Roadmap

Integrate real-time AI dashboard.

Add interactive neural animation layer.

Implement API-based subscription sync (Base44 ↔ SumUp).

🧾 License

© 2025 NeuroScope.ai — All Rights Reserved.
Unauthorized reproduction or redistribution is prohibited.
