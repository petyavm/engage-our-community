import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type {
  Announcement, NewsItem, BoardMember, Document, ImpactStat, GalleryImage, GalleryAlbum, DonationInfo, BoardHistory, SiteSetting
} from "@/lib/supabase";
import {
  LogOut, Megaphone, Newspaper, Users, FileText, BarChart2, Image, Heart, Trash2, Plus, Save, X, ChevronDown, ChevronUp, Home, Upload, Clock, Link as LinkIcon, FolderOpen, Copy, Check
} from "lucide-react";

type Section = "announcements" | "news" | "board" | "board_history" | "documents" | "files" | "stats" | "gallery" | "donation" | "settings";

// ── Generic helpers ──────────────────────────────────────────
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${props.className ?? ""}`} />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className={`w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${props.className ?? ""}`} />
);
const Btn = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger"; className?: string; type?: "button" | "submit"; disabled?: boolean;
}) => {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "border text-foreground hover:bg-accent",
    danger: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

// ── ANNOUNCEMENTS ────────────────────────────────────────────
const AnnouncementsTab = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", date: "", description: "", urgent: false });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("announcements").select("*").order("created_at", { ascending: false })
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editId) {
      await supabase.from("announcements").update(form).eq("id", editId);
    } else {
      await supabase.from("announcements").insert([form]);
    }
    setForm({ title: "", date: "", description: "", urgent: false });
    setEditId(null);
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Изтриване?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  const edit = (item: Announcement) => {
    setForm({ title: item.title, date: item.date, description: item.description, urgent: item.urgent });
    setEditId(item.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">{editId ? "Редактиране" : "Ново съобщение"}</h3>
        <Input placeholder="Заглавие" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Дата (напр. 5 март 2026)" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <Textarea rows={3} placeholder="Описание" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.urgent} onChange={e => setForm({ ...form, urgent: e.target.checked })}
            className="rounded" />
          Маркирай като важно
        </label>
        <div className="flex gap-2">
          <Btn onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Запазване..." : "Запази"}</Btn>
          {editId && <Btn variant="ghost" onClick={() => { setEditId(null); setForm({ title: "", date: "", description: "", urgent: false }); }}><X className="h-4 w-4" />Отказ</Btn>}
        </div>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.urgent && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Важно</span>}
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Btn variant="ghost" onClick={() => edit(item)}>Редактирай</Btn>
                <Btn variant="danger" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── NEWS ─────────────────────────────────────────────────────
const categories = ["Инициатива", "Новина", "Събитие", "Мнение", "Проект", "Ретроспекция", "Застъпничество"];

const emptyNews = { category: "Новина", title: "", excerpt: "", date: "", slug: "", image_url: "", full_text: "", published: true, created_at: "" };

const slugify = (text: string) =>
  text.toLowerCase()
    .replace(/[аа]/g, "a").replace(/[бб]/g, "b").replace(/[вв]/g, "v")
    .replace(/[гг]/g, "g").replace(/[дд]/g, "d").replace(/[ее]/g, "e")
    .replace(/[жж]/g, "zh").replace(/[зз]/g, "z").replace(/[ии]/g, "i")
    .replace(/[йй]/g, "y").replace(/[кк]/g, "k").replace(/[лл]/g, "l")
    .replace(/[мм]/g, "m").replace(/[нн]/g, "n").replace(/[оо]/g, "o")
    .replace(/[пп]/g, "p").replace(/[рр]/g, "r").replace(/[сс]/g, "s")
    .replace(/[тт]/g, "t").replace(/[уу]/g, "u").replace(/[фф]/g, "f")
    .replace(/[хх]/g, "h").replace(/[цц]/g, "ts").replace(/[чч]/g, "ch")
    .replace(/[шш]/g, "sh").replace(/[щщ]/g, "sht").replace(/[ъъ]/g, "a")
    .replace(/[юю]/g, "yu").replace(/[яя]/g, "ya")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").slice(0, 80);

const NewsTab = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState(emptyNews);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = () => supabase.from("news").select("*").order("date", { ascending: false })
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const handleTitleChange = (title: string) => {
    setForm(f => ({ ...f, title, slug: f.slug || slugify(title) }));
  };

  const save = async () => {
    setSaving(true);
    const { created_at, ...rest } = form;
    const payload = { ...rest, slug: form.slug || slugify(form.title) };
    // Also sync created_at to date so ordering by either column works
    const created_at_val = form.date ? new Date(form.date).toISOString() : new Date().toISOString();
    if (editId) {
      await supabase.from("news").update({ ...payload, created_at: created_at_val }).eq("id", editId);
    } else {
      await supabase.from("news").insert([{ ...payload, created_at: created_at_val }]);
    }
    setForm(emptyNews);
    setEditId(null);
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Изтриване?")) return;
    await supabase.from("news").delete().eq("id", id);
    load();
  };

  const edit = (item: NewsItem) => {
    setForm({
      category: item.category, title: item.title, excerpt: item.excerpt,
      date: item.date, slug: item.slug || "", image_url: item.image_url || "",
      full_text: item.full_text || "", published: item.published ?? true,
      created_at: item.created_at || ""
    });
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublish = async (item: NewsItem) => {
    await supabase.from("news").update({ published: !item.published }).eq("id", item.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold text-lg">{editId ? "✏️ Редактиране на новина" : "➕ Нова новина"}</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Категория</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Дата на публикуване</label>
            <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <p className="text-xs text-muted-foreground mt-1">Новините се наредят по тази дата — можете да въведете стара дата.</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Заглавие</label>
          <Input placeholder="Заглавие на новината" value={form.title} onChange={e => handleTitleChange(e.target.value)} />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">SEO Slug (URL) — генерира се автоматично</label>
          <Input placeholder="naprimer-zaglavia-novina" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="font-mono text-xs" />
          {form.slug && <p className="mt-1 text-xs text-muted-foreground">/актуално/<strong>{form.slug}</strong></p>}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Кратко описание (excerpt)</label>
          <Textarea rows={2} placeholder="Кратко резюме — показва се в листинга" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">URL на заглавна снимка</label>
          <Input placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-32 w-full object-cover rounded-lg" />}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Пълен текст на статията</label>
          <Textarea rows={10} placeholder="Напишете пълния текст тук. Поддържа се основно форматиране с нов ред." value={form.full_text} onChange={e => setForm({ ...form, full_text: e.target.value })} />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
          Публикувана (видима на сайта)
        </label>

        <div className="flex gap-2 pt-1">
          <Btn onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Запазване..." : "Запази"}</Btn>
          {editId && <Btn variant="ghost" onClick={() => { setEditId(null); setForm(emptyNews); }}><X className="h-4 w-4" />Отказ</Btn>}
        </div>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="h-16 w-24 rounded-lg object-cover shrink-0 hidden sm:block" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">{item.category}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {item.published ? "Публикувана" : "Скрита"}
                  </span>
                </div>
                <p className="font-semibold text-sm">{item.title}</p>
                {item.slug && <p className="text-xs text-muted-foreground font-mono mt-0.5">/актуално/{item.slug}</p>}
              </div>
              <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                <Btn variant="ghost" onClick={() => togglePublish(item)}>{item.published ? "Скрий" : "Публикувай"}</Btn>
                <Btn variant="ghost" onClick={() => edit(item)}>Редактирай</Btn>
                <Btn variant="danger" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── BOARD ────────────────────────────────────────────────────
const emptyMember = { name: "", role: "", description: "", email: "", phone: "", initials: "", image_url: "", sort_order: 0 };

const BoardTab = () => {
  const [items, setItems] = useState<BoardMember[]>([]);
  const [form, setForm] = useState(emptyMember);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("board_members").select("*").order("sort_order")
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editId) {
      await supabase.from("board_members").update(form).eq("id", editId);
    } else {
      await supabase.from("board_members").insert([form]);
    }
    setForm(emptyMember);
    setEditId(null);
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Изтриване?")) return;
    await supabase.from("board_members").delete().eq("id", id);
    load();
  };

  const edit = (item: BoardMember) => {
    setForm({ name: item.name, role: item.role, description: item.description, email: item.email, phone: item.phone, initials: item.initials, image_url: item.image_url, sort_order: item.sort_order });
    setEditId(item.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">{editId ? "Редактиране" : "Нов член"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Име" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Роля (напр. Председател)" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          <Input placeholder="Инициали (напр. МИ)" value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })} />
          <Input placeholder="Ред (за наредба)" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
          <Input placeholder="Имейл" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Телефон" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <Input placeholder="URL на снимка" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
        <Textarea rows={2} placeholder="Кратко описание" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div className="flex gap-2">
          <Btn onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Запазване..." : "Запази"}</Btn>
          {editId && <Btn variant="ghost" onClick={() => { setEditId(null); setForm(emptyMember); }}><X className="h-4 w-4" />Отказ</Btn>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-sm font-bold shrink-0">{item.initials}</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-primary">{item.role}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Btn variant="ghost" onClick={() => edit(item)}>Редактирай</Btn>
              <Btn variant="danger" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── DOCUMENTS ────────────────────────────────────────────────
const DOC_CATEGORIES = ["Основни", "Годишни финансови отчети", "Протоколи от ОС", "Протоколи от УС", "Други"];
const emptyDoc = { title: "", type: "PDF", size: "", url: "", category: "Основни", date: "" };

const sanitizeFileName = (name: string) =>
  name
    .replace(/[аА]/g, "a").replace(/[бБ]/g, "b").replace(/[вВ]/g, "v")
    .replace(/[гГ]/g, "g").replace(/[дД]/g, "d").replace(/[еЕ]/g, "e")
    .replace(/[жЖ]/g, "zh").replace(/[зЗ]/g, "z").replace(/[иИ]/g, "i")
    .replace(/[йЙ]/g, "y").replace(/[кК]/g, "k").replace(/[лЛ]/g, "l")
    .replace(/[мМ]/g, "m").replace(/[нН]/g, "n").replace(/[оО]/g, "o")
    .replace(/[пП]/g, "p").replace(/[рР]/g, "r").replace(/[сС]/g, "s")
    .replace(/[тТ]/g, "t").replace(/[уУ]/g, "u").replace(/[фФ]/g, "f")
    .replace(/[хХ]/g, "h").replace(/[цЦ]/g, "ts").replace(/[чЧ]/g, "ch")
    .replace(/[шШ]/g, "sh").replace(/[щЩ]/g, "sht").replace(/[ъЪ]/g, "a")
    .replace(/[юЮ]/g, "yu").replace(/[яЯ]/g, "ya")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-").replace(/-+/g, "-");

// Sub-component: re-link a single old-site document to Supabase
const RelinkRow = ({ doc, onRelinked }: { doc: Document; onRelinked: () => void }) => {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setMsg("Качване…");
    try {
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
      const { data, error } = await supabase.storage.from("documents").upload(fileName, file, { upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(data.path);
      const sizeKB = file.size / 1024;
      const sizeLabel = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
      await supabase.from("documents").update({ url: publicUrl, type: ext, size: sizeLabel }).eq("id", doc.id);
      setStatus("done");
      setMsg("✓ Свързан!");
      onRelinked();
    } catch (err: any) {
      setStatus("error");
      setMsg(`Грешка: ${err?.message}`);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{doc.title}</p>
        <p className="text-xs text-muted-foreground truncate">{doc.url}</p>
        {msg && <p className={`text-xs mt-0.5 ${status === "done" ? "text-green-600" : status === "error" ? "text-red-500" : "text-muted-foreground"}`}>{msg}</p>}
      </div>
      {status !== "done" && (
        <label className={`inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground cursor-pointer hover:bg-primary/90 shrink-0 ${status === "uploading" ? "opacity-50 pointer-events-none" : ""}`}>
          <Upload className="h-3.5 w-3.5" />{status === "uploading" ? "Качване…" : "Качи файл"}
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  );
};

const DocumentsTab = () => {
  const [items, setItems] = useState<Document[]>([]);
  const [form, setForm] = useState(emptyDoc);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [activeTab, setActiveTab] = useState(DOC_CATEGORIES[0]);
  const [showRelink, setShowRelink] = useState(false);

  const load = () => supabase.from("documents").select("*").order("date", { ascending: false })
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editId) {
      await supabase.from("documents").update(form).eq("id", editId);
    } else {
      await supabase.from("documents").insert([form]);
    }
    setForm(emptyDoc);
    setEditId(null);
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Изтриване?")) return;
    await supabase.from("documents").delete().eq("id", id);
    load();
  };

  const edit = (item: Document) => {
    setForm({ title: item.title, type: item.type, size: item.size, url: item.url, category: item.category || DOC_CATEGORIES[0], date: item.date || "" });
    setEditId(item.id);
    setActiveTab(item.category || DOC_CATEGORIES[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress("Качване...");
    try {
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
      const { data, error } = await supabase.storage.from("documents").upload(fileName, file, { upsert: false });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(data.path);
      const sizeKB = file.size / 1024;
      const sizeLabel = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
      setForm(f => ({ ...f, url: urlData.publicUrl, type: ext, size: sizeLabel, title: f.title || file.name.replace(/\.[^/.]+$/, "") }));
      setUploadProgress("✓ Файлът е качен успешно!");
    } catch (err: any) {
      setUploadProgress(`Грешка: ${err?.message || JSON.stringify(err)}`);
    }
    setUploading(false);
  };

  const visibleItems = items.filter(i => (i.category || DOC_CATEGORIES[0]) === activeTab);
  const oldSiteItems = items.filter(i => i.url?.includes("un.163ou.org"));

  return (
    <div className="space-y-6">
      {/* Re-link old site files */}
      <div className="rounded-xl border bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              📎 {oldSiteItems.length} файла сочат към стария сайт (un.163ou.org)
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Качете копие на всеки файл в Supabase за да не зависите от стария сайт.
            </p>
          </div>
          <button onClick={() => setShowRelink(!showRelink)}
            className="text-xs font-semibold text-amber-800 dark:text-amber-300 underline">
            {showRelink ? "Скрий" : "Покажи всички"}
          </button>
        </div>
        {showRelink && (
          <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
            {oldSiteItems.map(doc => (
              <RelinkRow key={doc.id} doc={doc} onRelinked={load} />
            ))}
          </div>
        )}
      </div>
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-lg">{editId ? "✏️ Редактиране на документ" : "➕ Нов документ"}</h3>

        {/* Category selector */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Категория</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {DOC_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Дата на документа</label>
          <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>

        {/* File upload — works for both new and edit */}
        <div className="rounded-lg border-2 border-dashed border-border p-5 text-center">
            <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-3 text-sm text-muted-foreground">{editId ? "Качете нов файл за да замените текущия" : "Качете PDF или друг документ директно"}</p>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Upload className="h-4 w-4" />
              {uploading ? "Качване..." : "Избери файл"}
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
            {uploadProgress && <p className={`mt-2 text-xs ${uploadProgress.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{uploadProgress}</p>}
          </div>

        <div className="relative flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 border-t" /><span>или въведете ръчно</span><div className="flex-1 border-t" />
        </div>

        <Input placeholder="Заглавие на документа" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Тип (PDF, DOCX...)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          <Input placeholder="Размер (напр. 2.4 MB)" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
        </div>
        <Input placeholder="URL за изтегляне" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
        <div className="flex gap-2">
          <Btn onClick={save} disabled={saving || uploading}><Save className="h-4 w-4" />{saving ? "Запазване..." : "Запази"}</Btn>
          {editId && <Btn variant="ghost" onClick={() => { setEditId(null); setForm(emptyDoc); setUploadProgress(""); }}><X className="h-4 w-4" />Отказ</Btn>}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {DOC_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${activeTab === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}>
            {cat} ({items.filter(i => (i.category || DOC_CATEGORIES[0]) === cat).length})
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {visibleItems.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Няма документи в тази категория.</p>}
        {visibleItems.map(item => (
          <div key={item.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.date && <span className="mr-2">{item.date}</span>}
                {item.type} · {item.size}
              </p>
              {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block max-w-xs">{item.url}</a>}
            </div>
            <div className="flex gap-1 shrink-0">
              <Btn variant="ghost" onClick={() => edit(item)}>Редактирай</Btn>
              <Btn variant="danger" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" /></Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── IMPACT STATS ─────────────────────────────────────────────
const StatsTab = () => {
  const [items, setItems] = useState<ImpactStat[]>([]);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("impact_stats").select("*").order("sort_order")
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const update = (id: string, field: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const save = async (item: ImpactStat) => {
    setSaving(true);
    await supabase.from("impact_stats").update({ value: item.value, label: item.label }).eq("id", item.id);
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Редактирайте стойностите директно и натиснете „Запази" за всяка.</p>
      {items.map(item => (
        <div key={item.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2 flex-1">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Стойност</label>
              <Input value={item.value} onChange={e => update(item.id, "value", e.target.value)} placeholder="напр. 350+" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Етикет</label>
              <Input value={item.label} onChange={e => update(item.id, "label", e.target.value)} placeholder="напр. Активни членове" />
            </div>
          </div>
          <Btn onClick={() => save(item)} disabled={saving} className="shrink-0"><Save className="h-4 w-4" />Запази</Btn>
        </div>
      ))}
    </div>
  );
};

// ── GALLERY (Albums + Photos) ─────────────────────────────────
const GalleryTab = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [openAlbum, setOpenAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [albumForm, setAlbumForm] = useState({ name: "", slug: "", description: "", seo_title: "", seo_description: "", sort_order: 0 });
  const [editAlbumId, setEditAlbumId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const loadAlbums = () => supabase.from("gallery_albums").select("*").order("sort_order")
    .then(({ data }) => { if (data) setAlbums(data as GalleryAlbum[]); });

  const loadPhotos = (albumId: string) => supabase.from("gallery").select("*").eq("album_id", albumId).order("sort_order")
    .then(({ data }) => { if (data) setPhotos(data); });

  useEffect(() => { loadAlbums(); }, []);
  useEffect(() => { if (openAlbum) loadPhotos(openAlbum.id); }, [openAlbum]);

  const slugify = (s: string) => s.toLowerCase().replace(/[а-яА-Я]/g, c =>
    ({ а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sht",ъ:"a",ю:"yu",я:"ya" }[c] ?? c)
  ).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const saveAlbum = async () => {
    setSaving(true);
    const data = { ...albumForm, slug: albumForm.slug || slugify(albumForm.name) };
    if (editAlbumId) {
      await supabase.from("gallery_albums").update(data).eq("id", editAlbumId);
    } else {
      await supabase.from("gallery_albums").insert([data]);
    }
    setSaving(false);
    setShowAlbumForm(false);
    setEditAlbumId(null);
    setAlbumForm({ name: "", slug: "", description: "", seo_title: "", seo_description: "", sort_order: 0 });
    loadAlbums();
  };

  const editAlbum = (a: GalleryAlbum) => {
    setAlbumForm({ name: a.name, slug: a.slug, description: a.description || "", seo_title: a.seo_title || "", seo_description: a.seo_description || "", sort_order: a.sort_order });
    setEditAlbumId(a.id);
    setShowAlbumForm(true);
  };

  const deleteAlbum = async (id: string) => {
    if (!confirm("Изтриване на албума и всички снимки в него?")) return;
    await supabase.from("gallery").delete().eq("album_id", id);
    await supabase.from("gallery_albums").delete().eq("id", id);
    loadAlbums();
  };

  const uploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!openAlbum) return;
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadMsg(`Качване на ${files.length} снимки...`);
    let done = 0;
    for (const file of files) {
      const name = `gallery/${openAlbum.id}/${Date.now()}-${sanitizeFileName(file.name)}`;
      const { data, error } = await supabase.storage.from("documents").upload(name, file, { upsert: false });
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(data.path);
        await supabase.from("gallery").insert([{ url: publicUrl, alt: file.name.replace(/\.[^/.]+$/, ""), caption: "", sort_order: done, album_id: openAlbum.id }]);
      }
      done++;
      setUploadMsg(`Качване ${done}/${files.length}...`);
    }
    setUploadMsg(`✓ ${done} снимки качени!`);
    setUploading(false);
    loadPhotos(openAlbum.id);
  };

  const updatePhoto = async (id: string, alt: string, caption: string) => {
    await supabase.from("gallery").update({ alt, caption }).eq("id", id);
    if (openAlbum) loadPhotos(openAlbum.id);
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Изтриване на снимката?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    if (openAlbum) loadPhotos(openAlbum.id);
  };

  // Photo edit inline state
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [photoAlt, setPhotoAlt] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");

  if (openAlbum) return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => { setOpenAlbum(null); setPhotos([]); }} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">← Назад към албумите</button>
        <h2 className="font-bold text-lg">{openAlbum.name}</h2>
      </div>

      {/* Upload */}
      <div className="rounded-xl border bg-card p-4">
        <label className={`inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground cursor-pointer hover:bg-primary/90 ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
          <Upload className="h-4 w-4" />{uploading ? uploadMsg : "Качи снимки"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={uploadPhotos} disabled={uploading} />
        </label>
        {uploadMsg && <p className={`mt-2 text-xs ${uploadMsg.startsWith("✓") ? "text-green-600" : "text-muted-foreground"}`}>{uploadMsg}</p>}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map(photo => (
          <div key={photo.id} className="rounded-xl border bg-card overflow-hidden">
            <img src={photo.url} alt={photo.alt} className="aspect-video w-full object-cover" />
            {editingPhoto === photo.id ? (
              <div className="p-3 space-y-2">
                <div><label className="text-xs text-muted-foreground block mb-1">Име (alt)</label>
                  <Input value={photoAlt} onChange={e => setPhotoAlt(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground block mb-1">Надпис</label>
                  <Input value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} /></div>
                <div className="flex gap-2">
                  <Btn onClick={() => { updatePhoto(photo.id, photoAlt, photoCaption); setEditingPhoto(null); }}><Save className="h-3 w-3" />Запази</Btn>
                  <Btn onClick={() => setEditingPhoto(null)} className="bg-secondary text-foreground hover:bg-secondary/80"><X className="h-3 w-3" />Отказ</Btn>
                </div>
              </div>
            ) : (
              <div className="p-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{photo.alt || "—"}</p>
                  {photo.caption && <p className="text-xs text-muted-foreground truncate">{photo.caption}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditingPhoto(photo.id); setPhotoAlt(photo.alt); setPhotoCaption(photo.caption || ""); }}
                    className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary"><Save className="h-3.5 w-3.5" /></button>
                  <button onClick={() => deletePhoto(photo.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {photos.length === 0 && <p className="col-span-3 text-sm text-muted-foreground py-8 text-center">Няма снимки в този албум. Качете снимки от бутона по-горе.</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Управлявайте фотоалбумите на сайта.</p>
        <Btn onClick={() => { setShowAlbumForm(!showAlbumForm); setEditAlbumId(null); setAlbumForm({ name: "", slug: "", description: "", seo_title: "", seo_description: "", sort_order: 0 }); }}>
          <Plus className="h-4 w-4" />Нов албум
        </Btn>
      </div>

      {showAlbumForm && (
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h3 className="font-semibold">{editAlbumId ? "Редактиране на албум" : "Нов албум"}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Име на албума *</label>
              <Input value={albumForm.name} onChange={e => setAlbumForm({ ...albumForm, name: e.target.value })} placeholder="напр. Коледен базар 2024" /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Slug (URL)</label>
              <Input value={albumForm.slug} onChange={e => setAlbumForm({ ...albumForm, slug: e.target.value })} placeholder="auto-generated" /></div>
            <div className="sm:col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Описание</label>
              <Input value={albumForm.description} onChange={e => setAlbumForm({ ...albumForm, description: e.target.value })} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">SEO заглавие</label>
              <Input value={albumForm.seo_title} onChange={e => setAlbumForm({ ...albumForm, seo_title: e.target.value })} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">SEO описание</label>
              <Input value={albumForm.seo_description} onChange={e => setAlbumForm({ ...albumForm, seo_description: e.target.value })} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Пореден №</label>
              <Input type="number" value={albumForm.sort_order} onChange={e => setAlbumForm({ ...albumForm, sort_order: +e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <Btn onClick={saveAlbum} disabled={!albumForm.name || saving}><Save className="h-4 w-4" />{saving ? "Запазване..." : "Запази"}</Btn>
            <Btn onClick={() => setShowAlbumForm(false)} className="bg-secondary text-foreground hover:bg-secondary/80"><X className="h-4 w-4" />Отказ</Btn>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map(album => (
          <div key={album.id} className="rounded-xl border bg-card overflow-hidden">
            {album.cover_url
              ? <img src={album.cover_url} alt={album.name} className="h-36 w-full object-cover" />
              : <div className="h-36 bg-accent flex items-center justify-center"><Image className="h-10 w-10 text-muted-foreground/30" /></div>}
            <div className="p-4">
              <h3 className="font-semibold">{album.name}</h3>
              {album.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{album.description}</p>}
              <div className="mt-3 flex gap-2">
                <Btn onClick={() => setOpenAlbum(album)}><Image className="h-3.5 w-3.5" />Снимки</Btn>
                <Btn onClick={() => editAlbum(album)} className="bg-secondary text-foreground hover:bg-secondary/80"><Save className="h-3.5 w-3.5" />Редактирай</Btn>
                <Btn onClick={() => deleteAlbum(album.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90"><Trash2 className="h-3.5 w-3.5" /></Btn>
              </div>
            </div>
          </div>
        ))}
        {albums.length === 0 && <p className="col-span-3 text-sm text-muted-foreground py-8 text-center">Няма създадени албуми. Създайте първия от бутона по-горе.</p>}
      </div>
    </div>
  );
};

// ── FILE MANAGER ──────────────────────────────────────────────
const FileManagerTab = () => {
  const [files, setFiles] = useState<{ name: string; url: string; size: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    setLoading(true);
    const { data } = await supabase.storage.from("documents").list("uploads", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (data) {
      const mapped = data.filter(f => f.name !== ".emptyFolderPlaceholder").map(f => {
        const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(`uploads/${f.name}`);
        const kb = f.metadata?.size ? Math.round(f.metadata.size / 1024) : 0;
        return { name: f.name, url: publicUrl, size: kb > 1024 ? `${(kb/1024).toFixed(1)} MB` : `${kb} KB` };
      });
      setFiles(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { loadFiles(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(e.target.files || []);
    if (!fileList.length) return;
    setUploading(true);
    let done = 0;
    for (const file of fileList) {
      setUploadMsg(`Качване ${done + 1}/${fileList.length}...`);
      const name = `uploads/${Date.now()}-${sanitizeFileName(file.name)}`;
      await supabase.storage.from("documents").upload(name, file, { upsert: false });
      done++;
    }
    setUploadMsg(`✓ ${done} файла качени!`);
    setUploading(false);
    loadFiles();
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteFile = async (name: string) => {
    if (!confirm("Изтриване на файла?")) return;
    await supabase.storage.from("documents").remove([`uploads/${name}`]);
    loadFiles();
  };

  const ext = (name: string) => name.split(".").pop()?.toUpperCase() || "FILE";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">Качване на файлове</h3>
        <p className="text-sm text-muted-foreground">Качете файл и копирайте линка за използване навсякъде в сайта.</p>
        <div className="flex flex-wrap items-center gap-3">
          <label className={`inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground cursor-pointer hover:bg-primary/90 ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload className="h-4 w-4" />{uploading ? uploadMsg : "Избери файлове"}
            <input type="file" multiple className="hidden" onChange={upload} disabled={uploading} />
          </label>
          {uploadMsg && !uploading && <p className="text-xs text-green-600">{uploadMsg}</p>}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{files.length} файла</p>
          {files.map(f => (
            <div key={f.name} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-xs font-bold text-primary">{ext(f.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name.replace(/^\d+-/, "")}</p>
                <p className="text-xs text-muted-foreground">{f.size}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => copy(f.url)}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors">
                  {copied === f.url ? <><Check className="h-3 w-3 text-green-600" />Копирано</> : <><Copy className="h-3 w-3" />Копирай линк</>}
                </button>
                <a href={f.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors">Преглед</a>
                <button onClick={() => deleteFile(f.name)}
                  className="rounded-lg border px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
          {files.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Няма качени файлове.</p>}
        </div>
      )}
    </div>
  );
};

// ── DONATION INFO ────────────────────────────────────────────
const DonationTab = () => {
  const [items, setItems] = useState<DonationInfo[]>([]);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("donation_info").select("*")
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const update = (id: string, field: string, value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const save = async (item: DonationInfo) => {
    setSaving(true);
    await supabase.from("donation_info").update({ label: item.label, value: item.value }).eq("id", item.id);
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Актуализирайте банковите данни директно.</p>
      {items.map(item => (
        <div key={item.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2 flex-1">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Етикет</label>
              <Input value={item.label} onChange={e => update(item.id, "label", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Стойност</label>
              <Input value={item.value} onChange={e => update(item.id, "value", e.target.value)} />
            </div>
          </div>
          <Btn onClick={() => save(item)} disabled={saving} className="shrink-0"><Save className="h-4 w-4" />Запази</Btn>
        </div>
      ))}
    </div>
  );
};

// ── BOARD HISTORY ─────────────────────────────────────────────
const BoardHistoryTab = () => {
  const [items, setItems] = useState<BoardHistory[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<BoardHistory>>({ mandate: "", name: "", role: "Председател на УС", note: "", current: false, sort_order: 99 });

  const load = () => supabase.from("board_history").select("*").order("sort_order")
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const update = (id: string, field: string, value: string | boolean) =>
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));

  const save = async (item: BoardHistory) => {
    setSaving(item.id);
    await supabase.from("board_history").update({
      mandate: item.mandate, name: item.name, role: item.role,
      note: item.note, current: item.current, sort_order: item.sort_order
    }).eq("id", item.id);
    setSaving(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Изтриване?")) return;
    await supabase.from("board_history").delete().eq("id", id);
    load();
  };

  const add = async () => {
    if (!newItem.mandate || !newItem.name) return;
    await supabase.from("board_history").insert([newItem]);
    setNewItem({ mandate: "", name: "", role: "Председател на УС", note: "", current: false, sort_order: 99 });
    setAdding(false);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Управлявайте историята на председателите на настоятелството.</p>
        <Btn onClick={() => setAdding(!adding)}><Plus className="h-4 w-4" />Добави</Btn>
      </div>

      {adding && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <p className="text-sm font-semibold">Нов запис</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Мандат (напр. 1993 – 1995)</label>
              <Input value={newItem.mandate} onChange={e => setNewItem({...newItem, mandate: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Пореден номер</label>
              <Input type="number" value={newItem.sort_order} onChange={e => setNewItem({...newItem, sort_order: Number(e.target.value)})} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Име</label>
              <Input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Роля</label>
              <Input value={newItem.role} onChange={e => setNewItem({...newItem, role: e.target.value})} /></div>
            <div className="sm:col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Бележка</label>
              <Input value={newItem.note} onChange={e => setNewItem({...newItem, note: e.target.value})} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="new-current" checked={!!newItem.current} onChange={e => setNewItem({...newItem, current: e.target.checked})} className="h-4 w-4" />
              <label htmlFor="new-current" className="text-sm">Настоящ председател</label>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Btn onClick={add}><Save className="h-4 w-4" />Запази</Btn>
            <Btn onClick={() => setAdding(false)} className="bg-secondary text-foreground hover:bg-secondary/80"><X className="h-4 w-4" />Отказ</Btn>
          </div>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} className="rounded-xl border bg-card p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="text-xs text-muted-foreground mb-1 block">Мандат</label>
              <Input value={item.mandate} onChange={e => update(item.id, "mandate", e.target.value)} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Пореден №</label>
              <Input type="number" value={item.sort_order} onChange={e => update(item.id, "sort_order", e.target.value)} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Име</label>
              <Input value={item.name} onChange={e => update(item.id, "name", e.target.value)} /></div>
            <div><label className="text-xs text-muted-foreground mb-1 block">Роля</label>
              <Input value={item.role} onChange={e => update(item.id, "role", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Бележка</label>
              <Input value={item.note} onChange={e => update(item.id, "note", e.target.value)} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id={`cur-${item.id}`} checked={!!item.current} onChange={e => update(item.id, "current", e.target.checked)} className="h-4 w-4" />
              <label htmlFor={`cur-${item.id}`} className="text-sm">Настоящ председател</label>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Btn onClick={() => save(item)} disabled={saving === item.id}><Save className="h-4 w-4" />{saving === item.id ? "Запазване…" : "Запази"}</Btn>
            <Btn onClick={() => remove(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90"><Trash2 className="h-4 w-4" />Изтрий</Btn>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── SITE SETTINGS ─────────────────────────────────────────────
const SettingsTab = () => {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "membership_form_url").single();
    if (data?.value) setUrl(data.value);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await supabase.from("site_settings").upsert({ key: "membership_form_url", value: url, label: "Заявление за членство (URL)" }, { onConflict: "key" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const sanitized = sanitizeFileName(file.name);
    const path = `membership/${Date.now()}-${sanitized}`;
    const { data, error } = await supabase.storage.from("documents").upload(path, file, { upsert: true });
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(data.path);
      setUrl(publicUrl);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Заявление за членство</h3>
          <p className="text-sm text-muted-foreground mb-3">URL на файла показан в страница „Включи се". Може да качите нов файл или да въведете линк ръчно.</p>
          <label className="text-xs text-muted-foreground mb-1 block">Текущ линк</label>
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Btn onClick={save}><Save className="h-4 w-4" />{saved ? "Запазено ✓" : "Запази линка"}</Btn>
          <label className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer border hover:bg-accent transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload className="h-4 w-4" />{uploading ? "Качване…" : "Качи нов файл"}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={upload} />
          </label>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <LinkIcon className="h-4 w-4" />Преглед на текущия файл
          </a>
        )}
      </div>
    </div>
  );
};

// ── MAIN DASHBOARD ───────────────────────────────────────────
const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "announcements", label: "Съобщения", icon: Megaphone },
  { id: "news", label: "Новини", icon: Newspaper },
  { id: "board", label: "УС — Членове", icon: Users },
  { id: "board_history", label: "УС — История", icon: Clock },
  { id: "documents", label: "Документи", icon: FileText },
  { id: "files", label: "Файлове", icon: FolderOpen },
  { id: "stats", label: "Статистики", icon: BarChart2 },
  { id: "gallery", label: "Галерия", icon: Image },
  { id: "donation", label: "Дарения", icon: Heart },
  { id: "settings", label: "Настройки", icon: LinkIcon },
];

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>("announcements");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const renderTab = () => {
    switch (active) {
      case "announcements": return <AnnouncementsTab />;
      case "news": return <NewsTab />;
      case "board": return <BoardTab />;
      case "board_history": return <BoardHistoryTab />;
      case "documents": return <DocumentsTab />;
      case "files": return <FileManagerTab />;
      case "stats": return <StatsTab />;
      case "gallery": return <GalleryTab />;
      case "donation": return <DonationTab />;
      case "settings": return <SettingsTab />;
    }
  };

  const activeItem = navItems.find(n => n.id === active)!;

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-card border-r flex flex-col transition-transform md:translate-x-0 md:static md:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b">
          <p className="font-bold text-sm">УН към 163 ОУ</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left
                ${active === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t space-y-1">
          <a href="/" className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
            <Home className="h-4 w-4" /> Към сайта
          </a>
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Изход
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button className="md:hidden p-1 rounded-lg hover:bg-accent" onClick={() => setSidebarOpen(true)}>
            <ChevronDown className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <activeItem.icon className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-lg">{activeItem.label}</h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-5xl w-full mx-auto">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
