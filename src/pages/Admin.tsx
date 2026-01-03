import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useHomeContent } from "@/hooks/useHomeContent";
import { useProducts } from "@/hooks/useProducts";
import { useVlogs } from "@/hooks/useVlogs";
import { useContactSubmissions } from "@/hooks/useContactSubmissions";
import { auth, db } from "@/lib/firebase";
import {
  HeroContent,
  ContactSectionContent,
  Product,
  Vlog,
  Certificate,
  ResourceSettings,
  ContactSubmission,
  ContactSubmissionStatus,
} from "@/types/content";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const parseList = (value: string) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const contactFormDefaults = {
  namePlaceholder: "Priya Verma",
  emailPlaceholder: "you@company.com",
  companyPlaceholder: "Eltra Overseas",
  countryPlaceholder: "India",
  messagePlaceholder: "Share product grades, destinations, or certifications needed",
  ctaLabel: "Send enquiry",
};

const Admin = () => {
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: homeContent, isLoading: loadingHome } = useHomeContent();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: vlogs, isLoading: loadingVlogs } = useVlogs();
  const { data: contactSubmissions, isLoading: loadingSubmissions } = useContactSubmissions();

  const [heroForm, setHeroForm] = useState<HeroContent | null>(null);
  const [contactForm, setContactForm] = useState<ContactSectionContent | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productForm, setProductForm] = useState<Product | null>(null);
  const [selectedVlog, setSelectedVlog] = useState<string>("");
  const [vlogForm, setVlogForm] = useState<Vlog | null>(null);
  const [savingHero, setSavingHero] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingVlog, setSavingVlog] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [vlogError, setVlogError] = useState<string | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isCreatingVlog, setIsCreatingVlog] = useState(false);
  const [testimonialsForm, setTestimonialsForm] = useState(homeContent?.testimonialsSection ?? null);
  const [savingTestimonials, setSavingTestimonials] = useState(false);
  const [visibility, setVisibility] = useState<{ vlogs: boolean; testimonials: boolean } | null>(null);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [resources, setResources] = useState<ResourceSettings>({ catalogUrl: "" });
  const [savingResources, setSavingResources] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [savingCertificates, setSavingCertificates] = useState(false);
  const defaultSocialIcons = [
    { icon: "instagram", label: "Instagram" },
    { icon: "youtube", label: "YouTube" },
    { icon: "linkedin", label: "LinkedIn" },
  ];
  const [socialLinks, setSocialLinks] = useState(
    defaultSocialIcons.map((item) => ({ icon: item.icon, label: item.label, url: "" })),
  );
  const [legalLinks, setLegalLinks] = useState([
    { name: "Privacy Policy", href: "" },
    { name: "Terms of Service", href: "" },
  ]);
  const [savingSocialLinks, setSavingSocialLinks] = useState(false);
  const [updatingSubmissionId, setUpdatingSubmissionId] = useState<string | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);

  const updateContactFormField = (key: keyof typeof contactFormDefaults, value: string) => {
    if (!contactForm) return;
    const base = contactForm.form ?? contactFormDefaults;
    setContactForm({ ...contactForm, form: { ...base, [key]: value } });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { email: firebaseUser.email } : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (homeContent?.hero) {
      setHeroForm(homeContent.hero);
    }
    if (homeContent?.contactSection) {
      setContactForm({
        ...homeContent.contactSection,
        form: homeContent.contactSection.form ?? contactFormDefaults,
      });
    }
    if (homeContent?.resources) {
      setResources(homeContent.resources);
    } else {
      setResources({ catalogUrl: "" });
    }
    if (homeContent?.testimonialsSection) {
      setTestimonialsForm(homeContent.testimonialsSection);
    }
    if (homeContent?.certificates) {
      setCertificates(
        homeContent.certificates.map((certificate, index) => ({
          ...certificate,
          id: certificate.id || `cert-${index}`,
        })),
      );
    } else {
      setCertificates([]);
    }
    if (homeContent?.footer?.socialLinks) {
      setSocialLinks(
        defaultSocialIcons.map((item) => ({
          icon: item.icon,
          label: item.label,
          url: homeContent.footer?.socialLinks?.find((link) => link.icon === item.icon)?.url ?? "",
        })),
      );
      if (homeContent.footer.legalLinks) {
        setLegalLinks(homeContent.footer.legalLinks);
      }
    }
    if (homeContent) {
      setVisibility({
        vlogs: homeContent.visibility?.vlogs ?? true,
        testimonials: homeContent.visibility?.testimonials ?? true,
      });
    }
  }, [homeContent]);

  useEffect(() => {
    if (isCreatingProduct) return;
    if (products?.length) {
      const nextSlug = selectedProduct || products[0].slug;
      setSelectedProduct(nextSlug);
      const match = products.find((product) => product.slug === nextSlug);
      if (match) {
        setProductForm(match);
      }
    }
  }, [products, selectedProduct, isCreatingProduct]);

  useEffect(() => {
    if (isCreatingVlog) return;
    if (vlogs?.length) {
      const nextSlug = selectedVlog || vlogs[0].slug;
      setSelectedVlog(nextSlug);
      const match = vlogs.find((vlog) => vlog.slug === nextSlug);
      if (match) {
        setVlogForm(match);
      }
    }
  }, [vlogs, selectedVlog, isCreatingVlog]);

  const initializeProductForm = () =>
    ({
      slug: "",
      name: "",
      specs: "",
      summary: "",
      description: "",
      image: "",
      gallery: [],
      materials: [],
      applications: [],
      certifications: [],
    } satisfies Product);

  const initializeVlogForm = () =>
    ({
      slug: "",
      title: "",
      youtubeId: "",
      summary: "",
      description: "",
      publishedOn: "",
      tags: [],
    } satisfies Vlog);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError("Invalid credentials. Check email/password and try again.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const saveHero = async () => {
    if (!heroForm) return;
    setSavingHero(true);
    await setDoc(doc(db, "siteContent", "home"), { hero: heroForm }, { merge: true });
    setSavingHero(false);
  };

  const saveContact = async () => {
    if (!contactForm) return;
    setSavingContact(true);
    await setDoc(doc(db, "siteContent", "home"), { contactSection: contactForm }, { merge: true });
    setSavingContact(false);
  };

  const saveProduct = async () => {
    if (!productForm) return;
    if (!productForm.slug) {
      setProductError("Provide a unique slug for the product.");
      return;
    }
    setSavingProduct(true);
    await setDoc(doc(db, "products", productForm.slug), productForm, { merge: true });
    setSavingProduct(false);
    setProductError(null);
    setIsCreatingProduct(false);
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const saveVlog = async () => {
    if (!vlogForm) return;
    if (!vlogForm.slug) {
      setVlogError("Provide a unique slug for the vlog.");
      return;
    }
    setSavingVlog(true);
    await setDoc(doc(db, "vlogs", vlogForm.slug), vlogForm, { merge: true });
    setSavingVlog(false);
    setVlogError(null);
    setIsCreatingVlog(false);
    await queryClient.invalidateQueries({ queryKey: ["vlogs"] });
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;
    await deleteDoc(doc(db, "products", selectedProduct));
    setSelectedProduct("");
    setProductForm(products && products.length > 0 ? products[0] : initializeProductForm());
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const deleteVlog = async () => {
    if (!selectedVlog) return;
    await deleteDoc(doc(db, "vlogs", selectedVlog));
    setSelectedVlog("");
    setVlogForm(vlogs && vlogs.length > 0 ? vlogs[0] : initializeVlogForm());
    await queryClient.invalidateQueries({ queryKey: ["vlogs"] });
  };

  const saveTestimonials = async () => {
    if (!testimonialsForm) return;
    setSavingTestimonials(true);
    await setDoc(doc(db, "siteContent", "home"), { testimonialsSection: testimonialsForm }, { merge: true });
    setSavingTestimonials(false);
    await queryClient.invalidateQueries({ queryKey: ["home-content"] });
  };

  const saveVisibility = async () => {
    if (!visibility) return;
    setSavingVisibility(true);
    await setDoc(doc(db, "siteContent", "home"), { visibility }, { merge: true });
    setSavingVisibility(false);
    await queryClient.invalidateQueries({ queryKey: ["home-content"] });
  };

  const saveResources = async () => {
    setSavingResources(true);
    await setDoc(doc(db, "siteContent", "home"), { resources }, { merge: true });
    setSavingResources(false);
    await queryClient.invalidateQueries({ queryKey: ["home-content"] });
  };

  const saveCertificates = async () => {
    setSavingCertificates(true);
    await setDoc(doc(db, "siteContent", "home"), { certificates }, { merge: true });
    setSavingCertificates(false);
    await queryClient.invalidateQueries({ queryKey: ["home-content"] });
  };

  const saveSocialLinks = async () => {
    setSavingSocialLinks(true);
    await setDoc(
      doc(db, "siteContent", "home"),
      {
        footer: {
          ...homeContent?.footer,
          socialLinks: socialLinks.map(({ icon, url }) => ({ icon, url })),
          legalLinks,
        },
      },
      { merge: true },
    );
    setSavingSocialLinks(false);
    await queryClient.invalidateQueries({ queryKey: ["home-content"] });
  };

  const updateSubmissionStatus = async (submissionId: string, status: ContactSubmissionStatus) => {
    setUpdatingSubmissionId(submissionId);
    await updateDoc(doc(db, "contactSubmissions", submissionId), { status });
    setUpdatingSubmissionId(null);
    await queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
  };

  const deleteSubmission = async (submissionId: string) => {
    setDeletingSubmissionId(submissionId);
    await deleteDoc(doc(db, "contactSubmissions", submissionId));
    setDeletingSubmissionId(null);
    await queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
  };

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-steel px-4">
        <Helmet>
          <title>Admin Login | Eltra Overseas</title>
        </Helmet>
        <div className="card-industrial w-full max-w-md p-8">
          <h1 className="text-2xl font-display mb-6 text-center">Admin Login</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            {authError && <p className="text-destructive text-sm">{authError}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </main>
    );
  }

  const isAuthorized = user.email === "elia470jassy@gmail.com";

  if (!isAuthorized) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-steel px-4">
        <Helmet>
          <title>Admin Dashboard | Eltra Overseas</title>
        </Helmet>
        <div className="card-industrial w-full max-w-md p-8 text-center space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <p className="text-destructive">This account is not authorized to edit site content.</p>
          <Button variant="ghost" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  const dataLoading =
    loadingHome ||
    loadingProducts ||
    loadingVlogs ||
    loadingSubmissions ||
    !heroForm ||
    !contactForm ||
    !productForm ||
    !vlogForm ||
    !testimonialsForm ||
    !visibility ||
    !contactSubmissions;

  if (dataLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-steel px-4">
        <Helmet>
          <title>Admin Dashboard | Eltra Overseas</title>
        </Helmet>
        <p className="text-muted-foreground">Loading site content…</p>
      </main>
    );
  }

  const statusStyles: Record<ContactSubmissionStatus, { label: string; className: string }> = {
    new: { label: "New", className: "bg-amber-100 text-amber-800" },
    in_progress: { label: "In progress", className: "bg-sky-100 text-sky-800" },
    processed: { label: "Processed", className: "bg-emerald-100 text-emerald-800" },
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Eltra Overseas</title>
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 bg-gradient-steel min-h-screen">
        <div className="container-custom space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
          </div>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contact enquiries</p>
                <h2 className="text-2xl font-display">Lead Inbox</h2>
              </div>
              <div className="text-sm text-muted-foreground">{contactSubmissions?.length ?? 0} records</div>
            </div>
            {contactSubmissions && contactSubmissions.length > 0 ? (
              <div className="space-y-4">
                {contactSubmissions.map((submission) => (
                  <div key={submission.id} className="border rounded-xl p-4 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="font-semibold text-lg">{submission.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Received {formatDate(submission.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          statusStyles[submission.status].className
                        }`}
                      >
                        {statusStyles[submission.status].label}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{submission.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Company</p>
                        <p className="font-medium">{submission.company}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Country</p>
                        <p className="font-medium">{submission.country}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{submission.phone || "—"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground">Message</p>
                        <p className="font-medium whitespace-pre-line">{submission.message}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {submission.status !== "new" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateSubmissionStatus(submission.id, "new")}
                          disabled={updatingSubmissionId === submission.id}
                        >
                          Mark as New
                        </Button>
                      )}
                      {submission.status !== "in_progress" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateSubmissionStatus(submission.id, "in_progress")}
                          disabled={updatingSubmissionId === submission.id}
                        >
                          Mark In Progress
                        </Button>
                      )}
                      {submission.status !== "processed" && (
                        <Button
                          size="sm"
                          onClick={() => updateSubmissionStatus(submission.id, "processed")}
                          disabled={updatingSubmissionId === submission.id}
                        >
                          Mark Processed
                        </Button>
                      )}
                      {submission.status === "processed" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSubmission(submission.id)}
                          disabled={deletingSubmissionId === submission.id}
                        >
                          Delete lead
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No enquiries yet.</p>
            )}
          </section>

          <section className="card-industrial p-6">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Sections</p>
                <h2 className="text-xl font-display">Visibility Controls</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Toggle sections on or off across the site and navigation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-3 text-sm font-medium">
                  <Switch
                    checked={visibility!.vlogs}
                    onCheckedChange={(checked) => setVisibility((prev) => (prev ? { ...prev, vlogs: checked } : prev))}
                  />
                  Show Vlogs
                </label>
                <label className="flex items-center gap-3 text-sm font-medium">
                  <Switch
                    checked={visibility!.testimonials}
                    onCheckedChange={(checked) => setVisibility((prev) => (prev ? { ...prev, testimonials: checked } : prev))}
                  />
                  Show Testimonials
                </label>
                <Button onClick={saveVisibility} disabled={savingVisibility}>
                  {savingVisibility ? "Saving..." : "Save visibility"}
                </Button>
              </div>
            </div>
          </section>

          <section className="card-industrial p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Resources</p>
                <h2 className="text-xl font-display">Product Catalog Link</h2>
                <p className="text-muted-foreground text-sm mt-2">Update the PDF link used by catalog buttons across the site.</p>
              </div>
              <Button onClick={saveResources} disabled={savingResources}>
                {savingResources ? "Saving..." : "Save catalog link"}
              </Button>
            </div>
            <Input
              value={resources.catalogUrl}
              onChange={(event) => setResources({ catalogUrl: event.target.value })}
              placeholder="https://example.com/catalog.pdf"
            />
          </section>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Homepage</p>
                <h2 className="text-2xl font-display">Hero Content</h2>
              </div>
              <Button onClick={saveHero} disabled={savingHero}>
                {savingHero ? "Saving..." : "Save hero"}
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Badge</label>
                <Input value={heroForm.badge ?? ""} onChange={(event) => setHeroForm({ ...heroForm, badge: event.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Highlight</label>
                <Input value={heroForm.highlight ?? ""} onChange={(event) => setHeroForm({ ...heroForm, highlight: event.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={heroForm.title ?? ""} onChange={(event) => setHeroForm({ ...heroForm, title: event.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={heroForm.description ?? ""} onChange={(event) => setHeroForm({ ...heroForm, description: event.target.value })} rows={3} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Primary CTA</label>
                <Input value={heroForm.primaryCtaLabel ?? ""} onChange={(event) => setHeroForm({ ...heroForm, primaryCtaLabel: event.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Secondary CTA</label>
                <Input value={heroForm.secondaryCtaLabel ?? ""} onChange={(event) => setHeroForm({ ...heroForm, secondaryCtaLabel: event.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Hero Image URL</label>
              <Input value={heroForm.heroImageUrl ?? ""} onChange={(event) => setHeroForm({ ...heroForm, heroImageUrl: event.target.value })} />
            </div>
          </section>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Homepage</p>
                <h2 className="text-2xl font-display">Contact Section</h2>
              </div>
              <Button onClick={saveContact} disabled={savingContact}>
                {savingContact ? "Saving..." : "Save contact"}
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Eyebrow</label>
                <Input value={contactForm.header.eyebrow ?? ""} onChange={(event) => setContactForm({ ...contactForm, header: { ...contactForm.header, eyebrow: event.target.value } })} />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={contactForm.header.title ?? ""} onChange={(event) => setContactForm({ ...contactForm, header: { ...contactForm.header, title: event.target.value } })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={contactForm.header.description ?? ""} onChange={(event) => setContactForm({ ...contactForm, header: { ...contactForm.header, description: event.target.value } })} rows={3} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {contactForm.cards.map((card, index) => (
                <div key={`${card.heading}-${index}`} className="border rounded-lg p-4 space-y-3">
                  <label className="text-sm font-medium block">Heading</label>
                  <Input
                    value={card.heading}
                    onChange={(event) => {
                      const updated = [...contactForm.cards];
                      updated[index] = { ...card, heading: event.target.value };
                      setContactForm({ ...contactForm, cards: updated });
                    }}
                  />
                  <label className="text-sm font-medium block">Detail</label>
                  <Input
                    value={card.detail}
                    onChange={(event) => {
                      const updated = [...contactForm.cards];
                      updated[index] = { ...card, detail: event.target.value };
                      setContactForm({ ...contactForm, cards: updated });
                    }}
                  />
                  <label className="text-sm font-medium block">Sub Detail</label>
                  <Input
                    value={card.subDetail}
                    onChange={(event) => {
                      const updated = [...contactForm.cards];
                      updated[index] = { ...card, subDetail: event.target.value };
                      setContactForm({ ...contactForm, cards: updated });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name Placeholder</label>
                <Input value={contactForm.form?.namePlaceholder ?? ""} onChange={(event) => updateContactFormField("namePlaceholder", event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Email Placeholder</label>
                <Input value={contactForm.form?.emailPlaceholder ?? ""} onChange={(event) => updateContactFormField("emailPlaceholder", event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Company Placeholder</label>
                <Input value={contactForm.form?.companyPlaceholder ?? ""} onChange={(event) => updateContactFormField("companyPlaceholder", event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Country Placeholder</label>
                <Input value={contactForm.form?.countryPlaceholder ?? ""} onChange={(event) => updateContactFormField("countryPlaceholder", event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Message Placeholder</label>
                <Input value={contactForm.form?.messagePlaceholder ?? ""} onChange={(event) => updateContactFormField("messagePlaceholder", event.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Form CTA Text</label>
              <Input value={contactForm.form?.ctaLabel ?? ""} onChange={(event) => updateContactFormField("ctaLabel", event.target.value)} />
            </div>
          </section>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Footer</p>
                <h2 className="text-2xl font-display">Social Links</h2>
              </div>
              <Button onClick={saveSocialLinks} disabled={savingSocialLinks}>
                {savingSocialLinks ? "Saving..." : "Save social links"}
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {socialLinks.map((link, index) => (
                <div key={link.icon} className="space-y-2">
                  <label className="text-sm font-medium">{link.label}</label>
                  <Input
                    placeholder={`https://${link.icon}.com/`}
                    value={link.url}
                    onChange={(event) => {
                      const updated = [...socialLinks];
                      updated[index] = { ...link, url: event.target.value };
                      setSocialLinks(updated);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {legalLinks.map((link, index) => (
                <div key={link.name} className="space-y-2">
                  <label className="text-sm font-medium">{link.name} PDF URL</label>
                  <Input
                    placeholder="https://example.com/file.pdf"
                    value={link.href}
                    onChange={(event) => {
                      const updated = [...legalLinks];
                      updated[index] = { ...link, href: event.target.value };
                      setLegalLinks(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Catalog</p>
                <h2 className="text-2xl font-display">Edit Product</h2>
              </div>
              <div className="flex gap-3">
                {!isCreatingProduct && selectedProduct && (
                  <Button variant="ghost" onClick={deleteProduct}>
                    Delete
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingProduct(true);
                    setSelectedProduct("");
                    setProductForm(initializeProductForm());
                    setProductError(null);
                  }}
                >
                  New Product
                </Button>
                <Button onClick={saveProduct} disabled={savingProduct}>
                  {savingProduct ? "Saving..." : "Save product"}
                </Button>
              </div>
            </div>
            {productError && <p className="text-destructive text-sm">{productError}</p>}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Select Product</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={selectedProduct}
                  disabled={isCreatingProduct}
                  onChange={(event) => {
                    setIsCreatingProduct(false);
                    setSelectedProduct(event.target.value);
                    setProductError(null);
                  }}
                >
                  {products?.map((product) => (
                    <option key={product.slug} value={product.slug}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input value={productForm.slug ?? ""} onChange={(event) => setProductForm({ ...productForm, slug: event.target.value })} disabled={!isCreatingProduct} />
                {!isCreatingProduct && <p className="text-xs text-muted-foreground mt-1">Existing slugs cannot be changed.</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={productForm.name ?? ""} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Specs</label>
                <Input value={productForm.specs ?? ""} onChange={(event) => setProductForm({ ...productForm, specs: event.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Primary Image URL</label>
                <Input value={productForm.image ?? ""} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Summary</label>
              <Textarea value={productForm.summary ?? ""} onChange={(event) => setProductForm({ ...productForm, summary: event.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={productForm.description ?? ""} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} rows={3} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Gallery URLs (comma separated)</label>
                <Textarea rows={2} value={(productForm.gallery ?? []).join(", ")} onChange={(event) => setProductForm({ ...productForm, gallery: parseList(event.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Materials</label>
                <Textarea rows={2} value={(productForm.materials ?? []).join(", ")} onChange={(event) => setProductForm({ ...productForm, materials: parseList(event.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium">Applications</label>
                <Textarea rows={2} value={(productForm.applications ?? []).join(", ")} onChange={(event) => setProductForm({ ...productForm, applications: parseList(event.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Certifications</label>
              <Textarea rows={2} value={(productForm.certifications ?? []).join(", ")} onChange={(event) => setProductForm({ ...productForm, certifications: parseList(event.target.value) })} />
            </div>
          </section>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stories</p>
                <h2 className="text-2xl font-display">Edit Vlog</h2>
              </div>
              <div className="flex gap-3">
                {!isCreatingVlog && selectedVlog && (
                  <Button variant="ghost" onClick={deleteVlog}>
                    Delete
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingVlog(true);
                    setSelectedVlog("");
                    setVlogForm(initializeVlogForm());
                    setVlogError(null);
                  }}
                >
                  New Vlog
                </Button>
                <Button onClick={saveVlog} disabled={savingVlog}>
                  {savingVlog ? "Saving..." : "Save vlog"}
                </Button>
              </div>
            </div>
            {vlogError && <p className="text-destructive text-sm">{vlogError}</p>}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Select Vlog</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={selectedVlog}
                  disabled={isCreatingVlog}
                  onChange={(event) => {
                    setIsCreatingVlog(false);
                    setSelectedVlog(event.target.value);
                    setVlogError(null);
                  }}
                >
                  {vlogs?.map((vlog) => (
                    <option key={vlog.slug} value={vlog.slug}>
                      {vlog.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input value={vlogForm.slug ?? ""} onChange={(event) => setVlogForm({ ...vlogForm, slug: event.target.value })} disabled={!isCreatingVlog} />
                {!isCreatingVlog && <p className="text-xs text-muted-foreground mt-1">Existing slugs cannot be changed.</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={vlogForm.title ?? ""} onChange={(event) => setVlogForm({ ...vlogForm, title: event.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Published On</label>
                <Input value={vlogForm.publishedOn ?? ""} onChange={(event) => setVlogForm({ ...vlogForm, publishedOn: event.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">YouTube ID</label>
                <Input value={vlogForm.youtubeId ?? ""} onChange={(event) => setVlogForm({ ...vlogForm, youtubeId: event.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Textarea rows={2} value={(vlogForm.tags ?? []).join(", ")} onChange={(event) => setVlogForm({ ...vlogForm, tags: parseList(event.target.value) })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Summary</label>
              <Textarea value={vlogForm.summary ?? ""} onChange={(event) => setVlogForm({ ...vlogForm, summary: event.target.value })} rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={vlogForm.description ?? ""} onChange={(event) => setVlogForm({ ...vlogForm, description: event.target.value })} rows={3} />
            </div>
          </section>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Testimonials</p>
                <h2 className="text-2xl font-display">Customer Stories</h2>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setTestimonialsForm((prev) =>
                      prev
                        ? { ...prev, testimonials: [...prev.testimonials, { quote: "", author: "", role: "", company: "" }] }
                        : prev,
                    )
                  }
                >
                  Add testimonial
                </Button>
                <Button onClick={saveTestimonials} disabled={savingTestimonials}>
                  {savingTestimonials ? "Saving..." : "Save testimonials"}
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Eyebrow</label>
                <Input
                  value={testimonialsForm.header.eyebrow}
                  onChange={(event) => setTestimonialsForm({ ...testimonialsForm, header: { ...testimonialsForm.header, eyebrow: event.target.value } })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={testimonialsForm.header.title}
                  onChange={(event) => setTestimonialsForm({ ...testimonialsForm, header: { ...testimonialsForm.header, title: event.target.value } })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Highlight</label>
              <Input
                value={testimonialsForm.header.highlight ?? ""}
                onChange={(event) => setTestimonialsForm({ ...testimonialsForm, header: { ...testimonialsForm.header, highlight: event.target.value } })}
              />
            </div>
            <div className="space-y-4">
              {testimonialsForm.testimonials.map((testimonial, index) => (
                <div key={`testimonial-${index}`} className="border rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Testimonial #{index + 1}</p>
                    {testimonialsForm.testimonials.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setTestimonialsForm((prev) => ({
                            ...prev!,
                            testimonials: prev!.testimonials.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quote</label>
                    <Textarea
                      rows={3}
                      value={testimonial.quote}
                      onChange={(event) =>
                        setTestimonialsForm((prev) => {
                          const updated = [...prev!.testimonials];
                          updated[index] = { ...testimonial, quote: event.target.value };
                          return { ...prev!, testimonials: updated };
                        })
                      }
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Author</label>
                      <Input
                        value={testimonial.author}
                        onChange={(event) =>
                          setTestimonialsForm((prev) => {
                            const updated = [...prev!.testimonials];
                            updated[index] = { ...testimonial, author: event.target.value };
                            return { ...prev!, testimonials: updated };
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Input
                        value={testimonial.role}
                        onChange={(event) =>
                          setTestimonialsForm((prev) => {
                            const updated = [...prev!.testimonials];
                            updated[index] = { ...testimonial, role: event.target.value };
                            return { ...prev!, testimonials: updated };
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Input
                        value={testimonial.company}
                        onChange={(event) =>
                          setTestimonialsForm((prev) => {
                            const updated = [...prev!.testimonials];
                            updated[index] = { ...testimonial, company: event.target.value };
                            return { ...prev!, testimonials: updated };
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card-industrial p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <h2 className="text-2xl font-display">Accreditations</h2>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCertificates((prev) => [
                      ...prev,
                      { id: `cert-${Date.now()}`, title: "", imageUrl: "", downloadUrl: "" },
                    ])
                  }
                >
                  Add certificate
                </Button>
                <Button onClick={saveCertificates} disabled={savingCertificates}>
                  {savingCertificates ? "Saving..." : "Save certificates"}
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {certificates.map((certificate, index) => (
                <div key={certificate.id} className="border rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Certificate #{index + 1}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCertificates((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={certificate.title}
                      onChange={(event) => {
                        const updated = [...certificates];
                        updated[index] = { ...certificate, title: event.target.value };
                        setCertificates(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={certificate.imageUrl}
                      onChange={(event) => {
                        const updated = [...certificates];
                        updated[index] = { ...certificate, imageUrl: event.target.value };
                        setCertificates(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Download Link</label>
                    <Input
                      value={certificate.downloadUrl}
                      onChange={(event) => {
                        const updated = [...certificates];
                        updated[index] = { ...certificate, downloadUrl: event.target.value };
                        setCertificates(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Admin;
