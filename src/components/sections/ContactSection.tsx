import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";
import { db } from "@/lib/firebase";
import { phoneCountries } from "@/data/phoneCountries";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company is required"),
  country: z.string().min(2, "Country is required"),
  phoneCountryIso: z.string().min(1, "Select country code"),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a little more about your requirement"),
  captchaToken: z.string().min(1, "Please complete the CAPTCHA verification"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const iconMap = {
  mail: Mail,
  phone: Phone,
  location: MapPin,
  clock: Clock,
};

const ContactSection = () => {
  const { toast } = useToast();
  const { data: content, isLoading, error } = useHomeContent();
  const section = content?.contactSection;
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      country: "",
      phoneCountryIso: "IN",
      phone: "",
      message: "",
      captchaToken: "",
    },
  });

  const phoneCountryIso = form.watch("phoneCountryIso") || "IN";
  const selectedPhoneCountry =
    phoneCountries.find((entry) => entry.iso === phoneCountryIso) ||
    phoneCountries.find((entry) => entry.iso === "IN") ||
    phoneCountries[0];

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const selectedCountry = phoneCountries.find((entry) => entry.iso === values.phoneCountryIso);
      await addDoc(collection(db, "contactSubmissions"), {
        ...values,
        phoneCountryIso: selectedCountry?.iso ?? values.phoneCountryIso,
        phoneCountryCode: selectedCountry?.dialCode ?? "",
        status: "new",
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Enquiry received",
        description: `Thanks ${values.name}, our sales desk will respond shortly.`,
      });
      form.reset();
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error("Failed to submit contact form", error);
      toast({
        title: "Submission failed",
        description: "Please try again in a moment or email us directly.",
        variant: "destructive",
      });
      recaptchaRef.current?.reset();
    }
  };

  if (isLoading) {
    return (
      <section id="contact" className="py-24 bg-gradient-steel">
        <div className="container-custom text-center text-muted-foreground">Loading contact details...</div>
      </section>
    );
  }

  if (error || !section) {
    return null;
  }

  const formContent = section.form ?? {
    namePlaceholder: "Priya Verma",
    emailPlaceholder: "you@company.com",
    companyPlaceholder: "Eltra Overseas",
    countryPlaceholder: "India",
    messagePlaceholder: "Share product grades, destinations, or certifications needed",
    ctaLabel: "Send enquiry",
  };

  return (
    <section id="contact" className="py-24 bg-gradient-steel">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="card-industrial p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">{section.header.eyebrow}</p>
              <h2 className="text-3xl md:text-4xl font-display text-foreground mt-3 mb-4">
                {section.header.title}
              </h2>
              <p className="text-muted-foreground">{section.header.description}</p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {section.cards.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Mail;
                return (
                  <div key={item.heading} className="rounded-2xl border border-border bg-card/90 dark:bg-card/60 p-4 shadow-sm backdrop-blur">
                    <Icon className="w-5 h-5 text-accent" />
                    <p className="mt-3 text-sm text-muted-foreground">{item.heading}</p>
                    <p className="font-semibold text-foreground">{item.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.subDetail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-industrial p-6 lg:p-10">
            <Form {...form}>
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder={formContent.namePlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={formContent.emailPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder={formContent.companyPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder={formContent.countryPlaceholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phoneCountryIso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Code</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            {...field}
                          >
                            {phoneCountries.map((country) => (
                              <option key={country.iso} value={country.iso}>
                                {country.name} ({country.dialCode})
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center rounded-l-lg border border-r-0 bg-muted px-3 text-sm font-medium text-muted-foreground">
                              {selectedPhoneCountry?.dialCode ?? "+"}
                            </span>
                            <Input className="rounded-l-none" placeholder="98765 43210" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder={formContent.messagePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="captchaToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ""}
                            onChange={(token) => field.onChange(token || "")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending..." : formContent.ctaLabel}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
