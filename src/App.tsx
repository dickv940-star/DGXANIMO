import { useRef, useState } from "react";
import {
  Aperture, ArrowDownToLine, Check, ChevronDown, CircleHelp, CloudUpload,
  Eye, Heart, ImagePlus, Layers3, LockKeyhole, RotateCcw, SlidersHorizontal,
  Sparkles, Sun, WandSparkles
} from "lucide-react";
import {
  adjustmentFilter, createImageDocument, DEFAULT_ADJUSTMENTS,
  type Adjustments, type ImageDocument
} from "./engine/document";

const presets = [
  { name: "Pure White", color: "#f3f3f0", detail: "Clean marketplace" },
  { name: "Warm Beige", color: "#d9c6aa", detail: "Soft warm studio" },
  { name: "Soft Grey", color: "#b9bdc2", detail: "Neutral premium" },
  { name: "Pastel", color: "#e7dce3", detail: "Gentle color tone" },
  { name: "Deep Charcoal", color: "#343536", detail: "Dark premium" }
];

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [doc, setDoc] = useState<ImageDocument | null>(null);
  const [adjustments, setAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS);
  const [preset, setPreset] = useState(presets[0]);
  const [showOriginal, setShowOriginal] = useState(false);
  const [activeTab, setActiveTab] = useState<"adjust" | "studio" | "favorites">("adjust");
  const [favorite, setFavorite] = useState<string[]>([]);

  function openFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const next = createImageDocument(file, url, image.naturalWidth, image.naturalHeight);
      setDoc(next);
      setAdjustments(DEFAULT_ADJUSTMENTS);
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  function reset() {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setPreset(presets[0]);
  }

  function update(key: keyof Adjustments, value: number) {
    setAdjustments(current => ({ ...current, [key]: value }));
  }

  function exportImage() {
    if (!doc) return;
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = doc.originalWidth;
      canvas.height = doc.originalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.filter = adjustmentFilter(adjustments);
      ctx.drawImage(image, 0, 0);
      ctx.filter = "none";
      canvas.toBlob(blob => {
        if (!blob) return;
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `dgxanimo-${doc.name.replace(/\.[^.]+$/, "")}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    image.src = doc.originalUrl;
  }

  const filter = showOriginal ? "none" : adjustmentFilter(adjustments);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="DGXANIMO home">
          <span className="brand-mark"><Aperture size={20}/></span>
          <span>DGXANIMO<span className="brand-sub">PRODUCT PHOTO STUDIO</span></span>
        </a>
        <div className="top-status"><span className="status-dot"/> Local workspace <span className="status-divider"/> <LockKeyhole size={13}/> Original protected</div>
        <div className="top-actions">
          <button className="icon-button" title="Help"><CircleHelp size={17}/></button>
          <button className="button button-primary" onClick={() => inputRef.current?.click()}><ImagePlus size={16}/> New photo</button>
          <input ref={inputRef} hidden type="file" accept="image/*" onChange={e => openFile(e.target.files?.[0])}/>
        </div>
      </header>

      <div className="workspace">
        <aside className="left-rail">
          <div className="rail-group">
            <button className="rail-button active" title="Editor"><SlidersHorizontal size={19}/><span>Editor</span></button>
            <button className="rail-button" title="Studio"><Layers3 size={19}/><span>Studio</span></button>
            <button className="rail-button" title="Favorites" onClick={() => setActiveTab("favorites")}><Heart size={19}/><span>Favorites</span></button>
          </div>
          <div className="rail-bottom"><span className="avatar">A</span><span>Workspace</span></div>
        </aside>

        <section className="editor-area">
          <div className="editor-heading">
            <div><div className="eyebrow">CREATIVE WORKSPACE / PRODUCT RETOUCH</div><h1>Product editor</h1><p>Refine the photograph. Preserve the product.</p></div>
            <div className="heading-actions">
              {doc && <button className="button button-quiet" onClick={reset}><RotateCcw size={15}/> Reset</button>}
              <button className="button button-primary" disabled={!doc} onClick={exportImage}><ArrowDownToLine size={16}/> Export</button>
            </div>
          </div>

          <div className="canvas-wrap">
            {!doc ? (
              <button className="upload-empty" onClick={() => inputRef.current?.click()}>
                <span className="upload-icon"><CloudUpload size={27}/></span>
                <strong>Drop in your product photo</strong>
                <span>or browse files from your device</span>
                <small>JPG · PNG · WEBP · Original file remains untouched</small>
              </button>
            ) : (
              <div className="photo-stage">
                <div className="stage-label"><span>LIVE PREVIEW</span><span>{doc.originalWidth} × {doc.originalHeight}px</span></div>
                <div className="photo-mat" style={{ background: preset.color }}>
                  <img src={doc.originalUrl} alt="Product preview" style={{ filter, maxWidth: "82%", maxHeight: "82%", objectFit: "contain" }}/>
                </div>
                <div className="stage-footer">
                  <span><LockKeyhole size={13}/> Original product layer locked</span>
                  <button className={showOriginal ? "compare active" : "compare"} onMouseDown={() => setShowOriginal(true)} onMouseUp={() => setShowOriginal(false)} onMouseLeave={() => setShowOriginal(false)} onTouchStart={() => setShowOriginal(true)} onTouchEnd={() => setShowOriginal(false)}><Eye size={14}/> Hold to compare</button>
                </div>
              </div>
            )}
          </div>

          <div className="bottom-strip">
            <div><span className="strip-title">WORKFLOW</span><span className="workflow-step active">01 <b>Import</b></span><span className={doc ? "workflow-step active" : "workflow-step"}>02 <b>Enhance</b></span><span className="workflow-step">03 <b>Studio</b></span><span className="workflow-step">04 <b>Export</b></span></div>
            <span className="privacy-note"><LockKeyhole size={12}/> Processing stays on this device</span>
          </div>
        </section>

        <aside className="settings-panel">
          <div className="panel-tabs">
            <button className={activeTab === "adjust" ? "panel-tab selected" : "panel-tab"} onClick={() => setActiveTab("adjust")}><Sun size={15}/> Adjust</button>
            <button className={activeTab === "studio" ? "panel-tab selected" : "panel-tab"} onClick={() => setActiveTab("studio")}><Layers3 size={15}/> Studio</button>
            <button className={activeTab === "favorites" ? "panel-tab selected" : "panel-tab"} onClick={() => setActiveTab("favorites")}><Heart size={15}/> Saved</button>
          </div>
          {activeTab === "adjust" && <div className="panel-content">
            <div className="panel-title"><div><h2>Image adjustments</h2><p>Non-destructive controls</p></div><WandSparkles size={18}/></div>
            {doc ? <>
              {([
                ["Exposure", "exposure", -100, 100],
                ["Brightness", "brightness", 0, 200],
                ["Contrast", "contrast", 0, 200],
                ["Saturation", "saturation", 0, 200],
                ["Warmth", "warmth", 0, 100]
              ] as const).map(([label, key, min, max]) => <label className="slider-control" key={key}>
                <span>{label}<output>{adjustments[key]}</output></span>
                <input type="range" min={min} max={max} value={adjustments[key]} onChange={e => update(key, Number(e.target.value))}/>
              </label>)}
              <button className="button button-soft full-width" onClick={() => setAdjustments(DEFAULT_ADJUSTMENTS)}><RotateCcw size={14}/> Reset adjustments</button>
            </> : <div className="panel-empty">Upload a product photo to unlock image controls.</div>}
            <div className="preservation-card"><LockKeyhole size={17}/><div><strong>Product protected</strong><p>Adjustments are applied as a preview layer. Your source image stays unchanged.</p></div><Check size={15}/></div>
          </div>}
          {activeTab === "studio" && <div className="panel-content">
            <div className="panel-title"><div><h2>Studio backgrounds</h2><p>Choose a clean product setting</p></div><Layers3 size={18}/></div>
            <div className="preset-grid">{presets.map(item => <button key={item.name} className={preset.name === item.name ? "preset selected" : "preset"} onClick={() => setPreset(item)}><span style={{ background: item.color }}/><strong>{item.name}</strong><small>{item.detail}</small></button>)}</div>
            <p className="hint">Background replacement and custom image upload will be enabled in the next milestone. This milestone previews studio color only.</p>
          </div>}
          {activeTab === "favorites" && <div className="panel-content">
            <div className="panel-title"><div><h2>Visual references</h2><p>Save your preferred studio look</p></div><Heart size={18}/></div>
            <button className="button button-soft full-width" onClick={() => setFavorite(items => items.includes(preset.name) ? items : [...items, preset.name])}><Heart size={14}/> Save current studio preset</button>
            <div className="favorite-list">{favorite.length ? favorite.map(name => <button className="favorite-item" key={name} onClick={() => { const p = presets.find(item => item.name === name); if (p) setPreset(p); }}><span style={{ background: presets.find(p => p.name === name)?.color }}/>{name}<Check size={14}/></button>) : <div className="panel-empty">Your saved visual references will appear here.</div>}</div>
            <p className="hint">Full reference profiles (lighting, composition and shadow) are planned for a later milestone.</p>
          </div>}
          <div className="panel-bottom"><span><Sparkles size={13}/> DGXANIMO Studio Engine</span><button title="More options"><ChevronDown size={15}/></button></div>
        </aside>
      </div>
    </main>
  );
}