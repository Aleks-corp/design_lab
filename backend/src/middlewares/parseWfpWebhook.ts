import express, { NextFunction, Request, Response } from "express";

const rawTextParser = express.text({ type: () => true, limit: "1mb" });

/**
 * WayForPay callbacks are not reliable about Content-Type: sometimes it's
 * application/json, sometimes application/x-www-form-urlencoded with the
 * whole JSON payload as a single (unescaped) form key. The global
 * express.json()/express.urlencoded() only parse the two exact content
 * types, so anything else leaves req.body empty and the route 400s with
 * "Missing orderReference" — which WayForPay logs as a refused callback.
 *
 * If a global parser already produced a usable body, keep it. Otherwise
 * read the still-unconsumed raw body ourselves and recover the JSON from
 * either shape.
 */
const parseWfpWebhook = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.body &&
    typeof req.body === "object" &&
    Object.keys(req.body).length > 0
  ) {
    return next();
  }

  rawTextParser(req, res, (err) => {
    if (err) return next(err);

    const raw = typeof req.body === "string" ? req.body.trim() : "";
    if (!raw) {
      req.body = {};
      return next();
    }

    try {
      req.body = JSON.parse(raw);
    } catch {
      // application/x-www-form-urlencoded with the JSON string as the key
      // (WFP's "whole payload as one form field" quirk), e.g. `{"a":"b"}=`
      const key = raw.split("=")[0] || "";
      try {
        req.body = JSON.parse(decodeURIComponent(key));
      } catch {
        req.body = {};
      }
    }
    next();
  });
};

export default parseWfpWebhook;
