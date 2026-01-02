import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useHomeContent } from "@/hooks/useHomeContent";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  company: z.string().min(2, "Company is required"),
  message: z.string().min(10, "Tell us a little more about your requirement"),
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

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast({
      title: "Enquiry received",
      description: `Thanks ${values.name}, our sales desk will respond shortly.`,
    });
    form.reset();
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
                  <div key={item.heading} className="rounded-2xl border border-border bg-white/70 p-4 shadow-sm">
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
                          <Input placeholder="Priya Verma" {...field} />
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
                          <Input type="email" placeholder="you@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Eltra Overseas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Share product grades, destinations, or certifications needed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending..." : "Send enquiry"}
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
