import fs from "node:fs";
import OpenAI from "openai";
import { Daytona } from "@daytona/sdk";
import fetchProxy from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

for (const line of fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}

const timed = async (name, task, ms = 25000) => {
  const start = Date.now();
  try {
    const detail = await Promise.race([task(), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);
    return { provider: name, ok: true, durationMs: Date.now() - start, detail };
  } catch (error) {
    return { provider: name, ok: false, durationMs: Date.now() - start, detail: error instanceof Error ? error.message : "unknown error" };
  }
};

async function daytonaCheck() {
  const client = new Daytona({ apiKey: process.env.DAYTONA_API_KEY, apiUrl: process.env.DAYTONA_API_URL, target: process.env.DAYTONA_TARGET });
  let sandbox;
  try {
    sandbox = await client.create({ language: "typescript", labels: { project: "tracefall", purpose: "credential-check" } });
    const result = await sandbox.process.codeRun("console.log(JSON.stringify({ready:true,runtime:'daytona'}))", undefined, 10);
    return `sandbox ${sandbox.id} · ${result.result.trim()}`;
  } finally {
    if (sandbox) try { await client.delete(sandbox); } catch {}
  }
}

async function oxylabsCheck() {
  const proxyUser = `customer-${process.env.OXYLABS_USERNAME}-cc-SG`;
  const gateway = process.env.OXYLABS_PROXY_URL || "http://pr.oxylabs.io:7777";
  const agent = new HttpsProxyAgent(gateway.replace("://", `://${encodeURIComponent(proxyUser)}:${encodeURIComponent(process.env.OXYLABS_PASSWORD)}@`));
  const response = await fetchProxy("https://ip.oxylabs.io/location", { agent });
  if (!response.ok) throw new Error(`proxy returned HTTP ${response.status}`);
  const body = await response.text();
  return `SG exit · HTTP ${response.status} · ${body.slice(0, 90)}`;
}

async function doublewordCheck() {
  const client = new OpenAI({ apiKey: process.env.DOUBLEWORD_API_KEY, baseURL: process.env.DOUBLEWORD_BASE_URL });
  const response = await client.embeddings.create({ model: process.env.DOUBLEWORD_EMBEDDING_MODEL, input: ["Tracefall integration check"] });
  return `${response.model} · ${response.data[0].embedding.length} dimensions`;
}

async function aiandCheck() {
  const client = new OpenAI({ apiKey: process.env.AIAND_API_KEY, baseURL: process.env.AIAND_BASE_URL });
  const response = await client.chat.completions.create({ model: process.env.AIAND_MODEL, max_tokens: 160, temperature: 0, reasoning_effort: "low", messages: [{ role: "user", content: "Reply with exactly: TRACEFALL_READY" }] });
  if (!response.choices[0]) throw new Error("completion returned no choices");
  return `${response.model} · ${response.choices[0].message.content?.slice(0, 48) || `finish=${response.choices[0].finish_reason}`}`;
}

async function nosanaCheck() {
  const response = await fetch(`${process.env.NOSANA_API_BASE_URL}/deployments/${process.env.NOSANA_DEPLOYMENT_ID}`, { headers: { Authorization: `Bearer ${process.env.NOSANA_API_KEY}` } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.json();
  return `deployment ${process.env.NOSANA_DEPLOYMENT_ID} · ${body.status || body.state || "reachable"}`;
}

const requested = process.argv[2]?.toLowerCase();
const definitions = [
  ["Daytona", daytonaCheck, 35000],
  ["Oxylabs", oxylabsCheck, 25000],
  ["Doubleword", doublewordCheck, 25000],
  ["ai&", aiandCheck, 30000],
  ["Nosana", nosanaCheck, 25000],
];
const checks = await Promise.all(definitions
  .filter(([name]) => !requested || String(name).toLowerCase() === requested)
  .map(([name, task, ms]) => timed(name, task, ms)));

console.log(JSON.stringify(checks, null, 2));
process.exitCode = checks.every((check) => check.ok) ? 0 : 1;
