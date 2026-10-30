import https from "https";
import http from "http";
import fs from "fs";
import { URL } from "url";

export interface SafeHttpResponse<T = any> {
  ok: boolean;
  status: number;
  json: () => Promise<T>;
  text: () => Promise<string>;
}

export function safeJsonRequest<T = any>(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    timeoutMs?: number;
  } = {}
): Promise<SafeHttpResponse<T>> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const transport = isHttps ? https : http;

    const payload = options.body
      ? typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body)
      : undefined;

    const headers: Record<string, string> = { ...(options.headers || {}) };
    if (payload && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }
    if (payload && !headers["Content-Length"]) {
      headers["Content-Length"] = String(Buffer.byteLength(payload));
    }

    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers,
      timeout: options.timeoutMs || 30000,
    };

    const req = transport.request(reqOptions, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        let jsonVal: any = null;
        try {
          jsonVal = JSON.parse(body);
        } catch {
          // non-JSON response body
        }
        resolve({
          ok: (res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300,
          status: res.statusCode ?? 500,
          json: () => Promise.resolve(jsonVal),
          text: () => Promise.resolve(body),
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`HTTP request timed out after ${options.timeoutMs || 30000}ms`));
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

export function safeDownloadFile(url: string, destPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const transport = isHttps ? https : http;

    const req = transport.get(url, (res) => {
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        return safeDownloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }

      if ((res.statusCode ?? 500) < 200 || (res.statusCode ?? 500) >= 300) {
        return reject(new Error(`Download failed with status ${res.statusCode}`));
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(fs.statSync(destPath).size);
      });
      file.on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });

    req.on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}
