"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowDown, Bookmark, Check, ChevronRight, Footprints, Heart, Palette, RotateCcw, Shirt, Sparkles, Trash2 } from "lucide-react";
import { Outfit, ShapePreview } from "./garment";
import { CATEGORIES, CATEGORY_LABELS, PRESETS, SAMPLE_LOOK, SHAPES, STORAGE_KEY, colorName, inkFor, normalizeHex, readSavedLooks, shapeName, type Category, type Look, type SavedLook } from "@/lib/wardrobe";

function CategoryIcon({ category }: { category: Category }) {
  if (category === "top") return <Shirt size={19} strokeWidth={1.6} />;
  if (category === "shoes") return <Footprints size={19} strokeWidth={1.6} />;
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12l2 18h-7L12 9l-1 12H4L6 3Z" /><path d="M6 6h12" /></svg>;
}

function ColorEditor({ color, onChange }: { color: string; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState(color);
  const invalid = normalizeHex(draft) === null;
  function finish() {
    const normalized = normalizeHex(draft);
    if (normalized) { setDraft(normalized); onChange(normalized); }
  }
  return <>
    <div className="color-edit-row">
      <div className="color-picker-shell" style={{ backgroundColor: color }}>
        <Palette size={23} style={{ color: inkFor(color) }} aria-hidden="true" />
        <input type="color" value={color} aria-label="カラーピッカー" onChange={(event) => { setDraft(event.target.value.toUpperCase()); onChange(event.target.value.toUpperCase()); }} />
      </div>
      <div className="hex-field">
        <label htmlFor="hex-color">HEXカラー</label>
        <input id="hex-color" value={draft} type="text" spellCheck={false} autoComplete="off" maxLength={9} aria-invalid={invalid} aria-describedby={invalid ? "hex-error" : "hex-hint"}
          onChange={(event) => {
            const value = event.target.value;
            setDraft(value);
            // Only six-digit values auto-commit while typing; three digits expand on blur/Enter.
            if (/^#?[0-9a-f]{6}$/i.test(value.trim())) onChange(normalizeHex(value)!);
          }}
          onBlur={finish} onKeyDown={(event) => { if (event.key === "Enter") finish(); if (event.key === "Escape") setDraft(color); }} />
      </div>
      <div className="current-color"><span>いまの色</span><strong>{colorName(color)}</strong></div>
    </div>
    {invalid ? <p id="hex-error" className="field-error" role="status"># と3桁または6桁の英数字（0–9・A–F）で入力してね。</p> : <p id="hex-hint" className="field-hint">色見本をタップ、またはカラーコードを入力。</p>}
  </>;
}

export default function PaletteEditor() {
  const [look, setLook] = useState<Look>(SAMPLE_LOOK);
  const [category, setCategory] = useState<Category>("top");
  const [saved, setSaved] = useState<SavedLook[]>([]);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState("");
  const [editorRevision, setEditorRevision] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const current = look[category];

  useEffect(() => {
    try { setSaved(readSavedLooks(localStorage.getItem(STORAGE_KEY))); }
    catch { setStorageError("保存したコーデを読み込めませんでした。色と形の編集は使えます。"); }
    setReady(true);
  }, []);

  function setColor(color: string) {
    setLook((previous) => ({ ...previous, [category]: { ...previous[category], color } }));
    setNotice("");
  }
  function persist(next: SavedLook[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, looks: next }));
      setSaved(next); setStorageError(""); return true;
    } catch {
      setStorageError("保存できませんでした。ブラウザの保存設定や空き容量を確認してね。編集中のコーデはこの画面に残っています。");
      return false;
    }
  }
  function save() {
    const entry: SavedLook = { id: crypto.randomUUID(), name: name.trim() || `My look ${String(saved.length + 1).padStart(2, "0")}`, savedAt: new Date().toISOString(), look: structuredClone(look) };
    if (persist([entry, ...saved])) { setNotice(`「${entry.name}」を保存しました。`); setName(""); }
  }
  function load(entry: SavedLook) {
    setLook(structuredClone(entry.look)); setEditorRevision((value) => value + 1);
    setName(entry.name); setNotice(`「${entry.name}」を開きました。`);
    editorRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    document.getElementById(`tab-${category}`)?.focus({ preventScroll: true });
  }
  function selectTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % 3;
    else if (event.key === "ArrowLeft") next = (index + 2) % 3;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 2;
    else return;
    event.preventDefault(); setCategory(CATEGORIES[next]);
    document.getElementById(`tab-${CATEGORIES[next]}`)?.focus();
  }

  return <div className="app-shell">
    <a href="#editor" className="skip-link">コーデを編集する</a>
    <header className="site-header">
      <a className="brand" href="#" aria-label="MIRROR_PALETTE ホーム">
        <span className="brand-mirror" aria-hidden="true"><Sparkles size={20} strokeWidth={1.4} /></span>
        <span><span className="brand-name">MIRROR_PALETTE</span><span className="brand-tagline">Build the shape. Find the color.</span></span>
      </a>
      <a href="#saved-looks" className="saved-link"><Bookmark size={17} /><span>保存したコーデ</span><span className="count">{saved.length}</span></a>
    </header>

    <main>
      <div className="intro"><div><div className="eyebrow"><span /> YOUR LITTLE STYLING STUDIO</div><h1>好きなかたちに、<span>好きな色を。</span><Sparkles size={24} aria-hidden="true" /></h1><p>服を選んで、色を重ねて。今日の組み合わせを見つけよう。</p></div><span className="intro-note">a little color,<br /><em>a little you.</em></span></div>

      <div className="workspace" id="editor" ref={editorRef}>
        <section className="preview-card" aria-labelledby="look-heading">
          <div className="preview-heading"><div><span className="eyebrow">THE MIRROR</span><h2 id="look-heading">My styling</h2></div><button className="reset-button" onClick={() => { setLook(structuredClone(SAMPLE_LOOK)); setName(""); setEditorRevision((value) => value + 1); setNotice("サンプルコーデに戻しました。"); }}><RotateCcw size={15} />サンプルに戻す</button></div>
          <div className="mirror-stage">
            <div className="mirror-arch"><span className="mirror-label">MIRROR / 01</span><Outfit look={look} /><span className="mirror-ground" aria-hidden="true" /></div>
            <span className="stage-sparkle sparkle-one" aria-hidden="true">✧</span><span className="stage-sparkle sparkle-two" aria-hidden="true">✧</span>
            <div className="palette-note"><span className="palette-note-title">Your palette</span><div>{CATEGORIES.map((item) => <span key={item} style={{ backgroundColor: look[item].color }} />)}</div><span>3 colors, one look.</span></div>
            <span className="stage-caption">a reflection of your colors</span>
          </div>
          <div className="look-colors">{CATEGORIES.map((item) => <button className={category === item ? "look-color active" : "look-color"} key={item} onClick={() => { setCategory(item); document.getElementById(`tab-${item}`)?.focus({ preventScroll: true }); }} aria-label={`${CATEGORY_LABELS[item].ja}を編集`}><span className="mini-swatch" style={{ backgroundColor: look[item].color }} /><span><strong>{CATEGORY_LABELS[item].en}</strong><code>{look[item].color}</code></span><ChevronRight size={13} /></button>)}</div>
          <p className="preview-footnote">色とシルエットを楽しむためのイメージです。</p>
        </section>

        <section className="editor-card" aria-label="コーデの編集パネル">
          <div className="editor-title"><span className="eyebrow">MAKE IT YOURS</span><span><Palette size={16} /> かたちと色をえらぶ</span></div>
          <div className="category-tabs" role="tablist" aria-label="アイテムカテゴリ">{CATEGORIES.map((item, index) => <button key={item} id={`tab-${item}`} role="tab" aria-selected={category === item} aria-controls="item-panel" tabIndex={category === item ? 0 : -1} onClick={() => setCategory(item)} onKeyDown={(event) => selectTab(event, index)}><CategoryIcon category={item} /><span>{CATEGORY_LABELS[item].en}<small>{CATEGORY_LABELS[item].ja}</small></span></button>)}</div>
          <div id="item-panel" role="tabpanel" aria-labelledby={`tab-${category}`}>
            <div className="section-title"><h3><span className="step-number">01</span>Shape<span>シルエット</span></h3><span className="selection-name">{shapeName(category, current.shape)}</span></div>
            <div className="shape-grid" role="group" aria-label={`${CATEGORY_LABELS[category].ja}のシルエット`}>{SHAPES[category].map((shape) => <button key={shape.id} className={`shape-card ${current.shape === shape.id ? "selected" : ""}`} aria-pressed={current.shape === shape.id} onClick={() => { setLook((previous) => ({ ...previous, [category]: { ...previous[category], shape: shape.id } })); setNotice(""); }}><span className="shape-check">{current.shape === shape.id && <Check size={11} strokeWidth={2.5} />}</span><ShapePreview category={category} shape={shape.id} /><strong>{shape.name}</strong><small>{shape.detail}</small></button>)}</div>
            <div className="section-title color-section-title"><h3><span className="step-number">02</span>Color<span>カラー</span></h3><span className="color-dot" style={{ backgroundColor: current.color }} /></div>
            <ColorEditor key={`${category}-${editorRevision}`} color={current.color} onChange={setColor} />
            <div className="presets-heading"><span>Preset palette</span><span>気になる色から、ひとつ。</span></div>
            <div className="preset-grid" role="group" aria-label="プリセットカラー">{PRESETS.map((preset) => <button key={preset.name} className={`preset ${current.color === preset.color ? "selected" : ""}`} aria-label={`${preset.name} ${preset.color}`} aria-pressed={current.color === preset.color} onClick={() => { setColor(preset.color); setEditorRevision((value) => value + 1); }}><span className="preset-swatch" style={{ backgroundColor: preset.color, "--swatch-ink": inkFor(preset.color) } as CSSProperties}>{current.color === preset.color && <Check size={18} strokeWidth={2} />}</span><span>{preset.name}</span></button>)}</div>
          </div>
          <div className="save-area"><label htmlFor="look-name">コーデに名前をつける <span>任意</span></label><div className="save-row"><input id="look-name" value={name} maxLength={40} placeholder="例：春待ちのピンク" onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && ready && !event.nativeEvent.isComposing) save(); }} /><button className="save-button" disabled={!ready} onClick={save}><Bookmark size={18} />コーデを保存</button></div><p><Heart size={12} /> このブラウザに保存されます</p></div>
        </section>
      </div>

      <div className="feedback" aria-live="polite" aria-atomic="true">{storageError ? <p className="storage-error">{storageError}</p> : notice && <p><Check size={16} />{notice}</p>}</div>

      <section className="saved-section" id="saved-looks" aria-labelledby="saved-heading"><div className="saved-heading"><div><span className="eyebrow">A COLLECTION OF YOU</span><h2 id="saved-heading">Saved looks<span>保存したコーデ</span></h2></div><span className="saved-total">{saved.length} LOOKS</span></div>
        {!ready ? <div className="saved-empty"><p>保存したコーデを読み込み中…</p></div> : saved.length === 0 ? <div className="saved-empty"><span className="empty-icon"><Bookmark size={23} strokeWidth={1.3} /></span><div><strong>お気に入りの組み合わせを、ここに。</strong><p>コーデを保存すると、いつでも呼び出して色を試せます。</p></div><ArrowDown size={19} aria-hidden="true" /></div> : <div className="saved-grid">{saved.map((entry) => <article className="saved-card" key={entry.id}>
          <button className="load-look" onClick={() => load(entry)} aria-label={`${entry.name}を開く`}><div className="saved-preview"><Outfit look={entry.look} small label={`${entry.name}のコーデ`} /><span className="open-look">開く <ChevronRight size={14} /></span></div><div className="saved-info"><strong>{entry.name}</strong><div className="saved-swatches">{CATEGORIES.map((item) => <span key={item} style={{ backgroundColor: entry.look[item].color }} title={`${CATEGORY_LABELS[item].en} ${entry.look[item].color}`} />)}<span className="saved-color-count">3 colors</span></div></div></button>
          <div className="delete-area">{deleteId === entry.id ? <><span>削除する？</span><button onClick={() => { if (persist(saved.filter((item) => item.id !== entry.id))) { setDeleteId(null); setNotice(`「${entry.name}」を削除しました。`); } }}>削除</button><button onClick={() => setDeleteId(null)}>戻る</button></> : <button className="delete-button" aria-label={`${entry.name}を削除`} onClick={() => setDeleteId(entry.id)}><Trash2 size={14} /><span>削除</span></button>}</div>
        </article>)}</div>}
      </section>
      <footer><span>MIRROR_PALETTE</span><p>いつもの服に、新しい「好き」を。</p><Sparkles size={16} aria-hidden="true" /></footer>
    </main>
  </div>;
}
