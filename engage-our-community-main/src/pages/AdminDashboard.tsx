import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type {
  Announcement, NewsItem, BoardMember, Document, ImpactStat, GalleryImage, DonationInfo
} from "@/lib/supabase";
import {
  LogOut, Megaphone, Newspaper, Users, FileText, BarChart2, Image, Heart, Trash2, Plus, Save, X, ChevronDown, ChevronUp, Home
} from "lucide-react";

type Section = "announcements" | "news" | "board" | "documents" | "stats" | "gallery" | "donation";

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
const categories = ["Инициатива", "Новина", "Събитие", "Мнение"];

const NewsTab = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState({ category: "Новина", title: "", excerpt: "", date: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("news").select("*").order("created_at", { ascending: false })
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editId) {
      await supabase.from("news").update(form).eq("id", editId);
    } else {
      await supabase.from("news").insert([form]);
    }
    setForm({ category: "Новина", title: "", excerpt: "", date: "" });
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
    setForm({ category: item.category, title: item.title, excerpt: item.excerpt, date: item.date });
    setEditId(item.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">{editId ? "Редактиране" : "Нова новина"}</h3>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <Input placeholder="Заглавие" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Textarea rows={3} placeholder="Кратко описание" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
        <Input placeholder="Дата (напр. 10 фев 2026)" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <div className="flex gap-2">
          <Btn onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Запазване..." : "Запази"}</Btn>
          {editId && <Btn variant="ghost" onClick={() => { setEditId(null); setForm({ category: "Новина", title: "", excerpt: "", date: "" }); }}><X className="h-4 w-4" />Отказ</Btn>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">{item.category}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <p className="font-semibold text-sm">{item.title}</p>
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
const emptyDoc = { title: "", type: "PDF", size: "", url: "" };

const DocumentsTab = () => {
  const [items, setItems] = useState<Document[]>([]);
  const [form, setForm] = useState(emptyDoc);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("documents").select("*").order("created_at", { ascending: false })
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
    setForm({ title: item.title, type: item.type, size: item.size, url: item.url });
    setEditId(item.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">{editId ? "Редактиране" : "Нов документ"}</h3>
        <Input placeholder="Заглавие" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Input placeholder="Тип (PDF)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          <Input placeholder="Размер (напр. 2.4 MB)" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
        </div>
        <Input placeholder="URL за изтегляне" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
        <div className="flex gap-2">
          <Btn onClick={save} disabled={saving}><Save className="h-4 w-4" />{saving ? "Запазване..." : "Запази"}</Btn>
          {editId && <Btn variant="ghost" onClick={() => { setEditId(null); setForm(emptyDoc); }}><X className="h-4 w-4" />Отказ</Btn>}
        </div>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border bg-card p-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.type} · {item.size}</p>
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

// ── GALLERY ──────────────────────────────────────────────────
const emptyImg = { url: "", alt: "", sort_order: 0 };

const GalleryTab = () => {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [form, setForm] = useState(emptyImg);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("gallery").select("*").order("sort_order")
    .then(({ data }) => { if (data) setItems(data); });

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.url) return;
    setSaving(true);
    await supabase.from("gallery").insert([form]);
    setForm(emptyImg);
    setSaving(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Изтриване?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="font-semibold">Добави снимка</h3>
        <Input placeholder="URL на снимката" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
        <Input placeholder="Описание (alt текст)" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} />
        <Input type="number" placeholder="Ред (за наредба)" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
        <Btn onClick={add} disabled={saving}><Plus className="h-4 w-4" />{saving ? "Добавяне..." : "Добави"}</Btn>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {items.map(item => (
          <div key={item.id} className="relative group rounded-xl overflow-hidden border">
            <img src={item.url} alt={item.alt} className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Btn variant="danger" onClick={() => del(item.id)}><Trash2 className="h-4 w-4" />Изтрий</Btn>
            </div>
            <div className="p-2">
              <p className="text-xs text-muted-foreground truncate">{item.alt}</p>
            </div>
          </div>
        ))}
      </div>
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

// ── MAIN DASHBOARD ───────────────────────────────────────────
const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "announcements", label: "Съобщения", icon: Megaphone },
  { id: "news", label: "Новини", icon: Newspaper },
  { id: "board", label: "Настоятелство", icon: Users },
  { id: "documents", label: "Документи", icon: FileText },
  { id: "stats", label: "Статистики", icon: BarChart2 },
  { id: "gallery", label: "Галерия", icon: Image },
  { id: "donation", label: "Дарения", icon: Heart },
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
      case "documents": return <DocumentsTab />;
      case "stats": return <StatsTab />;
      case "gallery": return <GalleryTab />;
      case "donation": return <DonationTab />;
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
