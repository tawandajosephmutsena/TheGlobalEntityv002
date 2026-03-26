import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: string; // Lucide icon name
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "shadcnblocks.com",
  heading = "A Collection of Components Built With Shadcn & Tailwind",
  description = "Join us to build flawless web solutions.",
  tabs = [],
}: Feature108Props) => {
  if (!tabs || tabs.length === 0) return null;

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as Record<string, any>)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-auto w-4 shrink-0" />;
  };

  return (
    <section className="py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <AnimatedSection animation="fade-up">
            <Badge variant="outline" className="font-black tracking-tighter lowercase [font-variant-caps:small-caps]">{badge}</Badge>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={100}>
            <h1 className="max-w-2xl text-3xl font-black md:text-5xl tracking-tighter lowercase [font-variant-caps:small-caps]">
              {heading}
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={200}>
            <p className="text-muted-foreground text-lg">{description}</p>
          </AnimatedSection>
        </div>
        
        <Tabs defaultValue={tabs[0].value} className="mt-12 w-full">
          <TabsList className="flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10 bg-transparent h-auto p-0 w-full">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary transition-all duration-300"
              >
                {renderIcon(tab.icon)} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mx-auto mt-8 max-w-screen-xl rounded-3xl bg-muted/30 border border-muted p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10 focus-visible:outline-none"
              >
                <div className="flex flex-col gap-6">
                  <Badge variant="outline" className="w-fit bg-background font-black tracking-tighter lowercase [font-variant-caps:small-caps]">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-black lg:text-5xl leading-tight tracking-tighter lowercase [font-variant-caps:small-caps]">
                    {tab.content.title}
                  </h3>
                  <div 
                    className="prose dark:prose-invert prose-p:text-muted-foreground lg:prose-p:text-xl prose-p:leading-relaxed max-w-none"
                    dangerouslySetInnerHTML={{ __html: tab.content.description }}
                  />
                  {tab.content.buttonLink ? (
                    <Button asChild className="mt-4 w-fit gap-2 h-12 px-8 rounded-full" size="lg">
                      <a href={tab.content.buttonLink} className="font-black tracking-tighter lowercase [font-variant-caps:small-caps]">
                        {tab.content.buttonText}
                      </a>
                    </Button>
                  ) : (
                    <Button className="mt-4 w-fit gap-2 h-12 px-8 rounded-full font-black tracking-tighter lowercase [font-variant-caps:small-caps]" size="lg">
                      {tab.content.buttonText}
                    </Button>
                  )}
                </div>
                <div className="relative w-full aspect-video lg:aspect-square overflow-hidden rounded-2xl">
                    <img
                        src={tab.content.imageSrc}
                        alt={tab.content.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Feature108;
