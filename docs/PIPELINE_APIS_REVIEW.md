# Pipeline APIs Review

Review of each API/tool in the context of the existing **3D Product Conversion** plan (UI-only phase) and what we can do with them.

---

## Current plan (summary)

- **Scope**: UI-only. Upload 3–6 JPG/PNG → job status → 3D viewer (GLB) → export (GLB/USDZ) and embed.
- **Backend**: Skeleton only — `submitUpload`, `requestExport`, `getJob`, `getViewerModel` with mock/empty implementation. No API routes, no real pipeline.

When we add a real backend, the logical pipeline is:

```
Upload → Input/QC → Background removal → 3D reconstruction → Mesh processing → Render/Texture → Export (GLB/USDZ) → Viewer
```

---

## 1. Input processing & quality control — **OpenCV** (opencv/opencv)

| Aspect | Details |
|--------|---------|
| **Role in pipeline** | First step after upload: validate images, check resolution/lighting, maybe resize/normalize. |
| **What it is** | C++/Python library for image processing, feature detection, calibration. Industry standard. |
| **Fit with plan** | Plan assumes “3–6 JPG/PNG” and job status with optional “quality warnings”. OpenCV fits that: we can run checks and surface warnings (e.g. “Low resolution”, “Too dark”) or reject before sending to rembg. |
| **What we can do** | (1) **Python service** (recommended): small FastAPI/Flask app that receives images, runs OpenCV checks (resolution, blur, exposure), returns pass/fail + warnings. (2) **Same process as rembg**: if the rest of the pipeline is in Python, OpenCV is just `import cv2` in that service. No separate API needed unless you want a dedicated “validation” microservice. |
| **Integration** | Run as Docker container or part of a single “pipeline worker” that does QC → rembg → … . Next.js calls your backend (e.g. Server Action → API route → worker or queue), not OpenCV directly. |

---

## 2. Background removal — **rembg** (danielgatis/rembg)

| Aspect | Details |
|--------|---------|
| **Role in pipeline** | After (or with) QC: remove background from each photo so 3D reconstruction sees only the product. |
| **What it is** | Python lib + CLI + **HTTP server**. Models: u2net, isnet-general-use, bria-rmbg, etc. CPU/GPU, Docker available. |
| **Fit with plan** | Directly supports “clean product photos” before reconstruction. Plan doesn’t mention rembg by name but the flow (upload → process → 3D) implies a step like this. |
| **What we can do** | (1) **HTTP server**: `rembg s --port 7000`; Next.js backend (or worker) sends images to `POST /api/remove`, gets PNGs with transparent background. (2) **Python library**: same process calls `rembg.remove()` in a pipeline script. (3) **Docker**: `docker run danielgatis/rembg i input.png output.png` for batch. Easiest integration: run rembg as a service, call it from the job processor. |
| **Integration** | After `submitUpload`, job processor (separate service or serverless) (a) stores images, (b) calls rembg per image, (c) passes result paths to openMVG. |

---

## 3. 3D reconstruction — **openMVG** (openMVG/openMVG)

| Aspect | Details |
|--------|---------|
| **Role in pipeline** | Structure-from-Motion (SfM): from multiple images + camera poses → sparse 3D structure, then export for dense reconstruction (e.g. openMVS). |
| **What it is** | C++ library and binaries: feature detection, matching, SfM, triangulation. Outputs sparse point cloud and camera poses. Not a full “photos → mesh” solution by itself; typically used with openMVS (or similar) for dense mesh. |
| **Fit with plan** | Plan’s “processing” step is where reconstruction happens. openMVG is the standard open-source choice for the SfM part. |
| **What we can do** | (1) **Run openMVG in a worker**: Docker or VM with openMVG (and usually openMVS) installed; pipeline script runs `openMVG_*` binaries, then passes result to dense reconstruction. (2) **No REST API**: it’s CLI/binaries; your backend orchestrates by calling the pipeline script (e.g. Python subprocess or shell). |
| **Integration** | Input: list of image paths (rembg output). Output: sparse reconstruction + camera data for openMVS (or other dense step). Job status “processing” can map to “Running openMVG…” and “Running dense reconstruction…”. |

---

## 4. Mesh processing — **Open3D** (isl-org/Open3D)

| Aspect | Details |
|--------|---------|
| **Role in pipeline** | After dense reconstruction (e.g. openMVS): clean mesh, simplify, fix normals, fill holes, scale/center. Prepares mesh for texturing and export. |
| **What it is** | C++/Python library: point clouds, meshes, registration, filtering, PBR. Python `pip install open3d`; good for scripting a “mesh cleanup” step. |
| **Fit with plan** | Plan’s “processing” and “output GLB” imply a clean, web-ready mesh. Open3D fits between “raw dense mesh” and “final textured GLB”. |
| **What we can do** | (1) **Python in same worker**: read mesh (e.g. from openMVS), run Open3D (decimate, remove degenerate triangles, recompute normals), write mesh for next step. (2) **Optional**: export to GLB from Open3D or hand off to RapidPipeline for optimization/export. |
| **Integration** | Pipeline: openMVG → openMVS (dense mesh) → **Open3D** (cleanup) → [RapidPipeline or direct export] → GLB. |

---

## 5. Rendering & texturing — **RapidPipeline** (DGG3D/rapidpipeline-api-sample)

| Aspect | Details |
|--------|---------|
| **Role in pipeline** | Optional “cloud” step: take a 3D asset (e.g. mesh/GLB), optimize, re-export, optionally bake/convert materials (e.g. DCC to PBR). |
| **What it is** | **REST API** (SaaS). Sample repo is Python: upload base asset → run preset (optimize/export) → download result. Features: mesh optimization, texture re-encoding, format conversion (e.g. to GLB/USDZ), QC, webhooks. Not photo→3D; it’s 3D→optimized 3D. |
| **Fit with plan** | Plan has “Export & Distribution” and “Download GLB/USDZ”. RapidPipeline can be the step that produces the final GLB/USDZ (and optionally runs QA). Fits as an alternative or complement to doing everything in-house with Open3D + manual export. |
| **What we can do** | (1) **Use RapidPipeline as export stage**: after Open3D (or openMVS) we have a mesh; upload it to RapidPipeline with a preset, get back optimized GLB (and optionally USDZ). (2) **Webhooks**: avoid polling; RapidPipeline notifies our backend when processing is done. (3) **Cost**: requires Team/Studio/Enterprise plan and API token. |
| **Integration** | `requestExport` (or the job processor) can call RapidPipeline API to generate GLB/USDZ from the job’s base asset, then return download URLs. Or the main pipeline always pushes to RapidPipeline and stores the returned asset URLs in the job record. |

---

## 6. Export & distribution — **modelviewer.dev** (@google/model-viewer)

| Aspect | Details |
|--------|---------|
| **Role in pipeline** | Frontend only: display GLB in the browser and in AR (where supported). No backend. |
| **What it is** | Web component `<model-viewer>`: load GLB/USDZ, orbit controls, AR, etc. Already in the plan and implemented in the repo. |
| **Fit with plan** | Plan explicitly mentions model-viewer for the 3D viewer page; current app uses it with a mock GLB. |
| **What we can do** | (1) Keep using it as-is. (2) When backend is real: `getViewerModel(id)` returns the job’s `outputGlbUrl` (and optionally `outputUsdzUrl` for AR); model-viewer shows that URL. No change to the component; only the data source (real URL vs mock) changes. |

---

## Pipeline flow (with your APIs)

```
[Next.js] submitUpload(images)
    → Store images, create job (pending)
    → Enqueue job (e.g. queue or serverless)

[Worker / pipeline service]
  1. Input/QC:     OpenCV (resolution, blur, exposure) → warnings or reject
  2. Bg removal:   rembg (HTTP or lib) → images with transparent bg
  3. 3D recon:     openMVG (+ openMVS or similar) → dense mesh
  4. Mesh:         Open3D cleanup → clean mesh
  5. Optional:     RapidPipeline API (upload mesh, optimize, get GLB/USDZ)
     OR:           Export GLB/USDZ in-house (e.g. Open3D + trimesh/pygltflib)
  6. Store output URLs on job; set status = completed (or failed)

[Next.js] getJob(id), getViewerModel(id), requestExport(id, format)
    → Return real job data and asset URLs
[Frontend] model-viewer shows GLB from getViewerModel(id)
```

---

## Suggested order of implementation

1. **rembg** — Easiest win: run as HTTP server or in a small Python script; call it from a single “process job” function to get cleaned images. Validates the rest of the pipeline design.
2. **OpenCV** — Add simple checks (resolution, blur) in the same Python environment; return warnings that can be shown on the job status page.
3. **openMVG + openMVS** — Run in Docker; script that takes image dir, runs SfM + dense, outputs mesh. Most complex step; consider a single “reconstruction” container.
4. **Open3D** — Add a Python step that reads the mesh from step 3, cleans it, writes intermediate result (and optionally GLB).
5. **RapidPipeline** — Optional: if you have an API key, add “upload to RapidPipeline → get GLB/USDZ” as the export path; otherwise export GLB in-house and use a separate USDZ conversion if needed.
6. **model-viewer** — No backend change; wire `getViewerModel` and job’s `outputGlbUrl` when the pipeline is real.

---

## Summary table

| Stage              | Tool           | Type        | Integration style              |
|--------------------|----------------|------------|---------------------------------|
| Input/QC           | OpenCV         | Library    | Python in pipeline worker       |
| Background removal | rembg          | Lib + HTTP | Service or in-process           |
| 3D reconstruction  | openMVG        | Binaries   | Script/container in worker      |
| Mesh processing    | Open3D         | Library    | Python in pipeline worker       |
| Render/Texture     | RapidPipeline  | REST API   | Optional cloud step             |
| Export/View        | model-viewer   | Frontend   | Already in plan; use real URLs  |

No changes to the existing plan file are required; this doc is an addendum that maps your APIs to the intended pipeline and what you can do with each.
