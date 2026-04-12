// mandel-perturb-compute.js
// Perturbation theory Mandelbrot worker.
// Reference orbit (Phase A) computed using Decimal.js — arbitrary precision.
// Per-pixel iterations (Phase B) use standard doubles on small deltas — fast, always accurate.

importScripts('decimal.min.js');

// ── worker message handler ────────────────────────────────────────────────────
self.onmessage = function(e) {
    var screenX     = e.data.screenX;
    var screenY     = e.data.screenY;
    var zoom        = e.data.zoom;
    var iter_max    = e.data.iterations;
    var smooth      = e.data.smooth;
    var startLine   = e.data.startLine;
    var workerID    = e.data.workerID;
    var blockSize   = e.data.blockSize;
    var canvasWidth = e.data.canvasWidth;
    var segHeight   = e.data.segmentHeight;
    var cx_ref      = e.data.cx_center;   // math coord of screen centre (double, for fallback)
    var cy_ref      = e.data.cy_center;
    var lblockSize  = blockSize == 1 ? 1 : blockSize / 2;

    var mandelData   = new Uint8Array(e.data.mandelBuffer);
    var smoothMandel = new Uint8Array(e.data.smoothMandel);

    var escSq    = smooth == 1 ? 256.0 : 4.0;
    var firstIter = smooth == 1 ? -3 : -1;
    var log2val  = 1.0; // Math.log2(2) == 1

    // cxhi/cyhi (doubles) are still used in Phase B for the inside-check bounding box
    var cxhi = (e.data.cxhi !== undefined) ? e.data.cxhi : cx_ref;
    var cxlo = (e.data.cxlo !== undefined) ? e.data.cxlo : 0.0;
    var cyhi = (e.data.cyhi !== undefined) ? e.data.cyhi : cy_ref;
    var cylo = (e.data.cylo !== undefined) ? e.data.cylo : 0.0;

    // ── Phase A: reference orbit using Decimal.js arithmetic ─────────────────
    // One orbit at the screen centre — computed once per frame.
    // Decimal gives arbitrary precision; only this phase is slow.
    // Phase B (per-pixel deltas) is standard doubles — completely unchanged.
    var needed_prec = Math.max(40, Math.ceil(Math.log10(zoom)) + 10);
    Decimal.set({ precision: needed_prec, rounding: 4 });

    // Use high-precision decimal string from main thread; fall back to double if absent
    var cx_dec_str = (e.data.cx_dec_str !== undefined) ? e.data.cx_dec_str : String(cxhi);
    var cy_dec_str = (e.data.cy_dec_str !== undefined) ? e.data.cy_dec_str : String(cyhi);
    var cx_D = new Decimal(cx_dec_str);
    var cy_D = new Decimal(cy_dec_str);
    var Zr_D = new Decimal(0);
    var Zi_D = new Decimal(0);
    var TWO  = new Decimal(2);

    // Array sized iter_max+2 so refZr[n+1] is always safe to read inside Phase B loop
    var refZr = new Float64Array(iter_max + 2);
    var refZi = new Float64Array(iter_max + 2);
    var refLen = 0;

    for (var n = 0; n < iter_max; n++) {
        refZr[n] = Zr_D.toNumber();
        refZi[n] = Zi_D.toNumber();
        refLen = n + 1;

        if (Zr_D.times(Zr_D).plus(Zi_D.times(Zi_D)).gt(escSq)) break;

        // Z_{n+1} = Z_n^2 + c  in Decimal arithmetic
        var newZr_D = Zr_D.times(Zr_D).minus(Zi_D.times(Zi_D)).plus(cx_D);
        var newZi_D = Zr_D.times(Zi_D).times(TWO).plus(cy_D);
        Zr_D = newZr_D;
        Zi_D = newZi_D;
    }

    // Reference pixel position (where delta = 0).
    // cx_hi/cy_hi are by definition the math coords of the screen centre, so the reference
    // pixel is always canvasWidth/2, canvasHeight/2.  Computing it via screenX + cxhi*zoom
    // causes catastrophic float64 cancellation at zoom > ~1e16 — avoid it.
    // segHeight * 2 == total canvas height / 2 for both full-res and coarse passes (4 workers).
    var px_ref = canvasWidth / 2;
    var py_ref = segHeight * 2;

    // ── Phase B: per-pixel perturbation ──────────────────────────────────────
    // For each pixel, delta from reference is:
    //   dcx = (x - px_ref) / zoom    — small number, accurate in double
    //   dcy = (y + startLine - py_ref) / zoom
    //
    // Perturbation formula:
    //   ε_{n+1} = (2·Z_n + ε_n)·ε_n + δc
    // Full point: z_{n+1} = Z_{n+1} + ε_{n+1}
    //
    // Escape: |z_{n+1}|^2 >= escSq

    var lineCounter = 0;

    for (var y = 0; y < segHeight; y += lblockSize) {
        var dcy = (y + startLine - py_ref) / zoom;

        for (var x = 0; x < canvasWidth; x += lblockSize) {
            var dcx = (x - px_ref) / zoom;

            // Quick inside-check: rough bounding box of main cardioid/bulb
            var ax = cxhi + dcx, ay = cyhi + dcy;
            if (ax > -0.5 && ax < 0.25 && ay > -0.5 && ay < 0.5) {
                mandelData[x + y * canvasWidth] = 255;
                continue;
            }

            var er = 0.0, ei = 0.0;
            var iter = firstIter;
            var escaped = false;
            var zr_esc = 0.0, zi_esc = 0.0;

            // Iterate up to refLen-1 steps (so we can safely read refZr[n+1])
            for (var n = 0; n < refLen - 1; n++) {
                var Zr_n = refZr[n], Zi_n = refZi[n];

                // ε_{n+1} = (2·Z_n + ε_n)·ε_n + δc
                var a = 2.0*Zr_n + er;
                var b = 2.0*Zi_n + ei;
                var new_er = a*er - b*ei + dcx;
                var new_ei = a*ei + b*er + dcy;
                er = new_er;
                ei = new_ei;
                iter++;

                if (iter >= iter_max) break;

                // z_{n+1} = Z_{n+1} + ε_{n+1}
                zr_esc = refZr[n + 1] + er;
                zi_esc = refZi[n + 1] + ei;

                if (zr_esc*zr_esc + zi_esc*zi_esc >= escSq) {
                    escaped = true;
                    break;
                }
            }

            if (smooth == 1 && escaped) {
                var mag = Math.sqrt(zr_esc*zr_esc + zi_esc*zi_esc);
                var smoothOffset = (Math.log2(Math.log2(mag) / log2val) - 2.0) * 255.0;
                smoothMandel[x + y * canvasWidth] = Math.floor(smoothOffset);
            }

            var out;
            if (iter >= iter_max || !escaped)
                out = 255;
            else
                out = iter % 255;

            mandelData[x + y * canvasWidth] = out;
        }

        lineCounter++;
        if (blockSize == 1 && lineCounter == 20) {
            self.postMessage({lineCount: y, workerID: workerID});
            lineCounter = 0;
        }
    }

    self.postMessage({
        finished: 1,
        mandel: mandelData.buffer,
        workerID: workerID,
        smooth: smooth,
        smoothMandel: smoothMandel.buffer
    }, [mandelData.buffer], [smoothMandel.buffer]);
};
