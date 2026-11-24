---
title: "Gemini API file‑slicing: pay only for the pages the model reads"
description: "Google DeepMind added file‑slicing controls to the Gemini API so apps can point the model at specific pages, sheet ranges, or media clips and pay only for the parts the model actually reads."
date: 2026-11-24T14:04:07.508Z
image: /images/gemini-api-fileslicing-pay-only-for-the-pages-the-model-reads-1124.jpg
imageAlt: "Gemini API file‑slicing: pay only for the pages the model reads"
source: "MLQ.ai Newsroom"
sourceUrl: "https://mlq.ai/news/google-adds-file-slicing-to-the-gemini-api-so-developers-pay-only-for-the-pages-and-clips-the-model-reads/"
---

**TL;DR:** Google DeepMind added file‑slicing controls to the Gemini API so apps can point the model at specific pages, sheet ranges, or media clips and pay only for the parts the model actually reads.

**Why it matters:** This cuts LLM bill shock for anyone building document search, summarization, or media analysis features. Freelancers and small teams can target only the relevant pages instead of sending whole files. That lowers per‑request cost and makes AI features feasible for tighter budgets.

**What to do:**
- Try file slicing on a sample upload to compare cost and latency against full‑file calls.
- Update your ingestion flow to send only needed pages/ranges and add checks that fall back to broader reads if necessary.
- Optional: add a pricing estimate in your app or client dashboard to show saved tokens to customers.

Source: [MLQ.ai Newsroom](https://mlq.ai/news/google-adds-file-slicing-to-the-gemini-api-so-developers-pay-only-for-the-pages-and-clips-the-model-reads/)
